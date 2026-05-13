-- =============================================================
-- MULTI-TENANT por "conta"
-- =============================================================
-- Modelo:
--   conta_id = user_id do admin dono da conta.
--   - admin: conta_id = self.user_id (cada admin é dono da própria conta)
--   - operacional/investidor: conta_id = user_id do admin que convidou
--   Tabelas de negócio carregam conta_id; RLS isola por conta.
--
-- Backfill: dados existentes vão para o primeiro admin do sistema.
-- =============================================================

-- ─────────────────────────────────────────────────────────────
-- 1. user_roles ganha conta_id
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.user_roles
  ADD COLUMN IF NOT EXISTS conta_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

DO $$
DECLARE v_first_admin uuid;
BEGIN
  -- Cada admin existente vira dono de própria conta
  UPDATE public.user_roles SET conta_id = user_id
   WHERE role = 'admin' AND conta_id IS NULL;

  -- Pega 1º admin (estabilidade: ordem por created_at se existir, senão por user_id)
  SELECT user_id INTO v_first_admin
    FROM public.user_roles
   WHERE role = 'admin'
   ORDER BY user_id
   LIMIT 1;

  -- Operacionais/investidores existentes vão para a conta do primeiro admin
  IF v_first_admin IS NOT NULL THEN
    UPDATE public.user_roles SET conta_id = v_first_admin
     WHERE conta_id IS NULL;
  END IF;
END $$;

ALTER TABLE public.user_roles ALTER COLUMN conta_id SET NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_roles_conta ON public.user_roles(conta_id);

-- ─────────────────────────────────────────────────────────────
-- 2. Helpers
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION private.minha_conta(_user_id uuid)
RETURNS uuid
LANGUAGE SQL STABLE SECURITY DEFINER
SET search_path = public, private
AS $$
  SELECT conta_id FROM public.user_roles WHERE user_id = _user_id LIMIT 1;
