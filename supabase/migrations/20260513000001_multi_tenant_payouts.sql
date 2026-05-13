-- =============================================================
-- Multi-tenant addendum: tabela payouts (esquecida em 20260513000000)
-- =============================================================
-- payouts armazena as transferências recebidas do Airbnb (fonte de
-- faturamento bruto no Dashboard). Sem conta_id, todo staff via os
-- payouts de todos os tenants. Esta migração fecha o vazamento.
-- =============================================================

ALTER TABLE public.payouts
  ADD COLUMN IF NOT EXISTS conta_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Backfill: todos os payouts existentes vão para o 1º admin
DO $$
DECLARE v_first_admin uuid;
BEGIN
  SELECT user_id INTO v_first_admin
    FROM public.user_roles
   WHERE role = 'admin'
   ORDER BY user_id
   LIMIT 1;
  IF v_first_admin IS NOT NULL THEN
    UPDATE public.payouts SET conta_id = v_first_admin WHERE conta_id IS NULL;
  END IF;
END $$;

ALTER TABLE public.payouts ALTER COLUMN conta_id SET NOT NULL;
CREATE INDEX IF NOT EXISTS idx_payouts_conta ON public.payouts(conta_id);

-- Unique de dedup vira por conta (não global)
DROP INDEX IF EXISTS uq_payouts_dedup;
CREATE UNIQUE INDEX uq_payouts_dedup_conta
  ON public.payouts(conta_id, data, valor_pago, recebedor, COALESCE(codigo_referencia, ''));

-- Trigger BEFORE INSERT (mesmo padrão das outras tabelas)
DROP TRIGGER IF EXISTS tg_set_conta ON public.payouts;
CREATE TRIGGER tg_set_conta BEFORE INSERT ON public.payouts
  FOR EACH ROW EXECUTE FUNCTION public.set_conta_id();

-- RLS reescrita com isolamento por conta
DROP POLICY IF EXISTS payouts_staff_select ON public.payouts;
DROP POLICY IF EXISTS payouts_staff_insert ON public.payouts;
DROP POLICY IF EXISTS payouts_staff_update ON public.payouts;
DROP POLICY IF EXISTS payouts_staff_delete ON public.payouts;
CREATE POLICY payouts_staff_select ON public.payouts FOR SELECT TO authenticated USING (private.is_staff(auth.uid()) AND conta_id = private.minha_conta(auth.uid()));
CREATE POLICY payouts_staff_insert ON public.payouts FOR INSERT TO authenticated WITH CHECK (private.is_staff(auth.uid()) AND conta_id = private.minha_conta(auth.uid()));
CREATE POLICY payouts_staff_update ON public.payouts FOR UPDATE TO authenticated USING (private.is_staff(auth.uid()) AND conta_id = private.minha_conta(auth.uid())) WITH CHECK (conta_id = private.minha_conta(auth.uid()));
CREATE POLICY payouts_staff_delete ON public.payouts FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role) AND conta_id = private.minha_conta(auth.uid()));
