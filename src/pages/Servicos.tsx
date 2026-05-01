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
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { brl, dateBR, monthInputValue, monthRange } from "@/lib/format";
import { useCompetenciaState } from "@/hooks/useLatestCompetencia";

const TIPOS = ["faxina", "lavanderia", "material", "manutencao"] as const;

export default function Servicos() {
  const [list, setList] = useState<any[]>([]);
  const [imoveis, setImoveis] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [mes, setMes] = useCompetenciaState();
  const [form, setForm] = useState<any>({});

  useEffect(() => { supabase.from("imoveis").select("id, codigo, valor_faxina, custo_faxina, valor_lavanderia, custo_lavanderia").eq("status", "ativo").order("codigo").then(({ data }) => setImoveis(data ?? [])); }, []);
  useEffect(() => { load(); }, [mes]);

  async function load() {
    const { start, end } = monthRange(mes);
    const { data } = await supabase.from("servicos_operacionais").select("*, imoveis(codigo)").gte("mes_competencia", start).lte("mes_competencia", end).order("data", { ascending: false });
    setList(data ?? []);
  }

  function onTipoOrImovel(tipo: string, imovel_id: string) {
    const im = imoveis.find((i) => i.id === imovel_id);
    if (!im) return;
    if (tipo === "faxina") setForm((f: any) => ({ ...f, tipo, imovel_id, custo_real: im.custo_faxina, valor_cobrado: im.valor_faxina }));
    else if (tipo === "lavanderia") setForm((f: any) => ({ ...f, tipo, imovel_id, custo_real: im.custo_lavanderia, valor_cobrado: im.valor_lavanderia }));
    else setForm((f: any) => ({ ...f, tipo, imovel_id }));
  }

  async function save() {
    if (!form.imovel_id || !form.data || !form.tipo) return toast.error("Preencha imóvel, data e tipo");
    const competencia = `${String(form.data).slice(0, 7)}-01`;
    const { error } = await supabase.from("servicos_operacionais").insert({
      imovel_id: form.imovel_id, data: form.data, tipo: form.tipo,
      custo_real: Number(form.custo_real ?? 0), valor_cobrado: Number(form.valor_cobrado ?? 0),
      prestador: form.prestador, mes_competencia: competencia,
    });
    if (error) return toast.error(error.message);
    toast.success("Lançado"); setOpen(false); setForm({}); load();
  }

  async function remove(id: string) {
    if (!confirm("Excluir lançamento?")) return;
    await supabase.from("servicos_operacionais").delete().eq("id", id); load();
  }

  return (
    <>
      <PageHeader
        title="Serviços operacionais"
        description="Faxina, lavanderia, material — custo pago e valor cobrado do investidor."
        actions={
          <div className="flex items-center gap-2">
            <Input type="month" value={mes} onChange={(e) => setMes(e.target.value)} className="w-[160px]" />
            <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setForm({}); }}>
              <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Novo lançamento</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Novo serviço</DialogTitle></DialogHeader>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Tipo *</Label>
                    <Select value={form.tipo ?? ""} onValueChange={(v) => onTipoOrImovel(v, form.imovel_id)}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>{TIPOS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5"><Label>Data *</Label><Input type="date" value={form.data ?? ""} onChange={(e) => setForm({ ...form, data: e.target.value })} /></div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>Imóvel *</Label>
                    <Select value={form.imovel_id ?? ""} onValueChange={(v) => onTipoOrImovel(form.tipo, v)}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>{imoveis.map((i) => <SelectItem key={i.id} value={i.id}>{i.codigo}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5"><Label>Custo real</Label><Input type="number" step="0.01" value={form.custo_real ?? ""} onChange={(e) => setForm({ ...form, custo_real: e.target.value })} /></div>
                  <div className="space-y-1.5"><Label>Valor cobrado</Label><Input type="number" step="0.01" value={form.valor_cobrado ?? ""} onChange={(e) => setForm({ ...form, valor_cobrado: e.target.value })} /></div>
                  <div className="space-y-1.5 sm:col-span-2"><Label>Prestador</Label><Input value={form.prestador ?? ""} onChange={(e) => setForm({ ...form, prestador: e.target.value })} /></div>
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
              <TableHead>Data</TableHead><TableHead>Imóvel</TableHead><TableHead>Tipo</TableHead>
              <TableHead>Prestador</TableHead><TableHead>Custo</TableHead><TableHead>Cobrado</TableHead>
              <TableHead>Margem</TableHead><TableHead></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {list.length === 0 && <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">Sem lançamentos.</TableCell></TableRow>}
              {list.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{dateBR(s.data)}</TableCell>
                  <TableCell className="font-medium">{s.imoveis?.codigo}</TableCell>
                  <TableCell className="capitalize">{s.tipo}</TableCell>
                  <TableCell className="text-muted-foreground">{s.prestador ?? "—"}</TableCell>
                  <TableCell className="num">{brl(s.custo_real)}</TableCell>
                  <TableCell className="num">{brl(s.valor_cobrado)}</TableCell>
                  <TableCell className="num">{brl(Number(s.valor_cobrado) - Number(s.custo_real))}</TableCell>
                  <TableCell><Button size="icon" variant="ghost" onClick={() => remove(s.id)}><Trash2 className="h-4 w-4" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      </div>
    </>
  );
}
