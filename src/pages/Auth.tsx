import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import sa7dLogo from "@/assets/sa7d-logo.png";

export default function Auth() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");

  useEffect(() => { if (user) navigate("/dashboard", { replace: true }); }, [user, navigate]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) toast.error(error.message);
    else { toast.success("Bem-vindo!"); navigate("/dashboard", { replace: true }); }
  };

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return toast.error("A senha deve ter no mínimo 8 caracteres.");
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { nome }, emailRedirectTo: `${window.location.origin}/` },
    });
    setLoading(false);
    if (error) toast.error(error.message);
    else { toast.success("Conta criada! Faça login."); }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-subtle px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-2xl bg-gradient-brand shadow-brand">
            <img src={sa7dLogo} alt="SA7D" className="h-16 w-16 object-cover" />
          </div>
          <div>
            <div className="text-2xl font-semibold tracking-wide">SA7D</div>
            <div className="text-xs text-muted-foreground">Gestão financeira de imóveis</div>
          </div>
        </div>

        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle>Acessar plataforma</CardTitle>
            <CardDescription>Entre ou crie sua conta para começar.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Entrar</TabsTrigger>
                <TabsTrigger value="signup">Criar conta</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={signIn} className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="e1">Email</Label>
                    <Input id="e1" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="p1">Senha</Label>
                    <Input id="p1" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  <Button className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Entrar
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={signUp} className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="n2">Nome</Label>
                    <Input id="n2" required value={nome} onChange={(e) => setNome(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="e2">Email</Label>
                    <Input id="e2" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="p2">Senha</Label>
                    <Input id="p2" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
                    <p className="text-xs text-muted-foreground">Mínimo 8 caracteres. O 1º cadastro é Admin.</p>
                  </div>
                  <Button className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Criar conta
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
