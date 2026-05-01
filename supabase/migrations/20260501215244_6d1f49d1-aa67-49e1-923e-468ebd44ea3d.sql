CREATE SCHEMA IF NOT EXISTS private;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION private.is_staff(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin','operacional')
  )
$$;

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.is_staff(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION private.is_staff(uuid) FROM PUBLIC, anon;
GRANT USAGE ON SCHEMA private TO authenticated;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION private.is_staff(uuid) TO authenticated;

DROP POLICY IF EXISTS adiantamentos_staff_delete ON public.adiantamentos;
DROP POLICY IF EXISTS adiantamentos_staff_insert ON public.adiantamentos;
DROP POLICY IF EXISTS adiantamentos_staff_select ON public.adiantamentos;
DROP POLICY IF EXISTS adiantamentos_staff_update ON public.adiantamentos;
CREATE POLICY adiantamentos_staff_delete ON public.adiantamentos FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY adiantamentos_staff_insert ON public.adiantamentos FOR INSERT TO authenticated WITH CHECK (private.is_staff(auth.uid()));
CREATE POLICY adiantamentos_staff_select ON public.adiantamentos FOR SELECT TO authenticated USING (private.is_staff(auth.uid()));
CREATE POLICY adiantamentos_staff_update ON public.adiantamentos FOR UPDATE TO authenticated USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));

DROP POLICY IF EXISTS custos_fixos_staff_delete ON public.custos_fixos;
DROP POLICY IF EXISTS custos_fixos_staff_insert ON public.custos_fixos;
DROP POLICY IF EXISTS custos_fixos_staff_select ON public.custos_fixos;
DROP POLICY IF EXISTS custos_fixos_staff_update ON public.custos_fixos;
CREATE POLICY custos_fixos_staff_delete ON public.custos_fixos FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY custos_fixos_staff_insert ON public.custos_fixos FOR INSERT TO authenticated WITH CHECK (private.is_staff(auth.uid()));
CREATE POLICY custos_fixos_staff_select ON public.custos_fixos FOR SELECT TO authenticated USING (private.is_staff(auth.uid()));
CREATE POLICY custos_fixos_staff_update ON public.custos_fixos FOR UPDATE TO authenticated USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));

DROP POLICY IF EXISTS imoveis_staff_delete ON public.imoveis;
DROP POLICY IF EXISTS imoveis_staff_insert ON public.imoveis;
DROP POLICY IF EXISTS imoveis_staff_select ON public.imoveis;
DROP POLICY IF EXISTS imoveis_staff_update ON public.imoveis;
CREATE POLICY imoveis_staff_delete ON public.imoveis FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY imoveis_staff_insert ON public.imoveis FOR INSERT TO authenticated WITH CHECK (private.is_staff(auth.uid()));
CREATE POLICY imoveis_staff_select ON public.imoveis FOR SELECT TO authenticated USING (private.is_staff(auth.uid()));
CREATE POLICY imoveis_staff_update ON public.imoveis FOR UPDATE TO authenticated USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));

DROP POLICY IF EXISTS importacoes_airbnb_staff_delete ON public.importacoes_airbnb;
DROP POLICY IF EXISTS importacoes_airbnb_staff_insert ON public.importacoes_airbnb;
DROP POLICY IF EXISTS importacoes_airbnb_staff_select ON public.importacoes_airbnb;
DROP POLICY IF EXISTS importacoes_airbnb_staff_update ON public.importacoes_airbnb;
CREATE POLICY importacoes_airbnb_staff_delete ON public.importacoes_airbnb FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY importacoes_airbnb_staff_insert ON public.importacoes_airbnb FOR INSERT TO authenticated WITH CHECK (private.is_staff(auth.uid()));
CREATE POLICY importacoes_airbnb_staff_select ON public.importacoes_airbnb FOR SELECT TO authenticated USING (private.is_staff(auth.uid()));
CREATE POLICY importacoes_airbnb_staff_update ON public.importacoes_airbnb FOR UPDATE TO authenticated USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));

