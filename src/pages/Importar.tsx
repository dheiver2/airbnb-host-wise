import { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
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

const FIELD_OPTIONS: Record<Tipo, { key: string; label: string; required?: boolean }[]> = {
  faturamento: [
    { key: "anuncio", label: "Anúncio (extrai código)", required: true },
    { key: "check_in", label: "Data de início (check-in)", required: true },
    { key: "check_out", label: "Data de término (check-out)", required: true },
    { key: "hospedes", label: "Hóspede (nome)" },
    { key: "noites", label: "Noites" },
    { key: "valor", label: "Valor bruto", required: true },
    { key: "taxa", label: "Taxa de serviço do anfitrião" },
    { key: "valor_liq", label: "Valor líquido" },
  ],
  adiantamentos: [
    { key: "anuncio", label: "Anúncio (extrai código)", required: true },
    { key: "data", label: "Data do pagamento", required: true },
    { key: "valor", label: "Valor", required: true },
  ],
};

// Extrai o código do imóvel de strings tipo "ANA104 - 2/4 Beira Mar..." ou "Atauá | Pé na Areia..."
function extractCodigo(anuncio: string): string | null {
  if (!anuncio) return null;
  const s = String(anuncio).trim();
  // padrão "CODIGO - resto"
  const m = s.match(/^([A-Za-zÀ-ÿ0-9]+)\s*[-–|]/);
  if (m) return m[1].trim();
  // fallback: primeira palavra
  const w = s.split(/\s+/)[0];
  return w || null;
}

function parseDate(v: any): string | null {
  if (v == null || v === "") return null;
  if (v instanceof Date && !isNaN(v.getTime())) return v.toISOString().slice(0, 10);
  const s = String(v).trim();
  // MM/DD/YYYY (formato Airbnb)
  let m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (m) return `${m[3]}-${m[1]}-${m[2]}`;
  // DD/MM/YYYY
  m = s.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (m) return `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  const d = new Date(s);
  if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return null;
}

function parseNum(v: any): number {
  if (v == null || v === "") return 0;
  if (typeof v === "number") return v;
  const s = String(v).replace(/[R$\s]/g, "").replace(/\.(?=\d{3}(\D|$))/g, "").replace(",", ".");
  const n = Number(s);
  return isNaN(n) ? 0 : n;
}

export default function Importar() {
  const [tipo, setTipo] = useState<Tipo>("faturamento");
  const [rows, setRows] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [imoveis, setImoveis] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [filename, setFilename] = useState("");
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [activeSheet, setActiveSheet] = useState<string>("");
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [fileKey, setFileKey] = useState(0); // força reset do <input file> após importação

  useEffect(() => {
    supabase.from("imoveis").select("id, codigo, investidor_id").then(({ data }) => setImoveis(data ?? []));
    loadHistory();
  }, []);

  async function loadHistory() {
    const { data } = await supabase.from("importacoes_airbnb").select("*").order("created_at", { ascending: false }).limit(20);
    setHistory(data ?? []);
  }

  function applyAutoMapping(hs: string[], t: Tipo) {
    const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
    const matchers: Record<string, string[]> = {
      anuncio: ["anuncio", "rotulosdelinha", "imovel"],
      check_in: ["datadeinicio", "checkin", "inicio"],
      check_out: ["datadetermino", "checkout", "termino", "fim"],
      hospedes: ["hospede", "hospedes"],
      noites: ["noites", "diarias"],
      valor: ["ganhosbrutos", "valorbruto", "somadevalor", "total", "valor"],
      taxa: ["taxadeservico", "taxadoanfitriao", "taxa", "servicefee", "hostfee"],
      valor_liq: ["valorliquido", "liquido", "netliquido", "payout"],
      data: ["data", "datapagamento"],
    };
    const auto: Record<string, string> = {};
    FIELD_OPTIONS[t].forEach((f) => {
      const targets = matchers[f.key] ?? [f.key];
      const guess = hs.find((h) => targets.some((tg) => norm(h).includes(tg)));
      if (guess) auto[f.key] = guess;
    });
    setMapping(auto);
  }

  function loadSheetRows(wb: XLSX.WorkBook, sheetName: string) {
    const ws = wb.Sheets[sheetName];
    // pega como matriz para detectar a linha de cabeçalho
    const aoa: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, defval: "" });
    if (!aoa.length) { setRows([]); setHeaders([]); return; }
    // encontra a primeira linha não vazia que contém >=3 strings (cabeçalho)
    let headerIdx = aoa.findIndex((r) => r.filter((c) => String(c).trim() !== "").length >= 3);
    if (headerIdx < 0) headerIdx = 0;
    const hs = aoa[headerIdx].map((c, i) => String(c).trim() || `Coluna ${i + 1}`);
    const data = aoa.slice(headerIdx + 1)
      .filter((r) => r.some((c) => String(c).trim() !== ""))
      .map((r) => Object.fromEntries(hs.map((h, i) => [h, r[i] ?? ""])));
    setHeaders(hs);
    setRows(data);
    applyAutoMapping(hs, tipo);
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFilename(file.name);
    const isXlsx = /\.xlsx?$/i.test(file.name);
    if (isXlsx) {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      setWorkbook(wb);
      setSheetNames(wb.SheetNames);
      // escolhe automaticamente a aba com mais linhas/colunas (geralmente a aba de dados, não a pivot)
      let best = wb.SheetNames[0];
      let bestScore = -1;
      wb.SheetNames.forEach((n) => {
        const ws = wb.Sheets[n];
        const ref = ws["!ref"]; if (!ref) return;
        const r = XLSX.utils.decode_range(ref);
        const score = (r.e.r - r.s.r) * (r.e.c - r.s.c + 1);
        if (score > bestScore) { bestScore = score; best = n; }
      });
      setActiveSheet(best);
      loadSheetRows(wb, best);
    } else {
      setWorkbook(null); setSheetNames([]); setActiveSheet("");
      Papa.parse(file, {
        header: true, skipEmptyLines: true,
        complete: (res) => {
          const rs = res.data as any[];
          const hs = Object.keys(rs[0] ?? {});
          setHeaders(hs); setRows(rs); applyAutoMapping(hs, tipo);
        },
      });
    }
  }

  function onChangeSheet(name: string) {
    setActiveSheet(name);
    if (workbook) loadSheetRows(workbook, name);
  }

  const codigoIndex = useMemo(() => {
    const m = new Map<string, any>();
    imoveis.forEach((i) => m.set(i.codigo.toLowerCase(), i));
    return m;
  }, [imoveis]);

  async function importar() {
    if (rows.length === 0) return toast.error("Carregue um arquivo");
    const required = FIELD_OPTIONS[tipo].filter((f) => f.required);
    for (const f of required) {
      if (!mapping[f.key]) return toast.error(`Mapeie o campo: ${f.label}`);
    }

    let inseridos = 0, duplicados = 0, erros = 0;
    const errosDetalhe: string[] = [];

    try {

    if (tipo === "faturamento") {
      type PendingReserva = {
        imovel_id: string; check_in: string; check_out: string;
        valor_bruto: number; taxas_airbnb: number; valor_liquido: number;
        mes_competencia: string; codigo_airbnb: string | null;
      };
      // Agrega múltiplas linhas da mesma reserva (Airbnb pode quebrar 1 reserva em vários lançamentos)
      const aggMap = new Map<string, PendingReserva>();

      for (const row of rows) {
        const anuncio = row[mapping.anuncio];
        const codigo = extractCodigo(String(anuncio ?? ""));
        if (!codigo) { erros++; continue; }
        const im = codigoIndex.get(codigo.toLowerCase());
        if (!im) { erros++; if (errosDetalhe.length < 5) errosDetalhe.push(`Imóvel não encontrado: ${codigo}`); continue; }
        const checkIn = parseDate(row[mapping.check_in]);
        const checkOut = parseDate(row[mapping.check_out]);
        if (!checkIn || !checkOut) { erros++; continue; }
        const valor = parseNum(row[mapping.valor]);
        if (valor <= 0) { erros++; continue; }
        const taxa = mapping.taxa ? Math.abs(parseNum(row[mapping.taxa])) : 0;
        const valorLiqRaw = mapping.valor_liq ? parseNum(row[mapping.valor_liq]) : 0;
        const valorLiquido = valorLiqRaw > 0 ? valorLiqRaw : valor - taxa;
        const hospede = mapping.hospedes ? String(row[mapping.hospedes] ?? "").trim() : "";
        const key = `${im.id}|${checkIn}|${checkOut}`;
        const ex = aggMap.get(key);
        if (ex) {
          ex.valor_bruto += valor;
          ex.taxas_airbnb += taxa;
          ex.valor_liquido += valorLiquido;
        } else {
          aggMap.set(key, {
            imovel_id: im.id, check_in: checkIn, check_out: checkOut,
            valor_bruto: valor, taxas_airbnb: taxa, valor_liquido: valorLiquido,
            mes_competencia: `${checkOut.slice(0, 7)}-01`,
            codigo_airbnb: hospede ? hospede.slice(0, 60) : null,
          });
        }
      }
      const pending: PendingReserva[] = Array.from(aggMap.values());

      if (pending.length > 0) {
        // dedupe: busca reservas existentes pelas mesmas chaves (imovel, check_in, check_out)
        const imovelIds = [...new Set(pending.map((r) => r.imovel_id))];
        const checkIns = [...new Set(pending.map((r) => r.check_in))];
        const { data: existing } = await supabase.from("reservas")
          .select("id, imovel_id, check_in, check_out, valor_bruto")
          .in("imovel_id", imovelIds).in("check_in", checkIns);
        const existingMap = new Map(
          (existing ?? []).map((r) => [`${r.imovel_id}|${r.check_in}|${r.check_out}`, r])
        );

        const toInsert: PendingReserva[] = [];
        const toUpdate: { id: string; r: PendingReserva }[] = [];
        for (const r of pending) {
          const ex = existingMap.get(`${r.imovel_id}|${r.check_in}|${r.check_out}`);
          if (!ex) {
            toInsert.push(r);
          } else if (Math.abs(Number(ex.valor_bruto) - r.valor_bruto) < 0.01) {
            duplicados++;
          } else {
            toUpdate.push({ id: ex.id, r });
          }
        }

        // INSERT em chunks de 500
        const CHUNK = 500;
        for (let i = 0; i < toInsert.length; i += CHUNK) {
          const chunk = toInsert.slice(i, i + CHUNK);
          const { error } = await supabase.from("reservas").insert(
            chunk.map((r) => ({ ...r, hospedes: 1 }))
          );
          if (error) {
            erros += chunk.length;
            if (errosDetalhe.length < 5) errosDetalhe.push(error.message);
          } else {
            inseridos += chunk.length;
          }
        }

        // UPDATE valores divergentes (mesma reserva, valor mudou)
        for (const u of toUpdate) {
          const { error } = await supabase.from("reservas")
            .update({ valor_bruto: u.r.valor_bruto, taxas_airbnb: u.r.taxas_airbnb, valor_liquido: u.r.valor_liquido })
            .eq("id", u.id);
          if (error) { erros++; if (errosDetalhe.length < 5) errosDetalhe.push(error.message); }
          else inseridos++;
        }
      }
      // ── Adiantamentos: parse → dedupe em lote → batch insert ──
      type PendingAdt = {
        investidor_id: string; imovel_id: string;
        data: string; valor: number; mes_competencia: string;
      };
      const pendingAdt: PendingAdt[] = [];

      for (const row of rows) {
        const anuncio = row[mapping.anuncio];
        const codigo = extractCodigo(String(anuncio ?? ""));
        if (!codigo) { erros++; continue; }
        const im = codigoIndex.get(codigo.toLowerCase());
        if (!im) { erros++; if (errosDetalhe.length < 5) errosDetalhe.push(`Imóvel não encontrado: ${codigo}`); continue; }
        if (!im.investidor_id) { erros++; if (errosDetalhe.length < 5) errosDetalhe.push(`Imóvel sem investidor: ${codigo}`); continue; }
        const data = parseDate(row[mapping.data]);
        const valor = parseNum(row[mapping.valor]);
        if (!data) { erros++; if (errosDetalhe.length < 5) errosDetalhe.push(`Data inválida na linha de ${codigo}`); continue; }
        if (valor <= 0) { erros++; if (errosDetalhe.length < 5) errosDetalhe.push(`Valor inválido na linha de ${codigo}`); continue; }
        pendingAdt.push({ investidor_id: im.investidor_id, imovel_id: im.id, data, valor, mes_competencia: `${data.slice(0, 7)}-01` });
      }

      if (pendingAdt.length > 0) {
        const imovelIds = [...new Set(pendingAdt.map((r) => r.imovel_id))];
        const datas = [...new Set(pendingAdt.map((r) => r.data))];
        const { data: existingAdt } = await supabase.from("adiantamentos")
          .select("imovel_id, data, valor")
          .in("imovel_id", imovelIds).in("data", datas);
        const existingAdtSet = new Set(
          (existingAdt ?? []).map((r) => `${r.imovel_id}|${r.data}|${r.valor}`)
        );

        const toInsertAdt: PendingAdt[] = [];
        for (const r of pendingAdt) {
          if (existingAdtSet.has(`${r.imovel_id}|${r.data}|${r.valor}`)) { duplicados++; }
          else { toInsertAdt.push(r); }
        }

        const CHUNK = 500;
        for (let i = 0; i < toInsertAdt.length; i += CHUNK) {
          const chunk = toInsertAdt.slice(i, i + CHUNK);
          const { error } = await supabase.from("adiantamentos").insert(
            chunk.map((r) => ({ ...r, origem: "airbnb_direto" as const }))
          );
          if (error) { erros += chunk.length; if (errosDetalhe.length < 5) errosDetalhe.push(error.message); }
          else inseridos += chunk.length;
        }
      }
    }

    } catch (err: any) {
      erros += rows.length - inseridos - duplicados;
      errosDetalhe.push(err?.message ?? "Erro inesperado");
      toast.error(`Erro na importação: ${err?.message ?? "Erro inesperado"}`);
    } finally {
      const { error: logErr } = await supabase.from("importacoes_airbnb").insert({
        tipo, arquivo: filename, total_linhas: rows.length, inseridos, duplicados, erros,
      });
      if (logErr) console.error("Falha ao salvar histórico:", logErr.message);
      if (inseridos > 0) {
        toast.success(`Importação: ${inseridos} inseridos, ${duplicados} duplicados, ${erros} erros`);
      } else if (duplicados > 0 && erros === 0) {
        toast.info(`Tudo já estava importado: ${duplicados} duplicados.`);
      } else if (erros > 0) {
        toast.warning(`Nenhuma linha inserida. ${erros} erros. Ex.: ${errosDetalhe.slice(0, 3).join(" | ")}`);
      }
      setRows([]); setHeaders([]); setMapping({}); setFilename(""); setWorkbook(null); setSheetNames([]); setActiveSheet("");
      setFileKey((k) => k + 1); // reseta o <input file> para permitir reimportar o mesmo arquivo
      loadHistory();
    }
  }

  return (
    <>
      <PageHeader title="Importar dados do Airbnb" description="Suba CSV ou XLSX de faturamento ou adiantamentos. O código do imóvel é extraído do nome do anúncio." />
      <div className="space-y-4 p-6">
        <Tabs value={tipo} onValueChange={(v) => { setTipo(v as Tipo); setRows([]); setHeaders([]); setMapping({}); setWorkbook(null); setSheetNames([]); }}>
          <TabsList>
            <TabsTrigger value="faturamento">Faturamento (Base Total)</TabsTrigger>
            <TabsTrigger value="adiantamentos">Adiantamentos pagos</TabsTrigger>
          </TabsList>

          {(["faturamento", "adiantamentos"] as Tipo[]).map((t) => (
            <TabsContent key={t} value={t} className="space-y-4">
              <Card className="shadow-card">
                <CardHeader><CardTitle className="text-base">1. Selecione o arquivo (.csv ou .xlsx)</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 px-6 py-10 text-center hover:bg-muted/50">
                    <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{filename || "Clique para enviar .csv ou .xlsx"}</span>
                    <Input key={fileKey} type="file" accept=".csv,.xlsx,.xls,text/csv" className="hidden" onChange={onFile} />
                  </label>
                  {sheetNames.length > 1 && (
                    <div className="space-y-1.5 max-w-sm">
                      <Label>Aba da planilha</Label>
                      <Select value={activeSheet} onValueChange={onChangeSheet}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{sheetNames.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">Selecione a aba com os dados detalhados (não o resumo/pivô).</p>
                    </div>
                  )}
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
                            <Label>{f.label}{f.required && <span className="text-destructive"> *</span>}</Label>
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
                            <TableHead>Código</TableHead>
                            {FIELD_OPTIONS[t].map((f) => <TableHead key={f.key}>{f.label}</TableHead>)}
                          </TableRow></TableHeader>
                          <TableBody>
                            {rows.slice(0, 50).map((r, i) => {
                              const cod = mapping.anuncio ? extractCodigo(String(r[mapping.anuncio] ?? "")) : null;
                              const known = cod ? codigoIndex.has(cod.toLowerCase()) : false;
                              return (
                                <TableRow key={i}>
                                  <TableCell>
                                    {cod ? (
                                      <Badge variant={known ? "default" : "destructive"}>{cod}</Badge>
                                    ) : <span className="text-muted-foreground">—</span>}
                                  </TableCell>
                                  {FIELD_OPTIONS[t].map((f) => {
                                    const raw = r[mapping[f.key]];
                                    const isVal = ["valor", "taxa", "valor_liq"].includes(f.key);
                                    const isDate = ["check_in", "check_out", "data"].includes(f.key);
                                    return <TableCell key={f.key} className={isVal ? "num" : ""}>
                                      {isVal ? brl(parseNum(raw)) : isDate ? (parseDate(raw) ? dateBR(parseDate(raw)!) : String(raw ?? "—")) : String(raw ?? "—")}
                                    </TableCell>;
                                  })}
                                </TableRow>
                              );
                            })}
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
