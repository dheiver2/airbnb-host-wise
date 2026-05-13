-- =============================================================
-- Seed: cria Julia Guedes e Elizana como operacional, sem passar
-- pelo fluxo de convite por email.
--
-- COMO RODAR:
--   Supabase Studio → SQL Editor → cole o conteúdo → Run.
--   Requer permissão de owner/postgres (acesso ao schema auth).
--
-- O QUE ACONTECE:
--   1. Insere em auth.users + auth.identities (login por email/senha).
--   2. Trigger public.handle_new_user dispara e cria:
--        - linha em public.profiles
--        - linha em public.user_roles com role = 'operacional'
--          (já existe pelo menos 1 usuário no sistema → não vira admin)
--   3. Trigger public.link_investidor_to_user também roda — irrelevante
--      aqui porque os emails não estão em public.investidores.
--
-- SENHA TEMPORÁRIA: 'TrocarSenha123!'
--   ⚠ Avise as usuárias para trocar no primeiro login.
--
-- IDEMPOTENTE: se o email já existe, pula sem erro.
-- =============================================================

DO $$
DECLARE
  v_user_id uuid;
  v_password text;
  rec record;
BEGIN
  v_password := crypt('TrocarSenha123!', gen_salt('bf'));

  FOR rec IN (
    SELECT * FROM (VALUES
      ('guedescomercial.al@gmail.com', 'Julia Guedes'),
      ('elizanaa0@gmail.com',          'Elizana')
    ) AS t(email, nome)
  ) LOOP
    IF EXISTS (SELECT 1 FROM auth.users WHERE lower(email) = lower(rec.email)) THEN
      RAISE NOTICE '⚠ Já existe (pulando): %', rec.email;
      CONTINUE;
    END IF;

    v_user_id := gen_random_uuid();

    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      v_user_id,
      'authenticated', 'authenticated',
      lower(rec.email),
      v_password,
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('nome', rec.nome),
      now(), now(),
      '', '', '', ''
    );

    INSERT INTO auth.identities (
      provider_id, user_id, identity_data, provider,
      last_sign_in_at, created_at, updated_at
    ) VALUES (
      v_user_id::text,
      v_user_id,
      jsonb_build_object('sub', v_user_id::text, 'email', lower(rec.email)),
      'email',
      now(), now(), now()
    );

    RAISE NOTICE '✓ Criado: % (id=%, papel=operacional, senha temp=TrocarSenha123!)',
                  rec.email, v_user_id;
  END LOOP;
END $$;

-- Verificação (opcional): rode depois pra confirmar
-- SELECT u.email, p.nome, ur.role, u.created_at
--   FROM auth.users u
--   JOIN public.profiles p   ON p.id = u.id
--   JOIN public.user_roles ur ON ur.user_id = u.id
--  WHERE u.email IN ('guedescomercial.al@gmail.com', 'elizanaa0@gmail.com');
