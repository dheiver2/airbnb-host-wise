-- =============================================================
-- AUDITORIA: roda no SQL Editor depois das migrações 20260513*
-- =============================================================
-- Executa como service-role (default no SQL Editor do Supabase Studio).
-- Cada bloco é independente. Resultado esperado descrito acima de cada query.
-- =============================================================

-- ─────────────────────────────────────────────────────────────
-- A. Estrutura: conta_id existe em todas as tabelas que precisam
-- Esperado: 10 linhas (9 tabelas de negócio + user_roles), nenhuma NULL_FOUND
-- ─────────────────────────────────────────────────────────────
SELECT
  c.table_name,
  c.is_nullable,
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.columns c2
     WHERE c2.table_schema = 'public'
       AND c2.table_name = c.table_name
       AND c2.column_name = 'conta_id'
  ) THEN 'OK' ELSE 'MISSING' END AS conta_id_status
FROM information_schema.columns c
WHERE c.table_schema = 'public'
  AND c.column_name = 'conta_id'
ORDER BY c.table_name;

-- Linhas NULL em conta_id (esperado: 0 em todas)
SELECT 'investidores'          AS tabela, COUNT(*) AS nulls FROM public.investidores          WHERE conta_id IS NULL
UNION ALL SELECT 'imoveis',               COUNT(*) FROM public.imoveis               WHERE conta_id IS NULL
UNION ALL SELECT 'reservas',              COUNT(*) FROM public.reservas              WHERE conta_id IS NULL
UNION ALL SELECT 'servicos_operacionais', COUNT(*) FROM public.servicos_operacionais WHERE conta_id IS NULL
UNION ALL SELECT 'manutencoes',           COUNT(*) FROM public.manutencoes           WHERE conta_id IS NULL
UNION ALL SELECT 'adiantamentos',         COUNT(*) FROM public.adiantamentos         WHERE conta_id IS NULL
UNION ALL SELECT 'custos_fixos',          COUNT(*) FROM public.custos_fixos          WHERE conta_id IS NULL
UNION ALL SELECT 'parametros_servico',    COUNT(*) FROM public.parametros_servico    WHERE conta_id IS NULL
UNION ALL SELECT 'importacoes_airbnb',    COUNT(*) FROM public.importacoes_airbnb    WHERE conta_id IS NULL
UNION ALL SELECT 'payouts',               COUNT(*) FROM public.payouts               WHERE conta_id IS NULL
UNION ALL SELECT 'user_roles',            COUNT(*) FROM public.user_roles            WHERE conta_id IS NULL;

-- ─────────────────────────────────────────────────────────────
-- B. Triggers tg_set_conta ativos
-- Esperado: 10 triggers, todos com tgenabled='O' (origin)
-- ─────────────────────────────────────────────────────────────
SELECT
  t.tgrelid::regclass AS tabela,
  t.tgname AS trigger_nome,
  CASE t.tgenabled
    WHEN 'O' THEN 'ENABLED'
    WHEN 'D' THEN 'DISABLED'
    ELSE 'OTHER'
  END AS status
FROM pg_trigger t
WHERE t.tgname = 'tg_set_conta'
ORDER BY t.tgrelid::regclass::text;

-- ─────────────────────────────────────────────────────────────
-- C. RLS habilitada em todas as tabelas-alvo
-- Esperado: rls=true em todas
-- ─────────────────────────────────────────────────────────────
SELECT
  schemaname || '.' || tablename AS tabela,
  rowsecurity AS rls_habilitada
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'investidores','imoveis','reservas','servicos_operacionais',
    'manutencoes','adiantamentos','custos_fixos','parametros_servico',
    'importacoes_airbnb','payouts','user_roles','profiles'
  )
ORDER BY tablename;

