import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { MonthPicker } from "@/components/MonthPicker";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Combobox } from "@/components/Combobox";
import { Button } from "@/components/ui/button";
import { brl, dateBR, monthRange } from "@/lib/format";
import { useCompetenciaState } from "@/hooks/useLatestCompetencia";
import { Printer } from "lucide-react";

export default function RelatorioLavanderia() {
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
    const { data } = await supabase.from("servicos_operacionais")
      .select("*, imoveis(codigo)")
      .eq("tipo", "lavanderia")
      .gte("mes_competencia", start).lte("mes_competencia", end)
      .order("data", { ascending: false });
    setList(data ?? []);
  }

  const filtered = useMemo(
    () => imovelFiltro ? list.filter((x) => x.imovel_id === imovelFiltro) : list,
    [list, imovelFiltro],
  );
  const totCusto = filtered.reduce((s, x) => s + Number(x.custo_real || 0), 0);
  const totCobrado = filtered.reduce((s, x) => s + Number(x.valor_cobrado || 0), 0);
  const margem = totCobrado - totCusto;

  return (
    <>
      <PageHeader
        title="Relatório — Lavanderia"
        description="Serviços de lavanderia lançados no período."
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
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Cobrado total</div>
            <div className="num mt-1 text-xl font-semibold">{brl(totCobrado)}</div>
          </CardContent></Card>
          <Card className="shadow-card"><CardContent className="p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Margem</div>
            <div className={`num mt-1 text-xl font-semibold ${margem < 0 ? "text-destructive" : "text-success"}`}>{brl(margem)}</div>
          </CardContent></Card>
        </div>

        <Card className="shadow-card"><CardContent className="overflow-x-auto p-0">
          <Table className="min-w-[680px]">
            <TableHeader><TableRow>
              <TableHead>Data</TableHead><TableHead>Imóvel</TableHead>
              <TableHead>Custo</TableHead><TableHead>Cobrado</TableHead><TableHead>Margem</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Sem lavanderias no mês.</TableCell></TableRow>
              )}
              {filtered.map((x) => (
                <TableRow key={x.id}>
                  <TableCell>{dateBR(x.data)}</TableCell>
                  <TableCell className="font-medium">{x.imoveis?.codigo ?? "—"}</TableCell>
                  <TableCell className="num">{brl(x.custo_real)}</TableCell>
                  <TableCell className="num">{brl(x.valor_cobrado)}</TableCell>
                  <TableCell className="num">{brl(Number(x.valor_cobrado || 0) - Number(x.custo_real || 0))}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      </div>
    </>
  );
}
