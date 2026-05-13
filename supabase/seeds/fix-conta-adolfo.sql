-- =============================================================
-- DIAGNÓSTICO + REMEDIAÇÃO: garante que toda a operação está na
-- conta do Adolfo (adolfocfc@gmail.com).
--
-- Causa raiz: o backfill da migração 20260513000000 usou
-- `ORDER BY user_id LIMIT 1` pra escolher o "primeiro admin".
-- Se houver outra linha admin com UUID alfabeticamente menor
-- (ex: usuário de teste), os dados foram pra conta errada e
-- o Adolfo passou a ver 0 imóveis, 0 ocupação etc.
--
-- COMO RODAR: SQL Editor do Supabase Studio → cole → Run.
-- Imprime estado atual no console (Run > Notices) e aplica fix.
-- =============================================================

-- ─────────────────────────────────────────────────────────────
-- BLOCO 1 — DIAGNÓSTICO (mostra a confusão atual)
-- ─────────────────────────────────────────────────────────────
DO $$
DECLARE
  v_adolfo uuid;
  v_minha_conta_adolfo uuid;
  rec record;
BEGIN
  SELECT id INTO v_adolfo
    FROM auth.users
   WHERE lower(email) = 'adolfocfc@gmail.com'
   LIMIT 1;

  IF v_adolfo IS NULL THEN
    RAISE EXCEPTION 'Adolfo (adolfocfc@gmail.com) não encontrado em auth.users';
  END IF;

  RAISE NOTICE '════════ DIAGNÓSTICO ════════';
  RAISE NOTICE 'Adolfo user_id: %', v_adolfo;

  SELECT conta_id INTO v_minha_conta_adolfo
    FROM public.user_roles
   WHERE user_id = v_adolfo
   ORDER BY role
   LIMIT 1;

  RAISE NOTICE 'conta_id atual do Adolfo em user_roles: %', COALESCE(v_minha_conta_adolfo::text, '<NULL>');

  IF v_minha_conta_adolfo IS DISTINCT FROM v_adolfo THEN
    RAISE NOTICE '⚠ Adolfo NÃO é dono de própria conta (esperado: %).', v_adolfo;
  END IF;

  RAISE NOTICE '── Quantos registros em cada conta ──';
  FOR rec IN (
    SELECT 'imoveis' AS tabela, conta_id, COUNT(*) AS n FROM public.imoveis GROUP BY conta_id
    UNION ALL SELECT 'investidores', conta_id, COUNT(*) FROM public.investidores GROUP BY conta_id
    UNION ALL SELECT 'reservas',     conta_id, COUNT(*) FROM public.reservas GROUP BY conta_id
    UNION ALL SELECT 'servicos_operacionais', conta_id, COUNT(*) FROM public.servicos_operacionais GROUP BY conta_id
    UNION ALL SELECT 'manutencoes',  conta_id, COUNT(*) FROM public.manutencoes GROUP BY conta_id
    UNION ALL SELECT 'adiantamentos',conta_id, COUNT(*) FROM public.adiantamentos GROUP BY conta_id
    UNION ALL SELECT 'custos_fixos', conta_id, COUNT(*) FROM public.custos_fixos GROUP BY conta_id
    UNION ALL SELECT 'parametros_servico', conta_id, COUNT(*) FROM public.parametros_servico GROUP BY conta_id
    UNION ALL SELECT 'payouts',      conta_id, COUNT(*) FROM public.payouts GROUP BY conta_id
    UNION ALL SELECT 'importacoes_airbnb', conta_id, COUNT(*) FROM public.importacoes_airbnb GROUP BY conta_id
    ORDER BY 1, 3 DESC
  ) LOOP
    RAISE NOTICE '%: % linhas em conta_id=%', rec.tabela, rec.n, rec.conta_id;
  END LOOP;
END $$;

-- ─────────────────────────────────────────────────────────────
-- BLOCO 2 — REMEDIAÇÃO (move tudo pra conta do Adolfo)
-- ATENÇÃO: assume single-tenant. Se você tem múltiplos admins
-- DE VERDADE com dados próprios, NÃO rode este bloco.
-- ─────────────────────────────────────────────────────────────
DO $$
DECLARE
  v_adolfo uuid;
  v_count_imoveis int;
  v_count_invs int;
BEGIN
  SELECT id INTO v_adolfo
    FROM auth.users
   WHERE lower(email) = 'adolfocfc@gmail.com'
   LIMIT 1;

  IF v_adolfo IS NULL THEN
    RAISE EXCEPTION 'Adolfo não encontrado';
  END IF;

  RAISE NOTICE '════════ APLICANDO FIX ════════';

  -- 1. Garante que Adolfo é dono de própria conta em TODAS as linhas admin dele
  UPDATE public.user_roles SET conta_id = v_adolfo
   WHERE user_id = v_adolfo AND role = 'admin';

  -- 2. Move TODOS os user_roles que NÃO são admin pra conta do Adolfo
  --    (operacionais e investidores existentes — assume que pertencem a ele)
  UPDATE public.user_roles SET conta_id = v_adolfo
   WHERE role IN ('operacional','investidor');

  -- 3. Move TODOS os dados de negócio pra conta do Adolfo
  UPDATE public.investidores          SET conta_id = v_adolfo;
  UPDATE public.imoveis               SET conta_id = v_adolfo;
  UPDATE public.reservas              SET conta_id = v_adolfo;
  UPDATE public.servicos_operacionais SET conta_id = v_adolfo;
  UPDATE public.manutencoes           SET conta_id = v_adolfo;
  UPDATE public.adiantamentos         SET conta_id = v_adolfo;
  UPDATE public.custos_fixos          SET conta_id = v_adolfo;
  UPDATE public.parametros_servico    SET conta_id = v_adolfo;
  UPDATE public.payouts               SET conta_id = v_adolfo;
  UPDATE public.importacoes_airbnb    SET conta_id = v_adolfo;

  -- 4. Verifica
  SELECT COUNT(*) INTO v_count_imoveis FROM public.imoveis WHERE conta_id = v_adolfo;
  SELECT COUNT(*) INTO v_count_invs    FROM public.investidores WHERE conta_id = v_adolfo;

  RAISE NOTICE '✓ Adolfo agora tem % imóveis e % investidores na conta dele',
    v_count_imoveis, v_count_invs;
END $$;

-- ─────────────────────────────────────────────────────────────
-- BLOCO 3 — REMOVE outras linhas admin órfãs (opcional)
-- Se você quer GARANTIR que só Adolfo é admin global,
-- descomente o DELETE abaixo. CUIDADO: ação destrutiva.
-- ─────────────────────────────────────────────────────────────
-- DELETE FROM public.user_roles
--  WHERE role = 'admin'
--    AND user_id <> (SELECT id FROM auth.users WHERE lower(email) = 'adolfocfc@gmail.com');

-- ─────────────────────────────────────────────────────────────
-- BLOCO 4 — CONFIRMAÇÃO FINAL
-- ─────────────────────────────────────────────────────────────
SELECT
  u.email,
  ur.role,
  ur.conta_id,
  a.email AS dono_conta,
  CASE WHEN ur.user_id = ur.conta_id THEN '✓ dono de própria conta' ELSE 'pertence a outra conta' END AS status
FROM public.user_roles ur
JOIN auth.users u ON u.id = ur.user_id
LEFT JOIN auth.users a ON a.id = ur.conta_id
ORDER BY ur.role, u.email;