-- ─────────────────────────────────────────────────────────────
-- D. Policies ativas — busca por menções a conta_id
-- Esperado: cada tabela-alvo deve ter >= 4 policies citando conta_id
-- (select/insert/update/delete) OU usar user_id/investidor_id (investidor self).
-- ─────────────────────────────────────────────────────────────
SELECT
  schemaname || '.' || tablename AS tabela,
  policyname,
  cmd,
  CASE
    WHEN qual LIKE '%conta_id%' OR with_check LIKE '%conta_id%' THEN 'TENANT-SCOPED'
    WHEN qual LIKE '%user_id = auth.uid%' OR qual LIKE '%investidor_id%' THEN 'SELF-SCOPED'
    ELSE '⚠ GLOBAL'
  END AS escopo
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
    'investidores','imoveis','reservas','servicos_operacionais',
    'manutencoes','adiantamentos','custos_fixos','parametros_servico',
    'importacoes_airbnb','payouts','user_roles','profiles'
  )
ORDER BY tablename, cmd, policyname;

-- ─────────────────────────────────────────────────────────────
-- E. Quem está em cada conta (sanity check de papéis)
-- Esperado: Adolfo admin de si próprio; Julia/Elizana operacional
-- na conta do Adolfo (depois do seed)
-- ─────────────────────────────────────────────────────────────
SELECT
  u.email AS usuario,
  p.nome  AS nome,
  ur.role AS papel,
  a.email AS dono_da_conta
FROM auth.users u
LEFT JOIN public.profiles  p  ON p.id = u.id
LEFT JOIN public.user_roles ur ON ur.user_id = u.id
LEFT JOIN auth.users a        ON a.id = ur.conta_id
ORDER BY u.created_at;

-- ─────────────────────────────────────────────────────────────
-- F. Distribuição de dados por conta
-- Esperado: tudo na conta do Adolfo (1 linha por tabela)
-- ─────────────────────────────────────────────────────────────
WITH contas AS (
  SELECT id AS user_id, email FROM auth.users
)
SELECT 'investidores'          AS tabela, c.email AS conta_dono, COUNT(*) AS total
  FROM public.investidores i JOIN contas c ON c.user_id = i.conta_id
  GROUP BY c.email
UNION ALL SELECT 'imoveis', c.email, COUNT(*)
  FROM public.imoveis x JOIN contas c ON c.user_id = x.conta_id
  GROUP BY c.email
UNION ALL SELECT 'reservas', c.email, COUNT(*)
  FROM public.reservas x JOIN contas c ON c.user_id = x.conta_id
  GROUP BY c.email
UNION ALL SELECT 'servicos_operacionais', c.email, COUNT(*)
  FROM public.servicos_operacionais x JOIN contas c ON c.user_id = x.conta_id
  GROUP BY c.email
UNION ALL SELECT 'manutencoes', c.email, COUNT(*)
  FROM public.manutencoes x JOIN contas c ON c.user_id = x.conta_id
  GROUP BY c.email
UNION ALL SELECT 'adiantamentos', c.email, COUNT(*)
  FROM public.adiantamentos x JOIN contas c ON c.user_id = x.conta_id
  GROUP BY c.email
UNION ALL SELECT 'custos_fixos', c.email, COUNT(*)
  FROM public.custos_fixos x JOIN contas c ON c.user_id = x.conta_id
  GROUP BY c.email
UNION ALL SELECT 'parametros_servico', c.email, COUNT(*)
  FROM public.parametros_servico x JOIN contas c ON c.user_id = x.conta_id
  GROUP BY c.email
UNION ALL SELECT 'payouts', c.email, COUNT(*)
  FROM public.payouts x JOIN contas c ON c.user_id = x.conta_id
  GROUP BY c.email
ORDER BY 1, 2;

-- ─────────────────────────────────────────────────────────────
-- G. Simulação: o que o Adolfo veria
-- (executa o SELECT como o usuário Adolfo, respeitando RLS)
-- ─────────────────────────────────────────────────────────────
DO $$
DECLARE
  v_adolfo uuid;
  v_count_imoveis int;
  v_count_invs int;
  v_count_payouts int;
