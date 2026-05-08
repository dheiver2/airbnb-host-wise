import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, type AppRole } from "@/hooks/useAuth";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, MailPlus, RefreshCw, ShieldCheck, UserMinus, UserPlus } from "lucide-react";
import { toast } from "sonner";

type ProfileRow = {
  id: string;
  email: string | null;
  nome: string | null;
  created_at: string;
};
type RoleRow = { user_id: string; role: AppRole };
type Member = ProfileRow & { roles: AppRole[] };

const ALL_ROLES: AppRole[] = ["admin", "operacional", "investidor"];

const roleLabel: Record<AppRole, string> = {
  admin: "Admin",
  operacional: "Operacional",
  investidor: "Investidor",
};
const roleBadge: Record<AppRole, "default" | "secondary" | "outline"> = {
  admin: "default",
  operacional: "secondary",
  investidor: "outline",
};

export default function Equipe() {
  const { user: currentUser } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  // dialog "Adicionar papel"
  const [addOpen, setAddOpen] = useState<string | null>(null);
  const [addRole, setAddRole] = useState<AppRole>("operacional");

  // dialog "Convidar usuário"
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteBusy, setInviteBusy] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteNome, setInviteNome] = useState("");
  const [inviteRole, setInviteRole] = useState<AppRole>("operacional");
  const [invDocumento, setInvDocumento] = useState("");
  const [invTelefone, setInvTelefone] = useState("");
  const [invPix, setInvPix] = useState("");

  const resetInvite = () => {
    setInviteEmail("");
    setInviteNome("");
    setInviteRole("operacional");
    setInvDocumento("");
    setInvTelefone("");
    setInvPix("");
  };

  const submitInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteBusy(true);
    const payload = {
      email: inviteEmail.trim().toLowerCase(),
      nome: inviteNome.trim() || undefined,
      role: inviteRole,
      investidor:
        inviteRole === "investidor"
          ? {
              documento: invDocumento.trim() || undefined,
              telefone: invTelefone.trim() || undefined,
              pix: invPix.trim() || undefined,
            }
          : undefined,
    };
    const { data, error } = await supabase.functions.invoke("invite-user", {
      body: payload,
    });
    setInviteBusy(false);
    if (error) {
      toast.error(`Falha ao convidar: ${error.message ?? error}`);
      return;
    }
    if (data?.warning) {
      toast.warning(`Convite criado, mas: ${data.warning}`);
    } else {
      toast.success(
        `Convite enviado para ${payload.email}. O usuário receberá um email para definir a senha.`,
      );
    }
    setInviteOpen(false);
    resetInvite();
    load();
  };

  const load = async () => {
    setLoading(true);
    const { data: profiles, error: pErr } = await supabase
      .from("profiles")
      .select("id, email, nome, created_at")
      .order("created_at", { ascending: false });
    if (pErr) { toast.error(`Erro ao carregar perfis: ${pErr.message}`); setLoading(false); return; }

    const { data: rolesRows, error: rErr } = await supabase
      .from("user_roles")
      .select("user_id, role");
    if (rErr) { toast.error(`Erro ao carregar papéis: ${rErr.message}`); setLoading(false); return; }

    const rolesByUser = new Map<string, AppRole[]>();
    (rolesRows ?? []).forEach((r) => {
      const arr = rolesByUser.get((r as RoleRow).user_id) ?? [];
      arr.push((r as RoleRow).role);
      rolesByUser.set((r as RoleRow).user_id, arr);
    });

    setMembers(
      (profiles ?? []).map((p) => ({
        ...(p as ProfileRow),
        roles: rolesByUser.get((p as ProfileRow).id) ?? [],
      })),
    );
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addRoleToUser = async (userId: string, role: AppRole) => {
    setBusy(userId);
    const { error } = await supabase
      .from("user_roles")
      .insert({ user_id: userId, role });
    setBusy(null);
    if (error) {
      if (error.code === "23505") toast.warning("Este papel já está atribuído.");
      else toast.error(`Falha ao atribuir papel: ${error.message}`);
      return;
    }
    toast.success(`Papel "${roleLabel[role]}" atribuído.`);
    setAddOpen(null);
    load();
  };

  const removeRoleFromUser = async (userId: string, role: AppRole) => {
    // proteção: não permitir remover o próprio admin
    if (currentUser?.id === userId && role === "admin") {
      const onlyAdmin = members.filter((m) => m.roles.includes("admin")).length <= 1;
      if (onlyAdmin) {
        toast.error("Não é possível remover o único admin do sistema.");
        return;
      }
    }
    setBusy(userId);
    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId)
      .eq("role", role);
    setBusy(null);
    if (error) { toast.error(`Falha ao remover papel: ${error.message}`); return; }
    toast.success(`Papel "${roleLabel[role]}" removido.`);
    load();
  };

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Equipe"
        description="Convide colaboradores e investidores; gerencie os papéis. O usuário convidado recebe um email para definir a senha."
        actions={
          <div className="flex flex-wrap gap-2">
            <Dialog
              open={inviteOpen}
              onOpenChange={(o) => {
                setInviteOpen(o);
                if (!o) resetInvite();
              }}
            >
              <DialogTrigger asChild>
                <Button size="sm" className="bg-gradient-brand text-primary-foreground shadow-brand hover:opacity-95">
                  <MailPlus className="mr-2 h-4 w-4" />
                  Convidar usuário
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Convidar novo usuário</DialogTitle>
                  <DialogDescription>
                    Crie a conta diretamente. O usuário receberá um email para definir a senha.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={submitInvite} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="inv-email">Email *</Label>
                      <Input
                        id="inv-email"
                        type="email"
                        required
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="pessoa@exemplo.com"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="inv-nome">Nome</Label>
                      <Input
                        id="inv-nome"
                        value={inviteNome}
                        onChange={(e) => setInviteNome(e.target.value)}
                        placeholder="Nome completo"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label>Papel *</Label>
                      <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as AppRole)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="operacional">Operacional (colaborador)</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="investidor">Investidor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {inviteRole === "investidor" && (
                      <>
                        <div className="space-y-1.5">
                          <Label htmlFor="inv-doc">Documento</Label>
                          <Input
                            id="inv-doc"
                            value={invDocumento}
                            onChange={(e) => setInvDocumento(e.target.value)}
                            placeholder="CPF/CNPJ"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="inv-tel">Telefone</Label>
                          <Input
                            id="inv-tel"
                            value={invTelefone}
                            onChange={(e) => setInvTelefone(e.target.value)}
                            placeholder="(11) 99999-0000"
                          />
                        </div>
                        <div className="space-y-1.5 sm:col-span-2">
                          <Label htmlFor="inv-pix">PIX</Label>
                          <Input
                            id="inv-pix"
                            value={invPix}
                            onChange={(e) => setInvPix(e.target.value)}
                            placeholder="Chave PIX para repasses"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setInviteOpen(false)}
                      disabled={inviteBusy}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={inviteBusy}>
                      {inviteBusy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Enviar convite
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Button variant="outline" size="sm" onClick={load} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
          </div>
        }
      />

      <div className="p-4 sm:p-6">
        <div className="rounded-xl border border-border bg-card shadow-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Papéis</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                  </TableCell>
                </TableRow>
              )}
              {!loading && members.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                    Nenhum usuário cadastrado ainda.
                  </TableCell>
                </TableRow>
              )}
              {members.map((m) => {
                const availableRoles = ALL_ROLES.filter((r) => !m.roles.includes(r));
                const isMe = currentUser?.id === m.id;
                return (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">
                      {m.nome ?? <span className="text-muted-foreground">—</span>}
                      {isMe && <Badge variant="outline" className="ml-2">você</Badge>}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{m.email ?? "—"}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {m.roles.length === 0 && <span className="text-xs text-muted-foreground">sem papel</span>}
                        {m.roles.map((r) => (
                          <Badge key={r} variant={roleBadge[r]} className="gap-1">
                            <ShieldCheck className="h-3 w-3" />
                            {roleLabel[r]}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground num">
                      {new Date(m.created_at).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        {availableRoles.length > 0 && (
                          <Dialog
                            open={addOpen === m.id}
                            onOpenChange={(o) => {
                              setAddOpen(o ? m.id : null);
                              if (o) setAddRole(availableRoles[0]);
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" disabled={busy === m.id}>
                                <UserPlus className="mr-1 h-3 w-3" /> Adicionar papel
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Atribuir papel</DialogTitle>
                                <DialogDescription>
                                  Escolha o papel para <strong>{m.nome ?? m.email}</strong>.
                                </DialogDescription>
                              </DialogHeader>
                              <Select value={addRole} onValueChange={(v) => setAddRole(v as AppRole)}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {availableRoles.map((r) => (
                                    <SelectItem key={r} value={r}>{roleLabel[r]}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setAddOpen(null)}>Cancelar</Button>
                                <Button onClick={() => addRoleToUser(m.id, addRole)} disabled={busy === m.id}>
                                  {busy === m.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                  Atribuir
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}

                        {m.roles.map((r) => (
                          <AlertDialog key={r}>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="ghost" disabled={busy === m.id} className="text-destructive hover:text-destructive">
                                <UserMinus className="mr-1 h-3 w-3" />
                                Remover {roleLabel[r]}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remover papel "{roleLabel[r]}"?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {m.nome ?? m.email} perderá os acessos vinculados a este papel imediatamente.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => removeRoleFromUser(m.id, r)}>
                                  Remover
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 rounded-xl border border-border bg-card/40 p-4 text-sm text-muted-foreground">
          <strong className="text-foreground">Como cadastrar:</strong> use o botão <em>"Convidar usuário"</em> no topo
          desta página. O usuário recebe um email do Supabase com um link para definir a senha e já entra com o papel
          que você escolheu. Para investidores, os dados (documento, telefone, PIX) ficam disponíveis para edição em
          <em> Investidores</em> depois do convite aceito.
        </div>
      </div>
    </div>
  );
}
