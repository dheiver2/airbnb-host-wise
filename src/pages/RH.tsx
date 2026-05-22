import { useEffect, useMemo, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Combobox } from "@/components/Combobox";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { brl, dateBR, monthRange } from "@/lib/format";
import { useCompetenciaState } from "@/hooks/useLatestCompetencia";

export default function RH() {
  // ── Pessoas (funcionários) ──
  const [pessoas, setPessoas] = useState<any[]>([]);
  const [openP, setOpenP] = useState(false);
  const [editP, setEditP] = useState<any>(null);
  const [buscaP, setBuscaP] = useState("");

  // ── Folha de pagamento (custos_fixos categoria='folha') ──
  const [mes, setMes] = useCompetenciaState();
  const [folha, setFolha] = useState<any[]>([]);
  const [openF, setOpenF] = useState(false);
  const [formF, setFormF] = useState<any>({});

  useEffect(() => { loadPessoas(); }, []);
  useEffect(() => { loadFolha(); }, [mes]);

  async function loadPessoas() {
    const { data } = await (supabase.from("funcionarios" as any) as any).select("*").order("nome");
    setPessoas(data ?? []);
  }

  async function loadFolha() {
    const { start, end } = monthRange(mes);
    const { data } = await supabase.from("custos_fixos")
      .select("*, funcionarios(nome)")
      .eq("categoria", "folha")
      .gte("mes_competencia", start).lte("mes_competencia", end)
      .order("valor", { ascending: false });
    setFolha(data ?? []);
  }

  // ── Pessoas: CRUD ──
  async function savePessoa() {
    if (!editP?.nome) return toast.error("Nome obrigatório");
    const payload = {
      nome: editP.nome, cargo: editP.cargo || null, telefone: editP.telefone || null,
      email: editP.email || null, documento: editP.documento || null, pix: editP.pix || null,
      data_admissao: editP.data_admissao || null,
      salario_base: Number(editP.salario_base ?? 0),
      ativo: editP.ativo ?? true, observacoes: editP.observacoes || null,
    };
    const res = editP.id
      ? await (supabase.from("funcionarios" as any) as any).update(payload).eq("id", editP.id)
      : await (supabase.from("funcionarios" as any) as any).insert(payload);
    if (res.error) return toast.error(res.error.message);
    toast.success("Salvo!"); setOpenP(false); setEditP(null); loadPessoas();
  }

  async function removePessoa(id: string) {
    if (!confirm("Excluir funcionário?")) return;
    await (supabase.from("funcionarios" as any) as any).delete().eq("id", id);
    loadPessoas();
  }

  // ── Folha: lançamento ──
  async function saveFolha() {
    if (!formF.valor) return toast.error("Valor obrigatório");
    const competencia = `${mes}-01`;
    const func = pessoas.find((p) => p.id === formF.funcionario_id);
    const { error } = await (supabase.from("custos_fixos" as any) as any).insert({
      mes_competencia: competencia, categoria: "folha",
      descricao: formF.descricao || (func ? `Folha — ${func.nome}` : "Folha de pagamento"),
      valor: Number(formF.valor), funcionario_id: formF.funcionario_id || null,
    });
    if (error) return toast.error(error.message);
    toast.success("Folha lançada"); setOpenF(false); setFormF({}); loadFolha();
  }

  async function removeFolha(id: string) {
    if (!confirm("Excluir lançamento de folha?")) return;
    await supabase.from("custos_fixos").delete().eq("id", id);
    loadFolha();
  }

  function lancarSalarioBase(p: any) {
    setFormF({ funcionario_id: p.id, valor: p.salario_base, descricao: `Folha — ${p.nome}` });
    setOpenF(true);
  }

  const pessoasF = useMemo(() => {
    const b = buscaP.toLowerCase();
    return pessoas.filter((p) =>
      (p.nome ?? "").toLowerCase().includes(b) ||
      (p.cargo ?? "").toLowerCase().includes(b));
  }, [pessoas, buscaP]);

  const totalFolha = folha.reduce((s, f) => s + Number(f.valor || 0), 0);
  const ativos = pessoas.filter((p) => p.ativo).length;
  const custoFolhaPrevisto = pessoas.filter((p) => p.ativo).reduce((s, p) => s + Number(p.salario_base || 0), 0);

  return (
    <>
      <PageHeader
        title="RH"
        description="Cadastro de pessoas e folha de pagamento."
      />
      <div className="p-6 space-y-4">
        <Tabs defaultValue="pessoas">
          <TabsList>
            <TabsTrigger value="pessoas">Pessoas</TabsTrigger>
            <TabsTrigger value="folha">Folha de Pagamento</TabsTrigger>
          </TabsList>

          {/* ── ABA PESSOAS ──────────────────────────────────── */}
          <TabsContent value="pessoas" className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-3">
              <Card className="shadow-card"><CardContent className="p-4">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Funcionários</div>
                <div className="num mt-1 text-xl font-semibold">{pessoas.length}</div>
              </CardContent></Card>
              <Card className="shadow-card"><CardContent className="p-4">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Ativos</div>
                <div className="num mt-1 text-xl font-semibold text-success">{ativos}</div>
              </CardContent></Card>
              <Card className="shadow-card"><CardContent className="p-4">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Folha prevista (salário base)</div>
                <div className="num mt-1 text-xl font-semibold">{brl(custoFolhaPrevisto)}</div>
              </CardContent></Card>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <Input placeholder="Buscar nome ou cargo..." value={buscaP}
                onChange={(e) => setBuscaP(e.target.value)} className="max-w-sm" />
              <Dialog open={openP} onOpenChange={(o) => { setOpenP(o); if (!o) setEditP(null); }}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditP({ ativo: true })}><Plus className="mr-2 h-4 w-4" />Novo funcionário</Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader><DialogTitle>{editP?.id ? "Editar" : "Novo"} funcionário</DialogTitle></DialogHeader>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5 sm:col-span-2"><Label>Nome *</Label>
                      <Input value={editP?.nome ?? ""} onChange={(e) => setEditP({ ...editP, nome: e.target.value })} /></div>
                    <div className="space-y-1.5"><Label>Cargo</Label>
                      <Input value={editP?.cargo ?? ""} onChange={(e) => setEditP({ ...editP, cargo: e.target.value })} /></div>
                    <div className="space-y-1.5"><Label>Salário base</Label>
                      <Input type="number" step="0.01" value={editP?.salario_base ?? ""} onChange={(e) => setEditP({ ...editP, salario_base: e.target.value })} /></div>
                    <div className="space-y-1.5"><Label>Telefone</Label>
                      <Input value={editP?.telefone ?? ""} onChange={(e) => setEditP({ ...editP, telefone: e.target.value })} /></div>
                    <div className="space-y-1.5"><Label>Email</Label>
                      <Input type="email" value={editP?.email ?? ""} onChange={(e) => setEditP({ ...editP, email: e.target.value })} /></div>
                    <div className="space-y-1.5"><Label>CPF / Documento</Label>
                      <Input value={editP?.documento ?? ""} onChange={(e) => setEditP({ ...editP, documento: e.target.value })} /></div>
                    <div className="space-y-1.5"><Label>PIX</Label>
                      <Input value={editP?.pix ?? ""} onChange={(e) => setEditP({ ...editP, pix: e.target.value })} /></div>
                    <div className="space-y-1.5"><Label>Data de admissão</Label>
                      <Input type="date" value={editP?.data_admissao ?? ""} onChange={(e) => setEditP({ ...editP, data_admissao: e.target.value })} /></div>
                    <div className="space-y-1.5">
                      <Label>Status</Label>
                      <Combobox
                        options={[{ value: "true", label: "Ativo" }, { value: "false", label: "Inativo" }]}
                        value={String(editP?.ativo ?? true)}
                        onChange={(v) => setEditP({ ...editP, ativo: v === "true" })}
                        placeholder="Status"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2"><Label>Observações</Label>
                      <Input value={editP?.observacoes ?? ""} onChange={(e) => setEditP({ ...editP, observacoes: e.target.value })} /></div>
                  </div>
                  <DialogFooter><Button onClick={savePessoa}>Salvar</Button></DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="shadow-card"><CardContent className="overflow-x-auto p-0">
              <Table className="min-w-[820px]">
                <TableHeader><TableRow>
                  <TableHead>Nome</TableHead><TableHead>Cargo</TableHead><TableHead>Contato</TableHead>
                  <TableHead>Admissão</TableHead><TableHead>Salário base</TableHead>
                  <TableHead>Status</TableHead><TableHead className="w-[130px]"></TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {pessoasF.length === 0 && (
                    <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Nenhum funcionário cadastrado.</TableCell></TableRow>
                  )}
                  {pessoasF.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.nome}</TableCell>
                      <TableCell>{p.cargo ?? "—"}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">{p.telefone}<br />{p.email}</TableCell>
                      <TableCell className="text-muted-foreground">{p.data_admissao ? dateBR(p.data_admissao) : "—"}</TableCell>
                      <TableCell className="num">{brl(p.salario_base)}</TableCell>
                      <TableCell><Badge variant={p.ativo ? "default" : "secondary"}>{p.ativo ? "ativo" : "inativo"}</Badge></TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => lancarSalarioBase(p)}>
                            Lançar folha
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => { setEditP(p); setOpenP(true); }}><Pencil className="h-4 w-4" /></Button>
                          <Button size="icon" variant="ghost" onClick={() => removePessoa(p.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent></Card>
          </TabsContent>

          {/* ── ABA FOLHA DE PAGAMENTO ───────────────────────── */}
          <TabsContent value="folha" className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm text-muted-foreground">
                Total da folha no mês: <span className="num font-semibold text-foreground">{brl(totalFolha)}</span>
                {" · "}{folha.length} lançamento(s)
              </div>
              <div className="flex items-center gap-2">
                <MonthPicker value={mes} onChange={setMes} />
                <Dialog open={openF} onOpenChange={(o) => { setOpenF(o); if (!o) setFormF({}); }}>
                  <DialogTrigger asChild>
                    <Button><Plus className="mr-2 h-4 w-4" />Lançar folha</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Lançar folha de pagamento</DialogTitle></DialogHeader>
                    <div className="grid gap-3">
                      <div className="space-y-1.5">
                        <Label>Funcionário</Label>
                        <Combobox
                          options={pessoas.map((p) => ({ value: p.id, label: p.nome, hint: p.cargo }))}
                          value={formF.funcionario_id ?? ""}
                          onChange={(v) => {
                            const p = pessoas.find((x) => x.id === v);
                            setFormF({ ...formF, funcionario_id: v, valor: formF.valor || p?.salario_base });
                          }}
                          placeholder="Opcional — selecione o funcionário"
                          searchPlaceholder="Buscar funcionário..." clearable
                        />
                      </div>
                      <div className="space-y-1.5"><Label>Valor *</Label>
                        <Input type="number" step="0.01" value={formF.valor ?? ""} onChange={(e) => setFormF({ ...formF, valor: e.target.value })} /></div>
                      <div className="space-y-1.5"><Label>Descrição</Label>
                        <Input value={formF.descricao ?? ""} onChange={(e) => setFormF({ ...formF, descricao: e.target.value })}
                          placeholder="Ex: Salário, 13º, férias, bônus..." /></div>
                    </div>
                    <DialogFooter><Button onClick={saveFolha}>Salvar</Button></DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <Card className="shadow-card"><CardContent className="overflow-x-auto p-0">
              <Table className="min-w-[640px]">
                <TableHeader><TableRow>
                  <TableHead>Funcionário</TableHead><TableHead>Descrição</TableHead>
                  <TableHead>Valor</TableHead><TableHead></TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {folha.length === 0 && (
                    <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">Sem folha lançada no mês.</TableCell></TableRow>
                  )}
                  {folha.map((f) => (
                    <TableRow key={f.id}>
                      <TableCell className="font-medium">{f.funcionarios?.nome ?? <span className="text-muted-foreground">— sem vínculo</span>}</TableCell>
                      <TableCell className="text-muted-foreground">{f.descricao ?? "—"}</TableCell>
                      <TableCell className="num">{brl(f.valor)}</TableCell>
                      <TableCell><Button size="icon" variant="ghost" onClick={() => removeFolha(f.id)}><Trash2 className="h-4 w-4" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent></Card>
            <p className="text-xs text-muted-foreground">
              A folha é gravada em <code>custos_fixos</code> (categoria "folha") — entra automaticamente no Custo Total do DRE SA7D.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
