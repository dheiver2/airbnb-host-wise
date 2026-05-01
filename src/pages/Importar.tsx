import { useEffect, useState } from "react";
import Papa from "papaparse";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { brl, dateBR } from "@/lib/format";

type Tipo = "faturamento" | "adiantamentos";

const FIELD_OPTIONS: Record<Tipo, { key: string; label: string }[]> = {
  faturamento: [
    { key: "codigo_airbnb", label: "Código Airbnb" },
    { key: "codigo_imovel", label: "Código do imóvel" },
    { key: "check_in", label: "Check-in (data)" },
    { key: "check_out", label: "Check-out (data)" },
    { key: "hospedes", label: "Hóspedes" },
    { key: "valor_bruto", label: "Valor bruto" },
    { key: "taxas_airbnb", label: "Taxas Airbnb" },
    { key: "valor_liquido", label: "Valor líquido" },
  ],
  adiantamentos: [
    { key: "codigo_imovel", label: "Código do imóvel" },
    { key: "investidor_nome", label: "Nome do investidor" },
    { key: "data", label: "Data" },
    { key: "valor", label: "Valor" },
  ],
};

function parseDate(v: any): string | null {
  if (!v) return null;
  const s = String(v).trim();
  // dd/mm/yyyy
  const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  // yyyy-mm-dd
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  const d = new Date(s);
  if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return null;
}
function parseNum(v: any): number {
  if (v == null || v === "") return 0;
  const s = String(v).replace(/[R$\s.]/g, "").replace(",", ".");
  const n = Number(s);
  return isNaN(n) ? 0 : n;
}

