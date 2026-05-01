import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { MonthPicker } from "@/components/MonthPicker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { brl, monthRange, monthInputValue } from "@/lib/format";
import { useCompetenciaState } from "@/hooks/useLatestCompetencia";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, TrendingUp, Wallet, BarChart3 } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function Dashboard() {
  const [mes, setMes] = useCompetenciaState();
  const [stats, setStats] = useState({ faturamento: 0, liquido: 0, imoveis: 0, ocupacao: 0 });
  const [evolucao, setEvolucao] = useState<{ mes: string; valor: number }[]>([]);
  const [topImoveis, setTopImoveis] = useState<{ codigo: string; valor: number }[]>([]);

  useEffect(() => { loadAll(); }, [mes]);

  async function loadAll() {
    const { start, end } = monthRange(mes);
    const [reservasRes, imoveisRes] = await Promise.all([
      supabase.from("reservas").select("valor_bruto, valor_liquido, check_in, check_out, imovel_id").gte("mes_competencia", start).lte("mes_competencia", end),
      supabase.from("imoveis").select("id, codigo, status").eq("status", "ativo"),
    ]);
    const reservas = reservasRes.data ?? [];
    const imoveis = imoveisRes.data ?? [];

    const faturamento = reservas.reduce((s, r: any) => s + Number(r.valor_bruto || 0), 0);
    const liquido = reservas.reduce((s, r: any) => s + Number(r.valor_liquido || 0), 0);

    // ocupação: noites ocupadas / (imóveis * dias do mês)
    const dias = new Date(new Date(end).getTime()).getDate();
    let noites = 0;
    reservas.forEach((r: any) => {
      const ci = new Date(r.check_in).getTime();
      const co = new Date(r.check_out).getTime();
      noites += Math.max(0, Math.round((co - ci) / 86400000));
    });
    const cap = imoveis.length * dias;
    const ocupacao = cap > 0 ? (noites / cap) * 100 : 0;

    setStats({ faturamento, liquido, imoveis: imoveis.length, ocupacao });

    // top imóveis
    const map: Record<string, number> = {};
    reservas.forEach((r: any) => { map[r.imovel_id] = (map[r.imovel_id] || 0) + Number(r.valor_bruto || 0); });
    const top = Object.entries(map).map(([id, valor]) => ({ codigo: imoveis.find((i: any) => i.id === id)?.codigo ?? "—", valor })).sort((a, b) => b.valor - a.valor).slice(0, 5);
    setTopImoveis(top);

    // evolução 12 meses
    const dt = new Date(mes + "-01");
    const meses: { mes: string; valor: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(dt.getFullYear(), dt.getMonth() - i, 1);
      const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const { start: s, end: e } = monthRange(ym);
      const { data } = await supabase.from("reservas").select("valor_bruto").gte("mes_competencia", s).lte("mes_competencia", e);
      const v = (data ?? []).reduce((sum, r: any) => sum + Number(r.valor_bruto || 0), 0);
      meses.push({ mes: d.toLocaleDateString("pt-BR", { month: "short" }), valor: v });
    }
    setEvolucao(meses);
  }

  const cards = [
    { label: "Faturamento bruto", value: brl(stats.faturamento), icon: TrendingUp },
    { label: "Recebido líquido", value: brl(stats.liquido), icon: Wallet },
    { label: "Imóveis ativos", value: String(stats.imoveis), icon: Building2 },
    { label: "Ocupação média", value: `${stats.ocupacao.toFixed(1)}%`, icon: BarChart3 },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Visão geral mensal da operação"
        actions={
          <div className="flex items-center gap-2">
            <Label htmlFor="mes" className="text-sm">Mês</Label>
            <Input id="mes" type="month" value={mes} onChange={(e) => setMes(e.target.value)} className="w-[160px]" />
          </div>
        }
      />
      <div className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <Card key={c.label} className="shadow-card">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">{c.label}</div>
                  <div className="num mt-1 text-2xl font-semibold text-foreground">{c.value}</div>
                </div>
                <div className="grid h-10 w-10 place-items-center rounded-md bg-muted text-muted-foreground">
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
