import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
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
import { brl, dateBR, monthRange } from "@/lib/format";
import { useCompetenciaState } from "@/hooks/useLatestCompetencia";
import { Combobox } from "@/components/Combobox";

export default function Adiantamentos() {
  const [list, setList] = useState<any[]>([]);
  const [investidores, setInvestidores] = useState<any[]>([]);
  const [imoveis, setImoveis] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [mes, setMes] = useCompetenciaState();
  const [invFiltro, setInvFiltro] = useState("");
  const [form, setForm] = useState<any>({ origem: "empresa_repasse" });

  useEffect(() => {
    supabase.from("investidores").select("id, nome").order("nome").then(({ data }) => setInvestidores(data ?? []));
    supabase.from("imoveis").select("id, codigo, investidor_id").order("codigo").then(({ data }) => setImoveis(data ?? []));
  }, []);
  useEffect(() => { load(); }, [mes]);

  async function load() {
    const { start, end } = monthRange(mes);
    const { data } = await supabase.from("adiantamentos").select("*, investidores(nome), imoveis(codigo)").gte("mes_competencia", start).lte("mes_competencia", end).order("data", { ascending: false });
    setList(data ?? []);
  }

  async function save() {
    if (!form.investidor_id || !form.data || !form.valor) return toast.error("Preencha investidor, data e valor");
    const competencia = `${String(form.data).slice(0, 7)}-01`;
    const { error } = await supabase.from("adiantamentos").insert({
      investidor_id: form.investidor_id, imovel_id: form.imovel_id || null,
      data: form.data, valor: Number(form.valor), origem: form.origem,
      mes_competencia: competencia, observacoes: form.observacoes,
    });
    if (error) return toast.error(error.message);
    toast.success("Adiantamento registrado"); setOpen(false); setForm({ origem: "empresa_repasse" }); load();
  }

  async function remove(id: string) {
    if (!confirm("Excluir?")) return;
    await supabase.from("adiantamentos").delete().eq("id", id); load();
  }

  const filteredImoveisForm = form.investidor_id ? imoveis.filter((i) => i.investidor_id === form.investidor_id) : imoveis;
  const filtered = useMemo(
    () => invFiltro ? list.filter((a) => a.investidor_id === invFiltro) : list,
    [list, invFiltro],
  );
  const total = filtered.reduce((s, a) => s + Number(a.valor || 0), 0);

  const invOpts = investidores.map((i) => ({ value: i.id, label: i.nome }));

  return (
    <>
      <PageHeader
        title="Adiantamentos"
        description="Repasses pagos ao investidor (pelo Airbnb diretamente ou pela empresa)."
        actions={
          <>
            <Combobox
              options={invOpts}
              value={invFiltro}
              onChange={setInvFiltro}
              placeholder="Todos investidores"
              searchPlaceholder="Filtrar investidor..."
              clearable
              className="w-[220px]"
            />
            <Input type="month" value={mes} onChange={(e) => setMes(e.target.value)} className="w-[160px]" />
            <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setForm({ origem: "empresa_repasse" }); }}>
              <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Novo adiantamento</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Novo adiantamento</DialogTitle></DialogHeader>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>Investidor *</Label>
                    <Combobox
                      options={invOpts}
                      value={form.investidor_id ?? ""}
                      onChange={(v) => setForm({ ...form, investidor_id: v, imovel_id: null })}
                      placeholder="Selecione o investidor"
                      searchPlaceholder="Buscar investidor..."
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Imóvel</Label>
                    <Combobox
                      options={filteredImoveisForm.map((i) => ({ value: i.id, label: i.codigo }))}
                      value={form.imovel_id ?? ""}
                      onChange={(v) => setForm({ ...form, imovel_id: v })}
                      placeholder="Opcional"
                      searchPlaceholder="Buscar imóvel..."
                      clearable
                    />
                  </div>
                  <div className="space-y-1.5"><Label>Data *</Label><Input type="date" value={form.data ?? ""} onChange={(e) => setForm({ ...form, data: e.target.value })} /></div>
                  <div className="space-y-1.5"><Label>Valor *</Label><Input type="number" step="0.01" value={form.valor ?? ""} onChange={(e) => setForm({ ...form, valor: e.target.value })} /></div>
                  <div className="space-y-1.5">
                    <Label>Origem</Label>
                    <Select value={form.origem} onValueChange={(v) => setForm({ ...form, origem: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="empresa_repasse">Empresa repassou</SelectItem>
                        <SelectItem value="airbnb_direto">Airbnb pagou direto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5 sm:col-span-2"><Label>Observações</Label><Input value={form.observacoes ?? ""} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} /></div>
                </div>
                <DialogFooter><Button onClick={save}>Salvar</Button></DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        }
      />
      <div className="p-6 space-y-4">
        <div className="text-sm text-muted-foreground">
          Total no mês: <span className="num font-semibold text-foreground">{brl(total)}</span> · {filtered.length} adiantamentos
        </div>
        <Card className="shadow-card"><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Data</TableHead><TableHead>Investidor</TableHead><TableHead>Imóvel</TableHead>
              <TableHead>Origem</TableHead><TableHead>Valor</TableHead><TableHead></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Sem adiantamentos no mês.</TableCell></TableRow>}
              {filtered.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>{dateBR(a.data)}</TableCell>
                  <TableCell className="font-medium">{a.investidores?.nome}</TableCell>
                  <TableCell className="text-muted-foreground">{a.imoveis?.codigo ?? "—"}</TableCell>
                  <TableCell><Badge variant={a.origem === "airbnb_direto" ? "secondary" : "default"}>{a.origem === "airbnb_direto" ? "Airbnb direto" : "Empresa"}</Badge></TableCell>
                  <TableCell className="num">{brl(a.valor)}</TableCell>
                  <TableCell><Button size="icon" variant="ghost" onClick={() => remove(a.id)}><Trash2 className="h-4 w-4" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      </div>
    </>
  );
}