DROP POLICY IF EXISTS investidores_staff_delete ON public.investidores;
DROP POLICY IF EXISTS investidores_staff_insert ON public.investidores;
DROP POLICY IF EXISTS investidores_staff_select ON public.investidores;
DROP POLICY IF EXISTS investidores_staff_update ON public.investidores;
CREATE POLICY investidores_staff_delete ON public.investidores FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY investidores_staff_insert ON public.investidores FOR INSERT TO authenticated WITH CHECK (private.is_staff(auth.uid()));
CREATE POLICY investidores_staff_select ON public.investidores FOR SELECT TO authenticated USING (private.is_staff(auth.uid()));
CREATE POLICY investidores_staff_update ON public.investidores FOR UPDATE TO authenticated USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));

DROP POLICY IF EXISTS manutencoes_staff_delete ON public.manutencoes;
DROP POLICY IF EXISTS manutencoes_staff_insert ON public.manutencoes;
DROP POLICY IF EXISTS manutencoes_staff_select ON public.manutencoes;
DROP POLICY IF EXISTS manutencoes_staff_update ON public.manutencoes;
CREATE POLICY manutencoes_staff_delete ON public.manutencoes FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY manutencoes_staff_insert ON public.manutencoes FOR INSERT TO authenticated WITH CHECK (private.is_staff(auth.uid()));
CREATE POLICY manutencoes_staff_select ON public.manutencoes FOR SELECT TO authenticated USING (private.is_staff(auth.uid()));
CREATE POLICY manutencoes_staff_update ON public.manutencoes FOR UPDATE TO authenticated USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));

DROP POLICY IF EXISTS parametros_servico_staff_delete ON public.parametros_servico;
DROP POLICY IF EXISTS parametros_servico_staff_insert ON public.parametros_servico;
DROP POLICY IF EXISTS parametros_servico_staff_select ON public.parametros_servico;
DROP POLICY IF EXISTS parametros_servico_staff_update ON public.parametros_servico;
CREATE POLICY parametros_servico_staff_delete ON public.parametros_servico FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY parametros_servico_staff_insert ON public.parametros_servico FOR INSERT TO authenticated WITH CHECK (private.is_staff(auth.uid()));
CREATE POLICY parametros_servico_staff_select ON public.parametros_servico FOR SELECT TO authenticated USING (private.is_staff(auth.uid()));
CREATE POLICY parametros_servico_staff_update ON public.parametros_servico FOR UPDATE TO authenticated USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));

DROP POLICY IF EXISTS profiles_self_select ON public.profiles;
DROP POLICY IF EXISTS profiles_self_update ON public.profiles;
CREATE POLICY profiles_self_select ON public.profiles FOR SELECT TO authenticated USING ((id = auth.uid()) OR private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY profiles_self_update ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());

DROP POLICY IF EXISTS reservas_staff_delete ON public.reservas;
DROP POLICY IF EXISTS reservas_staff_insert ON public.reservas;
DROP POLICY IF EXISTS reservas_staff_select ON public.reservas;
DROP POLICY IF EXISTS reservas_staff_update ON public.reservas;
CREATE POLICY reservas_staff_delete ON public.reservas FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY reservas_staff_insert ON public.reservas FOR INSERT TO authenticated WITH CHECK (private.is_staff(auth.uid()));
CREATE POLICY reservas_staff_select ON public.reservas FOR SELECT TO authenticated USING (private.is_staff(auth.uid()));
CREATE POLICY reservas_staff_update ON public.reservas FOR UPDATE TO authenticated USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));

DROP POLICY IF EXISTS servicos_operacionais_staff_delete ON public.servicos_operacionais;
DROP POLICY IF EXISTS servicos_operacionais_staff_insert ON public.servicos_operacionais;
DROP POLICY IF EXISTS servicos_operacionais_staff_select ON public.servicos_operacionais;
DROP POLICY IF EXISTS servicos_operacionais_staff_update ON public.servicos_operacionais;
CREATE POLICY servicos_operacionais_staff_delete ON public.servicos_operacionais FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY servicos_operacionais_staff_insert ON public.servicos_operacionais FOR INSERT TO authenticated WITH CHECK (private.is_staff(auth.uid()));
CREATE POLICY servicos_operacionais_staff_select ON public.servicos_operacionais FOR SELECT TO authenticated USING (private.is_staff(auth.uid()));
CREATE POLICY servicos_operacionais_staff_update ON public.servicos_operacionais FOR UPDATE TO authenticated USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));

DROP POLICY IF EXISTS roles_admin_all ON public.user_roles;
DROP POLICY IF EXISTS roles_self_select ON public.user_roles;
CREATE POLICY roles_admin_all ON public.user_roles FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY roles_self_select ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());