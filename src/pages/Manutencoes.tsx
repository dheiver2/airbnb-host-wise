import { useEffect, useRef, useState } from "react";
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
import { Plus, Trash2, Paperclip, Upload, X } from "lucide-react";
import { AnexoDownload } from "@/components/AnexoDownload";
import { toast } from "sonner";
import { brl, dateBR, monthRange } from "@/lib/format";
import { useCompetenciaState } from "@/hooks/useLatestCompetencia";

const AREAS = ["faxina", "lavanderia", "logistica", "casa", "manutencao", "escritorio"] as const;
const AREA_LABELS: Record<string, string> = {
  faxina: "Faxina", lavanderia: "Lavanderia", logistica: "Logística",
  casa: "Casa", manutencao: "Manutenção", escritorio: "Escritório",
};
const BUCKET = "anexos";

type Anexo = { nome: string; url: string; path: string };

async function uploadFiles(files: File[], pasta: string): Promise<Anexo[]> {
  const result: Anexo[] = [];
  for (const file of files) {
    const path = `${pasta}/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file);
    if (error) { toast.error(`Falha ao enviar ${file.name}: ${error.message}`); continue; }
    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
    result.push({ nome: file.name, url: pub.publicUrl, path });
  }
  return result;
}

function getAnexos(item: any): Anexo[] {
  if (!item?.anexos || !Array.isArray(item.anexos)) return [];
  return item.anexos as Anexo[];
}

function FileSelector({
  files, onChange, inputRef,
}: { files: File[]; onChange: (f: File[]) => void; inputRef: React.RefObject<HTMLInputElement> }) {
  return (
    <div className="flex flex-wrap gap-2">
      {files.map((f, i) => (
        <Badge key={i} variant="secondary" className="gap-1 max-w-[180px]">
          <span className="truncate">{f.name}</span>
          <button type="button" onClick={() => onChange(files.filter((_, j) => j !== i))}>
            <X className="h-3 w-3 shrink-0" />
          </button>
        </Badge>
      ))}
      <Button
        type="button" size="sm" variant="outline" className="h-7 gap-1"
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="h-3.5 w-3.5" />Adicionar
      </Button>
      <input
        ref={inputRef} type="file" multiple className="hidden"
        onChange={(e) => {
          onChange([...files, ...Array.from(e.target.files ?? [])]);
          if (inputRef.current) inputRef.current.value = "";
        }}
      />
    </div>
  );
}

export default function Manutencoes() {
  const [mes, setMes] = useCompetenciaState();
  const [imoveis, setImoveis] = useState<any[]>([]);
  const [params, setParams] = useState<any[]>([]);
  const [list, setList] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>({ rateio: "investidor" });
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  type AnexoCtx = { open: boolean; id: string; current: Anexo[] };
  const [anexoCtx, setAnexoCtx] = useState<AnexoCtx | null>(null);
  const [uploading, setUploading] = useState(false);
  const addAnexoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.from("imoveis")
      .select("id, codigo")
      .eq("status", "ativo").order("codigo")
      .then(({ data }) => setImoveis(data ?? []));
    supabase.from("parametros_servico").select("*, imoveis(codigo)").eq("ativo", true).order("nome")
      .then(({ data }) => setParams(data ?? []));
  }, []);

  useEffect(() => { load(); }, [mes]);

  async function load() {
    const { start, end } = monthRange(mes);
    const { data } = await supabase.from("manutencoes")
      .select("*, imoveis(codigo)")
      .gte("mes_competencia", start).lte("mes_competencia", end)
      .order("data", { ascending: false });
    setList(data ?? []);
  }

  function selectParam(id: string) {
    const p = params.find((x) => x.id === id);
    if (!p) return;
    setForm((f: any) => ({
      ...f, parametro_id: id, descricao: f.descricao || p.nome,
      categoria: p.categoria, custo: p.custo, valor_cobrado: p.valor_cobrado,
      ...(p.imovel_id ? { imovel_id: p.imovel_id } : {}),
      ...(p.area ? { area: p.area } : {}),
    }));
  }

  const paramsForImovel = (imovelId?: string) =>
    params.filter((p) => !p.imovel_id || (imovelId && p.imovel_id === imovelId));

  async function save() {
    if (!form.imovel_id || !form.data || !form.descricao)
      return toast.error("Preencha imóvel, data e descrição");
    const competencia = `${String(form.data).slice(0, 7)}-01`;
    const { data: inserted, error } = await (supabase.from("manutencoes") as any).insert({
      imovel_id: form.imovel_id, parametro_id: form.parametro_id || null,
      data: form.data, descricao: form.descricao, categoria: form.categoria || null,
      custo: Number(form.custo ?? 0), valor_cobrado: Number(form.valor_cobrado ?? 0),
      rateio: form.rateio, mes_competencia: competencia, anexos: [],
      area: form.area || null,
    }).select("id").single();
    if (error) return toast.error(error.message);
    if (files.length > 0) {
      const anexos = await uploadFiles(files, `manutencoes/${inserted.id}`);
      await supabase.from("manutencoes").update({ anexos }).eq("id", inserted.id);
    }
    toast.success("Manutenção registrada");
    setOpen(false); setForm({ rateio: "investidor" }); setFiles([]); load();
  }

  async function remove(id: string) {
    if (!confirm("Excluir?")) return;
    await supabase.from("manutencoes").delete().eq("id", id);
    load();
  }

  async function deleteAnexo(anexo: Anexo) {
    if (!anexoCtx) return;
    await supabase.storage.from(BUCKET).remove([anexo.path]);
    const updated = anexoCtx.current.filter((a) => a.path !== anexo.path);
    await (supabase.from("manutencoes") as any).update({ anexos: updated }).eq("id", anexoCtx.id);
    setAnexoCtx({ ...anexoCtx, current: updated });
    load();
  }

  async function addToExisting(fileList: FileList | null) {
    if (!fileList || !anexoCtx) return;
    setUploading(true);
    const novos = await uploadFiles(Array.from(fileList), `manutencoes/${anexoCtx.id}`);
    const merged = [...anexoCtx.current, ...novos];
    await (supabase.from("manutencoes") as any).update({ anexos: merged }).eq("id", anexoCtx.id);
    setAnexoCtx({ ...anexoCtx, current: merged });
    setUploading(false);
    load();
  }

  const totalCusto = list.reduce((s, m) => s + Number(m.custo || 0), 0);

  return (
    <>
      <PageHeader
        title="Manutenções"
        description="Registro de manutenções dos imóveis e controle de rateio."
        actions={
          <div className="contents sm:flex sm:w-full sm:flex-wrap sm:items-center sm:gap-2 lg:w-auto">
            <MonthPicker value={mes} onChange={setMes} />
            <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setForm({ rateio: "investidor" }); setFiles([]); } }}>
              <DialogTrigger asChild>
                <Button className="w-full sm:flex-1 lg:w-auto lg:flex-none">
                  <Plus className="mr-2 h-4 w-4" />Nova manutenção
                </Button>
              </DialogTrigger>
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
                  <div className="space-y-1.5">
                    <Label>Data *</Label>
                    <Input type="date" value={form.data ?? ""} onChange={(e) => setForm({ ...form, data: e.target.value })} />
                  </div>
                  {params.length > 0 && (
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label>Parâmetro de serviço</Label>
                      <Select value={form.parametro_id ?? ""} onValueChange={selectParam}>
                        <SelectTrigger><SelectValue placeholder="Opcional — preenche descrição, custo e valor" /></SelectTrigger>
                        <SelectContent>
                          {paramsForImovel(form.imovel_id).map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.nome}
                              {p.imoveis?.codigo ? ` · ${p.imoveis.codigo}` : p.categoria ? ` · ${p.categoria}` : ""}
                              {` — ${brl(p.custo)} / ${brl(p.valor_cobrado)}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>Descrição *</Label>
                    <Input value={form.descricao ?? ""} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Custo</Label>
                    <Input type="number" step="0.01" value={form.custo ?? ""} onChange={(e) => setForm({ ...form, custo: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Valor cobrado</Label>
                    <Input type="number" step="0.01" value={form.valor_cobrado ?? ""} onChange={(e) => setForm({ ...form, valor_cobrado: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Área</Label>
                    <Select value={form.area ?? ""} onValueChange={(v) => setForm({ ...form, area: v })}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>{AREAS.map((a) => <SelectItem key={a} value={a}>{AREA_LABELS[a]}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Rateio *</Label>
                    <Select value={form.rateio ?? "investidor"} onValueChange={(v) => setForm({ ...form, rateio: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="investidor">Investidor paga</SelectItem>
                        <SelectItem value="empresa">Empresa absorve</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>Anexos</Label>
                    <FileSelector files={files} onChange={setFiles} inputRef={fileInputRef} />
                  </div>
                </div>
                <DialogFooter><Button onClick={save}>Salvar</Button></DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      <div className="p-6 space-y-4">
        <div className="text-sm text-muted-foreground">
          Total custo no mês: <span className="num font-semibold text-foreground">{brl(totalCusto)}</span>
        </div>
        <Card className="shadow-card"><CardContent className="overflow-x-auto p-0">
          <Table className="min-w-[820px]">
            <TableHeader><TableRow>
              <TableHead>Data</TableHead><TableHead>Imóvel</TableHead><TableHead>Descrição</TableHead>
              <TableHead>Área</TableHead><TableHead>Custo</TableHead><TableHead>Cobrado</TableHead>
              <TableHead>Rateio</TableHead><TableHead>Anexos</TableHead><TableHead></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {list.length === 0 && (
                <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-8">Sem manutenções no mês.</TableCell></TableRow>
              )}
              {list.map((m) => {
                const anexos = getAnexos(m);
                return (
                  <TableRow key={m.id}>
                    <TableCell>{dateBR(m.data)}</TableCell>
                    <TableCell className="font-medium">{m.imoveis?.codigo}</TableCell>
                    <TableCell className="text-muted-foreground max-w-[260px] truncate">{m.descricao}</TableCell>
                    <TableCell>{m.area ? AREA_LABELS[m.area] ?? m.area : "—"}</TableCell>
                    <TableCell className="num">{brl(m.custo)}</TableCell>
                    <TableCell className="num">{brl(m.valor_cobrado)}</TableCell>
                    <TableCell>
                      <Badge variant={m.rateio === "investidor" ? "default" : "secondary"}>{m.rateio}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm" variant="ghost" className="h-7 gap-1 px-2 text-xs"
                        onClick={() => setAnexoCtx({ open: true, id: m.id, current: anexos })}
                      >
                        <Paperclip className="h-3.5 w-3.5" />
                        {anexos.length > 0 && <span>{anexos.length}</span>}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button size="icon" variant="ghost" onClick={() => remove(m.id)}><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent></Card>
      </div>

      {anexoCtx && (
        <Dialog open={anexoCtx.open} onOpenChange={(o) => !o && setAnexoCtx(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Anexos</DialogTitle></DialogHeader>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {anexoCtx.current.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-6">Nenhum arquivo anexado.</p>
              )}
              {anexoCtx.current.map((a, i) => (
                <div key={i} className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                  <Paperclip className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="flex-1 truncate">{a.nome}</span>
                  <AnexoDownload path={a.path} nome={a.nome} />
                  <Button
                    size="icon" variant="ghost"
                    className="h-7 w-7 shrink-0 text-destructive hover:text-destructive"
                    onClick={() => deleteAnexo(a)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button
                variant="outline" size="sm" disabled={uploading}
                onClick={() => addAnexoRef.current?.click()}
              >
                <Upload className="mr-2 h-3.5 w-3.5" />
                {uploading ? "Enviando…" : "Adicionar arquivos"}
              </Button>
              <input
                ref={addAnexoRef} type="file" multiple className="hidden"
                onChange={(e) => {
                  addToExisting(e.target.files);
                  if (addAnexoRef.current) addAnexoRef.current.value = "";
                }}
              />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
