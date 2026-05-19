import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { MonthPicker } from "@/components/MonthPicker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { brl, monthRange, monthBR, pct } from "@/lib/format";
import { useCompetenciaState } from "@/hooks/useLatestCompetencia";
import { Printer } from "lucide-react";

// Ordem fixa pelo template SA7D (image referência):
// Gestão, Logística, Chat, Escritório — depois Folha e Diversos (mantidos pra
// integridade da soma). Itens p/Apartamento sai DESTE bloco e vira linha
// destacada abaixo da Receita Líquida (não entra em Custo Total).
// Material de limpeza é categoria separada (consumível operacional).
const CUSTO_FIXO_ORDEM = ["gestao", "logistica", "chat", "escritorio", "folha", "diversos"] as const;
const CUSTO_LABELS: Record<string, string> = {
  gestao: "Custos de Gestão",
  logistica: "Custos de Logística",
  chat: "Custo do Chat",
  escritorio: "Custo do escritório (Base)",
  folha: "Custo de Folha de pagamento",
  diversos: "Custos diversos",
  material_limpeza: "Custo de material de limpeza",
  itens_apartamento: "Custo dos itens p/Ap",
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
    const recComissao = reservas.reduce((acc, r) => {
      const im = imoveisMap[r.imovel_id];
      if (!im) return acc;
      return acc + Number(r.valor_bruto || 0) * (Number(im.percentual_comissao) / 100);
    }, 0);

    const sumServ = (tipo: string, field: "valor_cobrado" | "custo_real") =>
      servicos.filter((x) => x.tipo === tipo).reduce((s, x) => s + Number(x[field] || 0), 0);

    const recFaxina = sumServ("faxina", "valor_cobrado");
    const recLav = sumServ("lavanderia", "valor_cobrado");
    // recMat agora inclui repasse a custo (break-even) do material_limpeza dos custos_fixos.
    // Lógica simétrica com manutenções rateio=investidor: empresa repassa o custo.
    // O custo entra normalmente em "Custo de material de limpeza" — net no lucro = 0.
    const recMat = sumServ("material", "valor_cobrado");
    // Fallback no custo quando valor_cobrado=0 com rateio=investidor
    const recManut = manuts.filter((x) => x.rateio === "investidor").reduce((s, x) => s + Number(x.valor_cobrado || x.custo || 0), 0);

    const custoFaxina = sumServ("faxina", "custo_real");
    const custoLav = sumServ("lavanderia", "custo_real");
    // Custo de material de limpeza: vem de DUAS fontes
    //   (a) servicos_operacionais tipo='material' (raro, requer imovel)
    //   (b) custos_fixos categoria='material_limpeza' (massa importada do XLSX)
    const custoMatServ = sumServ("material", "custo_real");

    const custoManut = manuts.reduce((s, x) => s + Number(x.custo || 0), 0);

    // Despesas fixas agrupadas
    const fixos: Record<string, number> = {};
    custos.forEach((c) => { fixos[c.categoria] = (fixos[c.categoria] || 0) + Number(c.valor || 0); });

    // Material de limpeza (custos_fixos) + tipo='material' em servicos = custo total mat. limpeza
    const custoMaterialLimpeza = (fixos["material_limpeza"] ?? 0) + custoMatServ;

    // Repasse a custo: receita de material de limpeza = custo (break-even auto).
    // Empresa repassa proporcionalmente aos investidores, mesmo padrão das manutenções.
    // Net no lucro = 0 (receita - custo = 0).
    const recMaterialLimpeza = recMat + custoMaterialLimpeza;

    // Itens p/Apartamento: separado do custo total (linha de referência, yellow)
    const custoItensApt = fixos["itens_apartamento"] ?? 0;

    // Total fixos (excluindo material_limpeza pq vai pra linha específica, e itens_apartamento pq sai do custo total)
    const totalFixosNoCusto = Object.entries(fixos)
      .filter(([k]) => k !== "itens_apartamento" && k !== "material_limpeza")
      .reduce((s, [, v]) => s + v, 0);

    const receitaBruta = recComissao + recFaxina + recLav + recMaterialLimpeza + recManut;
    const custoTotal = custoFaxina + custoLav + custoMaterialLimpeza + custoManut + totalFixosNoCusto;
    const liquida = receitaBruta - custoTotal;
    const margem = receitaBruta > 0 ? (liquida / receitaBruta) * 100 : 0;

    return {
      recComissao, recFaxina, recLav, recMaterialLimpeza, recManut,
      custoFaxina, custoLav, custoMaterialLimpeza, custoManut, fixos,
      custoItensApt, receitaBruta, custoTotal, liquida, margem,
    };
  }, [reservas, imoveisMap, servicos, manuts, custos]);

  const Row = ({ label, valor, tipo = "normal" as "normal" | "subtotal" | "total" | "header" | "destaque" }) => (
    <li className={`flex items-center justify-between px-5 py-2.5 ${
      tipo === "total" ? "bg-muted/60 font-semibold text-base"
        : tipo === "subtotal" ? "bg-muted/30 font-medium"
        : tipo === "header" ? "bg-foreground/5 text-xs uppercase tracking-wide text-muted-foreground"
        : tipo === "destaque" ? "bg-yellow-100/60 dark:bg-yellow-900/30 font-medium border-l-4 border-yellow-500"
        : ""
    }`}>
      <span className={tipo === "header" ? "" : "text-sm"}>{label}</span>
      {tipo !== "header" && <span className={`num ${valor < 0 ? "text-destructive" : ""}`}>{brl(valor)}</span>}
    </li>
  );

  return (
    <>
      <PageHeader
        title="DRE SA7D"
        description="Visão consolidada — receitas, custos e margem."
        actions={
          <div className="contents print:hidden sm:flex sm:w-full sm:flex-wrap sm:items-center sm:gap-2 lg:w-auto">
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
          <CardHeader><CardTitle className="text-base capitalize">DRE SA7D — {monthBR(mes + "-01")}</CardTitle></CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-border">
              <Row label="RECEITAS" valor={0} tipo="header" />
              <Row label="Receita de comissão" valor={calc.recComissao} />
              <Row label="Receita de faxina" valor={calc.recFaxina} />
              <Row label="Receita de lavanderia" valor={calc.recLav} />
              <Row label="Receita para Material de limpeza" valor={calc.recMaterialLimpeza} />
              <Row label="Receita de Manutenção" valor={calc.recManut} />
              <Row label="= Receita Bruta" valor={calc.receitaBruta} tipo="subtotal" />

              <Row label="CUSTOS" valor={0} tipo="header" />
              <Row label="Custo de faxina" valor={calc.custoFaxina} />
              <Row label="Custo de Lavanderia" valor={calc.custoLav} />
              <Row label="Custo de material de limpeza" valor={calc.custoMaterialLimpeza} />
              <Row label="Custo de manutenção" valor={calc.custoManut} />
              {CUSTO_FIXO_ORDEM.map((k) => {
                const v = calc.fixos[k] ?? 0;
                if (v === 0) return null; // não polui DRE com categorias zeradas
                return <Row key={k} label={CUSTO_LABELS[k]} valor={v} />;
              })}
              <Row label="= Custo Total" valor={calc.custoTotal} tipo="subtotal" />

              <Row label={`= Receita Líquida · Margem ${pct(calc.margem)}`} valor={calc.liquida} tipo="total" />

              {/* Linha de referência: Itens p/Apartamento NÃO entra no Custo Total */}
              {calc.custoItensApt > 0 && (
                <Row label="Custo dos itens p/Ap" valor={calc.custoItensApt} tipo="destaque" />
              )}
            </ul>
            {calc.custoItensApt > 0 && (
              <div className="border-t border-border bg-muted/20 px-5 py-2 text-xs text-muted-foreground">
                ⓘ "Custo dos itens p/Ap" é referência informativa — não compõe o Custo Total acima
                (são investimentos no apartamento, separados do P&L operacional).
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
