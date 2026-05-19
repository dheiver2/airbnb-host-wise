"""
Gera mapa mental do projeto SA7D em PNG/SVG via Graphviz.

Requisitos:
    pip install graphviz
    + binário do Graphviz instalado (https://graphviz.org/download/)

Uso:
    python gen_mindmap.py            # gera mindmap.png e mindmap.svg
    python gen_mindmap.py --view     # abre o resultado
"""
import sys
from graphviz import Digraph


def build():
    dot = Digraph("SA7D Mindmap", format="png")
    dot.attr(rankdir="LR", bgcolor="#0f172a", fontname="Helvetica", fontcolor="white")
    dot.attr("node", shape="box", style="rounded,filled", fontname="Helvetica",
             fontcolor="white", color="#334155")
    dot.attr("edge", color="#64748b", fontname="Helvetica", fontsize="10")

    # Raiz
    dot.node("ROOT", "🏠 SA7D\nAirbnb Host Wise",
             fillcolor="#dc2626", fontsize="18", fontcolor="white")

    # Grupos principais
    grupos = {
        "PAPEIS": ("🎭 Papéis", "#7c3aed"),
        "ROTAS": ("🌐 Rotas", "#0891b2"),
        "BANCO": ("💾 Banco Supabase", "#059669"),
        "FLUXO": ("🔄 Fluxo de Dados", "#d97706"),
        "FRONT": ("🛠️ Frontend", "#db2777"),
        "EDGE": ("⚙️ Edge Functions", "#7c2d12"),
        "MIGR": ("📜 Migrations", "#475569"),
        "SEEDS": ("🧪 Seeds/Scripts", "#65a30d"),
    }
    for k, (label, color) in grupos.items():
        dot.node(k, label, fillcolor=color, fontsize="14")
        dot.edge("ROOT", k)

    # Papéis
    papeis = [
        ("admin", "Admin\n(conta = self)", "#a78bfa"),
        ("ope", "Operacional\n(conta = admin)", "#a78bfa"),
        ("inv", "Investidor\n(conta = admin)", "#a78bfa"),
    ]
    for nid, lbl, c in papeis:
        dot.node(nid, lbl, fillcolor=c, fontcolor="#1e1b4b")
        dot.edge("PAPEIS", nid)

    # Rotas
    rotas = {
        "pub": ("/  /auth", "#67e8f9"),
        "stf": ("/operacional\n/imoveis\n/hospedagens\n/servicos (3 abas)\n/adiantamentos\n/importar", "#67e8f9"),
        "adm": ("/dashboard\n/investidores\n/dre/empresa\n/dre/investidor\n/equipe\n/parametros\n/custos", "#67e8f9"),
        "inv2": ("/meu-dre", "#67e8f9"),
    }
    for nid, (lbl, c) in rotas.items():
        dot.node(nid, lbl, fillcolor=c, fontcolor="#083344")
        dot.edge("ROTAS", nid)

    # Banco
    banco = {
        "auth": ("auth.users\nprofiles\nuser_roles", "#6ee7b7"),
        "ent": ("investidores\nimoveis\nparametros_servico", "#6ee7b7"),
        "lanc": ("reservas\npayouts\nadiantamentos\nservicos_operacionais\nmanutencoes\ncustos_fixos", "#6ee7b7"),
        "mt": ("Multi-tenant:\nconta_id em todas\nRLS + trigger auto-fill", "#6ee7b7"),
        "stor": ("Storage anexos\n(privado, signed URLs 60s)", "#6ee7b7"),
    }
    for nid, (lbl, c) in banco.items():
        dot.node(nid, lbl, fillcolor=c, fontcolor="#064e3b")
        dot.edge("BANCO", nid)

    # Categorias de custos_fixos (sub-do banco)
    dot.node("cat", "Categorias custos_fixos:\ngestao, logistica, chat\nescritorio, folha\nmaterial_limpeza\ndiversos, itens_apartamento (🟡)",
             fillcolor="#86efac", fontcolor="#14532d", fontsize="10")
    dot.edge("lanc", "cat")

    # Fluxo
    fluxo = {
        "ent2": ("Entrada:\nImportar CSV Airbnb\nForms operacionais\nForms admin", "#fcd34d"),
        "calc": ("Cálculos DRE:\n• Comissão = % × reservas\n• Faxina = reservas × imovel\n• Lav = reservas × imovel\n• Mat limp = break-even\n• Manut rateio investidor", "#fcd34d"),
        "dree": ("DRE Empresa (SA7D):\nReceita Bruta\n- Custo Total\n= Receita Líquida", "#fcd34d"),
        "drei": ("DRE Investidor:\nFaturamento\n- Comissão\n- Serviços+Manut\n- Adiantamentos\n= Saldo a repassar", "#fcd34d"),
        "dash": ("Dashboard:\nFaturamento = payouts\nLucro = DRE Empresa", "#fcd34d"),
    }
    for nid, (lbl, c) in fluxo.items():
        dot.node(nid, lbl, fillcolor=c, fontcolor="#78350f", fontsize="10")
        dot.edge("FLUXO", nid)

    # Frontend
    front = {
        "stack": ("React + Vite\nshadcn/ui + Tailwind\nReact Router", "#f9a8d4"),
        "comp": ("useAuth (Context)\nAppSidebar (menu)\nAppLayout (gate)\nRequireRole\nAnexoDownload", "#f9a8d4"),
    }
    for nid, (lbl, c) in front.items():
        dot.node(nid, lbl, fillcolor=c, fontcolor="#831843")
        dot.edge("FRONT", nid)

    # Edge
    dot.node("inv_fn", "invite-user:\n1) valida admin\n2) cria auth user\n3) seta role + conta_id\n4) liga investidor por email",
             fillcolor="#fdba74", fontcolor="#7c2d12")
    dot.edge("EDGE", "inv_fn")

    # Migrations
    dot.node("mig_list",
             "20260501204133  base\n20260501215244  RLS\n20260508000000  investidor_link\n20260513000000  multi-tenant\n20260513000001  payouts.conta_id\n20260513000002  storage+bootstrap\n20260513000003  payouts.investidor_id",
             fillcolor="#cbd5e1", fontcolor="#0f172a", fontsize="9")
    dot.edge("MIGR", "mig_list")

    # Seeds
    dot.node("seed_list",
             "seed-operacionais\nseed-plano-contas\nfix-conta-adolfo\naudit-multi-tenant",
             fillcolor="#bef264", fontcolor="#365314")
    dot.edge("SEEDS", "seed_list")

    return dot


if __name__ == "__main__":
    g = build()
    out = g.render("mindmap", cleanup=True, format="png")
    print(f"✓ PNG gerado: {out}")
    g.format = "svg"
    out_svg = g.render("mindmap", cleanup=True, format="svg")
    print(f"✓ SVG gerado: {out_svg}")
    if "--view" in sys.argv:
        g.view("mindmap")
