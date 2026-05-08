-- Allow staff (admin + operacional) to delete operational records
DROP POLICY IF EXISTS servicos_operacionais_staff_delete ON public.servicos_operacionais;
CREATE POLICY servicos_operacionais_staff_delete ON public.servicos_operacionais
  FOR DELETE TO authenticated USING (private.is_staff(auth.uid()));

DROP POLICY IF EXISTS manutencoes_staff_delete ON public.manutencoes;
CREATE POLICY manutencoes_staff_delete ON public.manutencoes
  FOR DELETE TO authenticated USING (private.is_staff(auth.uid()));

DROP POLICY IF EXISTS reservas_staff_delete ON public.reservas;
CREATE POLICY reservas_staff_delete ON public.reservas
  FOR DELETE TO authenticated USING (private.is_staff(auth.uid()));

DROP POLICY IF EXISTS adiantamentos_staff_delete ON public.adiantamentos;
CREATE POLICY adiantamentos_staff_delete ON public.adiantamentos
  FOR DELETE TO authenticated USING (private.is_staff(auth.uid()));