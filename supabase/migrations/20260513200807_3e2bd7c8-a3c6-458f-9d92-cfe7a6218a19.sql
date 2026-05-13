-- Permitir que staff (admin + operacional) também exclua em parametros_servico e custos_fixos
DROP POLICY IF EXISTS parametros_servico_staff_delete ON public.parametros_servico;
CREATE POLICY "parametros_servico_staff_delete"
ON public.parametros_servico
FOR DELETE
TO authenticated
USING (private.is_staff(auth.uid()));

DROP POLICY IF EXISTS custos_fixos_staff_delete ON public.custos_fixos;
CREATE POLICY "custos_fixos_staff_delete"
ON public.custos_fixos
FOR DELETE
TO authenticated
USING (private.is_staff(auth.uid()));