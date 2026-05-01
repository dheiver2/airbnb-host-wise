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
import { brl, monthInputValue, monthRange } from "@/lib/format";
import { useCompetenciaState } from "@/hooks/useLatestCompetencia";

const CATEGORIAS = ["gestao", "logistica", "chat", "escritorio", "folha", "diversos", "itens_apartamento"];
const LABELS: Record<string, string> = {
  gestao: "Gestão", logistica: "Logística", chat: "Chat / atendimento",
  escritorio: "Escritório (base)", folha: "Folha de pagamento",
  diversos: "Custos diversos", itens_apartamento: "Itens para apartamento",
};

export default function Custos() {
  const [list, setList] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [mes, setMes] = useCompetenciaState();
  const [form, setForm] = useState<any>({});

  useEffect(() => { load(); }, [mes]);

  async function load() {
    const { start, end } = monthRange(mes);
    const { data } = await supabase.from("custos_fixos").select("*").gte("mes_competencia", start).lte("mes_competencia", end).order("categoria");
    setList(data ?? []);
  }

  async function save() {
    if (!form.categoria || !form.valor) return toast.error("Categoria e valor obrigatórios");
    const competencia = `${mes}-01`;
    const { error } = await supabase.from("custos_fixos").insert({
      mes_competencia: competencia, categoria: form.categoria, descricao: form.descricao, valor: Number(form.valor),
    });
    if (error) return toast.error(error.message);
    toast.success("Custo lançado"); setOpen(false); setForm({}); load();
  }

  async function remove(id: string) {
    if (!confirm("Excluir?")) return;
    await supabase.from("custos_fixos").delete().eq("id", id); load();
  }

  const total = list.reduce((s, c) => s + Number(c.valor || 0), 0);

  return (
    <>
      <PageHeader
        title="Custos da empresa"
        description="Custos fixos e folha de pagamento — entram apenas no DRE da empresa."
        actions={
          <div className="contents sm:flex sm:w-full sm:flex-wrap sm:items-center sm:gap-2 lg:w-auto">
            <MonthPicker value={mes} onChange={setMes} />
            <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setForm({}); }}>
              <DialogTrigger asChild><Button className="w-full sm:flex-1 lg:w-auto lg:flex-none"><Plus className="mr-2 h-4 w-4" />Novo custo</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Novo custo do mês</DialogTitle></DialogHeader>
                <div className="grid gap-3">
                  <div className="space-y-1.5">
                    <Label>Categoria *</Label>
                    <Select value={form.categoria ?? ""} onValueChange={(v) => setForm({ ...form, categoria: v })}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>{CATEGORIAS.map((c) => <SelectItem key={c} value={c}>{LABELS[c]}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5"><Label>Descrição</Label><Input value={form.descricao ?? ""} onChange={(e) => setForm({ ...form, descricao: e.target.value })} /></div>
                  <div className="space-y-1.5"><Label>Valor *</Label><Input type="number" step="0.01" value={form.valor ?? ""} onChange={(e) => setForm({ ...form, valor: e.target.value })} /></div>
                </div>
                <DialogFooter><Button onClick={save}>Salvar</Button></DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        }
      />
      <div className="p-6 space-y-4">
        <div className="text-sm text-muted-foreground">Total no mês: <span className="num font-semibold text-foreground">{brl(total)}</span></div>
        <Card className="shadow-card"><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Categoria</TableHead><TableHead>Descrição</TableHead><TableHead>Valor</TableHead><TableHead></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {list.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">Sem custos lançados.</TableCell></TableRow>}
              {list.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{LABELS[c.categoria] ?? c.categoria}</TableCell>
                  <TableCell className="text-muted-foreground">{c.descricao ?? "—"}</TableCell>
                  <TableCell className="num">{brl(c.valor)}</TableCell>
                  <TableCell><Button size="icon" variant="ghost" onClick={() => remove(c.id)}><Trash2 className="h-4 w-4" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      </div>
    </>
  );
}
