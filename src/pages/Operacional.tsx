import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Building2, CalendarRange, LogIn, LogOut, Wrench, Receipt, Upload,
} from "lucide-react";
import { dateBR } from "@/lib/format";

export default function Operacional() {
  const [imoveisAtivos, setImoveisAtivos] = useState(0);
  const [checkInsHoje, setCheckInsHoje] = useState(0);
  const [checkOutsHoje, setCheckOutsHoje] = useState(0);
  const [proximosCheckins, setProximosCheckins] = useState<any[]>([]);
  const [proximosCheckouts, setProximosCheckouts] = useState<any[]>([]);
  const [manutencoesRecentes, setManutencoesRecentes] = useState<any[]>([]);

  useEffect(() => { load(); }, []);

  async function load() {
    const hoje = new Date().toISOString().slice(0, 10);
    const em7dias = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
    const a30diasAtras = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);

    const [imoveisRes, ciHojeRes, coHojeRes, ciNextRes, coNextRes, manutsRes] = await Promise.all([
      supabase.from("imoveis").select("*", { count: "exact", head: true }).eq("status", "ativo"),
      supabase.from("reservas").select("*", { count: "exact", head: true }).eq("check_in", hoje),
      supabase.from("reservas").select("*", { count: "exact", head: true }).eq("check_out", hoje),
      supabase.from("reservas").select("id, check_in, check_out, hospedes, imoveis(codigo, endereco)")
        .gte("check_in", hoje).lte("check_in", em7dias)
        .order("check_in").limit(15),
      supabase.from("reservas").select("id, check_in, check_out, hospedes, imoveis(codigo, endereco)")
        .gte("check_out", hoje).lte("check_out", em7dias)
        .order("check_out").limit(15),
      supabase.from("manutencoes").select("id, data, descricao, rateio, imoveis(codigo)")
        .gte("data", a30diasAtras)
        .order("data", { ascending: false }).limit(10),
    ]);

    setImoveisAtivos(imoveisRes.count ?? 0);
    setCheckInsHoje(ciHojeRes.count ?? 0);
    setCheckOutsHoje(coHojeRes.count ?? 0);
    setProximosCheckins(ciNextRes.data ?? []);
    setProximosCheckouts(coNextRes.data ?? []);
    setManutencoesRecentes(manutsRes.data ?? []);
  }

  const atalhos = [
    { label: "Hospedagens", url: "/hospedagens", icon: CalendarRange },
    { label: "Serviços", url: "/servicos", icon: Receipt },
    { label: "Manutenções", url: "/manutencoes", icon: Wrench },
    { label: "Adiantamentos", url: "/adiantamentos", icon: Receipt },
    { label: "Imóveis", url: "/imoveis", icon: Building2 },
    { label: "Importar Airbnb", url: "/importar", icon: Upload },
  ];

  return (
    <>
      <PageHeader
        title="Visão Operacional"
        description="Próximos eventos da operação e atalhos do dia."
      />
      <div className="space-y-4 p-6">
        {/* KPIs */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="shadow-card"><CardContent className="flex items-start justify-between p-5">
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Imóveis ativos</div>
              <div className="num mt-1 text-2xl font-semibold">{imoveisAtivos}</div>
            </div>
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
              <Building2 className="h-5 w-5" />
            </div>
          </CardContent></Card>
          <Card className="shadow-card"><CardContent className="flex items-start justify-between p-5">
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Check-ins hoje</div>
              <div className="num mt-1 text-2xl font-semibold text-success">{checkInsHoje}</div>
            </div>
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
              <LogIn className="h-5 w-5" />
            </div>
          </CardContent></Card>
          <Card className="shadow-card"><CardContent className="flex items-start justify-between p-5">
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Check-outs hoje</div>
              <div className="num mt-1 text-2xl font-semibold">{checkOutsHoje}</div>
            </div>
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
              <LogOut className="h-5 w-5" />
            </div>
          </CardContent></Card>
        </div>

        {/* Atalhos */}
        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-base">Atalhos</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
              {atalhos.map((a) => (
                <Link
                  key={a.url}
                  to={a.url}
                  className="flex flex-col items-center gap-2 rounded-md border border-border bg-card p-4 text-center text-sm transition-colors hover:bg-muted"
                >
                  <a.icon className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{a.label}</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Próximos check-ins / check-outs */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="shadow-card">
            <CardHeader><CardTitle className="text-base">Próximos check-ins (7 dias)</CardTitle></CardHeader>
            <CardContent className="p-0">
              {proximosCheckins.length === 0 ? (
                <div className="p-5 text-sm text-muted-foreground">Nenhum check-in nos próximos 7 dias.</div>
              ) : (
                <ul className="divide-y divide-border">
                  {proximosCheckins.map((r) => (
                    <li key={r.id} className="flex items-center justify-between gap-3 px-5 py-3">
                      <div className="min-w-0">
                        <div className="text-sm font-medium">
                          {r.imoveis?.codigo ?? "—"} · <span className="num">{dateBR(r.check_in)}</span>
                        </div>
                        <div className="truncate text-xs text-muted-foreground">{r.imoveis?.endereco ?? ""}</div>
                      </div>
                      <Badge variant="default" className="shrink-0">{r.hospedes ?? 1} pax</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader><CardTitle className="text-base">Próximos check-outs (7 dias)</CardTitle></CardHeader>
            <CardContent className="p-0">
              {proximosCheckouts.length === 0 ? (
                <div className="p-5 text-sm text-muted-foreground">Nenhum check-out nos próximos 7 dias.</div>
              ) : (
                <ul className="divide-y divide-border">
                  {proximosCheckouts.map((r) => (
                    <li key={r.id} className="flex items-center justify-between gap-3 px-5 py-3">
                      <div className="min-w-0">
                        <div className="text-sm font-medium">
                          {r.imoveis?.codigo ?? "—"} · <span className="num">{dateBR(r.check_out)}</span>
                        </div>
                        <div className="truncate text-xs text-muted-foreground">{r.imoveis?.endereco ?? ""}</div>
                      </div>
                      <Badge variant="secondary" className="shrink-0">faxina</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Manutenções recentes */}
        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-base">Manutenções recentes (30 dias)</CardTitle></CardHeader>
          <CardContent className="p-0">
            {manutencoesRecentes.length === 0 ? (
              <div className="p-5 text-sm text-muted-foreground">Sem manutenções recentes.</div>
            ) : (
              <ul className="divide-y divide-border">
                {manutencoesRecentes.map((m) => (
                  <li key={m.id} className="flex items-center justify-between gap-3 px-5 py-3">
                    <div className="min-w-0">
                      <div className="text-sm font-medium">
                        {m.imoveis?.codigo ?? "—"} · <span className="num">{dateBR(m.data)}</span>
                      </div>
                      <div className="truncate text-xs text-muted-foreground">{m.descricao ?? ""}</div>
                    </div>
                    <Badge
                      variant={m.rateio === "investidor" ? "default" : "secondary"}
                      className="shrink-0"
                    >
                      {m.rateio}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
