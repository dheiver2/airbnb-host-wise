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
