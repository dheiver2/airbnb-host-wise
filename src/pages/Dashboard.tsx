import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { MonthPicker } from "@/components/MonthPicker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { brl, daysInMonth, monthDate, monthRange } from "@/lib/format";
import { useCompetenciaState } from "@/hooks/useLatestCompetencia";
import { Label } from "@/components/ui/label";
import { Building2, TrendingUp, BarChart3, PiggyBank, ArrowUp, ArrowDown, BedDouble, Gauge } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

type Stats = {
  faturamento: number;
  lucro: number;
  imoveis: number;
  ocupacao: number;
  adr: number;
  revpar: number;
  noites: number;
  // MoM (variação % vs mês anterior)
  momFaturamento: number;
  momLucro: number;
  momOcupacao: number;
  momAdr: number;
};

const ZERO: Stats = { faturamento: 0, lucro: 0, imoveis: 0, ocupacao: 0, adr: 0, revpar: 0, noites: 0, momFaturamento: 0, momLucro: 0, momOcupacao: 0, momAdr: 0 };

export default function Dashboard() {
  const [mes, setMes] = useCompetenciaState();
  const [stats, setStats] = useState<Stats>(ZERO);
  const [evolucao, setEvolucao] = useState<{ mes: string; valor: number }[]>([]);
  const [topImoveis, setTopImoveis] = useState<{ codigo: string; valor: number }[]>([]);

  useEffect(() => { loadAll(); }, [mes]);

  // Calcula KPIs de um mês específico
  async function computeMonth(ym: string, imoveis: any[], imoveisMap: Record<string, any>) {
    const { start, end } = monthRange(ym);
    const [r, s, m, c] = await Promise.all([
      supabase.from("reservas").select("valor_bruto, check_in, check_out, imovel_id").gte("mes_competencia", start).lte("mes_competencia", end),
      supabase.from("servicos_operacionais").select("custo_real, valor_cobrado, tipo").gte("mes_competencia", start).lte("mes_competencia", end),
      supabase.from("manutencoes").select("custo, valor_cobrado, rateio").gte("mes_competencia", start).lte("mes_competencia", end),
      supabase.from("custos_fixos").select("valor").gte("mes_competencia", start).lte("mes_competencia", end),
    ]);
    const reservas = r.data ?? [];
    const servicos = s.data ?? [];
    const manuts = m.data ?? [];
    const custos = c.data ?? [];

    const faturamento = reservas.reduce((acc, x: any) => acc + Number(x.valor_bruto || 0), 0);

    // Receita da empresa = comissão + serviços cobrados + manutenção cobrada
    const comissao = reservas.reduce((acc, x: any) => {
      const im = imoveisMap[x.imovel_id];
      if (!im) return acc;
      return acc + Number(x.valor_bruto || 0) * (Number(im.percentual_comissao) / 100);
    }, 0);
    const recServ = servicos.reduce((a, x: any) => a + Number(x.valor_cobrado || 0), 0);
    const recManut = manuts.filter((x: any) => x.rateio === "investidor").reduce((a, x: any) => a + Number(x.valor_cobrado || 0), 0);
    const receitaEmpresa = comissao + recServ + recManut;

    // Custos da empresa
    const custoServ = servicos.reduce((a, x: any) => a + Number(x.custo_real || 0), 0);
    const custoManut = manuts.reduce((a, x: any) => a + Number(x.custo || 0), 0);
    const custoFixo = custos.reduce((a, x: any) => a + Number(x.valor || 0), 0);

    const lucro = receitaEmpresa - custoServ - custoManut - custoFixo;

    // Ocupação
    const dias = daysInMonth(ym);
    let noites = 0;
    reservas.forEach((x: any) => {
      const ci = new Date(x.check_in).getTime();
      const co = new Date(x.check_out).getTime();
      noites += Math.max(0, Math.round((co - ci) / 86400000));
    });
    const cap = imoveis.length * dias;
    const ocupacao = cap > 0 ? (noites / cap) * 100 : 0;

    const adr = noites > 0 ? faturamento / noites : 0;
    const revpar = cap > 0 ? faturamento / cap : 0;

    return { faturamento, lucro, ocupacao, adr, revpar, noites };
  }

  async function loadAll() {
    const imoveisRes = await supabase.from("imoveis").select("id, codigo, status, percentual_comissao").eq("status", "ativo");
    const imoveis = imoveisRes.data ?? [];
    const imoveisMap: Record<string, any> = {};
    imoveis.forEach((x: any) => { imoveisMap[x.id] = x; });

    // mês atual + mês anterior em paralelo
    const dt = monthDate(mes);
    const prev = new Date(dt.getFullYear(), dt.getMonth() - 1, 1);
    const prevYm = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, "0")}`;

    const [cur, prevK] = await Promise.all([
      computeMonth(mes, imoveis, imoveisMap),
      computeMonth(prevYm, imoveis, imoveisMap),
    ]);

    const mom = (a: number, b: number) => (b > 0 ? ((a - b) / b) * 100 : 0);

    setStats({
      faturamento: cur.faturamento,
      lucro: cur.lucro,
      imoveis: imoveis.length,
      ocupacao: cur.ocupacao,
      adr: cur.adr,
      revpar: cur.revpar,
      noites: cur.noites,
      momFaturamento: mom(cur.faturamento, prevK.faturamento),
      momLucro: mom(cur.lucro, prevK.lucro),
      momOcupacao: cur.ocupacao - prevK.ocupacao, // pp
      momAdr: mom(cur.adr, prevK.adr),
    });

    // Top imóveis (mês atual)
    const { start, end } = monthRange(mes);
    const { data: rTop } = await supabase.from("reservas").select("valor_bruto, imovel_id").gte("mes_competencia", start).lte("mes_competencia", end);
    const map: Record<string, number> = {};
    (rTop ?? []).forEach((r: any) => { map[r.imovel_id] = (map[r.imovel_id] || 0) + Number(r.valor_bruto || 0); });
    const top = Object.entries(map)
      .map(([id, valor]) => ({ codigo: imoveis.find((i: any) => i.id === id)?.codigo ?? "—", valor }))
      .sort((a, b) => b.valor - a.valor).slice(0, 5);
    setTopImoveis(top);

    // Evolução 12 meses
    const meses: { mes: string; valor: number }[] = [];
    const promises: Promise<any>[] = [];
    const labels: string[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(dt.getFullYear(), dt.getMonth() - i, 1);
      const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const { start: s, end: e } = monthRange(ym);
      labels.push(d.toLocaleDateString("pt-BR", { month: "short" }));
      promises.push(supabase.from("reservas").select("valor_bruto").gte("mes_competencia", s).lte("mes_competencia", e));
    }
    const results = await Promise.all(promises);
    results.forEach((res, idx) => {
      const v = (res.data ?? []).reduce((sum: number, r: any) => sum + Number(r.valor_bruto || 0), 0);
      meses.push({ mes: labels[idx], valor: v });
    });
    setEvolucao(meses);
  }

  const Delta = ({ v, suffix = "%", isPP = false }: { v: number; suffix?: string; isPP?: boolean }) => {
    if (!isFinite(v) || v === 0) return <span className="text-xs text-muted-foreground">— vs mês anterior</span>;
    const up = v > 0;
    const Icon = up ? ArrowUp : ArrowDown;
    const cls = up ? "text-success" : "text-destructive";
    const val = isPP ? `${v > 0 ? "+" : ""}${v.toFixed(1)} pp` : `${v > 0 ? "+" : ""}${v.toFixed(1)}${suffix}`;
    return (
      <span className={`mt-1 inline-flex items-center gap-1 text-xs font-medium ${cls}`}>
        <Icon className="h-3 w-3" />
        {val}
        <span className="ml-1 font-normal text-muted-foreground">vs mês anterior</span>
      </span>
    );
  };

  const cards = [
    { label: "Faturamento bruto", value: brl(stats.faturamento), icon: TrendingUp, delta: <Delta v={stats.momFaturamento} /> },
    { label: "Lucro líquido empresa", value: brl(stats.lucro), icon: PiggyBank, delta: <Delta v={stats.momLucro} />, highlight: stats.lucro < 0 },
    { label: "Imóveis ativos", value: String(stats.imoveis), icon: Building2, delta: null },
    { label: "Ocupação média", value: `${stats.ocupacao.toFixed(1)}%`, icon: BarChart3, delta: <Delta v={stats.momOcupacao} isPP /> },
  ];

  const performance = [
    { label: "ADR · diária média", value: brl(stats.adr), icon: BedDouble, delta: <Delta v={stats.momAdr} />, hint: `${stats.noites} noites no mês` },
    { label: "RevPAR · receita / unidade", value: brl(stats.revpar), icon: Gauge, delta: null, hint: "Faturamento ÷ (imóveis × dias)" },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Visão geral mensal da operação"
        actions={
          <div className="flex items-center gap-2">
            <Label htmlFor="mes" className="text-sm">Mês</Label>
            <MonthPicker id="mes" value={mes} onChange={setMes} />
          </div>
        }
      />
      <div className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <Card key={c.label} className="shadow-card">
              <CardContent className="flex items-start justify-between p-5">
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">{c.label}</div>
                  <div className={`num mt-1 text-2xl font-semibold ${c.highlight ? "text-destructive" : "text-foreground"}`}>{c.value}</div>
                  {c.delta && <div>{c.delta}</div>}
                </div>
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
                  <c.icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {performance.map((c) => (
            <Card key={c.label} className="shadow-card">
              <CardContent className="flex items-start justify-between p-5">
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">{c.label}</div>
                  <div className="num mt-1 text-2xl font-semibold text-foreground">{c.value}</div>
                  {c.delta ? <div>{c.delta}</div> : <div className="mt-1 text-xs text-muted-foreground">{c.hint}</div>}
                </div>
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
                  <c.icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="shadow-card lg:col-span-2">
            <CardHeader><CardTitle className="text-base">Evolução mensal (faturamento)</CardTitle></CardHeader>
            <CardContent className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={evolucao}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                    formatter={(v: any) => brl(Number(v))}
                  />
                  <Bar dataKey="valor" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader><CardTitle className="text-base">Top 5 imóveis</CardTitle></CardHeader>
            <CardContent>
              {topImoveis.length === 0 && <div className="text-sm text-muted-foreground">Sem dados no período.</div>}
              <ul className="divide-y divide-border">
                {topImoveis.map((t, i) => (
                  <li key={t.codigo} className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="grid h-6 w-6 place-items-center rounded bg-muted text-xs font-semibold text-muted-foreground">{i + 1}</span>
                      <span className="text-sm font-medium">{t.codigo}</span>
                    </div>
                    <span className="num text-sm">{brl(t.valor)}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
