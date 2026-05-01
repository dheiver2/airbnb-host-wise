
-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('admin', 'operacional', 'investidor');
CREATE TYPE public.tipo_imovel AS ENUM ('studio', '1Q', '2Q', '3Q', 'cobertura');
CREATE TYPE public.status_geral AS ENUM ('ativo', 'inativo', 'manutencao');
CREATE TYPE public.tipo_servico_op AS ENUM ('faxina', 'lavanderia', 'material', 'manutencao');
CREATE TYPE public.origem_adiantamento AS ENUM ('airbnb_direto', 'empresa_repasse');
CREATE TYPE public.rateio_manutencao AS ENUM ('investidor', 'empresa');

-- ============ PROFILES & ROLES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','operacional')) $$;

-- Trigger: cria profile e dá role ao novo usuário (1º vira admin)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE total INT;
BEGIN
  INSERT INTO public.profiles (id, nome, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'nome', NEW.email), NEW.email);

  SELECT COUNT(*) INTO total FROM public.user_roles;
  IF total = 0 THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'operacional');
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at helper
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- ============ INVESTIDORES ============
CREATE TABLE public.investidores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  documento TEXT,
  email TEXT,
  telefone TEXT,
  pix TEXT,
  status status_geral NOT NULL DEFAULT 'ativo',
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.investidores ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER tg_investidores_updated BEFORE UPDATE ON public.investidores
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============ IMOVEIS ============
CREATE TABLE public.imoveis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT NOT NULL UNIQUE,
  endereco TEXT NOT NULL,
  tipo tipo_imovel NOT NULL DEFAULT 'studio',
  investidor_id UUID NOT NULL REFERENCES public.investidores(id) ON DELETE RESTRICT,
  capacidade INT NOT NULL DEFAULT 2,
  valor_faxina NUMERIC(10,2) NOT NULL DEFAULT 0,
  valor_lavanderia NUMERIC(10,2) NOT NULL DEFAULT 0,
  custo_faxina NUMERIC(10,2) NOT NULL DEFAULT 0,
  custo_lavanderia NUMERIC(10,2) NOT NULL DEFAULT 0,
  percentual_comissao NUMERIC(5,2) NOT NULL DEFAULT 20,
  status status_geral NOT NULL DEFAULT 'ativo',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.imoveis ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER tg_imoveis_updated BEFORE UPDATE ON public.imoveis
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============ PARAMETROS DE SERVIÇO (manutenção) ============
CREATE TABLE public.parametros_servico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  categoria TEXT,
  custo NUMERIC(10,2) NOT NULL DEFAULT 0,
  valor_cobrado NUMERIC(10,2) NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.parametros_servico ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER tg_param_serv_updated BEFORE UPDATE ON public.parametros_servico
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============ RESERVAS ============
CREATE TABLE public.reservas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo_airbnb TEXT,
  imovel_id UUID NOT NULL REFERENCES public.imoveis(id) ON DELETE CASCADE,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  hospedes INT NOT NULL DEFAULT 1,
  valor_bruto NUMERIC(12,2) NOT NULL DEFAULT 0,
  taxas_airbnb NUMERIC(12,2) NOT NULL DEFAULT 0,
  valor_liquido NUMERIC(12,2) NOT NULL DEFAULT 0,
  mes_competencia DATE NOT NULL,
  importacao_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(codigo_airbnb, imovel_id)
);
ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER tg_reservas_updated BEFORE UPDATE ON public.reservas
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE INDEX idx_reservas_competencia ON public.reservas(mes_competencia);
CREATE INDEX idx_reservas_imovel ON public.reservas(imovel_id);

-- ============ ADIANTAMENTOS ============
CREATE TABLE public.adiantamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investidor_id UUID NOT NULL REFERENCES public.investidores(id) ON DELETE CASCADE,
  imovel_id UUID REFERENCES public.imoveis(id) ON DELETE SET NULL,
  data DATE NOT NULL,
  valor NUMERIC(12,2) NOT NULL,
  origem origem_adiantamento NOT NULL DEFAULT 'empresa_repasse',
  mes_competencia DATE NOT NULL,
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.adiantamentos ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_adiant_competencia ON public.adiantamentos(mes_competencia);
CREATE INDEX idx_adiant_inv ON public.adiantamentos(investidor_id);

