import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { MonthPicker } from "@/components/MonthPicker";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { brl, dateBR, monthRange } from "@/lib/format";
import { useCompetenciaState } from "@/hooks/useLatestCompetencia";
import { Printer } from "lucide-react";

export default function RelatorioPagamentos() {
  const [mes, setMes] = useCompetenciaState();
  const [payouts, setPayouts] = useState<any[]>([]);
  const [adiantamentos, setAdiantamentos] = useState<any[]>([]);

  useEffect(() => { load(); }, [mes]);

  async function load() {
    const { start, end } = monthRange(mes);
    // payouts filtram por data; adiantamentos por mes_competencia
    const ini = new Date(start);
    const fimWin = new Date(new Date(end).getFullYear(), new Date(end).getMonth() + 1, 1);
    const toIso = (d: Date) => d.toISOString().slice(0, 10);
    const [p, a] = await Promise.all([
      supabase.from("payouts").select("*")
        .gte("data", toIso(ini)).lte("data", toIso(fimWin))
        .order("data", { ascending: false }),
      supabase.from("adiantamentos").select("*, investidores(nome)")
        .gte("mes_competencia", start).lte("mes_competencia", end)
        .order("data", { ascending: false }),
    ]);
    setPayouts(p.data ?? []);
    setAdiantamentos(a.data ?? []);
  }

  const totPayouts = payouts.reduce((s, x) => s + Number(x.valor_pago || 0), 0);
  const totSA7D = payouts.filter((x) => x.is_sa7d).reduce((s, x) => s + Number(x.valor_pago || 0), 0);
  const totInvestidor = totPayouts - totSA7D;
  const totAdiant = adiantamentos.reduce((s, x) => s + Number(x.valor || 0), 0);

  return (
    <>
      <PageHeader
        title="Relatório — Pagamentos"
        description="Payouts do Airbnb e adiantamentos repassados aos investidores."
        actions={
          <div className="contents print:hidden sm:flex sm:w-full sm:flex-wrap sm:items-center sm:gap-2 lg:w-auto">
            <MonthPicker value={mes} onChange={setMes} />
            <Button variant="outline" onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" />PDF</Button>
          </div>
        }
      />
      <div className="space-y-4 p-6">
        <div className="grid gap-3 sm:grid-cols-4">
          <Card className="shadow-card"><CardContent className="p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Payouts totais</div>
            <div className="num mt-1 text-xl font-semibold">{brl(totPayouts)}</div>
          </CardContent></Card>
          <Card className="shadow-card"><CardContent className="p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Entrou na SA7D</div>
            <div className="num mt-1 text-xl font-semibold">{brl(totSA7D)}</div>
          </CardContent></Card>
          <Card className="shadow-card"><CardContent className="p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Direto p/ investidor</div>
            <div className="num mt-1 text-xl font-semibold">{brl(totInvestidor)}</div>
          </CardContent></Card>
          <Card className="shadow-card"><CardContent className="p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Adiantamentos (tabela)</div>
            <div className="num mt-1 text-xl font-semibold">{brl(totAdiant)}</div>
          </CardContent></Card>
        </div>

        <Tabs defaultValue="payouts">
          <TabsList>
            <TabsTrigger value="payouts">Payouts ({payouts.length})</TabsTrigger>
            <TabsTrigger value="adiantamentos">Adiantamentos ({adiantamentos.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="payouts">
            <Card className="shadow-card"><CardContent className="overflow-x-auto p-0">
              <Table className="min-w-[680px]">
                <TableHeader><TableRow>
                  <TableHead>Data</TableHead><TableHead>Recebedor</TableHead>
                  <TableHead>Destino</TableHead><TableHead>Valor</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {payouts.length === 0 && (
                    <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">Sem payouts no período.</TableCell></TableRow>
                  )}
                  {payouts.map((x) => (
                    <TableRow key={x.id}>
                      <TableCell>{dateBR(x.data)}</TableCell>
                      <TableCell className="text-muted-foreground max-w-[320px] truncate">{x.recebedor}</TableCell>
                      <TableCell>
                        <Badge variant={x.is_sa7d ? "default" : "secondary"}>{x.is_sa7d ? "SA7D" : "Investidor"}</Badge>
                      </TableCell>
                      <TableCell className="num">{brl(x.valor_pago)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="adiantamentos">
            <Card className="shadow-card"><CardContent className="overflow-x-auto p-0">
              <Table className="min-w-[640px]">
                <TableHeader><TableRow>
                  <TableHead>Data</TableHead><TableHead>Investidor</TableHead>
                  <TableHead>Origem</TableHead><TableHead>Valor</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {adiantamentos.length === 0 && (
                    <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">Sem adiantamentos no mês.</TableCell></TableRow>
                  )}
                  {adiantamentos.map((x) => (
                    <TableRow key={x.id}>
                      <TableCell>{dateBR(x.data)}</TableCell>
                      <TableCell className="font-medium">{x.investidores?.nome ?? "—"}</TableCell>
                      <TableCell className="text-muted-foreground">{x.origem === "airbnb_direto" ? "Airbnb direto" : "Empresa"}</TableCell>
                      <TableCell className="num">{brl(x.valor)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent></Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
