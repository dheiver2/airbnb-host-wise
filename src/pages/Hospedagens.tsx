import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { MonthPicker } from "@/components/MonthPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { brl, dateBR, monthRange } from "@/lib/format";
import { useCompetenciaState } from "@/hooks/useLatestCompetencia";
import { Combobox } from "@/components/Combobox";

export default function Hospedagens() {
  const [list, setList] = useState<any[]>([]);
  const [imoveis, setImoveis] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [mes, setMes] = useCompetenciaState();
  const [imovelFiltro, setImovelFiltro] = useState("");
  const [form, setForm] = useState<any>({});

  useEffect(() => { loadImoveis(); }, []);
  useEffect(() => { load(); }, [mes]);

  async function loadImoveis() {
    const { data } = await supabase.from("imoveis").select("id, codigo, endereco").eq("status", "ativo").order("codigo");
    setImoveis(data ?? []);
  }
  async function load() {
    const { start, end } = monthRange(mes);
    const { data } = await supabase.from("reservas").select("*, imoveis(codigo)").gte("mes_competencia", start).lte("mes_competencia", end).order("check_in", { ascending: false });
    setList(data ?? []);
  }

  async function save() {
    if (!form.imovel_id || !form.check_in || !form.check_out) return toast.error("Preencha imóvel e datas");
    const competencia = `${form.check_out.slice(0, 7)}-01`;
    const payload = {
      codigo_airbnb: form.codigo_airbnb || null,
      imovel_id: form.imovel_id,
      check_in: form.check_in, check_out: form.check_out,
      hospedes: Number(form.hospedes ?? 1),
      valor_bruto: Number(form.valor_bruto ?? 0),
      taxas_airbnb: Number(form.taxas_airbnb ?? 0),
      valor_liquido: Number(form.valor_liquido ?? form.valor_bruto ?? 0),
      mes_competencia: competencia,
    };
    const { error } = await supabase.from("reservas").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Hospedagem registrada"); setOpen(false); setForm({}); load();
  }

  async function remove(id: string) {
    if (!confirm("Excluir hospedagem?")) return;
    await supabase.from("reservas").delete().eq("id", id);
    load();
  }

  const filtered = useMemo(
    () => imovelFiltro ? list.filter((r) => r.imovel_id === imovelFiltro) : list,
    [list, imovelFiltro],
  );
  const total = filtered.reduce((s, r) => s + Number(r.valor_bruto || 0), 0);
  const liquido = filtered.reduce((s, r) => s + Number(r.valor_liquido || 0), 0);

  const imovelOpts = imoveis.map((i) => ({ value: i.id, label: i.codigo, hint: i.endereco }));

  return (
    <>
      <PageHeader
        title="Hospedagens"
        description="Reservas/check-ins por mês de competência (data de check-out)."
        actions={
          <>
            <Combobox
              options={imovelOpts}
              value={imovelFiltro}
              onChange={setImovelFiltro}
              placeholder="Todos os imóveis"
              searchPlaceholder="Filtrar imóvel..."
              clearable
              className="min-w-[220px] flex-1 lg:flex-none"
            />
            <MonthPicker value={mes} onChange={setMes} />
            <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setForm({}); }}>
              <DialogTrigger asChild><Button className="flex-1 lg:flex-none"><Plus className="mr-2 h-4 w-4" />Nova hospedagem</Button></DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader><DialogTitle>Nova hospedagem</DialogTitle></DialogHeader>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>Imóvel *</Label>
                    <Combobox
                      options={imovelOpts}
                      value={form.imovel_id ?? ""}
                      onChange={(v) => setForm({ ...form, imovel_id: v })}
                      placeholder="Selecione o imóvel"
                      searchPlaceholder="Buscar imóvel..."
                    />
                  </div>
                  <div className="space-y-1.5"><Label>Check-in *</Label><Input type="date" value={form.check_in ?? ""} onChange={(e) => setForm({ ...form, check_in: e.target.value })} /></div>
                  <div className="space-y-1.5"><Label>Check-out *</Label><Input type="date" value={form.check_out ?? ""} onChange={(e) => setForm({ ...form, check_out: e.target.value })} /></div>
                  <div className="space-y-1.5"><Label>Hóspedes</Label><Input type="number" value={form.hospedes ?? 1} onChange={(e) => setForm({ ...form, hospedes: e.target.value })} /></div>
                  <div className="space-y-1.5"><Label>Cód. Airbnb</Label><Input value={form.codigo_airbnb ?? ""} onChange={(e) => setForm({ ...form, codigo_airbnb: e.target.value })} /></div>
                  <div className="space-y-1.5"><Label>Valor bruto</Label><Input type="number" step="0.01" value={form.valor_bruto ?? ""} onChange={(e) => setForm({ ...form, valor_bruto: e.target.value })} /></div>
                  <div className="space-y-1.5"><Label>Taxas Airbnb</Label><Input type="number" step="0.01" value={form.taxas_airbnb ?? ""} onChange={(e) => setForm({ ...form, taxas_airbnb: e.target.value })} /></div>
                  <div className="space-y-1.5 sm:col-span-2"><Label>Valor líquido recebido</Label><Input type="number" step="0.01" value={form.valor_liquido ?? ""} onChange={(e) => setForm({ ...form, valor_liquido: e.target.value })} /></div>
                </div>
                <DialogFooter><Button onClick={save}>Salvar</Button></DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        }
      />
      <div className="p-6 space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <Card className="shadow-card"><CardContent className="p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Reservas</div>
            <div className="num mt-1 text-xl font-semibold">{filtered.length}</div>
          </CardContent></Card>
          <Card className="shadow-card"><CardContent className="p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Bruto</div>
            <div className="num mt-1 text-xl font-semibold">{brl(total)}</div>
          </CardContent></Card>
          <Card className="shadow-card"><CardContent className="p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Líquido</div>
            <div className="num mt-1 text-xl font-semibold">{brl(liquido)}</div>
          </CardContent></Card>
        </div>
        <Card className="shadow-card"><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Imóvel</TableHead><TableHead>Check-in</TableHead><TableHead>Check-out</TableHead>
              <TableHead>Noites</TableHead><TableHead>Hósp.</TableHead><TableHead>Bruto</TableHead>
              <TableHead>Taxas</TableHead><TableHead>Líquido</TableHead><TableHead>Cód.</TableHead><TableHead></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.length === 0 && <TableRow><TableCell colSpan={10} className="text-center text-muted-foreground py-8">Nenhuma reserva neste mês.</TableCell></TableRow>}
              {filtered.map((r) => {
                const noites = Math.round((new Date(r.check_out).getTime() - new Date(r.check_in).getTime()) / 86400000);
                return (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.imoveis?.codigo}</TableCell>
                    <TableCell>{dateBR(r.check_in)}</TableCell>
                    <TableCell>{dateBR(r.check_out)}</TableCell>
                    <TableCell className="num">{noites}</TableCell>
                    <TableCell className="num">{r.hospedes}</TableCell>
                    <TableCell className="num">{brl(r.valor_bruto)}</TableCell>
                    <TableCell className="num text-muted-foreground">{brl(r.taxas_airbnb)}</TableCell>
                    <TableCell className="num">{brl(r.valor_liquido)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{r.codigo_airbnb ?? "—"}</TableCell>
                    <TableCell><Button size="icon" variant="ghost" onClick={() => remove(r.id)}><Trash2 className="h-4 w-4" /></Button></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent></Card>
      </div>
    </>
  );
}