-- ============ SERVIÇOS OPERACIONAIS ============
CREATE TABLE public.servicos_operacionais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  imovel_id UUID NOT NULL REFERENCES public.imoveis(id) ON DELETE CASCADE,
  reserva_id UUID REFERENCES public.reservas(id) ON DELETE SET NULL,
  data DATE NOT NULL,
  tipo tipo_servico_op NOT NULL,
  custo_real NUMERIC(10,2) NOT NULL DEFAULT 0,
  valor_cobrado NUMERIC(10,2) NOT NULL DEFAULT 0,
  prestador TEXT,
  mes_competencia DATE NOT NULL,
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.servicos_operacionais ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_serv_competencia ON public.servicos_operacionais(mes_competencia);
CREATE INDEX idx_serv_imovel ON public.servicos_operacionais(imovel_id);

-- ============ MANUTENÇÕES ============
CREATE TABLE public.manutencoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  imovel_id UUID NOT NULL REFERENCES public.imoveis(id) ON DELETE CASCADE,
  parametro_id UUID REFERENCES public.parametros_servico(id) ON DELETE SET NULL,
  data DATE NOT NULL,
  descricao TEXT NOT NULL,
  categoria TEXT,
  custo NUMERIC(10,2) NOT NULL DEFAULT 0,
  valor_cobrado NUMERIC(10,2) NOT NULL DEFAULT 0,
  rateio rateio_manutencao NOT NULL DEFAULT 'investidor',
  mes_competencia DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'concluida',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.manutencoes ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_manut_competencia ON public.manutencoes(mes_competencia);
CREATE INDEX idx_manut_imovel ON public.manutencoes(imovel_id);

-- ============ CUSTOS FIXOS DA EMPRESA ============
CREATE TABLE public.custos_fixos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mes_competencia DATE NOT NULL,
  categoria TEXT NOT NULL, -- gestao, logistica, chat, escritorio, folha, diversos, itens_apartamento
  descricao TEXT,
  valor NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.custos_fixos ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_cf_competencia ON public.custos_fixos(mes_competencia);

-- ============ HISTÓRICO DE IMPORTAÇÕES ============
CREATE TABLE public.importacoes_airbnb (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo TEXT NOT NULL, -- 'faturamento' | 'adiantamentos'
  arquivo TEXT,
  total_linhas INT NOT NULL DEFAULT 0,
  inseridos INT NOT NULL DEFAULT 0,
  duplicados INT NOT NULL DEFAULT 0,
  erros INT NOT NULL DEFAULT 0,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.importacoes_airbnb ENABLE ROW LEVEL SECURITY;

-- ============ RLS POLICIES ============
-- profiles: usuário vê o próprio; admin vê todos
CREATE POLICY "profiles_self_select" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "profiles_self_update" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());

-- user_roles: usuário vê seus papéis; admin gerencia
CREATE POLICY "roles_self_select" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "roles_admin_all" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- staff (admin/operacional) tem acesso completo às tabelas operacionais
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'investidores','imoveis','parametros_servico','reservas',
    'adiantamentos','servicos_operacionais','manutencoes',
    'custos_fixos','importacoes_airbnb'
  ] LOOP
    EXECUTE format('CREATE POLICY "%s_staff_select" ON public.%I FOR SELECT TO authenticated USING (public.is_staff(auth.uid()))', t, t);
    EXECUTE format('CREATE POLICY "%s_staff_insert" ON public.%I FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()))', t, t);
    EXECUTE format('CREATE POLICY "%s_staff_update" ON public.%I FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()))', t, t);
    EXECUTE format('CREATE POLICY "%s_staff_delete" ON public.%I FOR DELETE TO authenticated USING (public.has_role(auth.uid(),''admin''))', t, t);
  END LOOP;
END $$;
