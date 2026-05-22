import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Combobox } from "@/components/Combobox";
import { Plus, Trash2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { dateBR } from "@/lib/format";

const STATUS = ["pendente", "concluida", "cancelada"] as const;
const STATUS_LABEL: Record<string, string> = {
  pendente: "Pendente", concluida: "Concluída", cancelada: "Cancelada",
};
const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  pendente: "outline", concluida: "default", cancelada: "secondary",
};

const hojeISO = () => new Date().toISOString().slice(0, 10);
const addDias = (d: number) => new Date(Date.now() + d * 86400000).toISOString().slice(0, 10);

export default function Escalador() {
  const [ini, setIni] = useState(hojeISO());
  const [fim, setFim] = useState(addDias(7));
  const [faxinas, setFaxinas] = useState<any[]>([]);
  const [imoveis, setImoveis] = useState<any[]>([]);
  const [prestadores, setPrestadores] = useState<any[]>([]);
  const [filtro, setFiltro] = useState<"todas" | "hoje" | "pendentes">("todas");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    supabase.from("imoveis").select("id, codigo").eq("status", "ativo").order("codigo")
      .then(({ data }) => setImoveis(data ?? []));
    (supabase.from("prestadores" as any) as any).select("id, nome").eq("ativo", true).order("nome")
      .then(({ data }: any) => setPrestadores(data ?? []));
  }, []);

  useEffect(() => { load(); }, [ini, fim]);

  async function load() {
    const { data } = await (supabase.from("faxinas" as any) as any)
      .select("*, imoveis(codigo, endereco), prestadores(nome)")
      .gte("data", ini).lte("data", fim)
      .order("data");
    setFaxinas(data ?? []);
  }

  // Gera faxinas pendentes a partir dos check-outs de reservas no período
  async function gerarDosCheckouts() {
    const { data: reservas } = await supabase.from("reservas")
      .select("id, imovel_id, check_out")
      .gte("check_out", ini).lte("check_out", fim);
    if (!reservas || reservas.length === 0) {
      return toast.info("Nenhum check-out no período selecionado.");
    }
    const jaTem = new Set(faxinas.map((f) => f.reserva_id).filter(Boolean));
    const novas = reservas
      .filter((r: any) => !jaTem.has(r.id))
      .map((r: any) => ({ imovel_id: r.imovel_id, reserva_id: r.id, data: r.check_out, status: "pendente" }));
    if (novas.length === 0) {
      return toast.info("Todas as faxinas dos check-outs já estão na escala.");
    }
    const { error } = await (supabase.from("faxinas" as any) as any).insert(novas);
    if (error) return toast.error(error.message);
    toast.success(`${novas.length} faxina(s) gerada(s) dos check-outs.`);
    load();
  }

  async function salvarManual() {
    if (!form.imovel_id || !form.data) return toast.error("Preencha imóvel e data");
    const { error } = await (supabase.from("faxinas" as any) as any).insert({
      imovel_id: form.imovel_id, data: form.data,
      prestador_id: form.prestador_id || null,
      status: "pendente", observacoes: form.observacoes || null,
    });
    if (error) return toast.error(error.message);
    toast.success("Faxina agendada"); setOpen(false); setForm({}); load();
  }

  async function atualizar(id: string, campo: string, valor: any) {
    const { error } = await (supabase.from("faxinas" as any) as any).update({ [campo]: valor }).eq("id", id);
    if (error) return toast.error(error.message);
    load();
  }

  async function excluir(id: string) {
    if (!confirm("Excluir faxina da escala?")) return;
    await (supabase.from("faxinas" as any) as any).delete().eq("id", id);
    load();
  }

  const filtradas = useMemo(() => {
    if (filtro === "hoje") return faxinas.filter((f) => f.data === hojeISO());
    if (filtro === "pendentes") return faxinas.filter((f) => f.status === "pendente");
    return faxinas;
  }, [faxinas, filtro]);

  // Indicadores
  const total = faxinas.length;
  const pend = faxinas.filter((f) => f.status === "pendente").length;
  const conc = faxinas.filter((f) => f.status === "concluida").length;
  const pctConc = total > 0 ? Math.round((conc / total) * 100) : 0;
  const semFaxinista = faxinas.filter((f) => !f.prestador_id && f.status !== "cancelada").length;

  return (
    <>
      <PageHeader
        title="Escalador de Faxina"
        description="Agende faxinas por imóvel e data, atribua faxinistas e acompanhe a execução."
        actions={
          <div className="contents print:hidden sm:flex sm:w-full sm:flex-wrap sm:items-center sm:gap-2 lg:w-auto">
            <div className="flex items-center gap-1.5">
              <Label className="shrink-0 text-sm">De</Label>
              <Input type="date" value={ini} onChange={(e) => setIni(e.target.value)} className="w-[150px]" />
            </div>
            <div className="flex items-center gap-1.5">
              <Label className="shrink-0 text-sm">Até</Label>
              <Input type="date" value={fim} onChange={(e) => setFim(e.target.value)} className="w-[150px]" />
            </div>
            <Button variant="outline" onClick={gerarDosCheckouts}>
              <Sparkles className="mr-2 h-4 w-4" />Gerar dos check-outs
            </Button>
            <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setForm({}); }}>
              <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Nova faxina</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Agendar faxina</DialogTitle></DialogHeader>
                <div className="grid gap-3">
                  <div className="space-y-1.5">
                    <Label>Imóvel *</Label>
                    <Combobox
                      options={imoveis.map((i) => ({ value: i.id, label: i.codigo }))}
                      value={form.imovel_id ?? ""}
                      onChange={(v) => setForm({ ...form, imovel_id: v })}
                      placeholder="Selecione o imóvel" searchPlaceholder="Buscar imóvel..."
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Data *</Label>
                    <Input type="date" value={form.data ?? ""} onChange={(e) => setForm({ ...form, data: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Faxinista</Label>
                    <Combobox
                      options={prestadores.map((p) => ({ value: p.id, label: p.nome }))}
                      value={form.prestador_id ?? ""}
                      onChange={(v) => setForm({ ...form, prestador_id: v })}
                      placeholder="Opcional" searchPlaceholder="Buscar prestador..." clearable
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Observações</Label>
                    <Input value={form.observacoes ?? ""} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} />
                  </div>
                </div>
                <DialogFooter><Button onClick={salvarManual}>Salvar</Button></DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        }
      />
      <div className="space-y-4 p-6">
        {/* Indicadores de Faxina */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Card className="shadow-card"><CardContent className="p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Total na escala</div>
            <div className="num mt-1 text-xl font-semibold">{total}</div>
          </CardContent></Card>
          <Card className="shadow-card"><CardContent className="p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Pendentes</div>
            <div className="num mt-1 text-xl font-semibold text-warning">{pend}</div>
          </CardContent></Card>
          <Card className="shadow-card"><CardContent className="p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Concluídas</div>
            <div className="num mt-1 text-xl font-semibold text-success">{conc}</div>
          </CardContent></Card>
          <Card className="shadow-card"><CardContent className="p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">% Conclusão</div>
            <div className="num mt-1 text-xl font-semibold">{pctConc}%</div>
          </CardContent></Card>
          <Card className="shadow-card"><CardContent className="p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Sem faxinista</div>
            <div className={`num mt-1 text-xl font-semibold ${semFaxinista > 0 ? "text-destructive" : ""}`}>{semFaxinista}</div>
          </CardContent></Card>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2">
          {([["todas", "Todas"], ["hoje", "Faxinas de hoje"], ["pendentes", "Só pendentes"]] as const).map(([k, lbl]) => (
            <Button key={k} size="sm" variant={filtro === k ? "default" : "outline"} onClick={() => setFiltro(k)}>
              {lbl}
            </Button>
          ))}
        </div>

        <Card className="shadow-card"><CardContent className="overflow-x-auto p-0">
          <Table className="min-w-[860px]">
            <TableHeader><TableRow>
              <TableHead>Data</TableHead><TableHead>Imóvel</TableHead>
              <TableHead>Faxinista</TableHead><TableHead>Status</TableHead>
              <TableHead>Observações</TableHead><TableHead></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtradas.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  Nenhuma faxina na escala. Use "Gerar dos check-outs" ou "Nova faxina".
                </TableCell></TableRow>
              )}
              {filtradas.map((f) => (
                <TableRow key={f.id}>
                  <TableCell>{dateBR(f.data)}</TableCell>
                  <TableCell className="font-medium">{f.imoveis?.codigo ?? "—"}</TableCell>
                  <TableCell>
                    <Select value={f.prestador_id ?? ""} onValueChange={(v) => atualizar(f.id, "prestador_id", v || null)}>
                      <SelectTrigger className="h-8 w-[170px]"><SelectValue placeholder="Atribuir..." /></SelectTrigger>
                      <SelectContent>
                        {prestadores.map((p) => <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select value={f.status} onValueChange={(v) => atualizar(f.id, "status", v)}>
                      <SelectTrigger className="h-8 w-[140px]">
                        <SelectValue>
                          <Badge variant={STATUS_VARIANT[f.status]}>{STATUS_LABEL[f.status]}</Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS.map((s) => <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-[200px] truncate">{f.observacoes ?? "—"}</TableCell>
                  <TableCell>
                    <Button size="icon" variant="ghost" onClick={() => excluir(f.id)}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      </div>
    </>
  );
}