$$;
REVOKE ALL ON FUNCTION private.minha_conta(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.minha_conta(uuid) TO authenticated;

-- ─────────────────────────────────────────────────────────────
-- 3. Adiciona conta_id em todas as tabelas de negócio + backfill
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.investidores          ADD COLUMN IF NOT EXISTS conta_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.imoveis               ADD COLUMN IF NOT EXISTS conta_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.reservas              ADD COLUMN IF NOT EXISTS conta_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.servicos_operacionais ADD COLUMN IF NOT EXISTS conta_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.manutencoes           ADD COLUMN IF NOT EXISTS conta_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.adiantamentos         ADD COLUMN IF NOT EXISTS conta_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.custos_fixos          ADD COLUMN IF NOT EXISTS conta_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.parametros_servico    ADD COLUMN IF NOT EXISTS conta_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.importacoes_airbnb    ADD COLUMN IF NOT EXISTS conta_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

DO $$
DECLARE v_first_admin uuid;
BEGIN
  SELECT user_id INTO v_first_admin
    FROM public.user_roles
   WHERE role = 'admin'
   ORDER BY user_id
   LIMIT 1;

  IF v_first_admin IS NOT NULL THEN
    UPDATE public.investidores          SET conta_id = v_first_admin WHERE conta_id IS NULL;
    UPDATE public.imoveis               SET conta_id = v_first_admin WHERE conta_id IS NULL;
    UPDATE public.reservas              SET conta_id = v_first_admin WHERE conta_id IS NULL;
    UPDATE public.servicos_operacionais SET conta_id = v_first_admin WHERE conta_id IS NULL;
    UPDATE public.manutencoes           SET conta_id = v_first_admin WHERE conta_id IS NULL;
    UPDATE public.adiantamentos         SET conta_id = v_first_admin WHERE conta_id IS NULL;
    UPDATE public.custos_fixos          SET conta_id = v_first_admin WHERE conta_id IS NULL;
    UPDATE public.parametros_servico    SET conta_id = v_first_admin WHERE conta_id IS NULL;
    UPDATE public.importacoes_airbnb    SET conta_id = v_first_admin WHERE conta_id IS NULL;
  END IF;
END $$;

ALTER TABLE public.investidores          ALTER COLUMN conta_id SET NOT NULL;
ALTER TABLE public.imoveis               ALTER COLUMN conta_id SET NOT NULL;
ALTER TABLE public.reservas              ALTER COLUMN conta_id SET NOT NULL;
ALTER TABLE public.servicos_operacionais ALTER COLUMN conta_id SET NOT NULL;
ALTER TABLE public.manutencoes           ALTER COLUMN conta_id SET NOT NULL;
ALTER TABLE public.adiantamentos         ALTER COLUMN conta_id SET NOT NULL;
ALTER TABLE public.custos_fixos          ALTER COLUMN conta_id SET NOT NULL;
ALTER TABLE public.parametros_servico    ALTER COLUMN conta_id SET NOT NULL;
ALTER TABLE public.importacoes_airbnb    ALTER COLUMN conta_id SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_investidores_conta       ON public.investidores(conta_id);
CREATE INDEX IF NOT EXISTS idx_imoveis_conta            ON public.imoveis(conta_id);
CREATE INDEX IF NOT EXISTS idx_reservas_conta           ON public.reservas(conta_id);
CREATE INDEX IF NOT EXISTS idx_servicos_op_conta        ON public.servicos_operacionais(conta_id);
CREATE INDEX IF NOT EXISTS idx_manutencoes_conta        ON public.manutencoes(conta_id);
CREATE INDEX IF NOT EXISTS idx_adiantamentos_conta      ON public.adiantamentos(conta_id);
CREATE INDEX IF NOT EXISTS idx_custos_fixos_conta       ON public.custos_fixos(conta_id);
CREATE INDEX IF NOT EXISTS idx_parametros_servico_conta ON public.parametros_servico(conta_id);
CREATE INDEX IF NOT EXISTS idx_importacoes_conta        ON public.importacoes_airbnb(conta_id);

-- ─────────────────────────────────────────────────────────────
-- 4. imoveis.codigo: única dentro da conta (não global)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.imoveis DROP CONSTRAINT IF EXISTS imoveis_codigo_key;
DROP INDEX IF EXISTS imoveis_codigo_key;
ALTER TABLE public.imoveis ADD CONSTRAINT imoveis_conta_codigo_key UNIQUE (conta_id, codigo);

-- ─────────────────────────────────────────────────────────────
-- 5. Trigger BEFORE INSERT: auto-preenche conta_id da minha conta
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_conta_id()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, private
AS $$
BEGIN
  IF NEW.conta_id IS NULL THEN
    NEW.conta_id := private.minha_conta(auth.uid());
    IF NEW.conta_id IS NULL THEN
      RAISE EXCEPTION 'Usuário sem conta atribuída — não pode inserir em %', TG_TABLE_NAME;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'investidores','imoveis','reservas','servicos_operacionais',
    'manutencoes','adiantamentos','custos_fixos','parametros_servico',
    'importacoes_airbnb',
    -- user_roles também: quando Equipe.tsx adiciona um papel a um usuário existente,
    -- o conta_id deve vir do admin que está atribuindo (auth.uid()).
    -- O invite-user Edge Function passa conta_id explícito, então o trigger não sobrescreve.
    'user_roles'
  ] LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS tg_set_conta ON public.%I', t);
    EXECUTE format('CREATE TRIGGER tg_set_conta BEFORE INSERT ON public.%I FOR EACH ROW EXECUTE FUNCTION public.set_conta_id()', t);
  END LOOP;
END $$;

-- ─────────────────────────────────────────────────────────────
-- 6. RLS: reescreve TODAS as policies de staff com isolamento por conta
-- ─────────────────────────────────────────────────────────────
-- Padrão: tudo passa a exigir conta_id = private.minha_conta(auth.uid()).
-- Mantém os limites de role (admin para deletes/escrita sensível) que já existiam.

-- ADIANTAMENTOS — staff CRUD dentro da conta (delete já liberado para staff em 20260508132501)
DROP POLICY IF EXISTS adiantamentos_staff_delete ON public.adiantamentos;
DROP POLICY IF EXISTS adiantamentos_staff_insert ON public.adiantamentos;
DROP POLICY IF EXISTS adiantamentos_staff_select ON public.adiantamentos;
DROP POLICY IF EXISTS adiantamentos_staff_update ON public.adiantamentos;
CREATE POLICY adiantamentos_staff_delete ON public.adiantamentos FOR DELETE TO authenticated USING (private.is_staff(auth.uid()) AND conta_id = private.minha_conta(auth.uid()));
CREATE POLICY adiantamentos_staff_insert ON public.adiantamentos FOR INSERT TO authenticated WITH CHECK (private.is_staff(auth.uid()) AND conta_id = private.minha_conta(auth.uid()));
CREATE POLICY adiantamentos_staff_select ON public.adiantamentos FOR SELECT TO authenticated USING (private.is_staff(auth.uid()) AND conta_id = private.minha_conta(auth.uid()));
CREATE POLICY adiantamentos_staff_update ON public.adiantamentos FOR UPDATE TO authenticated USING (private.is_staff(auth.uid()) AND conta_id = private.minha_conta(auth.uid())) WITH CHECK (conta_id = private.minha_conta(auth.uid()));