BEGIN
  SELECT id INTO v_adolfo FROM auth.users WHERE lower(email) = 'adolfocfc@gmail.com';
  IF v_adolfo IS NULL THEN
    RAISE NOTICE '⚠ Adolfo não encontrado — pula simulação';
    RETURN;
  END IF;

  -- Simula sessão do Adolfo
  PERFORM set_config('request.jwt.claim.sub', v_adolfo::text, true);
  PERFORM set_config('role', 'authenticated', true);

  SELECT COUNT(*) INTO v_count_imoveis  FROM public.imoveis;
  SELECT COUNT(*) INTO v_count_invs     FROM public.investidores;
  SELECT COUNT(*) INTO v_count_payouts  FROM public.payouts;

  RAISE NOTICE 'Adolfo vê: imoveis=%, investidores=%, payouts=%',
    v_count_imoveis, v_count_invs, v_count_payouts;

  RESET role;
END $$;

-- ─────────────────────────────────────────────────────────────
-- H. Simulação: o que a Julia veria (operacional na conta do Adolfo)
-- ─────────────────────────────────────────────────────────────
DO $$
DECLARE
  v_julia uuid;
  v_count_imoveis int;
  v_count_invs int;
  v_count_custos int;
BEGIN
  SELECT id INTO v_julia FROM auth.users WHERE lower(email) = 'guedescomercial.al@gmail.com';
  IF v_julia IS NULL THEN
    RAISE NOTICE '⚠ Julia não encontrada — rode o seed primeiro';
    RETURN;
  END IF;

  PERFORM set_config('request.jwt.claim.sub', v_julia::text, true);
  PERFORM set_config('role', 'authenticated', true);

  SELECT COUNT(*) INTO v_count_imoveis FROM public.imoveis;
  SELECT COUNT(*) INTO v_count_invs    FROM public.investidores;
  -- Julia NÃO deveria ver custos_fixos (admin-only) — espera 0
  SELECT COUNT(*) INTO v_count_custos  FROM public.custos_fixos;

  RAISE NOTICE 'Julia vê: imoveis=%, investidores=%, custos_fixos=% (esperado custos_fixos=0)',
    v_count_imoveis, v_count_invs, v_count_custos;

  RESET role;
END $$;

-- ─────────────────────────────────────────────────────────────
-- I. Cross-tenant probe: cria uma 2ª conta fictícia e confirma isolamento
-- ─────────────────────────────────────────────────────────────
DO $$
DECLARE
  v_adolfo uuid;
  v_fake_admin uuid := gen_random_uuid();
  v_count int;
BEGIN
  SELECT id INTO v_adolfo FROM auth.users WHERE lower(email) = 'adolfocfc@gmail.com';
  IF v_adolfo IS NULL THEN RETURN; END IF;

  -- Cria um "admin fictício" só em user_roles (sem auth.users, é só pra teste de RLS)
  INSERT INTO public.user_roles (user_id, role, conta_id) VALUES (v_fake_admin, 'admin', v_fake_admin)
  ON CONFLICT DO NOTHING;

  PERFORM set_config('request.jwt.claim.sub', v_fake_admin::text, true);
  PERFORM set_config('role', 'authenticated', true);

  -- Como admin fictício de outra conta, NÃO deveria ver imóveis do Adolfo
  SELECT COUNT(*) INTO v_count FROM public.imoveis;
  RAISE NOTICE 'Admin fictício vê % imóveis (ESPERADO: 0)', v_count;

  RESET role;

  -- Limpa
  DELETE FROM public.user_roles WHERE user_id = v_fake_admin;
END $$;

-- ─────────────────────────────────────────────────────────────
-- J. Storage anexos — confirma estado atual (NÃO corrigido nesta rodada)
-- Esperado: bucket public=true → arquivos acessíveis por URL pública
-- ─────────────────────────────────────────────────────────────
SELECT id, name, public FROM storage.buckets WHERE id = 'anexos';
SELECT policyname, cmd, qual FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname LIKE 'anexos%';
