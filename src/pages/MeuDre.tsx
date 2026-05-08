import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/PageHeader";
import { MonthPicker } from "@/components/MonthPicker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Building2, TrendingUp, Wallet, Wrench } from "lucide-react";
import { brl, dateBR, monthInputValue, monthRange } from "@/lib/format";

type Investidor = { id: string; nome: string; pix: string | null };
type Imovel = { id: string; codigo: string; endereco: string; percentual_comissao: number };
type Reserva = {
  id: string; imovel_id: string; check_in: string; check_out: string;
  valor_bruto: number; taxas_airbnb: number; valor_liquido: number;
};
type Adiantamento = {
  id: string; imovel_id: string | null; data: string; valor: number; origem: string; observacoes: string | null;
};
type Manutencao = {
  id: string; imovel_id: string; data: string; descricao: string; custo: number; rateio: string;
};

export default function MeuDre() {
  const { user } = useAuth();
  const [competencia, setCompetencia] = useState(monthInputValue());
  const [loading, setLoading] = useState(true);
  const [investidor, setInvestidor] = useState<Investidor | null>(null);
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [adiantamentos, setAdiantamentos] = useState<Adiantamento[]>([]);
  const [manutencoes, setManutencoes] = useState<Manutencao[]>([]);

  useEffect(() => {
    let cancel = false;
    (async () => {
      if (!user) return;
      setLoading(true);

      // 1) Investidor vinculado a este usuário
      const { data: inv, error: invErr } = await supabase
        .from("investidores")
        .select("id, nome, pix")
        .eq("user_id", user.id)
        .maybeSingle();
      if (invErr || !inv) {
        if (!cancel) {
          setInvestidor(null);
          setImoveis([]); setReservas([]); setAdiantamentos([]); setManutencoes([]);
          setLoading(false);
        }
        return;
      }

      // 2) Imóveis do investidor
      const { data: imv } = await supabase
        .from("imoveis")
        .select("id, codigo, endereco, percentual_comissao")
        .eq("investidor_id", inv.id)
        .order("codigo");
      const ids = (imv ?? []).map((i) => (i as Imovel).id);

      // 3) Dados do mês
      const { start, end } = monthRange(competencia);
      const [{ data: rsv }, { data: adi }, { data: mnt }] = await Promise.all([
        ids.length
          ? supabase
              .from("reservas")
              .select("id, imovel_id, check_in, check_out, valor_bruto, taxas_airbnb, valor_liquido")
              .in("imovel_id", ids)
              .gte("check_in", start)
              .lte("check_in", end)
          : Promise.resolve({ data: [] as Reserva[] }),
        supabase
          .from("adiantamentos")
          .select("id, imovel_id, data, valor, origem, observacoes")
          .eq("investidor_id", inv.id)
          .gte("data", start)
          .lte("data", end),
        ids.length
          ? supabase
              .from("manutencoes")
              .select("id, imovel_id, data, descricao, custo, rateio")
              .in("imovel_id", ids)
              .eq("rateio", "investidor")
              .gte("data", start)
              .lte("data", end)
          : Promise.resolve({ data: [] as Manutencao[] }),
      ]);

      if (cancel) return;
      setInvestidor(inv as Investidor);
      setImoveis((imv ?? []) as Imovel[]);
      setReservas((rsv ?? []) as Reserva[]);
      setAdiantamentos((adi ?? []) as Adiantamento[]);
      setManutencoes((mnt ?? []) as Manutencao[]);
      setLoading(false);
    })();
    return () => { cancel = true; };
  }, [user, competencia]);

  const resumo = useMemo(() => {
    const receitaBruta = reservas.reduce((s, r) => s + Number(r.valor_bruto || 0), 0);
    const taxasAirbnb = reservas.reduce((s, r) => s + Number(r.taxas_airbnb || 0), 0);
    const receitaLiquida = reservas.reduce((s, r) => s + Number(r.valor_liquido || 0), 0);
    // comissão da empresa = % por imóvel sobre o líquido das reservas daquele imóvel
    const imovById = new Map(imoveis.map((i) => [i.id, i]));
    const comissaoEmpresa = reservas.reduce((s, r) => {
      const im = imovById.get(r.imovel_id);
      const pct = Number(im?.percentual_comissao ?? 0);
      return s + (Number(r.valor_liquido || 0) * pct) / 100;
    }, 0);
    const custoManutencoes = manutencoes.reduce((s, m) => s + Number(m.custo || 0), 0);
    const adiantamentosTotal = adiantamentos.reduce((s, a) => s + Number(a.valor || 0), 0);
    const resultadoInvestidor = receitaLiquida - comissaoEmpresa - custoManutencoes;
    const saldoARepassar = resultadoInvestidor - adiantamentosTotal;
    return {
      receitaBruta, taxasAirbnb, receitaLiquida,
      comissaoEmpresa, custoManutencoes, adiantamentosTotal,
      resultadoInvestidor, saldoARepassar,
    };
  }, [reservas, manutencoes, adiantamentos, imoveis]);

  if (!user) return null;

  if (!loading && !investidor) {
    return (
      <div className="flex flex-col">
        <PageHeader
          title="Meu DRE"
          description="Resultados financeiros dos seus imóveis."
        />
        <div className="p-4 sm:p-6">
          <Card>
            <CardHeader>
              <CardTitle>Conta ainda não vinculada a um investidor</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Sua conta está com o papel <Badge variant="outline">investidor</Badge> mas ainda não foi
              ligada a nenhum cadastro de investidor.<br /><br />
              Peça ao administrador para abrir o cadastro de investidores e vincular o seu usuário
              ({user.email}). Assim que o vínculo for feito, seus DREs aparecem aqui automaticamente.
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <PageHeader
        title={investidor ? `Olá, ${investidor.nome}` : "Meu DRE"}
        description="Resultado consolidado dos seus imóveis no mês selecionado."
        actions={<MonthPicker value={competencia} onChange={setCompetencia} />}
      />

      <div className="space-y-6 p-4 sm:p-6">
        {/* Cartões resumo */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ResumoCard
            icon={<TrendingUp className="h-4 w-4" />}
            label="Receita líquida"
            value={brl(resumo.receitaLiquida)}
            hint={`${reservas.length} reserva(s) · bruto ${brl(resumo.receitaBruta)}`}
          />
          <ResumoCard
            icon={<Building2 className="h-4 w-4" />}
            label="Comissão da empresa"
            value={brl(-resumo.comissaoEmpresa)}
            hint="Descontada do líquido"
          />
          <ResumoCard
            icon={<Wrench className="h-4 w-4" />}
            label="Manutenções (rateio investidor)"
            value={brl(-resumo.custoManutencoes)}
            hint={`${manutencoes.length} item(ns)`}
          />
          <ResumoCard
            icon={<Wallet className="h-4 w-4" />}
            label="Saldo a repassar"
            value={brl(resumo.saldoARepassar)}
            hint={`Resultado ${brl(resumo.resultadoInvestidor)} − adiant. ${brl(resumo.adiantamentosTotal)}`}
            highlight
          />
        </div>

        {/* Imóveis */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Meus imóveis</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead className="text-right">Comissão</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {imoveis.length === 0 && (
                  <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-8">Nenhum imóvel vinculado.</TableCell></TableRow>
                )}
                {imoveis.map((i) => (
                  <TableRow key={i.id}>
                    <TableCell className="font-medium">{i.codigo}</TableCell>
                    <TableCell className="text-muted-foreground">{i.endereco}</TableCell>
                    <TableCell className="text-right num">{Number(i.percentual_comissao).toFixed(2)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Reservas do mês */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hospedagens do mês</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Imóvel</TableHead>
                  <TableHead className="text-right">Bruto</TableHead>
                  <TableHead className="text-right">Taxas</TableHead>
                  <TableHead className="text-right">Líquido</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && (
                  <TableRow><TableCell colSpan={6} className="py-8 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin" /></TableCell></TableRow>
                )}
                {!loading && reservas.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">Sem hospedagens no mês.</TableCell></TableRow>
                )}
                {reservas.map((r) => {
                  const im = imoveis.find((x) => x.id === r.imovel_id);
                  return (
                    <TableRow key={r.id}>
                      <TableCell className="num">{dateBR(r.check_in)}</TableCell>
                      <TableCell className="num">{dateBR(r.check_out)}</TableCell>
                      <TableCell className="text-muted-foreground">{im?.codigo ?? "—"}</TableCell>
                      <TableCell className="text-right num">{brl(r.valor_bruto)}</TableCell>
                      <TableCell className="text-right num text-muted-foreground">{brl(-r.taxas_airbnb)}</TableCell>
                      <TableCell className="text-right num font-medium">{brl(r.valor_liquido)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Adiantamentos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Adiantamentos recebidos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead>Observação</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adiantamentos.length === 0 && (
                  <TableRow><TableCell colSpan={4} className="py-6 text-center text-muted-foreground">Nenhum adiantamento no mês.</TableCell></TableRow>
                )}
                {adiantamentos.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="num">{dateBR(a.data)}</TableCell>
                    <TableCell><Badge variant="outline">{a.origem}</Badge></TableCell>
                    <TableCell className="text-muted-foreground">{a.observacoes ?? "—"}</TableCell>
                    <TableCell className="text-right num">{brl(a.valor)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ResumoCard({
  icon, label, value, hint, highlight,
}: { icon: React.ReactNode; label: string; value: string; hint?: string; highlight?: boolean }) {
  return (
    <Card className={highlight ? "border-brand/40 shadow-brand" : undefined}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {icon} <span>{label}</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className={`text-2xl font-semibold num ${highlight ? "bg-gradient-brand bg-clip-text text-transparent" : ""}`}>
          {value}
        </div>
        {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
      </CardContent>
    </Card>
  );
}
