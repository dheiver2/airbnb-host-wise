import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, Building2, Calculator, LineChart, ShieldCheck, Sparkles, Wallet, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import heroImg from "@/assets/landing-hero.jpg";

const features = [
  { icon: Building2, title: "Imóveis & Investidores", desc: "Cadastre propriedades, sócios e participações com regras flexíveis de rateio." },
  { icon: BarChart3, title: "Hospedagens consolidadas", desc: "Importe extratos do Airbnb e veja receita líquida, ocupação e diária média." },
  { icon: Wrench, title: "Custos & Manutenções", desc: "Controle despesas operacionais e obras por imóvel, com competência mensal." },
  { icon: Wallet, title: "Adiantamentos", desc: "Registre repasses parciais e concilie com o resultado do mês automaticamente." },
  { icon: Calculator, title: "DRE Investidor & Empresa", desc: "Demonstrativos prontos por cota e da operação, com exportação rápida." },
  { icon: ShieldCheck, title: "Multiusuário seguro", desc: "Autenticação, papéis e isolamento de dados por conta com Lovable Cloud." },
];

const stats = [
  { v: "100%", l: "dos repasses rastreados" },
  { v: "1 clique", l: "para importar Airbnb" },
  { v: "DRE", l: "pronto todo mês" },
];

export default function Landing() {
  const { user } = useAuth();
  const ctaTo = user ? "/dashboard" : "/auth";

  return (
    <div className="min-h-screen bg-gradient-subtle text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border/60">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-brand shadow-brand grid place-items-center">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold tracking-tight">SA7D Hosts</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Recursos</a>
            <a href="#how" className="hover:text-foreground transition-colors">Como funciona</a>
            <a href="#stats" className="hover:text-foreground transition-colors">Resultados</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link to="/auth">Entrar</Link>
            </Button>
            <Button asChild size="sm" className="bg-gradient-brand text-primary-foreground shadow-brand hover:opacity-95">
              <Link to={ctaTo}>Começar agora <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-brand" /> Gestão financeira para anfitriões Airbnb
            </span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
              Sua operação Airbnb,{" "}
              <span className="text-gradient-brand">com clareza absoluta</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              Centralize hospedagens, custos, manutenções e adiantamentos. Gere DREs por investidor e
              pela empresa em segundos — sem planilha, sem retrabalho.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="bg-gradient-brand text-primary-foreground shadow-brand hover:opacity-95">
                <Link to={ctaTo}>Acessar plataforma <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#features">Ver recursos</a>
              </Button>
            </div>
            <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-success" /> Dados isolados por conta</div>
              <div className="hidden sm:flex items-center gap-2"><LineChart className="h-4 w-4 text-brand" /> Relatórios em tempo real</div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-brand opacity-20 blur-3xl rounded-full" aria-hidden />
            <div className="relative rounded-2xl overflow-hidden border border-border shadow-elevated">
              <img
                src={heroImg}
                alt="Apartamento de hospedagem com luz de fim de tarde"
                width={1600}
                height={1200}
                className="w-full h-auto object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-background/85 backdrop-blur p-4 border border-border">
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <div className="text-muted-foreground">Receita líquida · Abr/26</div>
                    <div className="text-xl font-semibold">R$ 184.320</div>
                  </div>
                  <div className="text-right">
                    <div className="text-muted-foreground">Ocupação</div>
                    <div className="text-xl font-semibold text-success">87%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="border-y border-border bg-card/40">
        <div className="container mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {stats.map((s) => (
            <div key={s.l} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gradient-brand">{s.v}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Tudo o que sua operação precisa</h2>
          <p className="mt-3 text-muted-foreground">Desenhado para anfitriões e administradoras que gerenciam múltiplos imóveis e investidores.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="group rounded-2xl border border-border bg-card p-6 shadow-card hover:shadow-elevated hover:-translate-y-0.5 transition-all">
              <div className="h-10 w-10 rounded-lg bg-gradient-brand grid place-items-center shadow-brand mb-4">
                <Icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How */}
      <section id="how" className="bg-card/40 border-t border-border">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Em 3 passos você está no controle</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { n: "01", t: "Cadastre imóveis e investidores", d: "Defina cotas, taxas e regras de rateio uma única vez." },
              { n: "02", t: "Importe hospedagens e lance custos", d: "Suba o extrato do Airbnb e registre despesas e manutenções." },
              { n: "03", t: "Gere DRE e repasses", d: "Resultado por imóvel, investidor e empresa — pronto para enviar." },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl border border-border bg-background p-6">
                <div className="text-sm font-mono text-brand">{s.n}</div>
                <div className="mt-2 font-semibold text-lg">{s.t}</div>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-brand p-10 md:p-16 text-center shadow-elevated">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,white,transparent_40%)]" aria-hidden />
          <h2 className="relative text-3xl md:text-5xl font-bold text-primary-foreground tracking-tight">
            Pronto para fechar o mês em minutos?
          </h2>
          <p className="relative mt-4 text-primary-foreground/90 max-w-xl mx-auto">
            Comece agora — leva menos de 2 minutos para cadastrar seu primeiro imóvel.
          </p>
          <div className="relative mt-8">
            <Button asChild size="lg" variant="secondary" className="shadow-elevated">
              <Link to={ctaTo}>Acessar plataforma <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-gradient-brand grid place-items-center">
              <Sparkles className="h-3 w-3 text-primary-foreground" />
            </div>
            <span>SA7D Hosts © {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/auth" className="hover:text-foreground">Entrar</Link>
            <a href="#features" className="hover:text-foreground">Recursos</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
