import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { MonthPicker } from "@/components/MonthPicker";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { brl, monthRange, monthBR } from "@/lib/format";
import { useCompetenciaState } from "@/hooks/useLatestCompetencia";
import { Printer } from "lucide-react";

/**
 * Relatório base para emissão de Notas Fiscais (mapa SistemA7D › Resultado).
 * Premissa: a SA7D fatura cada investidor pelos serviços que prestou no mês —
 * comissão de administração + serviços operacionais cobrados + manutenção
 * repassada. O total por investidor é a base da NF.
 */
export default function RelatorioNotasFiscais() {
  const [mes, setMes] = useCompetenciaState();
  const [investidores, setInvestidores] = useState<any[]>([]);
  const [imoveis, setImoveis] = useState<any[]>([]);
  const [reservas, setReservas] = useState<any[]>([]);
  const [servicos, setServicos] = useState<any[]>([]);
  const [manuts, setManuts] = useState<any[]>([]);

  useEffect(() => { load(); }, [mes]);

  async function load() {
    const { start, end } = monthRange(mes);
    const [inv, im, r, s, m] = await Promise.all([
      supabase.from("investidores").select("id, nome, documento, email"),
      supabase.from("imoveis").select("id, investidor_id, percentual_comissao"),
      supabase.from("reservas").select("imovel_id, valor_bruto, valor_liquido").gte("mes_competencia", start).lte("mes_competencia", end),
      supabase.from("servicos_operacionais").select("imovel_id, valor_cobrado").gte("mes_competencia", start).lte("mes_competencia", end),
      supabase.from("manutencoes").select("imovel_id, valor_cobrado, custo, rateio").gte("mes_competencia", start).lte("mes_competencia", end),
    ]);
    setInvestidores(inv.data ?? []);
    setImoveis(im.data ?? []);
    setReservas(r.data ?? []);
    setServicos(s.data ?? []);
    setManuts(m.data ?? []);
  }

  const linhas = useMemo(() => {
    const imovelById: Record<string, any> = {};
    imoveis.forEach((i) => { imovelById[i.id] = i; });

    return investidores.map((inv) => {
      const meusImoveis = imoveis.filter((i) => i.investidor_id === inv.id).map((i) => i.id);
      const setImoveis = new Set(meusImoveis);

      const comissao = reservas
        .filter((r) => setImoveis.has(r.imovel_id))
        .reduce((s, r) => {
          const im = imovelById[r.imovel_id];
          const base = Number(r.valor_liquido || r.valor_bruto || 0);
          return s + base * (Number(im?.percentual_comissao || 0) / 100);
        }, 0);

      const servicosV = servicos
        .filter((x) => setImoveis.has(x.imovel_id))
        .reduce((s, x) => s + Number(x.valor_cobrado || 0), 0);

      const manutV = manuts
        .filter((x) => setImoveis.has(x.imovel_id) && x.rateio === "investidor")
        .reduce((s, x) => s + Number(x.valor_cobrado || x.custo || 0), 0);

      const total = comissao + servicosV + manutV;
      return { inv, comissao, servicosV, manutV, total };
    }).filter((l) => l.total > 0).sort((a, b) => b.total - a.total);
  }, [investidores, imoveis, reservas, servicos, manuts]);

  const totGeral = linhas.reduce((s, l) => s + l.total, 0);
  const totComissao = linhas.reduce((s, l) => s + l.comissao, 0);
  const totServicos = linhas.reduce((s, l) => s + l.servicosV, 0);
  const totManut = linhas.reduce((s, l) => s + l.manutV, 0);

  return (
    <>
      <PageHeader
        title="Relatório — Notas Fiscais"
        description="Base para emissão de NF: valor faturado pela SA7D a cada investidor no mês."
        actions={
          <div className="contents print:hidden sm:flex sm:w-full sm:flex-wrap sm:items-center sm:gap-2 lg:w-auto">
            <MonthPicker value={mes} onChange={setMes} />
            <Button variant="outline" onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" />Imprimir / PDF</Button>
          </div>
        }
      />
      <div className="space-y-4 p-6">
        <div className="grid gap-3 sm:grid-cols-4">
          <Card className="shadow-card"><CardContent className="p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Comissão</div>
            <div className="num mt-1 text-xl font-semibold">{brl(totComissao)}</div>
          </CardContent></Card>
          <Card className="shadow-card"><CardContent className="p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Serviços</div>
            <div className="num mt-1 text-xl font-semibold">{brl(totServicos)}</div>
          </CardContent></Card>
          <Card className="shadow-card"><CardContent className="p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Manutenção</div>
            <div className="num mt-1 text-xl font-semibold">{brl(totManut)}</div>
          </CardContent></Card>
          <Card className="shadow-card"><CardContent className="p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Total a faturar</div>
            <div className="num mt-1 text-xl font-semibold text-success">{brl(totGeral)}</div>
          </CardContent></Card>
        </div>

        <Card className="shadow-card">
          <CardContent className="overflow-x-auto p-0">
            <div className="border-b border-border px-5 py-3 text-sm font-medium capitalize">
              Competência {monthBR(mes + "-01")} · {linhas.length} investidor(es) a faturar
            </div>
            <Table className="min-w-[760px]">
              <TableHeader><TableRow>
                <TableHead>Investidor</TableHead><TableHead>CPF / CNPJ</TableHead>
                <TableHead>Comissão</TableHead><TableHead>Serviços</TableHead>
                <TableHead>Manutenção</TableHead><TableHead>Total NF</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {linhas.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Nada a faturar no mês.</TableCell></TableRow>
                )}
                {linhas.map((l) => (
                  <TableRow key={l.inv.id}>
                    <TableCell className="font-medium">{l.inv.nome}</TableCell>
                    <TableCell className="text-muted-foreground">{l.inv.documento ?? "—"}</TableCell>
                    <TableCell className="num">{brl(l.comissao)}</TableCell>
                    <TableCell className="num">{brl(l.servicosV)}</TableCell>
                    <TableCell className="num">{brl(l.manutV)}</TableCell>
                    <TableCell className="num font-semibold">{brl(l.total)}</TableCell>
                  </TableRow>
                ))}
                {linhas.length > 0 && (
                  <TableRow className="bg-muted/50 font-semibold">
                    <TableCell colSpan={2}>TOTAL</TableCell>
                    <TableCell className="num">{brl(totComissao)}</TableCell>
                    <TableCell className="num">{brl(totServicos)}</TableCell>
                    <TableCell className="num">{brl(totManut)}</TableCell>
                    <TableCell className="num">{brl(totGeral)}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <p className="text-xs text-muted-foreground">
          ⓘ Valor base de NF = comissão de administração + serviços operacionais cobrados + manutenção
          repassada ao investidor. Cada linha corresponde a uma NF a emitir para o investidor.
        </p>
      </div>
    </>
  );
}