-- CUSTOS_FIXOS — admin only (custo da empresa)
DROP POLICY IF EXISTS custos_fixos_staff_delete ON public.custos_fixos;
DROP POLICY IF EXISTS custos_fixos_staff_insert ON public.custos_fixos;
DROP POLICY IF EXISTS custos_fixos_staff_select ON public.custos_fixos;
DROP POLICY IF EXISTS custos_fixos_staff_update ON public.custos_fixos;
CREATE POLICY custos_fixos_admin_delete ON public.custos_fixos FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role) AND conta_id = private.minha_conta(auth.uid()));
CREATE POLICY custos_fixos_admin_insert ON public.custos_fixos FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role) AND conta_id = private.minha_conta(auth.uid()));
CREATE POLICY custos_fixos_admin_select ON public.custos_fixos FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role) AND conta_id = private.minha_conta(auth.uid()));
CREATE POLICY custos_fixos_admin_update ON public.custos_fixos FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role) AND conta_id = private.minha_conta(auth.uid())) WITH CHECK (conta_id = private.minha_conta(auth.uid()));

-- IMOVEIS — admin escreve, staff lê (UI já limita)
DROP POLICY IF EXISTS imoveis_staff_delete ON public.imoveis;
DROP POLICY IF EXISTS imoveis_staff_insert ON public.imoveis;
DROP POLICY IF EXISTS imoveis_staff_select ON public.imoveis;
DROP POLICY IF EXISTS imoveis_staff_update ON public.imoveis;
CREATE POLICY imoveis_admin_delete ON public.imoveis FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role) AND conta_id = private.minha_conta(auth.uid()));
CREATE POLICY imoveis_admin_insert ON public.imoveis FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role) AND conta_id = private.minha_conta(auth.uid()));
CREATE POLICY imoveis_staff_select ON public.imoveis FOR SELECT TO authenticated USING (private.is_staff(auth.uid()) AND conta_id = private.minha_conta(auth.uid()));
CREATE POLICY imoveis_admin_update ON public.imoveis FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role) AND conta_id = private.minha_conta(auth.uid())) WITH CHECK (conta_id = private.minha_conta(auth.uid()));

-- IMPORTACOES_AIRBNB — staff insere/lê, admin deleta
DROP POLICY IF EXISTS importacoes_airbnb_staff_delete ON public.importacoes_airbnb;
DROP POLICY IF EXISTS importacoes_airbnb_staff_insert ON public.importacoes_airbnb;
DROP POLICY IF EXISTS importacoes_airbnb_staff_select ON public.importacoes_airbnb;
DROP POLICY IF EXISTS importacoes_airbnb_staff_update ON public.importacoes_airbnb;
CREATE POLICY importacoes_airbnb_admin_delete ON public.importacoes_airbnb FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role) AND conta_id = private.minha_conta(auth.uid()));
CREATE POLICY importacoes_airbnb_staff_insert ON public.importacoes_airbnb FOR INSERT TO authenticated WITH CHECK (private.is_staff(auth.uid()) AND conta_id = private.minha_conta(auth.uid()));
CREATE POLICY importacoes_airbnb_staff_select ON public.importacoes_airbnb FOR SELECT TO authenticated USING (private.is_staff(auth.uid()) AND conta_id = private.minha_conta(auth.uid()));
CREATE POLICY importacoes_airbnb_staff_update ON public.importacoes_airbnb FOR UPDATE TO authenticated USING (private.is_staff(auth.uid()) AND conta_id = private.minha_conta(auth.uid())) WITH CHECK (conta_id = private.minha_conta(auth.uid()));

