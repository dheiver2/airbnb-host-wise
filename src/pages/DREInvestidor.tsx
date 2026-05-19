import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { MonthPicker } from "@/components/MonthPicker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { brl, monthRange, monthBR } from "@/lib/format";
import { useCompetenciaState } from "@/hooks/useLatestCompetencia";
import { Combobox } from "@/components/Combobox";
import { Printer, Building2 } from "lucide-react";

interface Linha { label: string; valor: number; tipo?: "receita" | "despesa" | "total" | "subtotal"; }

export default function DREInvestidor() {
  const [investidores, setInvestidores] = useState<any[]>([]);
  const [investidorId, setInvestidorId] = useState<string>("");
  const [mes, setMes] = useCompetenciaState();
  const [imoveis, setImoveis] = useState<any[]>([]);
  const [reservas, setReservas] = useState<any[]>([]);
  const [servicos, setServicos] = useState<any[]>([]);
  const [manuts, setManuts] = useState<any[]>([]);
  const [adiants, setAdiants] = useState<any[]>([]);

  useEffect(() => { supabase.from("investidores").select("id, nome").order("nome").then(({ data }) => { setInvestidores(data ?? []); if (data?.[0] && !investidorId) setInvestidorId(data[0].id); }); }, []);
  useEffect(() => { if (investidorId) load(); }, [investidorId, mes]);

  async function load() {
    const { start, end } = monthRange(mes);
    const { data: ims } = await supabase.from("imoveis").select("*").eq("investidor_id", investidorId);
    setImoveis(ims ?? []);
    const ids = (ims ?? []).map((i: any) => i.id);
    if (ids.length === 0) { setReservas([]); setServicos([]); setManuts([]); setAdiants([]); return; }
    const [r, s, m, a] = await Promise.all([
      supabase.from("reservas").select("*").in("imovel_id", ids).gte("mes_competencia", start).lte("mes_competencia", end),
      supabase.from("servicos_operacionais").select("*").in("imovel_id", ids).gte("mes_competencia", start).lte("mes_competencia", end),
      supabase.from("manutencoes").select("*").in("imovel_id", ids).gte("mes_competencia", start).lte("mes_competencia", end),
      // Adiantamentos JA recebidos pelo investidor: is_sa7d=false significa
      // "Airbnb pagou direto" ou "SA7D repassou". Inclui as linhas criadas pelo
      // Importar (1 por reserva) E os lancamentos manuais via /adiantamentos.
      // NAO somar payouts separados — seria dupla contagem (Importar ja cria
      // entradas espelhando os payouts).
      supabase.from("adiantamentos").select("*").eq("investidor_id", investidorId).eq("is_sa7d", false).gte("mes_competencia", start).lte("mes_competencia", end),
    ]);
    setReservas(r.data ?? []); setServicos(s.data ?? []); setManuts(m.data ?? []); setAdiants(a.data ?? []);
  }

  const calc = useMemo(() => {
    const porImovel = imoveis.map((im) => {
      const rs = reservas.filter((x) => x.imovel_id === im.id);
      const faturamento = rs.reduce((s, x) => s + Number(x.valor_bruto || 0), 0);
      // Comissão sobre valor_liquido (após taxas Airbnb), consistente com DRE Empresa.
      // Faturamento bruto continua sobre valor_bruto (mostrado ao investidor).
      const baseComissao = rs.reduce((s, x) => s + Number(x.valor_liquido || x.valor_bruto || 0), 0);
      const comissao = baseComissao * (Number(im.percentual_comissao) / 100);
      const ss = servicos.filter((x) => x.imovel_id === im.id);
      const despFaxina = ss.filter((x) => x.tipo === "faxina").reduce((s, x) => s + Number(x.valor_cobrado || 0), 0);
      const despLav = ss.filter((x) => x.tipo === "lavanderia").reduce((s, x) => s + Number(x.valor_cobrado || 0), 0);
      const despMat = ss.filter((x) => x.tipo === "material").reduce((s, x) => s + Number(x.valor_cobrado || 0), 0);
      const ms = manuts.filter((x) => x.imovel_id === im.id && x.rateio === "investidor");
      const manutencao = ms.reduce((s, x) => s + Number(x.valor_cobrado || x.custo || 0), 0);
      return { im, faturamento, comissao, despFaxina, despLav, despMat, manutencao };
    });

    const faturamento = porImovel.reduce((s, p) => s + p.faturamento, 0);
    const comissao = porImovel.reduce((s, p) => s + p.comissao, 0);
    const despFaxina = porImovel.reduce((s, p) => s + p.despFaxina, 0);
    const despLav = porImovel.reduce((s, p) => s + p.despLav, 0);
    const despMat = porImovel.reduce((s, p) => s + p.despMat, 0);
    const manutencao = porImovel.reduce((s, p) => s + p.manutencao, 0);
    const totalDesp = comissao + despFaxina + despLav + despMat + manutencao;
    const liquida = faturamento - totalDesp;
    // Adiantamentos: tudo que o investidor ja recebeu (is_sa7d=false).
    // Inclui Airbnb direto E SA7D forwarding. Vem da tabela adiantamentos —
    // o Importar.tsx ja cria 1 linha por reserva espelhando o payout.
    const adiantado = adiants.reduce((s, a) => s + Number(a.valor || 0), 0);
    const saldo = liquida - adiantado;
    const pctCustos = faturamento > 0 ? (totalDesp / faturamento) * 100 : 0;

    return { porImovel, faturamento, comissao, despFaxina, despLav, despMat, manutencao, totalDesp, liquida, adiantado, saldo, pctCustos };
  }, [imoveis, reservas, servicos, manuts, adiants]);

  const investidor = investidores.find((i) => i.id === investidorId);

  const linhas: Linha[] = [
    { label: "(+) Faturamento bruto Airbnb", valor: calc.faturamento, tipo: "receita" },
    { label: "(−) Comissão da empresa", valor: -calc.comissao, tipo: "despesa" },
    { label: "(−) Faxina", valor: -calc.despFaxina, tipo: "despesa" },
    { label: "(−) Lavanderia", valor: -calc.despLav, tipo: "despesa" },
    { label: "(−) Material de limpeza", valor: -calc.despMat, tipo: "despesa" },
    { label: "(−) Manutenções", valor: -calc.manutencao, tipo: "despesa" },
    { label: "= Receita líquida do investidor", valor: calc.liquida, tipo: "subtotal" },
    { label: "(−) Adiantamentos já pagos", valor: -calc.adiantado, tipo: "despesa" },
    { label: "= Saldo a repassar", valor: calc.saldo, tipo: "total" },
  ];

  return (
    <>
      <PageHeader
        title="DRE por Investidor"
        description="Demonstrativo mensal por proprietário."
        actions={
          <div className="contents print:hidden sm:flex sm:w-full sm:flex-wrap sm:items-center sm:gap-2 lg:w-auto">
            <Combobox
              options={investidores.map((i) => ({ value: i.id, label: i.nome }))}
              value={investidorId}
              onChange={setInvestidorId}
              placeholder="Selecione o investidor"
              searchPlaceholder="Buscar investidor..."
              className="min-w-[260px] sm:flex-1 lg:flex-none"
            />
            <MonthPicker value={mes} onChange={setMes} />
            <Button variant="outline" onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" />Imprimir / PDF</Button>
          </div>
        }
      />
      <div className="space-y-4 p-6">
        {!investidorId && (
          <Card className="shadow-card"><CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <Building2 className="h-10 w-10 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">Selecione um investidor para ver o demonstrativo.</div>
          </CardContent></Card>
        )}
        {investidor && imoveis.length === 0 && (
          <Card className="shadow-card"><CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <Building2 className="h-10 w-10 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">{investidor.nome} ainda não possui imóveis cadastrados.</div>
          </CardContent></Card>
        )}
        {investidor && imoveis.length > 0 && (
          <Card className="shadow-card">
            <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Investidor</div>
                <div className="text-lg font-semibold">{investidor.nome}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Competência</div>
                <div className="text-lg font-semibold capitalize">{monthBR(mes + "-01")}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Imóveis</div>
                <div className="text-lg font-semibold">{imoveis.length} · <Badge variant="secondary">{imoveis.length <= 1 ? "Único" : "Múltiplos"}</Badge></div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">% Custos / faturamento</div>
                <div className="num text-lg font-semibold">{calc.pctCustos.toFixed(1)}%</div>
              </div>
            </CardContent>
          </Card>
        )}

        {investidor && imoveis.length > 0 && (
          <>
            <Card className="shadow-card">
              <CardHeader><CardTitle className="text-base">Demonstrativo de Resultado</CardTitle></CardHeader>
              <CardContent className="p-0">
                <ul className="divide-y divide-border">
                  {linhas.map((l) => (
                    <li key={l.label} className={`flex items-center justify-between px-5 py-3 ${l.tipo === "total" ? "bg-muted/60 font-semibold" : l.tipo === "subtotal" ? "bg-muted/30 font-medium" : ""}`}>
                      <span className={l.tipo === "total" ? "text-base" : "text-sm"}>{l.label}</span>
                      <span className={`num ${l.tipo === "total" ? "text-lg" : "text-sm"} ${l.valor < 0 ? "text-destructive" : "text-foreground"}`}>{brl(l.valor)}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {imoveis.length > 1 && (
              <Card className="shadow-card">
                <CardHeader><CardTitle className="text-base">Drill-down por imóvel</CardTitle></CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <tr><th className="px-4 py-2">Imóvel</th><th className="px-4 py-2">Faturamento</th><th className="px-4 py-2">Comissão</th><th className="px-4 py-2">Faxina</th><th className="px-4 py-2">Lavand.</th><th className="px-4 py-2">Material</th><th className="px-4 py-2">Manut.</th><th className="px-4 py-2">Líquido</th></tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {calc.porImovel.map((p) => {
                        const liq = p.faturamento - p.comissao - p.despFaxina - p.despLav - p.despMat - p.manutencao;
                        return (
                          <tr key={p.im.id}>
                            <td className="px-4 py-2 font-medium">{p.im.codigo}</td>
                            <td className="px-4 py-2 num">{brl(p.faturamento)}</td>
                            <td className="px-4 py-2 num text-muted-foreground">{brl(p.comissao)}</td>
                            <td className="px-4 py-2 num text-muted-foreground">{brl(p.despFaxina)}</td>
                            <td className="px-4 py-2 num text-muted-foreground">{brl(p.despLav)}</td>
                            <td className="px-4 py-2 num text-muted-foreground">{brl(p.despMat)}</td>
                            <td className="px-4 py-2 num text-muted-foreground">{brl(p.manutencao)}</td>
                            <td className="px-4 py-2 num font-semibold">{brl(liq)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </>
  );
}
