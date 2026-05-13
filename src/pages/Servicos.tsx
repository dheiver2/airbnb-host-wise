import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { MonthPicker } from "@/components/MonthPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Paperclip, X, Upload } from "lucide-react";
import { AnexoDownload } from "@/components/AnexoDownload";
import { toast } from "sonner";
import { brl, dateBR, monthRange } from "@/lib/format";
import { useCompetenciaState } from "@/hooks/useLatestCompetencia";

const TIPOS_SERVICO = ["faxina", "lavanderia", "material", "manutencao"] as const;
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

// Fora do componente para evitar remount a cada render
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

export default function Servicos() {
  const [mes, setMes] = useCompetenciaState();
  const [imoveis, setImoveis] = useState<any[]>([]);
  const [params, setParams] = useState<any[]>([]);

  // ── Serviços ──
  const [listServ, setListServ] = useState<any[]>([]);
  const [openServ, setOpenServ] = useState(false);
  const [formServ, setFormServ] = useState<any>({});
  const [filesServ, setFilesServ] = useState<File[]>([]);
  const fileInputServRef = useRef<HTMLInputElement>(null);

  // ── Manutenções ──
  const [listMan, setListMan] = useState<any[]>([]);
  const [openMan, setOpenMan] = useState(false);
  const [formMan, setFormMan] = useState<any>({ rateio: "investidor" });
  const [filesMan, setFilesMan] = useState<File[]>([]);
  const fileInputManRef = useRef<HTMLInputElement>(null);

  // ── Gerenciar anexos de um item existente ──
  type AnexoCtx = { open: boolean; tabela: string; id: string; current: Anexo[] };
  const [anexoCtx, setAnexoCtx] = useState<AnexoCtx | null>(null);
  const [uploading, setUploading] = useState(false);
  const addAnexoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.from("imoveis")
      .select("id, codigo, valor_faxina, custo_faxina, valor_lavanderia, custo_lavanderia")
      .eq("status", "ativo").order("codigo")
      .then(({ data }) => setImoveis(data ?? []));
    supabase.from("parametros_servico").select("*, imoveis(codigo)").eq("ativo", true).order("nome")
      .then(({ data }) => setParams(data ?? []));
  }, []);

  useEffect(() => { loadServ(); loadMan(); }, [mes]);

  async function loadServ() {
    const { start, end } = monthRange(mes);
    const { data } = await supabase.from("servicos_operacionais")
      .select("*, imoveis(codigo)")
      .gte("mes_competencia", start).lte("mes_competencia", end)
      .order("data", { ascending: false });
    setListServ(data ?? []);
  }

  async function loadMan() {
    const { start, end } = monthRange(mes);
    const { data } = await supabase.from("manutencoes")
      .select("*, imoveis(codigo)")
      .gte("mes_competencia", start).lte("mes_competencia", end)
      .order("data", { ascending: false });
    setListMan(data ?? []);
  }

  // ── Serviços: seleciona parâmetro ──
  function selectParamServ(id: string) {
    const p = params.find((x) => x.id === id);
    if (!p) return;
    const cat = (p.categoria ?? "").toLowerCase();
    const tipoMapped = (TIPOS_SERVICO as readonly string[]).find((t) => cat.includes(t)) as typeof TIPOS_SERVICO[number] | undefined;
    setFormServ((f: any) => ({
      ...f,
      parametro_id: id,
      custo_real: p.custo,
      valor_cobrado: p.valor_cobrado,
      ...(p.imovel_id ? { imovel_id: p.imovel_id } : {}),
      ...(p.area ? { area: p.area } : {}),
      ...(tipoMapped ? { tipo: tipoMapped } : {}),
    }));
  }

  const paramsForImovel = (imovelId?: string) =>
    params.filter((p) => !p.imovel_id || (imovelId && p.imovel_id === imovelId));

  // ── Serviços ──
  function onTipoOrImovel(tipo: string, imovel_id: string) {
    const im = imoveis.find((i) => i.id === imovel_id);
    if (!im) return;
    if (tipo === "faxina")
      setFormServ((f: any) => ({ ...f, tipo, imovel_id, custo_real: im.custo_faxina, valor_cobrado: im.valor_faxina }));
    else if (tipo === "lavanderia")
      setFormServ((f: any) => ({ ...f, tipo, imovel_id, custo_real: im.custo_lavanderia, valor_cobrado: im.valor_lavanderia }));
    else
      setFormServ((f: any) => ({ ...f, tipo, imovel_id }));
  }

  async function saveServ() {
    if (!formServ.imovel_id || !formServ.data || !formServ.tipo)
      return toast.error("Preencha imóvel, data e tipo");
    const competencia = `${String(formServ.data).slice(0, 7)}-01`;

    // Vincula automaticamente à reserva cujo check_out = data (faxina/lavanderia pós-saída)
    // ou que englobe a data (manutenções durante a estadia).
    let reservaId: string | null = null;
    const { data: resMatch } = await supabase.from("reservas")
      .select("id, check_in, check_out")
      .eq("imovel_id", formServ.imovel_id)
      .lte("check_in", formServ.data)
      .gte("check_out", formServ.data)
      .order("check_out", { ascending: false }).limit(1);
    if (resMatch && resMatch.length > 0) reservaId = resMatch[0].id;
    else {
      const { data: resOut } = await supabase.from("reservas")
        .select("id").eq("imovel_id", formServ.imovel_id).eq("check_out", formServ.data).limit(1);
      if (resOut && resOut.length > 0) reservaId = resOut[0].id;
    }

    const { data: inserted, error } = await (supabase.from("servicos_operacionais") as any).insert({
      imovel_id: formServ.imovel_id, data: formServ.data, tipo: formServ.tipo,
      custo_real: Number(formServ.custo_real ?? 0), valor_cobrado: Number(formServ.valor_cobrado ?? 0),
      prestador: formServ.prestador || null, mes_competencia: competencia, anexos: [],
      parametro_id: formServ.parametro_id || null, area: formServ.area || null,
      reserva_id: reservaId,
    }).select("id").single();
    if (error) return toast.error(error.message);
    if (filesServ.length > 0) {
      const anexos = await uploadFiles(filesServ, `servicos/${inserted.id}`);
      await supabase.from("servicos_operacionais").update({ anexos }).eq("id", inserted.id);
    }
    toast.success(reservaId ? "Lançado e vinculado à reserva" : "Lançado");
    setOpenServ(false); setFormServ({}); setFilesServ([]); loadServ();
  }

  async function removeServ(id: string) {
    if (!confirm("Excluir lançamento?")) return;
    await supabase.from("servicos_operacionais").delete().eq("id", id);
    loadServ();
  }

  // ── Manutenções ──
  function selectParam(id: string) {
    const p = params.find((x) => x.id === id);
    if (!p) return;
    setFormMan((f: any) => ({
      ...f, parametro_id: id, descricao: f.descricao || p.nome,
      categoria: p.categoria, custo: p.custo, valor_cobrado: p.valor_cobrado,
      ...(p.imovel_id ? { imovel_id: p.imovel_id } : {}),
      ...(p.area ? { area: p.area } : {}),
    }));
  }

  async function saveMan() {
    if (!formMan.imovel_id || !formMan.data || !formMan.descricao)
      return toast.error("Preencha imóvel, data e descrição");
    const competencia = `${String(formMan.data).slice(0, 7)}-01`;
    const { data: inserted, error } = await (supabase.from("manutencoes") as any).insert({
      imovel_id: formMan.imovel_id, parametro_id: formMan.parametro_id || null,
      data: formMan.data, descricao: formMan.descricao, categoria: formMan.categoria || null,
      custo: Number(formMan.custo ?? 0), valor_cobrado: Number(formMan.valor_cobrado ?? 0),
      rateio: formMan.rateio, mes_competencia: competencia, anexos: [],
      area: formMan.area || null,
    }).select("id").single();
    if (error) return toast.error(error.message);
    if (filesMan.length > 0) {
      const anexos = await uploadFiles(filesMan, `manutencoes/${inserted.id}`);
      await supabase.from("manutencoes").update({ anexos }).eq("id", inserted.id);
    }
    toast.success("Manutenção registrada");
    setOpenMan(false); setFormMan({ rateio: "investidor" }); setFilesMan([]); loadMan();
  }

  async function removeMan(id: string) {
    if (!confirm("Excluir?")) return;
    await supabase.from("manutencoes").delete().eq("id", id);
    loadMan();
  }

  // ── Gerenciar anexos de item existente ──
  async function deleteAnexo(anexo: Anexo) {
    if (!anexoCtx) return;
    await supabase.storage.from(BUCKET).remove([anexo.path]);
    const updated = anexoCtx.current.filter((a) => a.path !== anexo.path);
    await (supabase.from(anexoCtx.tabela as any) as any).update({ anexos: updated }).eq("id", anexoCtx.id);
    setAnexoCtx({ ...anexoCtx, current: updated });
    if (anexoCtx.tabela === "servicos_operacionais") loadServ(); else loadMan();
  }

  async function addToExisting(files: FileList | null) {
    if (!files || !anexoCtx) return;
    setUploading(true);
    const pasta = `${anexoCtx.tabela === "servicos_operacionais" ? "servicos" : "manutencoes"}/${anexoCtx.id}`;
    const novos = await uploadFiles(Array.from(files), pasta);
    const merged = [...anexoCtx.current, ...novos];
    await (supabase.from(anexoCtx.tabela as any) as any).update({ anexos: merged }).eq("id", anexoCtx.id);
    setAnexoCtx({ ...anexoCtx, current: merged });
    setUploading(false);
    if (anexoCtx.tabela === "servicos_operacionais") loadServ(); else loadMan();
  }

  return (
    <>
      <PageHeader
        title="Serviços & Manutenções"
        description="Serviços operacionais e manutenções dos imóveis."
        actions={<MonthPicker value={mes} onChange={setMes} />}
      />

      <div className="p-6 space-y-4">
        <Tabs defaultValue="servicos">
          <TabsList>
            <TabsTrigger value="servicos">Serviços operacionais</TabsTrigger>
            <TabsTrigger value="manutencoes">Manutenções</TabsTrigger>
          </TabsList>

          {/* ── ABA SERVIÇOS ──────────────────────────────────── */}
          <TabsContent value="servicos" className="space-y-3">
            <div className="flex justify-end">
              <Dialog open={openServ} onOpenChange={(o) => { setOpenServ(o); if (!o) { setFormServ({}); setFilesServ([]); } }}>
                <DialogTrigger asChild>
                  <Button><Plus className="mr-2 h-4 w-4" />Novo lançamento</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Novo serviço</DialogTitle></DialogHeader>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {params.length > 0 && (
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label>Parâmetro de serviço</Label>
                        <Select value={formServ.parametro_id ?? ""} onValueChange={selectParamServ}>
                          <SelectTrigger><SelectValue placeholder="Opcional — preenche custo, valor e tipo" /></SelectTrigger>
                          <SelectContent>
                            {paramsForImovel(formServ.imovel_id).map((p) => (
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
                    <div className="space-y-1.5">
                      <Label>Tipo *</Label>
                      <Select value={formServ.tipo ?? ""} onValueChange={(v) => onTipoOrImovel(v, formServ.imovel_id)}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>{TIPOS_SERVICO.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Data *</Label>
                      <Input type="date" value={formServ.data ?? ""} onChange={(e) => setFormServ({ ...formServ, data: e.target.value })} />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label>Imóvel *</Label>
                      <Select value={formServ.imovel_id ?? ""} onValueChange={(v) => onTipoOrImovel(formServ.tipo, v)}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>{imoveis.map((i) => <SelectItem key={i.id} value={i.id}>{i.codigo}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Custo real</Label>
                      <Input type="number" step="0.01" value={formServ.custo_real ?? ""} onChange={(e) => setFormServ({ ...formServ, custo_real: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Valor cobrado</Label>
                      <Input type="number" step="0.01" value={formServ.valor_cobrado ?? ""} onChange={(e) => setFormServ({ ...formServ, valor_cobrado: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Área</Label>
                      <Select value={formServ.area ?? ""} onValueChange={(v) => setFormServ({ ...formServ, area: v })}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>{AREAS.map((a) => <SelectItem key={a} value={a}>{AREA_LABELS[a]}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label>Prestador</Label>
                      <Input value={formServ.prestador ?? ""} onChange={(e) => setFormServ({ ...formServ, prestador: e.target.value })} />
                    </div>
                    {(() => {
                      const p = params.find((x) => x.id === formServ.parametro_id);
                      if (!p) return null;
                      const cReal = Number(formServ.custo_real ?? 0);
                      const vReal = Number(formServ.valor_cobrado ?? 0);
                      const cParam = Number(p.custo ?? 0);
                      const vParam = Number(p.valor_cobrado ?? 0);
                      const dCusto = cParam > 0 ? Math.abs(cReal - cParam) / cParam : 0;
                      const dValor = vParam > 0 ? Math.abs(vReal - vParam) / vParam : 0;
                      if (dCusto < 0.1 && dValor < 0.1) return null;
                      return (
                        <div className="sm:col-span-2 rounded-md border border-yellow-500/50 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-700 dark:text-yellow-400">
                          ⚠️ Divergência vs parâmetro <strong>{p.nome}</strong>:
                          {dCusto >= 0.1 && <> custo {cReal > cParam ? "+" : "−"}{(dCusto * 100).toFixed(0)}% (esperado {brl(cParam)}).</>}
                          {dValor >= 0.1 && <> Valor {vReal > vParam ? "+" : "−"}{(dValor * 100).toFixed(0)}% (esperado {brl(vParam)}).</>}
                        </div>
                      );
                    })()}
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label>Anexos</Label>
                      <FileSelector files={filesServ} onChange={setFilesServ} inputRef={fileInputServRef} />
                    </div>
                  </div>
                  <DialogFooter><Button onClick={saveServ}>Salvar</Button></DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="shadow-card"><CardContent className="overflow-x-auto p-0">
              <Table className="min-w-[820px]">
                <TableHeader><TableRow>
                  <TableHead>Data</TableHead><TableHead>Imóvel</TableHead><TableHead>Tipo</TableHead>
                  <TableHead>Área</TableHead>
                  <TableHead>Prestador</TableHead><TableHead>Custo</TableHead><TableHead>Cobrado</TableHead>
                  <TableHead>Margem</TableHead><TableHead>Anexos</TableHead><TableHead></TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {listServ.length === 0 && (
                    <TableRow><TableCell colSpan={10} className="text-center text-muted-foreground py-8">Sem lançamentos.</TableCell></TableRow>
                  )}
                  {listServ.map((s) => {
                    const anexos = getAnexos(s);
                    return (
                      <TableRow key={s.id}>
                        <TableCell>{dateBR(s.data)}</TableCell>
                        <TableCell className="font-medium">{s.imoveis?.codigo}</TableCell>
                        <TableCell className="capitalize">{s.tipo}</TableCell>
                        <TableCell>{s.area ? AREA_LABELS[s.area] ?? s.area : "—"}</TableCell>
                        <TableCell className="text-muted-foreground">{s.prestador ?? "—"}</TableCell>
                        <TableCell className="num">{brl(s.custo_real)}</TableCell>
                        <TableCell className="num">{brl(s.valor_cobrado)}</TableCell>
                        <TableCell className="num">{brl(Number(s.valor_cobrado) - Number(s.custo_real))}</TableCell>
                        <TableCell>
                          <Button
                            size="sm" variant="ghost" className="h-7 gap-1 px-2 text-xs"
                            onClick={() => setAnexoCtx({ open: true, tabela: "servicos_operacionais", id: s.id, current: anexos })}
                          >
                            <Paperclip className="h-3.5 w-3.5" />
                            {anexos.length > 0 && <span>{anexos.length}</span>}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button size="icon" variant="ghost" onClick={() => removeServ(s.id)}><Trash2 className="h-4 w-4" /></Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent></Card>
          </TabsContent>

          {/* ── ABA MANUTENÇÕES ───────────────────────────────── */}
          <TabsContent value="manutencoes" className="space-y-3">
            <div className="flex justify-end">
              <Dialog open={openMan} onOpenChange={(o) => { setOpenMan(o); if (!o) { setFormMan({ rateio: "investidor" }); setFilesMan([]); } }}>
                <DialogTrigger asChild>
                  <Button><Plus className="mr-2 h-4 w-4" />Nova manutenção</Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader><DialogTitle>Nova manutenção</DialogTitle></DialogHeader>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label>Imóvel *</Label>
                      <Select value={formMan.imovel_id ?? ""} onValueChange={(v) => setFormMan({ ...formMan, imovel_id: v })}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>{imoveis.map((i) => <SelectItem key={i.id} value={i.id}>{i.codigo}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Data *</Label>
                      <Input type="date" value={formMan.data ?? ""} onChange={(e) => setFormMan({ ...formMan, data: e.target.value })} />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label>Parâmetro de serviço</Label>
                      <Select value={formMan.parametro_id ?? ""} onValueChange={selectParam}>
                        <SelectTrigger><SelectValue placeholder="Opcional — preenche descrição, custo e valor" /></SelectTrigger>
                        <SelectContent>
                          {paramsForImovel(formMan.imovel_id).map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.nome}
                              {p.imoveis?.codigo ? ` · ${p.imoveis.codigo}` : p.categoria ? ` · ${p.categoria}` : ""}
                              {` — ${brl(p.custo)} / ${brl(p.valor_cobrado)}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label>Descrição *</Label>
                      <Input value={formMan.descricao ?? ""} onChange={(e) => setFormMan({ ...formMan, descricao: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Custo</Label>
                      <Input type="number" step="0.01" value={formMan.custo ?? ""} onChange={(e) => setFormMan({ ...formMan, custo: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Valor cobrado</Label>
                      <Input type="number" step="0.01" value={formMan.valor_cobrado ?? ""} onChange={(e) => setFormMan({ ...formMan, valor_cobrado: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Área</Label>
                      <Select value={formMan.area ?? ""} onValueChange={(v) => setFormMan({ ...formMan, area: v })}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>{AREAS.map((a) => <SelectItem key={a} value={a}>{AREA_LABELS[a]}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    {(() => {
                      const p = params.find((x) => x.id === formMan.parametro_id);
                      if (!p) return null;
                      const cReal = Number(formMan.custo ?? 0);
                      const vReal = Number(formMan.valor_cobrado ?? 0);
                      const cParam = Number(p.custo ?? 0);
                      const vParam = Number(p.valor_cobrado ?? 0);
                      const dCusto = cParam > 0 ? Math.abs(cReal - cParam) / cParam : 0;
                      const dValor = vParam > 0 ? Math.abs(vReal - vParam) / vParam : 0;
                      if (dCusto < 0.1 && dValor < 0.1) return null;
                      return (
                        <div className="sm:col-span-2 rounded-md border border-yellow-500/50 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-700 dark:text-yellow-400">
                          ⚠️ Divergência vs parâmetro <strong>{p.nome}</strong>:
                          {dCusto >= 0.1 && <> custo {cReal > cParam ? "+" : "−"}{(dCusto * 100).toFixed(0)}% (esperado {brl(cParam)}).</>}
                          {dValor >= 0.1 && <> Valor {vReal > vParam ? "+" : "−"}{(dValor * 100).toFixed(0)}% (esperado {brl(vParam)}).</>}
                        </div>
                      );
                    })()}
                    <div className="space-y-1.5">
                      <Label>Rateio *</Label>
                      <Select value={formMan.rateio ?? "investidor"} onValueChange={(v) => setFormMan({ ...formMan, rateio: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="investidor">Investidor paga</SelectItem>
                          <SelectItem value="empresa">Empresa absorve</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label>Anexos</Label>
                      <FileSelector files={filesMan} onChange={setFilesMan} inputRef={fileInputManRef} />
                    </div>
                  </div>
                  <DialogFooter><Button onClick={saveMan}>Salvar</Button></DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="shadow-card"><CardContent className="overflow-x-auto p-0">
              <Table className="min-w-[820px]">
                <TableHeader><TableRow>
                  <TableHead>Data</TableHead><TableHead>Imóvel</TableHead><TableHead>Descrição</TableHead>
                  <TableHead>Área</TableHead>
                  <TableHead>Custo</TableHead><TableHead>Cobrado</TableHead><TableHead>Rateio</TableHead>
                  <TableHead>Anexos</TableHead><TableHead></TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {listMan.length === 0 && (
                    <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-8">Sem manutenções no mês.</TableCell></TableRow>
                  )}
                  {listMan.map((m) => {
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
                            onClick={() => setAnexoCtx({ open: true, tabela: "manutencoes", id: m.id, current: anexos })}
                          >
                            <Paperclip className="h-3.5 w-3.5" />
                            {anexos.length > 0 && <span>{anexos.length}</span>}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button size="icon" variant="ghost" onClick={() => removeMan(m.id)}><Trash2 className="h-4 w-4" /></Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent></Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* ── DIALOG: GERENCIAR ANEXOS DE ITEM EXISTENTE ───────── */}
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