-- INVESTIDORES — admin escreve, staff lê
DROP POLICY IF EXISTS investidores_staff_delete ON public.investidores;
DROP POLICY IF EXISTS investidores_staff_insert ON public.investidores;
DROP POLICY IF EXISTS investidores_staff_select ON public.investidores;
DROP POLICY IF EXISTS investidores_staff_update ON public.investidores;
CREATE POLICY investidores_admin_delete ON public.investidores FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role) AND conta_id = private.minha_conta(auth.uid()));
CREATE POLICY investidores_admin_insert ON public.investidores FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role) AND conta_id = private.minha_conta(auth.uid()));
CREATE POLICY investidores_staff_select ON public.investidores FOR SELECT TO authenticated USING (private.is_staff(auth.uid()) AND conta_id = private.minha_conta(auth.uid()));
CREATE POLICY investidores_admin_update ON public.investidores FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role) AND conta_id = private.minha_conta(auth.uid())) WITH CHECK (conta_id = private.minha_conta(auth.uid()));

-- MANUTENCOES — staff CRUD (delete relaxado em 20260508132501)
DROP POLICY IF EXISTS manutencoes_staff_delete ON public.manutencoes;
DROP POLICY IF EXISTS manutencoes_staff_insert ON public.manutencoes;
DROP POLICY IF EXISTS manutencoes_staff_select ON public.manutencoes;
DROP POLICY IF EXISTS manutencoes_staff_update ON public.manutencoes;
CREATE POLICY manutencoes_staff_delete ON public.manutencoes FOR DELETE TO authenticated USING (private.is_staff(auth.uid()) AND conta_id = private.minha_conta(auth.uid()));
CREATE POLICY manutencoes_staff_insert ON public.manutencoes FOR INSERT TO authenticated WITH CHECK (private.is_staff(auth.uid()) AND conta_id = private.minha_conta(auth.uid()));
CREATE POLICY manutencoes_staff_select ON public.manutencoes FOR SELECT TO authenticated USING (private.is_staff(auth.uid()) AND conta_id = private.minha_conta(auth.uid()));
CREATE POLICY manutencoes_staff_update ON public.manutencoes FOR UPDATE TO authenticated USING (private.is_staff(auth.uid()) AND conta_id = private.minha_conta(auth.uid())) WITH CHECK (conta_id = private.minha_conta(auth.uid()));

-- PARAMETROS_SERVICO — admin escreve, staff lê
DROP POLICY IF EXISTS parametros_servico_staff_delete ON public.parametros_servico;
DROP POLICY IF EXISTS parametros_servico_staff_insert ON public.parametros_servico;
DROP POLICY IF EXISTS parametros_servico_staff_select ON public.parametros_servico;
DROP POLICY IF EXISTS parametros_servico_staff_update ON public.parametros_servico;
CREATE POLICY parametros_servico_admin_delete ON public.parametros_servico FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role) AND conta_id = private.minha_conta(auth.uid()));
CREATE POLICY parametros_servico_admin_insert ON public.parametros_servico FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role) AND conta_id = private.minha_conta(auth.uid()));
CREATE POLICY parametros_servico_staff_select ON public.parametros_servico FOR SELECT TO authenticated USING (private.is_staff(auth.uid()) AND conta_id = private.minha_conta(auth.uid()));
CREATE POLICY parametros_servico_admin_update ON public.parametros_servico FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role) AND conta_id = private.minha_conta(auth.uid())) WITH CHECK (conta_id = private.minha_conta(auth.uid()));

-- RESERVAS — staff CRUD (delete relaxado em 20260508132501)
DROP POLICY IF EXISTS reservas_staff_delete ON public.reservas;
DROP POLICY IF EXISTS reservas_staff_insert ON public.reservas;
DROP POLICY IF EXISTS reservas_staff_select ON public.reservas;
DROP POLICY IF EXISTS reservas_staff_update ON public.reservas;
CREATE POLICY reservas_staff_delete ON public.reservas FOR DELETE TO authenticated USING (private.is_staff(auth.uid()) AND conta_id = private.minha_conta(auth.uid()));
CREATE POLICY reservas_staff_insert ON public.reservas FOR INSERT TO authenticated WITH CHECK (private.is_staff(auth.uid()) AND conta_id = private.minha_conta(auth.uid()));
CREATE POLICY reservas_staff_select ON public.reservas FOR SELECT TO authenticated USING (private.is_staff(auth.uid()) AND conta_id = private.minha_conta(auth.uid()));
CREATE POLICY reservas_staff_update ON public.reservas FOR UPDATE TO authenticated USING (private.is_staff(auth.uid()) AND conta_id = private.minha_conta(auth.uid())) WITH CHECK (conta_id = private.minha_conta(auth.uid()));

