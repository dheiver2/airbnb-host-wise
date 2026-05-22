import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { MonthPicker } from "@/components/MonthPicker";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Combobox } from "@/components/Combobox";
import { Button } from "@/components/ui/button";
import { brl, dateBR, monthRange } from "@/lib/format";
import { useCompetenciaState } from "@/hooks/useLatestCompetencia";
import { Printer } from "lucide-react";

export default function RelatorioManutencao() {
  const [mes, setMes] = useCompetenciaState();
  const [list, setList] = useState<any[]>([]);
  const [imoveis, setImoveis] = useState<any[]>([]);
  const [imovelFiltro, setImovelFiltro] = useState("");

  useEffect(() => {
    supabase.from("imoveis").select("id, codigo").order("codigo").then(({ data }) => setImoveis(data ?? []));
  }, []);
  useEffect(() => { load(); }, [mes]);

  async function load() {
    const { start, end } = monthRange(mes);
    const { data } = await supabase.from("manutencoes")
      .select("*, imoveis(codigo)")
      .gte("mes_competencia", start).lte("mes_competencia", end)
      .order("data", { ascending: false });
    setList(data ?? []);
  }

  const filtered = useMemo(
    () => imovelFiltro ? list.filter((x) => x.imovel_id === imovelFiltro) : list,
    [list, imovelFiltro],
  );
  const totCusto = filtered.reduce((s, x) => s + Number(x.custo || 0), 0);
  const totInvestidor = filtered.filter((x) => x.rateio === "investidor").reduce((s, x) => s + Number(x.custo || 0), 0);
  const totEmpresa = filtered.filter((x) => x.rateio === "empresa").reduce((s, x) => s + Number(x.custo || 0), 0);

  // agrupamento por categoria
  const porCategoria = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.forEach((x) => {
      const c = x.categoria || "sem categoria";
      map[c] = (map[c] || 0) + Number(x.custo || 0);
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [filtered]);

  return (
    <>
      <PageHeader
        title="Relatório — Manutenção"
        description="Manutenções por imóvel, categoria e rateio."
        actions={
          <div className="contents print:hidden sm:flex sm:w-full sm:flex-wrap sm:items-center sm:gap-2 lg:w-auto">
            <Combobox
              options={imoveis.map((i) => ({ value: i.id, label: i.codigo }))}
              value={imovelFiltro} onChange={setImovelFiltro}
              placeholder="Todos os imóveis" searchPlaceholder="Filtrar imóvel..." clearable
              className="min-w-[200px]"
            />
            <MonthPicker value={mes} onChange={setMes} />
            <Button variant="outline" onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" />PDF</Button>
          </div>
        }
      />
      <div className="space-y-4 p-6">
        <div className="grid gap-3 sm:grid-cols-4">
          <Card className="shadow-card"><CardContent className="p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Lançamentos</div>
            <div className="num mt-1 text-xl font-semibold">{filtered.length}</div>
          </CardContent></Card>
          <Card className="shadow-card"><CardContent className="p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Custo total</div>
            <div className="num mt-1 text-xl font-semibold">{brl(totCusto)}</div>
          </CardContent></Card>
          <Card className="shadow-card"><CardContent className="p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Rateio investidor</div>
            <div className="num mt-1 text-xl font-semibold">{brl(totInvestidor)}</div>
          </CardContent></Card>
          <Card className="shadow-card"><CardContent className="p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Rateio empresa</div>
            <div className="num mt-1 text-xl font-semibold">{brl(totEmpresa)}</div>
          </CardContent></Card>
        </div>

        {porCategoria.length > 0 && (
          <Card className="shadow-card"><CardContent className="p-4">
            <div className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">Custo por categoria</div>
            <div className="flex flex-wrap gap-2">
              {porCategoria.map(([cat, val]) => (
                <Badge key={cat} variant="secondary" className="gap-1">
                  {cat}: <span className="num">{brl(val)}</span>
                </Badge>
              ))}
            </div>
          </CardContent></Card>
        )}

        <Card className="shadow-card"><CardContent className="overflow-x-auto p-0">
          <Table className="min-w-[820px]">
            <TableHeader><TableRow>
              <TableHead>Data</TableHead><TableHead>Imóvel</TableHead><TableHead>Descrição</TableHead>
              <TableHead>Categoria</TableHead><TableHead>Custo</TableHead><TableHead>Rateio</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Sem manutenções no mês.</TableCell></TableRow>
              )}
              {filtered.map((x) => (
                <TableRow key={x.id}>
                  <TableCell>{dateBR(x.data)}</TableCell>
                  <TableCell className="font-medium">{x.imoveis?.codigo ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground max-w-[280px] truncate">{x.descricao}</TableCell>
                  <TableCell>{x.categoria ?? "—"}</TableCell>
                  <TableCell className="num">{brl(x.custo)}</TableCell>
                  <TableCell>
                    <Badge variant={x.rateio === "investidor" ? "default" : "secondary"}>{x.rateio}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      </div>
    </>
  );
}
