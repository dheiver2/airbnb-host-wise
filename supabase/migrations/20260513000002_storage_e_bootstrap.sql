-- =============================================================
-- Multi-tenant: fecha bucket anexos + corrige bootstrap multi-admin
-- =============================================================

-- ─────────────────────────────────────────────────────────────
-- 1. Bootstrap multi-admin: todo self-signup vira admin de própria conta.
--    invite-user (e seeds) sobrescrevem essa atribuição quando o usuário
--    foi convidado por um admin existente.
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'nome', NEW.email), NEW.email);

  -- Todo novo usuário vira admin da própria conta.
  -- invite-user limpa e seta o papel correto quando há convite.
  INSERT INTO public.user_roles (user_id, role, conta_id)
  VALUES (NEW.id, 'admin', NEW.id);

  RETURN NEW;
END;
$$;

-- ─────────────────────────────────────────────────────────────
-- 2. Storage anexos: bucket privado + RLS por conta (e por investidor)
-- ─────────────────────────────────────────────────────────────
-- Antes: bucket public=true → qualquer um na internet com a URL acessava.
-- Agora: bucket private + signed URLs. Caminhos:
--   manutencoes/<uuid>/<file>   → checa manutencao.conta_id (+ imóvel do investidor)
--   servicos/<uuid>/<file>      → checa servicos_op.conta_id (+ imóvel do investidor)

UPDATE storage.buckets SET public = false WHERE id = 'anexos';

-- Helper: verifica se o usuário pode acessar um anexo dado pelo caminho.
CREATE OR REPLACE FUNCTION private.anexo_acessivel(_path text, _user_id uuid)
RETURNS boolean
LANGUAGE plpgsql STABLE SECURITY DEFINER
SET search_path = public, private
AS $$
DECLARE
  v_parts text[];
  v_kind text;
  v_id uuid;
  v_conta uuid;
  v_imovel uuid;
  v_inv uuid;
BEGIN
  v_parts := string_to_array(_path, '/');
  IF array_length(v_parts, 1) < 2 THEN RETURN false; END IF;
  v_kind := v_parts[1];

  BEGIN
    v_id := v_parts[2]::uuid;
  EXCEPTION WHEN OTHERS THEN
    RETURN false;
  END;

  IF v_kind = 'manutencoes' THEN
    SELECT conta_id, imovel_id INTO v_conta, v_imovel
      FROM public.manutencoes WHERE id = v_id;
  ELSIF v_kind = 'servicos' THEN
    SELECT conta_id, imovel_id INTO v_conta, v_imovel
      FROM public.servicos_operacionais WHERE id = v_id;
  ELSE
    RETURN false;
  END IF;

  IF v_conta IS NULL THEN RETURN false; END IF;

  -- Staff (admin/operacional): conta_id precisa bater
  IF private.is_staff(_user_id) THEN
    RETURN v_conta = private.minha_conta(_user_id);
  END IF;

  -- Investidor: precisa ser dono do imóvel
  IF private.has_role(_user_id, 'investidor'::public.app_role) THEN
    v_inv := private.investidor_id(_user_id);
    IF v_inv IS NULL THEN RETURN false; END IF;
    RETURN EXISTS (
      SELECT 1 FROM public.imoveis
       WHERE id = v_imovel AND investidor_id = v_inv
    );
  END IF;

  RETURN false;
END;
$$;

REVOKE ALL ON FUNCTION private.anexo_acessivel(text, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.anexo_acessivel(text, uuid) TO authenticated;

-- Políticas em storage.objects
DROP POLICY IF EXISTS "anexos_upload" ON storage.objects;
DROP POLICY IF EXISTS "anexos_read"   ON storage.objects;
DROP POLICY IF EXISTS "anexos_delete" ON storage.objects;
DROP POLICY IF EXISTS anexos_select   ON storage.objects;
DROP POLICY IF EXISTS anexos_insert   ON storage.objects;
DROP POLICY IF EXISTS anexos_update   ON storage.objects;
DROP POLICY IF EXISTS anexos_delete_p ON storage.objects;

CREATE POLICY anexos_select ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'anexos' AND private.anexo_acessivel(name, auth.uid()));

CREATE POLICY anexos_insert ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'anexos' AND private.anexo_acessivel(name, auth.uid()));

CREATE POLICY anexos_update ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'anexos' AND private.anexo_acessivel(name, auth.uid()))
  WITH CHECK (bucket_id = 'anexos' AND private.anexo_acessivel(name, auth.uid()));

CREATE POLICY anexos_delete_p ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'anexos' AND private.anexo_acessivel(name, auth.uid()));