-- SERVICOS_OPERACIONAIS — staff CRUD (delete relaxado em 20260508132501)
DROP POLICY IF EXISTS servicos_operacionais_staff_delete ON public.servicos_operacionais;
DROP POLICY IF EXISTS servicos_operacionais_staff_insert ON public.servicos_operacionais;
DROP POLICY IF EXISTS servicos_operacionais_staff_select ON public.servicos_operacionais;
DROP POLICY IF EXISTS servicos_operacionais_staff_update ON public.servicos_operacionais;
CREATE POLICY servicos_operacionais_staff_delete ON public.servicos_operacionais FOR DELETE TO authenticated USING (private.is_staff(auth.uid()) AND conta_id = private.minha_conta(auth.uid()));
CREATE POLICY servicos_operacionais_staff_insert ON public.servicos_operacionais FOR INSERT TO authenticated WITH CHECK (private.is_staff(auth.uid()) AND conta_id = private.minha_conta(auth.uid()));
CREATE POLICY servicos_operacionais_staff_select ON public.servicos_operacionais FOR SELECT TO authenticated USING (private.is_staff(auth.uid()) AND conta_id = private.minha_conta(auth.uid()));
CREATE POLICY servicos_operacionais_staff_update ON public.servicos_operacionais FOR UPDATE TO authenticated USING (private.is_staff(auth.uid()) AND conta_id = private.minha_conta(auth.uid())) WITH CHECK (conta_id = private.minha_conta(auth.uid()));

-- USER_ROLES — admin gerencia papéis DA PRÓPRIA conta + usuário vê os próprios
DROP POLICY IF EXISTS roles_admin_all ON public.user_roles;
DROP POLICY IF EXISTS roles_self_select ON public.user_roles;
CREATE POLICY roles_self_select ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY roles_admin_select ON public.user_roles FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role) AND conta_id = private.minha_conta(auth.uid()));
CREATE POLICY roles_admin_insert ON public.user_roles FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role) AND conta_id = private.minha_conta(auth.uid()));
CREATE POLICY roles_admin_update ON public.user_roles FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role) AND conta_id = private.minha_conta(auth.uid())) WITH CHECK (conta_id = private.minha_conta(auth.uid()));
CREATE POLICY roles_admin_delete ON public.user_roles FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role) AND conta_id = private.minha_conta(auth.uid()));

-- PROFILES — admin vê quem está NA SUA conta; cada usuário vê o próprio
DROP POLICY IF EXISTS profiles_self_select ON public.profiles;
DROP POLICY IF EXISTS profiles_self_update ON public.profiles;
CREATE POLICY profiles_self_select ON public.profiles FOR SELECT TO authenticated USING (
  id = auth.uid()
  OR (
    private.has_role(auth.uid(), 'admin'::public.app_role)
    AND id IN (
      SELECT user_id FROM public.user_roles
       WHERE conta_id = private.minha_conta(auth.uid())
    )
  )
);
CREATE POLICY profiles_self_update ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());

-- ─────────────────────────────────────────────────────────────
-- 7. Desabilita auto-link investidor↔user por email (cross-tenant)
-- ─────────────────────────────────────────────────────────────
-- O trigger antigo casava email entre auth.users e public.investidores SEM
-- considerar conta_id, podendo vazar dados entre tenants. Linking agora é
-- responsabilidade exclusiva da Edge Function invite-user, que filtra por
-- conta_id corretamente.
DROP TRIGGER IF EXISTS tg_link_investidor_after_user_insert ON auth.users;
DROP TRIGGER IF EXISTS tg_link_investidor_before_insert ON public.investidores;

-- ─────────────────────────────────────────────────────────────
-- 8. handle_new_user: 1º usuário do sistema vira admin de própria conta.
--    Demais ficam sem papel até o admin convidar via /equipe.
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE total INT;
BEGIN
  INSERT INTO public.profiles (id, nome, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'nome', NEW.email), NEW.email);

  SELECT COUNT(*) INTO total FROM public.user_roles;
  IF total = 0 THEN
    -- Bootstrap: 1º usuário do sistema vira admin de própria conta
    INSERT INTO public.user_roles (user_id, role, conta_id)
    VALUES (NEW.id, 'admin', NEW.id);
  END IF;
  -- Demais: sem papel até serem convidados por algum admin (via invite-user)
  RETURN NEW;
END;
$$;
