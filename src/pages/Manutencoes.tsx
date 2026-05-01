import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { MonthPicker } from "@/components/MonthPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { brl, dateBR, monthInputValue, monthRange } from "@/lib/format";
import { useCompetenciaState } from "@/hooks/useLatestCompetencia";

export default function Manutencoes() {
  const [list, setList] = useState<any[]>([]);
  const [imoveis, setImoveis] = useState<any[]>([]);
  const [params, setParams] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [mes, setMes] = useCompetenciaState();
  const [form, setForm] = useState<any>({ rateio: "investidor" });

  useEffect(() => {
    supabase.from("imoveis").select("id, codigo").eq("status", "ativo").order("codigo").then(({ data }) => setImoveis(data ?? []));
    supabase.from("parametros_servico").select("*").eq("ativo", true).order("nome").then(({ data }) => setParams(data ?? []));
  }, []);
  useEffect(() => { load(); }, [mes]);

  async function load() {
    const { start, end } = monthRange(mes);
    const { data } = await supabase.from("manutencoes").select("*, imoveis(codigo)").gte("mes_competencia", start).lte("mes_competencia", end).order("data", { ascending: false });
    setList(data ?? []);
  }

  function selectParam(id: string) {
    const p = params.find((x) => x.id === id);
    if (!p) return;
    setForm((f: any) => ({ ...f, parametro_id: id, descricao: f.descricao || p.nome, categoria: p.categoria, custo: p.custo, valor_cobrado: p.valor_cobrado }));
  }

  async function save() {
    if (!form.imovel_id || !form.data || !form.descricao) return toast.error("Preencha imóvel, data e descrição");
    const competencia = `${String(form.data).slice(0, 7)}-01`;
    const { error } = await supabase.from("manutencoes").insert({
      imovel_id: form.imovel_id, parametro_id: form.parametro_id || null,
      data: form.data, descricao: form.descricao, categoria: form.categoria,
      custo: Number(form.custo ?? 0), valor_cobrado: Number(form.valor_cobrado ?? 0),
      rateio: form.rateio, mes_competencia: competencia,
    });
    if (error) return toast.error(error.message);
    toast.success("Manutenção registrada"); setOpen(false); setForm({ rateio: "investidor" }); load();
  }

  async function remove(id: string) {
    if (!confirm("Excluir?")) return;
    await supabase.from("manutencoes").delete().eq("id", id); load();
  }

  return (
    <>
      <PageHeader
        title="Manutenções"
        description="Reparos e investimentos no imóvel — defina quem absorve o custo."
        actions={
          <div className="flex items-center gap-2">
            <MonthPicker value={mes} onChange={setMes} />
            <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setForm({ rateio: "investidor" }); }}>
              <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Nova manutenção</Button></DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader><DialogTitle>Nova manutenção</DialogTitle></DialogHeader>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Imóvel *</Label>
                    <Select value={form.imovel_id ?? ""} onValueChange={(v) => setForm({ ...form, imovel_id: v })}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>{imoveis.map((i) => <SelectItem key={i.id} value={i.id}>{i.codigo}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5"><Label>Data *</Label><Input type="date" value={form.data ?? ""} onChange={(e) => setForm({ ...form, data: e.target.value })} /></div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>Serviço (parâmetro)</Label>
                    <Select value={form.parametro_id ?? ""} onValueChange={selectParam}>
                      <SelectTrigger><SelectValue placeholder="Opcional — preenche valores" /></SelectTrigger>
                      <SelectContent>{params.map((p) => <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5 sm:col-span-2"><Label>Descrição *</Label><Input value={form.descricao ?? ""} onChange={(e) => setForm({ ...form, descricao: e.target.value })} /></div>
                  <div className="space-y-1.5"><Label>Custo</Label><Input type="number" step="0.01" value={form.custo ?? ""} onChange={(e) => setForm({ ...form, custo: e.target.value })} /></div>
                  <div className="space-y-1.5"><Label>Valor cobrado</Label><Input type="number" step="0.01" value={form.valor_cobrado ?? ""} onChange={(e) => setForm({ ...form, valor_cobrado: e.target.value })} /></div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>Rateio *</Label>
                    <Select value={form.rateio ?? "investidor"} onValueChange={(v) => setForm({ ...form, rateio: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="investidor">Investidor paga</SelectItem>
                        <SelectItem value="empresa">Empresa absorve</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter><Button onClick={save}>Salvar</Button></DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        }
      />
      <div className="p-6">
        <Card className="shadow-card"><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Data</TableHead><TableHead>Imóvel</TableHead><TableHead>Descrição</TableHead>
              <TableHead>Custo</TableHead><TableHead>Cobrado</TableHead><TableHead>Rateio</TableHead><TableHead></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {list.length === 0 && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Sem manutenções no mês.</TableCell></TableRow>}
              {list.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>{dateBR(m.data)}</TableCell>
                  <TableCell className="font-medium">{m.imoveis?.codigo}</TableCell>
                  <TableCell className="text-muted-foreground max-w-[280px] truncate">{m.descricao}</TableCell>
                  <TableCell className="num">{brl(m.custo)}</TableCell>
                  <TableCell className="num">{brl(m.valor_cobrado)}</TableCell>
                  <TableCell><Badge variant={m.rateio === "investidor" ? "default" : "secondary"}>{m.rateio}</Badge></TableCell>
                  <TableCell><Button size="icon" variant="ghost" onClick={() => remove(m.id)}><Trash2 className="h-4 w-4" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      </div>
    </>
  );
}
