-- =============================================================
-- RH — cadastro de pessoas (funcionários) + vínculo na folha
-- Mapa mental SistemA7D › RH
-- A folha de pagamento continua em custos_fixos (categoria='folha');
-- aqui só adicionamos o cadastro de pessoas e o vínculo opcional.
-- =============================================================

CREATE TABLE IF NOT EXISTS public.funcionarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conta_id uuid NOT NULL,
  nome text NOT NULL,
  cargo text,
  telefone text,
  email text,
  documento text,
  pix text,
  data_admissao date,
  salario_base numeric(10,2) NOT NULL DEFAULT 0,
  ativo boolean NOT NULL DEFAULT true,
  observacoes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.funcionarios ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_funcionarios_conta ON public.funcionarios(conta_id);

DROP TRIGGER IF EXISTS tg_funcionarios_set_conta ON public.funcionarios;
CREATE TRIGGER tg_funcionarios_set_conta
  BEFORE INSERT ON public.funcionarios
  FOR EACH ROW EXECUTE FUNCTION public.set_conta_id();

DROP TRIGGER IF EXISTS tg_funcionarios_touch ON public.funcionarios;
CREATE TRIGGER tg_funcionarios_touch
  BEFORE UPDATE ON public.funcionarios
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- RLS: admin only (dados de RH e remuneração são sensíveis)
CREATE POLICY funcionarios_admin_select ON public.funcionarios
  FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role) AND conta_id = private.minha_conta(auth.uid()));

CREATE POLICY funcionarios_admin_insert ON public.funcionarios
  FOR INSERT TO authenticated
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role) AND conta_id = private.minha_conta(auth.uid()));

CREATE POLICY funcionarios_admin_update ON public.funcionarios
  FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role) AND conta_id = private.minha_conta(auth.uid()))
  WITH CHECK (conta_id = private.minha_conta(auth.uid()));

CREATE POLICY funcionarios_admin_delete ON public.funcionarios
  FOR DELETE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role) AND conta_id = private.minha_conta(auth.uid()));

-- Vínculo opcional: cada lançamento de folha pode referenciar um funcionário
ALTER TABLE public.custos_fixos
  ADD COLUMN IF NOT EXISTS funcionario_id uuid REFERENCES public.funcionarios(id) ON DELETE SET NULL;
