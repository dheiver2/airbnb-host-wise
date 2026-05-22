-- =============================================================
-- ESCALADOR DE FAXINA — tabela de escala de faxinas
-- Mapa mental SistemA7D › Escalador de Faxina
-- =============================================================

CREATE TABLE IF NOT EXISTS public.faxinas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conta_id uuid NOT NULL,
  imovel_id uuid NOT NULL REFERENCES public.imoveis(id) ON DELETE CASCADE,
  reserva_id uuid REFERENCES public.reservas(id) ON DELETE SET NULL,
  data date NOT NULL,
  prestador_id uuid REFERENCES public.prestadores(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pendente',  -- pendente | concluida | cancelada
  observacoes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.faxinas ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_faxinas_conta ON public.faxinas(conta_id);
CREATE INDEX IF NOT EXISTS idx_faxinas_data  ON public.faxinas(data);
-- Evita duplicar faxina da mesma reserva ao "gerar dos check-outs"
CREATE UNIQUE INDEX IF NOT EXISTS uq_faxinas_reserva
  ON public.faxinas(reserva_id) WHERE reserva_id IS NOT NULL;

-- conta_id auto-preenchido + updated_at
DROP TRIGGER IF EXISTS tg_faxinas_set_conta ON public.faxinas;
CREATE TRIGGER tg_faxinas_set_conta
  BEFORE INSERT ON public.faxinas
  FOR EACH ROW EXECUTE FUNCTION public.set_conta_id();

DROP TRIGGER IF EXISTS tg_faxinas_touch ON public.faxinas;
CREATE TRIGGER tg_faxinas_touch
  BEFORE UPDATE ON public.faxinas
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- RLS: staff da conta (admin + operacional)
CREATE POLICY faxinas_staff_select ON public.faxinas
  FOR SELECT TO authenticated
  USING (private.is_staff(auth.uid()) AND conta_id = private.minha_conta(auth.uid()));

CREATE POLICY faxinas_staff_insert ON public.faxinas
  FOR INSERT TO authenticated
  WITH CHECK (private.is_staff(auth.uid()) AND conta_id = private.minha_conta(auth.uid()));

CREATE POLICY faxinas_staff_update ON public.faxinas
  FOR UPDATE TO authenticated
  USING (private.is_staff(auth.uid()) AND conta_id = private.minha_conta(auth.uid()))
  WITH CHECK (conta_id = private.minha_conta(auth.uid()));

CREATE POLICY faxinas_staff_delete ON public.faxinas
  FOR DELETE TO authenticated
  USING (private.is_staff(auth.uid()) AND conta_id = private.minha_conta(auth.uid()));
