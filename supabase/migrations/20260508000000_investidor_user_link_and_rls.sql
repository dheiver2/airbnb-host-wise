-- =============================================================
-- Liga investidores a auth.users e libera RLS para o papel
-- 'investidor' enxergar APENAS os próprios dados.
-- =============================================================

-- 1) Coluna de vínculo ----------------------------------------
ALTER TABLE public.investidores
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_investidores_user_id
  ON public.investidores(user_id) WHERE user_id IS NOT NULL;

-- 2) Helper: retorna o investidor_id do usuário logado --------
CREATE OR REPLACE FUNCTION private.investidor_id(_user_id UUID)
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public, private
AS $$
  SELECT id FROM public.investidores WHERE user_id = _user_id LIMIT 1;
$$;

REVOKE ALL ON FUNCTION private.investidor_id(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.investidor_id(UUID) TO authenticated;

-- 3) RLS adicionais para o papel 'investidor' -----------------
-- (As políticas de staff continuam ativas em paralelo: cada policy
--  é avaliada como OR, então admin/operacional não são afetados.)

DROP POLICY IF EXISTS investidores_self_select ON public.investidores;
CREATE POLICY investidores_self_select
  ON public.investidores
  FOR SELECT
  TO authenticated
  USING (
    private.has_role(auth.uid(), 'investidor'::public.app_role)
    AND user_id = auth.uid()
  );

DROP POLICY IF EXISTS imoveis_investidor_select ON public.imoveis;
CREATE POLICY imoveis_investidor_select
  ON public.imoveis
  FOR SELECT
  TO authenticated
  USING (
    private.has_role(auth.uid(), 'investidor'::public.app_role)
    AND investidor_id = private.investidor_id(auth.uid())
  );

DROP POLICY IF EXISTS reservas_investidor_select ON public.reservas;
CREATE POLICY reservas_investidor_select
  ON public.reservas
  FOR SELECT
  TO authenticated
  USING (
    private.has_role(auth.uid(), 'investidor'::public.app_role)
    AND imovel_id IN (
      SELECT id FROM public.imoveis
       WHERE investidor_id = private.investidor_id(auth.uid())
    )
  );

DROP POLICY IF EXISTS adiantamentos_investidor_select ON public.adiantamentos;
CREATE POLICY adiantamentos_investidor_select
  ON public.adiantamentos
  FOR SELECT
  TO authenticated
  USING (
    private.has_role(auth.uid(), 'investidor'::public.app_role)
    AND investidor_id = private.investidor_id(auth.uid())
  );

DROP POLICY IF EXISTS manutencoes_investidor_select ON public.manutencoes;
CREATE POLICY manutencoes_investidor_select
  ON public.manutencoes
  FOR SELECT
  TO authenticated
  USING (
    private.has_role(auth.uid(), 'investidor'::public.app_role)
    AND imovel_id IN (
      SELECT id FROM public.imoveis
       WHERE investidor_id = private.investidor_id(auth.uid())
    )
  );

DROP POLICY IF EXISTS servicos_op_investidor_select ON public.servicos_operacionais;
CREATE POLICY servicos_op_investidor_select
  ON public.servicos_operacionais
  FOR SELECT
  TO authenticated
  USING (
    private.has_role(auth.uid(), 'investidor'::public.app_role)
    AND imovel_id IN (
      SELECT id FROM public.imoveis
       WHERE investidor_id = private.investidor_id(auth.uid())
    )
  );

-- =============================================================
-- 4) Vínculo automático por email
-- Quando um usuário se cadastra com um email que já está em
-- public.investidores.email (e o investidor ainda não tem user_id),
-- o link é feito automaticamente. Vale também na direção oposta:
-- ao criar/editar um investidor com email de um usuário existente.
-- =============================================================

CREATE OR REPLACE FUNCTION public.link_investidor_to_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Caso tenha vindo de auth.users: NEW.email + NEW.id
  IF TG_TABLE_NAME = 'users' AND TG_TABLE_SCHEMA = 'auth' THEN
    UPDATE public.investidores
       SET user_id = NEW.id
     WHERE user_id IS NULL
       AND email IS NOT NULL
       AND lower(email) = lower(NEW.email);
    RETURN NEW;
  END IF;

  -- Caso tenha vindo de public.investidores: NEW.email
  IF TG_TABLE_NAME = 'investidores' AND TG_TABLE_SCHEMA = 'public' THEN
    IF NEW.user_id IS NULL AND NEW.email IS NOT NULL THEN
      SELECT id INTO NEW.user_id
        FROM auth.users
       WHERE lower(email) = lower(NEW.email)
       LIMIT 1;
    END IF;
    RETURN NEW;
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger 1: novo usuário criado / email alterado → tenta vincular
DROP TRIGGER IF EXISTS tg_link_investidor_after_user_insert ON auth.users;
CREATE TRIGGER tg_link_investidor_after_user_insert
AFTER INSERT OR UPDATE OF email ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.link_investidor_to_user();

-- Trigger 2: novo investidor criado / email alterado → tenta vincular
DROP TRIGGER IF EXISTS tg_link_investidor_before_insert ON public.investidores;
CREATE TRIGGER tg_link_investidor_before_insert
BEFORE INSERT OR UPDATE OF email, user_id ON public.investidores
FOR EACH ROW
EXECUTE FUNCTION public.link_investidor_to_user();

-- Vínculo retroativo: para investidores e usuários que já existem
UPDATE public.investidores i
   SET user_id = u.id
  FROM auth.users u
 WHERE i.user_id IS NULL
   AND i.email IS NOT NULL
   AND lower(i.email) = lower(u.email);
