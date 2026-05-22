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

export default function RelatorioReservas() {
  const [mes, setMes] = useCompetenciaState();
  const [list, setList] = useState<any[]>([]);
  const [imovelFiltro, setImovelFiltro] = useState("");
  const [imoveis, setImoveis] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("imoveis").select("id, codigo").order("codigo").then(({ data }) => setImoveis(data ?? []));
  }, []);
  useEffect(() => { load(); }, [mes]);

  async function load() {
    const { start, end } = monthRange(mes);
    const { data } = await supabase.from("reservas")
      .select("*, imoveis(codigo)")
      .gte("mes_competencia", start).lte("mes_competencia", end)
      .order("check_in", { ascending: false });
    setList(data ?? []);
  }

  const filtered = useMemo(
    () => imovelFiltro ? list.filter((r) => r.imovel_id === imovelFiltro) : list,
    [list, imovelFiltro],
  );

  const noites = (r: any) => Math.max(0, Math.round((new Date(r.check_out).getTime() - new Date(r.check_in).getTime()) / 86400000));
  const totBruto = filtered.reduce((s, r) => s + Number(r.valor_bruto || 0), 0);
  const totLiquido = filtered.reduce((s, r) => s + Number(r.valor_liquido || 0), 0);
  const totNoites = filtered.reduce((s, r) => s + noites(r), 0);
  const adr = totNoites > 0 ? totBruto / totNoites : 0;

  return (
    <>
      <PageHeader
        title="Relatório — Reservas"
        description="Hospedagens por mês de competência."
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
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Reservas</div>
            <div className="num mt-1 text-xl font-semibold">{filtered.length}</div>
          </CardContent></Card>
          <Card className="shadow-card"><CardContent className="p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Faturamento bruto</div>
            <div className="num mt-1 text-xl font-semibold">{brl(totBruto)}</div>
          </CardContent></Card>
          <Card className="shadow-card"><CardContent className="p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Noites</div>
            <div className="num mt-1 text-xl font-semibold">{totNoites}</div>
          </CardContent></Card>
          <Card className="shadow-card"><CardContent className="p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">ADR (diária média)</div>
            <div className="num mt-1 text-xl font-semibold">{brl(adr)}</div>
          </CardContent></Card>
        </div>

        <Card className="shadow-card"><CardContent className="overflow-x-auto p-0">
          <Table className="min-w-[760px]">
            <TableHeader><TableRow>
              <TableHead>Imóvel</TableHead><TableHead>Check-in</TableHead><TableHead>Check-out</TableHead>
              <TableHead>Noites</TableHead><TableHead>Hóspedes</TableHead>
              <TableHead>Bruto</TableHead><TableHead>Líquido</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Sem reservas no mês.</TableCell></TableRow>
              )}
              {filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.imoveis?.codigo ?? "—"}</TableCell>
                  <TableCell>{dateBR(r.check_in)}</TableCell>
                  <TableCell>{dateBR(r.check_out)}</TableCell>
                  <TableCell className="num">{noites(r)}</TableCell>
                  <TableCell className="num">{r.hospedes ?? "—"}</TableCell>
                  <TableCell className="num">{brl(r.valor_bruto)}</TableCell>
                  <TableCell className="num">{brl(r.valor_liquido)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
        <div className="text-sm text-muted-foreground">
          Total líquido recebido: <span className="num font-semibold text-foreground">{brl(totLiquido)}</span>
        </div>
      </div>
    </>
  );
}
