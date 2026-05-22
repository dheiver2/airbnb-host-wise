import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { MonthPicker } from "@/components/MonthPicker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/Combobox";
import { brl, monthRange, monthBR, pct } from "@/lib/format";
import { useCompetenciaState } from "@/hooks/useLatestCompetencia";
import { Printer, Building2 } from "lucide-react";

interface Linha { label: string; valor: number; tipo?: "receita" | "despesa" | "subtotal" | "total" | "header"; }

export default function DREImovel() {
  const [mes, setMes] = useCompetenciaState();
  const [imoveis, setImoveis] = useState<any[]>([]);
  const [imovelId, setImovelId] = useState("");
  const [reservas, setReservas] = useState<any[]>([]);
  const [servicos, setServicos] = useState<any[]>([]);
  const [manuts, setManuts] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("imoveis")
      .select("id, codigo, endereco, percentual_comissao, valor_faxina, custo_faxina, valor_lavanderia, custo_lavanderia, investidores(nome)")
      .order("codigo")
      .then(({ data }) => {
        setImoveis(data ?? []);
        if (data?.[0] && !imovelId) setImovelId(data[0].id);
      });
  }, []);

  useEffect(() => { if (imovelId) load(); }, [imovelId, mes]);

  async function load() {
    const { start, end } = monthRange(mes);
    const [r, s, m] = await Promise.all([
      supabase.from("reservas").select("*").eq("imovel_id", imovelId).gte("mes_competencia", start).lte("mes_competencia", end),
      supabase.from("servicos_operacionais").select("*").eq("imovel_id", imovelId).gte("mes_competencia", start).lte("mes_competencia", end),
      supabase.from("manutencoes").select("*").eq("imovel_id", imovelId).gte("mes_competencia", start).lte("mes_competencia", end),
    ]);
    setReservas(r.data ?? []); setServicos(s.data ?? []); setManuts(m.data ?? []);
  }

  const imovel = imoveis.find((i) => i.id === imovelId);

  const calc = useMemo(() => {
    if (!imovel) return null;
    const pComissao = Number(imovel.percentual_comissao || 0) / 100;
    const sumS = (tipo: string, f: "valor_cobrado" | "custo_real") =>
      servicos.filter((x) => x.tipo === tipo).reduce((s, x) => s + Number(x[f] || 0), 0);

    const faturamento = reservas.reduce((s, r) => s + Number(r.valor_bruto || 0), 0);
    const comissao = reservas.reduce((s, r) => s + Number(r.valor_liquido || r.valor_bruto || 0) * pComissao, 0);

    // faxina/lavanderia: regular (por reserva) + extras (servicos_operacionais)
    const recFaxina = reservas.length * Number(imovel.valor_faxina || 0) + sumS("faxina", "valor_cobrado");
    const custoFaxina = reservas.length * Number(imovel.custo_faxina || 0) + sumS("faxina", "custo_real");
    const recLav = reservas.length * Number(imovel.valor_lavanderia || 0) + sumS("lavanderia", "valor_cobrado");
    const custoLav = reservas.length * Number(imovel.custo_lavanderia || 0) + sumS("lavanderia", "custo_real");
    const recMat = sumS("material", "valor_cobrado");
    const custoMat = sumS("material", "custo_real");
    const recManut = manuts.filter((x) => x.rateio === "investidor").reduce((s, x) => s + Number(x.valor_cobrado || x.custo || 0), 0);
    const custoManut = manuts.reduce((s, x) => s + Number(x.custo || 0), 0);

    const receita = comissao + recFaxina + recLav + recMat + recManut;
    const custo = custoFaxina + custoLav + custoMat + custoManut;
    const resultado = receita - custo;
    const margem = receita > 0 ? (resultado / receita) * 100 : 0;

    return {
      faturamento, comissao, recFaxina, custoFaxina, recLav, custoLav,
      recMat, custoMat, recManut, custoManut, receita, custo, resultado, margem,
      reservasCount: reservas.length,
    };
  }, [imovel, reservas, servicos, manuts]);

  const linhas: Linha[] = calc ? [
    { label: "RECEITAS", valor: 0, tipo: "header" },
    { label: "Comissão da empresa", valor: calc.comissao, tipo: "receita" },
    { label: "Faxina", valor: calc.recFaxina, tipo: "receita" },
    { label: "Lavanderia", valor: calc.recLav, tipo: "receita" },
    { label: "Material de limpeza", valor: calc.recMat, tipo: "receita" },
    { label: "Manutenção", valor: calc.recManut, tipo: "receita" },
    { label: "= Receita do imóvel", valor: calc.receita, tipo: "subtotal" },
    { label: "CUSTOS DIRETOS", valor: 0, tipo: "header" },
    { label: "Custo de faxina", valor: -calc.custoFaxina, tipo: "despesa" },
    { label: "Custo de lavanderia", valor: -calc.custoLav, tipo: "despesa" },
    { label: "Custo de material", valor: -calc.custoMat, tipo: "despesa" },
    { label: "Custo de manutenção", valor: -calc.custoManut, tipo: "despesa" },
    { label: "= Custo Total do imóvel", valor: -calc.custo, tipo: "subtotal" },
    { label: `= Resultado do imóvel · Margem ${pct(calc.margem)}`, valor: calc.resultado, tipo: "total" },
  ] : [];

  return (
    <>
      <PageHeader
        title="DRE por Imóvel"
        description="Resultado individual de cada imóvel — apenas custos diretos (sem rateio de custos fixos da empresa)."
        actions={
          <div className="contents print:hidden sm:flex sm:w-full sm:flex-wrap sm:items-center sm:gap-2 lg:w-auto">
            <Combobox
              options={imoveis.map((i) => ({ value: i.id, label: i.codigo, hint: i.investidores?.nome }))}
              value={imovelId}
              onChange={setImovelId}
              placeholder="Selecione o imóvel"
              searchPlaceholder="Buscar imóvel..."
              className="min-w-[240px] sm:flex-1 lg:flex-none"
            />
            <MonthPicker value={mes} onChange={setMes} />
            <Button variant="outline" onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" />Imprimir / PDF</Button>
          </div>
        }
      />
      <div className="space-y-4 p-6">
        {!imovel && (
          <Card className="shadow-card"><CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <Building2 className="h-10 w-10 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">Selecione um imóvel para ver o demonstrativo.</div>
          </CardContent></Card>
        )}

        {imovel && calc && (
          <>
            <Card className="shadow-card">
              <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">Imóvel</div>
                  <div className="text-lg font-semibold">{imovel.codigo}</div>
                  <div className="text-xs text-muted-foreground">{imovel.investidores?.nome ?? "—"}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">Competência</div>
                  <div className="text-lg font-semibold capitalize">{monthBR(mes + "-01")}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">Reservas</div>
                  <div className="num text-lg font-semibold">{calc.reservasCount}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">Resultado · Margem</div>
                  <div className={`num text-lg font-semibold ${calc.resultado < 0 ? "text-destructive" : "text-success"}`}>
                    {brl(calc.resultado)} · {pct(calc.margem)}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader><CardTitle className="text-base">Demonstrativo — {imovel.codigo}</CardTitle></CardHeader>
              <CardContent className="p-0">
                <ul className="divide-y divide-border">
                  {linhas.map((l) => (
                    <li key={l.label} className={`flex items-center justify-between px-5 py-2.5 ${
                      l.tipo === "total" ? "bg-muted/60 font-semibold text-base"
                        : l.tipo === "subtotal" ? "bg-muted/30 font-medium"
                        : l.tipo === "header" ? "bg-foreground/5 text-xs uppercase tracking-wide text-muted-foreground"
                        : ""
                    }`}>
                      <span className={l.tipo === "header" ? "" : "text-sm"}>{l.label}</span>
                      {l.tipo !== "header" && (
                        <span className={`num ${l.valor < 0 ? "text-destructive" : "text-foreground"}`}>{brl(l.valor)}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </>
  );
}