export default function Importar() {
  const [tipo, setTipo] = useState<Tipo>("faturamento");
  const [rows, setRows] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [imoveis, setImoveis] = useState<any[]>([]);
  const [investidores, setInvestidores] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [filename, setFilename] = useState("");

  useEffect(() => {
    supabase.from("imoveis").select("id, codigo").then(({ data }) => setImoveis(data ?? []));
    supabase.from("investidores").select("id, nome").then(({ data }) => setInvestidores(data ?? []));
    loadHistory();
  }, []);

  async function loadHistory() {
    const { data } = await supabase.from("importacoes_airbnb").select("*").order("created_at", { ascending: false }).limit(20);
    setHistory(data ?? []);
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFilename(file.name);
    Papa.parse(file, {
      header: true, skipEmptyLines: true,
      complete: (res) => {
        const rs = res.data as any[];
        setRows(rs);
        const hs = Object.keys(rs[0] ?? {});
        setHeaders(hs);
        // auto-mapeamento por proximidade
        const auto: Record<string, string> = {};
        FIELD_OPTIONS[tipo].forEach((f) => {
          const guess = hs.find((h) => h.toLowerCase().replace(/[^a-z]/g, "").includes(f.key.replace(/_/g, "").slice(0, 5)));
          if (guess) auto[f.key] = guess;
        });
        setMapping(auto);
      },
    });
  }

  async function importar() {
    if (rows.length === 0) return toast.error("Carregue um arquivo");
    let inseridos = 0, duplicados = 0, erros = 0;

    if (tipo === "faturamento") {
      for (const row of rows) {
        const codigoImovel = row[mapping.codigo_imovel];
        const im = imoveis.find((i) => i.codigo === String(codigoImovel ?? "").trim());
        if (!im) { erros++; continue; }
        const checkOut = parseDate(row[mapping.check_out]);
        const checkIn = parseDate(row[mapping.check_in]);
        if (!checkIn || !checkOut) { erros++; continue; }
        const competencia = `${checkOut.slice(0, 7)}-01`;
        const codigoAirbnb = row[mapping.codigo_airbnb] ? String(row[mapping.codigo_airbnb]).trim() : null;

        // dedupe
        if (codigoAirbnb) {
          const { data: dup } = await supabase.from("reservas").select("id").eq("codigo_airbnb", codigoAirbnb).eq("imovel_id", im.id).maybeSingle();
          if (dup) { duplicados++; continue; }
        }
        const { error } = await supabase.from("reservas").insert({
          codigo_airbnb: codigoAirbnb, imovel_id: im.id,
          check_in: checkIn, check_out: checkOut,
          hospedes: Number(row[mapping.hospedes]) || 1,
          valor_bruto: parseNum(row[mapping.valor_bruto]),
          taxas_airbnb: parseNum(row[mapping.taxas_airbnb]),
          valor_liquido: parseNum(row[mapping.valor_liquido]) || parseNum(row[mapping.valor_bruto]),
          mes_competencia: competencia,
        });
        if (error) erros++; else inseridos++;
      }
    } else {
      for (const row of rows) {
        const data = parseDate(row[mapping.data]);
        if (!data) { erros++; continue; }
        const codigoImovel = row[mapping.codigo_imovel];
        const im = imoveis.find((i) => i.codigo === String(codigoImovel ?? "").trim());
        const nome = String(row[mapping.investidor_nome] ?? "").trim();
        let invId = im ? null : investidores.find((x) => x.nome.toLowerCase() === nome.toLowerCase())?.id;
        if (im && !invId) {
          const { data: imv } = await supabase.from("imoveis").select("investidor_id").eq("id", im.id).single();
          invId = imv?.investidor_id;
        }
        if (!invId) { erros++; continue; }
        const valor = parseNum(row[mapping.valor]);
        const competencia = `${data.slice(0, 7)}-01`;
        const { error } = await supabase.from("adiantamentos").insert({
          investidor_id: invId, imovel_id: im?.id ?? null,
          data, valor, origem: "airbnb_direto", mes_competencia: competencia,
        });
        if (error) erros++; else inseridos++;
      }
    }

    await supabase.from("importacoes_airbnb").insert({
      tipo, arquivo: filename, total_linhas: rows.length, inseridos, duplicados, erros,
    });

    toast.success(`Importação concluída: ${inseridos} inseridos, ${duplicados} duplicados, ${erros} erros`);
    setRows([]); setHeaders([]); setMapping({}); setFilename("");
    loadHistory();
  }

  return (
    <>
      <PageHeader title="Importar dados do Airbnb" description="Suba CSV de faturamento ou adiantamentos para processamento em lote." />
      <div className="space-y-4 p-6">
        <Tabs value={tipo} onValueChange={(v) => { setTipo(v as Tipo); setRows([]); setMapping({}); }}>
          <TabsList>
            <TabsTrigger value="faturamento">Faturamento acumulado</TabsTrigger>
            <TabsTrigger value="adiantamentos">Adiantamentos pagos</TabsTrigger>
          </TabsList>

          {(["faturamento", "adiantamentos"] as Tipo[]).map((t) => (
            <TabsContent key={t} value={t} className="space-y-4">
              <Card className="shadow-card">
                <CardHeader><CardTitle className="text-base">1. Selecione o arquivo CSV</CardTitle></CardHeader>
                <CardContent>
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 px-6 py-10 text-center hover:bg-muted/50">
                    <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{filename || "Clique para enviar um arquivo .csv"}</span>
                    <Input type="file" accept=".csv,text/csv" className="hidden" onChange={onFile} />
                  </label>
                </CardContent>
              </Card>

              {headers.length > 0 && (
                <>
                  <Card className="shadow-card">
                    <CardHeader><CardTitle className="text-base">2. Mapeie as colunas</CardTitle></CardHeader>
                    <CardContent>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {FIELD_OPTIONS[t].map((f) => (
                          <div key={f.key} className="space-y-1.5">
                            <Label>{f.label}</Label>
                            <Select value={mapping[f.key] ?? ""} onValueChange={(v) => setMapping({ ...mapping, [f.key]: v })}>
                              <SelectTrigger><SelectValue placeholder="Selecione coluna" /></SelectTrigger>
                              <SelectContent>{headers.map((h) => <SelectItem key={h} value={h}>{h}</SelectItem>)}</SelectContent>
                            </Select>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-card">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center justify-between">
                        <span>3. Preview ({rows.length} linhas)</span>
                        <Button onClick={importar}><FileSpreadsheet className="mr-2 h-4 w-4" />Confirmar importação</Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="max-h-[360px] overflow-auto">
                        <Table>
                          <TableHeader><TableRow>
                            {FIELD_OPTIONS[t].map((f) => <TableHead key={f.key}>{f.label}</TableHead>)}
                          </TableRow></TableHeader>
                          <TableBody>
                            {rows.slice(0, 50).map((r, i) => (
                              <TableRow key={i}>
                                {FIELD_OPTIONS[t].map((f) => {
                                  const raw = r[mapping[f.key]];
                                  const isVal = ["valor", "valor_bruto", "taxas_airbnb", "valor_liquido"].includes(f.key);
                                  return <TableCell key={f.key} className={isVal ? "num" : ""}>{isVal ? brl(parseNum(raw)) : String(raw ?? "—")}</TableCell>;
                                })}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>
          ))}
        </Tabs>

        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-base">Histórico de importações</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow>
                <TableHead>Data</TableHead><TableHead>Tipo</TableHead><TableHead>Arquivo</TableHead>
                <TableHead>Linhas</TableHead><TableHead>Inseridos</TableHead><TableHead>Duplicados</TableHead><TableHead>Erros</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {history.length === 0 && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-6">Nenhuma importação ainda.</TableCell></TableRow>}
                {history.map((h) => (
                  <TableRow key={h.id}>
                    <TableCell>{dateBR(h.created_at)}</TableCell>
                    <TableCell><Badge variant="outline">{h.tipo}</Badge></TableCell>
                    <TableCell className="text-muted-foreground">{h.arquivo}</TableCell>
                    <TableCell className="num">{h.total_linhas}</TableCell>
                    <TableCell className="num text-success"><span className="inline-flex items-center gap-1"><CheckCircle2 className="h-3 w-3" />{h.inseridos}</span></TableCell>
                    <TableCell className="num text-muted-foreground">{h.duplicados}</TableCell>
                    <TableCell className="num text-destructive"><span className="inline-flex items-center gap-1">{h.erros > 0 && <AlertCircle className="h-3 w-3" />}{h.erros}</span></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
