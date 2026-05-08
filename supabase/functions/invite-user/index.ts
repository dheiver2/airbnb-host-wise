// supabase/functions/invite-user/index.ts
//
// Edge Function que permite ao ADMIN convidar um novo usuário com papel
// específico, sem expor a service-role key ao cliente.
//
// Body esperado (JSON):
//   {
//     email:        string  (obrigatório)
//     nome:         string  (opcional, vai pra profiles.nome)
//     role:         "admin" | "operacional" | "investidor"  (obrigatório)
//     investidor?:  {                  // só preencher se role === "investidor"
//       documento?: string,
//       telefone?:  string,
//       pix?:       string,
//     }
//   }
//
// Resposta:
//   200 { ok: true, user_id, investidor_id? }
//   401 { error: "unauthorized" }     – não logado
//   403 { error: "forbidden" }        – logado mas não é admin
//   400 { error: "<motivo>" }         – payload inválido / email duplicado etc.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type Role = "admin" | "operacional" | "investidor";
interface Body {
  email: string;
  nome?: string;
  role: Role;
  investidor?: {
    documento?: string;
    telefone?: string;
    pix?: string;
  };
}

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json(405, { error: "method_not_allowed" });
  }

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
  const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!SUPABASE_URL || !ANON_KEY || !SERVICE_KEY) {
    return json(500, { error: "missing_env" });
  }

  // 1) Identifica e autoriza o chamador
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return json(401, { error: "unauthorized" });

  const callerClient = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: callerData, error: callerErr } =
    await callerClient.auth.getUser();
  if (callerErr || !callerData.user) {
    return json(401, { error: "unauthorized" });
  }
  const callerId = callerData.user.id;

  const adminClient = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: callerRoles, error: rolesErr } = await adminClient
    .from("user_roles")
    .select("role")
    .eq("user_id", callerId);
  if (rolesErr) return json(500, { error: rolesErr.message });
  const isAdmin = (callerRoles ?? []).some((r) => r.role === "admin");
  if (!isAdmin) return json(403, { error: "forbidden" });

  // 2) Valida payload
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return json(400, { error: "invalid_json" });
  }
  const email = (body.email ?? "").trim().toLowerCase();
  const nome = (body.nome ?? "").trim() || null;
  const role = body.role;
  if (!email || !email.includes("@")) {
    return json(400, { error: "email_invalido" });
  }
  if (!["admin", "operacional", "investidor"].includes(role)) {
    return json(400, { error: "role_invalido" });
  }

  // 3) Convida o usuário (cria + envia email com link de definir senha)
  const { data: invited, error: inviteErr } =
    await adminClient.auth.admin.inviteUserByEmail(email, {
      data: nome ? { nome } : undefined,
    });
  if (inviteErr || !invited.user) {
    return json(400, { error: inviteErr?.message ?? "invite_falhou" });
  }
  const newUserId = invited.user.id;

  // 4) Ajusta o papel:
  // O trigger handle_new_user já atribuiu 'operacional' (ou 'admin' se for o
  // 1º usuário do sistema). Reseta e seta o papel desejado.
  await adminClient.from("user_roles").delete().eq("user_id", newUserId);
  const { error: roleErr } = await adminClient
    .from("user_roles")
    .insert({ user_id: newUserId, role });
  if (roleErr) {
    // user já criado, mas falha ao setar papel. Não dá pra fazer rollback do
    // user via service key — devolve aviso para o admin corrigir em /equipe.
    return json(200, {
      ok: true,
      user_id: newUserId,
      warning: `usuario_criado_mas_papel_falhou: ${roleErr.message}`,
    });
  }

  // 5) Se for investidor, garante linha em public.investidores ligada
  let investidorId: string | null = null;
  if (role === "investidor") {
    // Tenta UPDATE primeiro (caso já exista um investidor com este email)
    const { data: existing } = await adminClient
      .from("investidores")
      .select("id, user_id")
      .ilike("email", email)
      .maybeSingle();
    if (existing) {
      investidorId = existing.id as string;
      if (!existing.user_id) {
        await adminClient
          .from("investidores")
          .update({ user_id: newUserId })
          .eq("id", existing.id);
      }
    } else {
      const { data: created, error: createErr } = await adminClient
        .from("investidores")
        .insert({
          nome: nome ?? email.split("@")[0],
          email,
          documento: body.investidor?.documento ?? null,
          telefone: body.investidor?.telefone ?? null,
          pix: body.investidor?.pix ?? null,
          user_id: newUserId,
          status: "ativo",
        })
        .select("id")
        .single();
      if (createErr) {
        return json(200, {
          ok: true,
          user_id: newUserId,
          warning: `usuario_criado_mas_investidor_falhou: ${createErr.message}`,
        });
      }
      investidorId = (created as { id: string }).id;
    }
  }

  return json(200, {
    ok: true,
    user_id: newUserId,
    investidor_id: investidorId,
  });
});
