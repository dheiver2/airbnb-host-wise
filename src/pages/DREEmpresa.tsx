import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { MonthPicker } from "@/components/MonthPicker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { brl, monthInputValue, monthRange, monthBR, pct } from "@/lib/format";
import { useCompetenciaState } from "@/hooks/useLatestCompetencia";
import { Printer } from "lucide-react";

const CUSTO_LABELS: Record<string, string> = {
  gestao: "Gestão", logistica: "Logística", chat: "Chat / atendimento",
  escritorio: "Escritório (base)", folha: "Folha de pagamento",
  diversos: "Custos diversos", itens_apartamento: "Itens para apartamento",
};

export default function DREEmpresa() {
  const [mes, setMes] = useCompetenciaState();
  const [reservas, setReservas] = useState<any[]>([]);
  const [imoveisMap, setImoveisMap] = useState<Record<string, any>>({});
  const [servicos, setServicos] = useState<any[]>([]);
  const [manuts, setManuts] = useState<any[]>([]);
  const [custos, setCustos] = useState<any[]>([]);

  useEffect(() => { load(); }, [mes]);

  async function load() {
    const { start, end } = monthRange(mes);
    const [r, im, s, m, c] = await Promise.all([
      supabase.from("reservas").select("*").gte("mes_competencia", start).lte("mes_competencia", end),
      supabase.from("imoveis").select("*"),
      supabase.from("servicos_operacionais").select("*").gte("mes_competencia", start).lte("mes_competencia", end),
      supabase.from("manutencoes").select("*").gte("mes_competencia", start).lte("mes_competencia", end),
      supabase.from("custos_fixos").select("*").gte("mes_competencia", start).lte("mes_competencia", end),
    ]);
    setReservas(r.data ?? []);
    const map: Record<string, any> = {}; (im.data ?? []).forEach((x: any) => { map[x.id] = x; });
    setImoveisMap(map);
    setServicos(s.data ?? []); setManuts(m.data ?? []); setCustos(c.data ?? []);
  }

  const calc = useMemo(() => {
    // Receita de comissão
    const recComissao = reservas.reduce((acc, r) => {
      const im = imoveisMap[r.imovel_id];
      if (!im) return acc;
      return acc + Number(r.valor_bruto || 0) * (Number(im.percentual_comissao) / 100);
    }, 0);

    const sumServ = (tipo: string, field: "valor_cobrado" | "custo_real") =>
      servicos.filter((x) => x.tipo === tipo).reduce((s, x) => s + Number(x[field] || 0), 0);

    const recFaxina = sumServ("faxina", "valor_cobrado");
    const recLav = sumServ("lavanderia", "valor_cobrado");
    const recMat = sumServ("material", "valor_cobrado");
    const recManut = manuts.filter((x) => x.rateio === "investidor").reduce((s, x) => s + Number(x.valor_cobrado || 0), 0);

    const custoFaxina = sumServ("faxina", "custo_real");
    const custoLav = sumServ("lavanderia", "custo_real");
    const custoMat = sumServ("material", "custo_real");
    const custoManut = manuts.reduce((s, x) => s + Number(x.custo || 0), 0);
    // Manutenção empresa absorve = custo total sem cobrança
    // Despesas fixas
    const fixos: Record<string, number> = {};
    custos.forEach((c) => { fixos[c.categoria] = (fixos[c.categoria] || 0) + Number(c.valor || 0); });

    const receitaBruta = recComissao + recFaxina + recLav + recMat + recManut;
    const totalFixos = Object.values(fixos).reduce((s, v) => s + v, 0);
    const custoTotal = custoFaxina + custoLav + custoMat + custoManut + totalFixos;
    const liquida = receitaBruta - custoTotal;
    const margem = receitaBruta > 0 ? (liquida / receitaBruta) * 100 : 0;

    return { recComissao, recFaxina, recLav, recMat, recManut, custoFaxina, custoLav, custoMat, custoManut, fixos, receitaBruta, custoTotal, liquida, margem };
  }, [reservas, imoveisMap, servicos, manuts, custos]);

  const Row = ({ label, valor, tipo = "normal" as "normal" | "subtotal" | "total" | "header" }) => (
    <li className={`flex items-center justify-between px-5 py-2.5 ${tipo === "total" ? "bg-muted/60 font-semibold text-base" : tipo === "subtotal" ? "bg-muted/30 font-medium" : tipo === "header" ? "bg-foreground/5 text-xs uppercase tracking-wide text-muted-foreground" : ""}`}>
      <span className={tipo === "header" ? "" : "text-sm"}>{label}</span>
      {tipo !== "header" && <span className={`num ${valor < 0 ? "text-destructive" : ""}`}>{brl(valor)}</span>}
    </li>
  );

  return (
    <>
      <PageHeader
        title="DRE da Empresa"
        description="Visão consolidada — receitas, custos e margem."
        actions={
          <div className="flex w-full flex-wrap items-center gap-2 print:hidden lg:w-auto">
            <MonthPicker value={mes} onChange={setMes} />
            <Button variant="outline" onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" />Imprimir / PDF</Button>
          </div>
        }
      />
      <div className="space-y-4 p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="shadow-card"><CardContent className="p-5">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Receita bruta</div>
            <div className="num mt-1 text-2xl font-semibold">{brl(calc.receitaBruta)}</div>
          </CardContent></Card>
          <Card className="shadow-card"><CardContent className="p-5">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Custo total</div>
            <div className="num mt-1 text-2xl font-semibold">{brl(calc.custoTotal)}</div>
          </CardContent></Card>
          <Card className="shadow-card"><CardContent className="p-5">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Receita líquida · Margem</div>
            <div className={`num mt-1 text-2xl font-semibold ${calc.liquida < 0 ? "text-destructive" : "text-success"}`}>{brl(calc.liquida)}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{pct(calc.margem)}</div>
          </CardContent></Card>
        </div>

        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-base capitalize">DRE — {monthBR(mes + "-01")}</CardTitle></CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-border">
              <Row label="RECEITAS" valor={0} tipo="header" />
              <Row label="Receita de comissão" valor={calc.recComissao} />
              <Row label="Receita de faxina" valor={calc.recFaxina} />
              <Row label="Receita de lavanderia" valor={calc.recLav} />
              <Row label="Receita de material de limpeza" valor={calc.recMat} />
              <Row label="Receita de manutenção" valor={calc.recManut} />
              <Row label="= Receita Bruta" valor={calc.receitaBruta} tipo="subtotal" />

              <Row label="CUSTOS" valor={0} tipo="header" />
              <Row label="Custo de faxina" valor={calc.custoFaxina} />
              <Row label="Custo de lavanderia" valor={calc.custoLav} />
              <Row label="Custo de material de limpeza" valor={calc.custoMat} />
              <Row label="Custo de manutenção" valor={calc.custoManut} />
              {Object.entries(calc.fixos).map(([k, v]) => <Row key={k} label={`Custo de ${CUSTO_LABELS[k] ?? k}`} valor={v} />)}
              <Row label="= Custo Total" valor={calc.custoTotal} tipo="subtotal" />

              <Row label={`= RECEITA LÍQUIDA · Margem ${pct(calc.margem)}`} valor={calc.liquida} tipo="total" />
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
