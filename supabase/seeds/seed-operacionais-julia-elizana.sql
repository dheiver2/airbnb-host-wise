-- =============================================================
-- Seed: cria Julia Guedes e Elizana como operacional NA CONTA do Adolfo.
-- (Pós multi-tenant: handle_new_user não atribui mais papel automaticamente —
--  é necessário criar a linha em user_roles manualmente com conta_id correto.)
--
-- COMO RODAR:
--   Supabase Studio → SQL Editor → cole o conteúdo → Run.
--   Requer permissão de owner/postgres (acesso ao schema auth).
--
-- O QUE ACONTECE:
--   1. Localiza o user_id do Adolfo (adolfocfc@gmail.com).
--   2. Para cada usuária a criar:
--      a) Insere em auth.users + auth.identities (login por email/senha).
--      b) Trigger public.handle_new_user cria public.profiles (sem papel,
--         porque o sistema já tem usuários).
--      c) Insere manualmente em public.user_roles com role='operacional'
--         e conta_id = Adolfo (vínculo à conta dele).
--
-- SENHA TEMPORÁRIA: 'TrocarSenha123!' — avise para trocarem no 1º login.
-- IDEMPOTENTE: pula emails já existentes em auth.users.
-- =============================================================

DO $$
DECLARE
  v_adolfo_id uuid;
  v_user_id uuid;
  v_password text;
  rec record;
BEGIN
  -- 1) Acha Adolfo (admin dono da conta)
  SELECT id INTO v_adolfo_id
    FROM auth.users
   WHERE lower(email) = 'adolfocfc@gmail.com'
   LIMIT 1;

  IF v_adolfo_id IS NULL THEN
    RAISE EXCEPTION 'Admin Adolfo (adolfocfc@gmail.com) não encontrado em auth.users';
  END IF;

  v_password := crypt('TrocarSenha123!', gen_salt('bf'));

  -- 2) Cria/garante cada operacional
  FOR rec IN (
    SELECT * FROM (VALUES
      ('guedescomercial.al@gmail.com', 'Julia Guedes'),
      ('elizanaa0@gmail.com',          'Elizana')
    ) AS t(email, nome)
  ) LOOP
    -- Se o usuário já existe em auth.users, só ajusta a role (idempotente)
    SELECT id INTO v_user_id
      FROM auth.users
     WHERE lower(email) = lower(rec.email)
     LIMIT 1;

    IF v_user_id IS NOT NULL THEN
      RAISE NOTICE '⚠ Usuário já existe: % (ajustando user_roles)', rec.email;
    ELSE
      -- Cria auth.users + auth.identities
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

      RAISE NOTICE '✓ auth.users criado: % (id=%)', rec.email, v_user_id;
    END IF;

    -- Garante papel 'operacional' na conta do Adolfo (idempotente)
    DELETE FROM public.user_roles WHERE user_id = v_user_id;
    INSERT INTO public.user_roles (user_id, role, conta_id)
    VALUES (v_user_id, 'operacional', v_adolfo_id);

    RAISE NOTICE '✓ % vinculada como operacional à conta do Adolfo', rec.email;
  END LOOP;
END $$;

-- Verificação rápida:
-- SELECT u.email, p.nome, ur.role, ur.conta_id, a.email AS admin_email
--   FROM auth.users u
--   JOIN public.profiles p   ON p.id = u.id
--   JOIN public.user_roles ur ON ur.user_id = u.id
--   JOIN auth.users a        ON a.id = ur.conta_id
--  WHERE u.email IN ('guedescomercial.al@gmail.com', 'elizanaa0@gmail.com');
