import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Building2, Upload, FileText } from "lucide-react";
import { toast } from "sonner";
import { dateBR } from "@/lib/format";
import { lookupCep } from "@/lib/cep";
import { AnexoDownload } from "@/components/AnexoDownload";
import { Link } from "react-router-dom";

const BUCKET = "anexos";

export default function Investidores() {
  const [list, setList] = useState<any[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [docFile, setDocFile] = useState<File | null>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase.from("investidores").select("*").order("nome");
    setList(data ?? []);
    const { data: imv } = await supabase.from("imoveis").select("investidor_id");
    const c: Record<string, number> = {};
    (imv ?? []).forEach((i: any) => { c[i.investidor_id] = (c[i.investidor_id] || 0) + 1; });
    setCounts(c);
  }

  async function onCepBlur(cep: string) {
    const r = await lookupCep(cep);
    if (r) setEditing((e: any) => ({ ...e, endereco: e?.endereco || r.endereco, bairro: e?.bairro || r.bairro, cidade: e?.cidade || r.cidade, estado: e?.estado || r.estado }));
  }

  async function uploadDoc(invId: string): Promise<string | null> {
    if (!docFile) return null;
    const path = `investidores/${invId}/${Date.now()}_${docFile.name}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, docFile);
    if (error) { toast.error(`Falha ao enviar documento: ${error.message}`); return null; }
    return path;
  }

  async function save() {
    if (!editing?.nome) return toast.error("Nome obrigatório");
    const payload: any = {
      nome: editing.nome, documento: editing.documento || null, email: editing.email || null,
      telefone: editing.telefone || null, pix: editing.pix || null,
      status: editing.status ?? "ativo", observacoes: editing.observacoes || null,
      data_nascimento: editing.data_nascimento || null,
      cep: editing.cep || null, endereco: editing.endereco || null, numero: editing.numero || null,
      complemento: editing.complemento || null, bairro: editing.bairro || null,
      cidade: editing.cidade || null, estado: editing.estado || null,
      banco: editing.banco || null, agencia: editing.agencia || null, conta: editing.conta || null,
      tipo_conta: editing.tipo_conta || null, titular_conta: editing.titular_conta || null,
    };
    let res;
    if (editing.id) {
      res = await (supabase.from("investidores") as any).update(payload).eq("id", editing.id).select("id").single();
    } else {
      res = await (supabase.from("investidores") as any).insert(payload).select("id").single();
    }
    if (res.error) return toast.error(res.error.message);
    const invId = res.data?.id ?? editing.id;
    if (docFile && invId) {
      const path = await uploadDoc(invId);
      if (path) await (supabase.from("investidores") as any).update({ documento_url: path }).eq("id", invId);
    }
    toast.success("Salvo!"); setOpen(false); setEditing(null); setDocFile(null); load();
  }

  async function remove(id: string) {
    if (!confirm("Excluir este investidor?")) return;
    const { error } = await supabase.from("investidores").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Excluído"); load(); }
  }

  const filtered = list.filter((i) => i.nome.toLowerCase().includes(search.toLowerCase()) || (i.documento ?? "").includes(search));

  return (
    <>
      <PageHeader
        title="Investidores"
        description="Gerencie os proprietários dos imóveis administrados."
        actions={
          <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setEditing(null); setDocFile(null); } }}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditing({ status: "ativo" })}><Plus className="mr-2 h-4 w-4" />Novo investidor</Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
              <DialogHeader><DialogTitle>{editing?.id ? "Editar" : "Novo"} investidor</DialogTitle></DialogHeader>
              <Tabs defaultValue="dados">
                <TabsList>
                  <TabsTrigger value="dados">Dados</TabsTrigger>
                  <TabsTrigger value="endereco">Endereço</TabsTrigger>
                  <TabsTrigger value="banco">Bancário</TabsTrigger>
                  <TabsTrigger value="doc">Documento</TabsTrigger>
                </TabsList>
                <TabsContent value="dados" className="grid gap-3 sm:grid-cols-2 pt-3">
                  <div className="space-y-1.5 sm:col-span-2"><Label>Nome *</Label><Input value={editing?.nome ?? ""} onChange={(e) => setEditing({ ...editing, nome: e.target.value })} /></div>
                  <div className="space-y-1.5"><Label>CPF / CNPJ</Label><Input value={editing?.documento ?? ""} onChange={(e) => setEditing({ ...editing, documento: e.target.value })} /></div>
                  <div className="space-y-1.5"><Label>Data de nascimento</Label><Input type="date" value={editing?.data_nascimento ?? ""} onChange={(e) => setEditing({ ...editing, data_nascimento: e.target.value })} /></div>
                  <div className="space-y-1.5"><Label>Telefone</Label><Input value={editing?.telefone ?? ""} onChange={(e) => setEditing({ ...editing, telefone: e.target.value })} /></div>
                  <div className="space-y-1.5"><Label>E-mail</Label><Input type="email" value={editing?.email ?? ""} onChange={(e) => setEditing({ ...editing, email: e.target.value })} /></div>
                  <div className="space-y-1.5"><Label>PIX</Label><Input value={editing?.pix ?? ""} onChange={(e) => setEditing({ ...editing, pix: e.target.value })} /></div>
                  <div className="space-y-1.5">
                    <Label>Status</Label>
                    <Select value={editing?.status ?? "ativo"} onValueChange={(v) => setEditing({ ...editing, status: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ativo">Ativo</SelectItem>
                        <SelectItem value="inativo">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
                <TabsContent value="endereco" className="grid gap-3 sm:grid-cols-6 pt-3">
                  <div className="space-y-1.5 sm:col-span-2"><Label>CEP</Label><Input value={editing?.cep ?? ""} onChange={(e) => setEditing({ ...editing, cep: e.target.value })} onBlur={(e) => onCepBlur(e.target.value)} placeholder="00000-000" /></div>
                  <div className="space-y-1.5 sm:col-span-4"><Label>Endereço</Label><Input value={editing?.endereco ?? ""} onChange={(e) => setEditing({ ...editing, endereco: e.target.value })} /></div>
                  <div className="space-y-1.5 sm:col-span-2"><Label>Número</Label><Input value={editing?.numero ?? ""} onChange={(e) => setEditing({ ...editing, numero: e.target.value })} /></div>
                  <div className="space-y-1.5 sm:col-span-4"><Label>Complemento</Label><Input value={editing?.complemento ?? ""} onChange={(e) => setEditing({ ...editing, complemento: e.target.value })} /></div>
                  <div className="space-y-1.5 sm:col-span-2"><Label>Bairro</Label><Input value={editing?.bairro ?? ""} onChange={(e) => setEditing({ ...editing, bairro: e.target.value })} /></div>
                  <div className="space-y-1.5 sm:col-span-3"><Label>Cidade</Label><Input value={editing?.cidade ?? ""} onChange={(e) => setEditing({ ...editing, cidade: e.target.value })} /></div>
                  <div className="space-y-1.5 sm:col-span-1"><Label>UF</Label><Input maxLength={2} value={editing?.estado ?? ""} onChange={(e) => setEditing({ ...editing, estado: e.target.value.toUpperCase() })} /></div>
                </TabsContent>
                <TabsContent value="banco" className="grid gap-3 sm:grid-cols-2 pt-3">
                  <div className="space-y-1.5"><Label>Banco</Label><Input value={editing?.banco ?? ""} onChange={(e) => setEditing({ ...editing, banco: e.target.value })} /></div>
                  <div className="space-y-1.5">
                    <Label>Tipo de conta</Label>
                    <Select value={editing?.tipo_conta ?? ""} onValueChange={(v) => setEditing({ ...editing, tipo_conta: v })}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="corrente">Corrente</SelectItem>
                        <SelectItem value="poupanca">Poupança</SelectItem>
                        <SelectItem value="pagamento">Pagamento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5"><Label>Agência</Label><Input value={editing?.agencia ?? ""} onChange={(e) => setEditing({ ...editing, agencia: e.target.value })} /></div>
                  <div className="space-y-1.5"><Label>Conta</Label><Input value={editing?.conta ?? ""} onChange={(e) => setEditing({ ...editing, conta: e.target.value })} /></div>
                  <div className="space-y-1.5 sm:col-span-2"><Label>Titular da conta</Label><Input value={editing?.titular_conta ?? ""} onChange={(e) => setEditing({ ...editing, titular_conta: e.target.value })} /></div>
                </TabsContent>
                <TabsContent value="doc" className="space-y-3 pt-3">
                  {editing?.documento_url && (
                    <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="flex-1 truncate">Documento atual</span>
                      <AnexoDownload path={editing.documento_url} nome="documento" />
                    </div>
                  )}
                  <div>
                    <Label>{editing?.documento_url ? "Substituir documento (RG, CNH, contrato...)" : "Enviar documento (RG, CNH, contrato...)"}</Label>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Button type="button" variant="outline" size="sm" onClick={() => docInputRef.current?.click()}>
                        <Upload className="mr-2 h-3.5 w-3.5" />Escolher arquivo
                      </Button>
                      {docFile && <span className="text-xs text-muted-foreground truncate">{docFile.name}</span>}
                      <input ref={docInputRef} type="file" className="hidden" onChange={(e) => setDocFile(e.target.files?.[0] ?? null)} />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <DialogFooter><Button onClick={save}>Salvar</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      <div className="space-y-4 p-6">
        <Input placeholder="Buscar por nome ou documento..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
        <Card className="shadow-card">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead><TableHead>Documento</TableHead><TableHead>Contato</TableHead>
                  <TableHead>Imóveis</TableHead><TableHead>Status</TableHead>
                  <TableHead>Cadastro</TableHead><TableHead className="w-[110px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Nenhum investidor cadastrado.</TableCell></TableRow>}
                {filtered.map((i) => {
                  const n = counts[i.id] || 0;
                  return (
                    <TableRow key={i.id}>
                      <TableCell className="font-medium">{i.nome}</TableCell>
                      <TableCell className="text-muted-foreground">{i.documento ?? "—"}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">{i.email}<br />{i.telefone}</TableCell>
                      <TableCell className="num">
                        {n > 0 ? (
                          <Link to={`/imoveis?investidor=${i.id}`} className="inline-flex items-center gap-1 text-primary hover:underline">
                            <Building2 className="h-3.5 w-3.5" />{n}
                          </Link>
                        ) : <span className="text-muted-foreground">0</span>}
                      </TableCell>
                      <TableCell><Badge variant={i.status === "ativo" ? "default" : "secondary"}>{i.status}</Badge></TableCell>
                      <TableCell className="text-muted-foreground">{dateBR(i.created_at)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" onClick={() => { setEditing(i); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                          <Button size="icon" variant="ghost" onClick={() => remove(i.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
