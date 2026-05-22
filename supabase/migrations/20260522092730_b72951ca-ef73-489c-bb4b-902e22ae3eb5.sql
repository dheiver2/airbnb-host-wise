
-- ============ IMÓVEIS: endereço estruturado ============
ALTER TABLE public.imoveis
  ADD COLUMN IF NOT EXISTS cep text,
  ADD COLUMN IF NOT EXISTS numero text,
  ADD COLUMN IF NOT EXISTS complemento text,
  ADD COLUMN IF NOT EXISTS bairro text,
  ADD COLUMN IF NOT EXISTS cidade text,
  ADD COLUMN IF NOT EXISTS estado text;

-- ============ INVESTIDORES: docs + endereço + banco ============
ALTER TABLE public.investidores
  ADD COLUMN IF NOT EXISTS data_nascimento date,
  ADD COLUMN IF NOT EXISTS cep text,
  ADD COLUMN IF NOT EXISTS endereco text,
  ADD COLUMN IF NOT EXISTS numero text,
  ADD COLUMN IF NOT EXISTS complemento text,
  ADD COLUMN IF NOT EXISTS bairro text,
  ADD COLUMN IF NOT EXISTS cidade text,
  ADD COLUMN IF NOT EXISTS estado text,
  ADD COLUMN IF NOT EXISTS banco text,
  ADD COLUMN IF NOT EXISTS agencia text,
  ADD COLUMN IF NOT EXISTS conta text,
  ADD COLUMN IF NOT EXISTS tipo_conta text,
  ADD COLUMN IF NOT EXISTS titular_conta text,
  ADD COLUMN IF NOT EXISTS documento_url text;

-- ============ PRESTADORES ============
CREATE TABLE IF NOT EXISTS public.prestadores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conta_id uuid NOT NULL,
  nome text NOT NULL,
  documento text,
  telefone text,
  email text,
  pix text,
  area text,
  observacoes text,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.prestadores ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS tg_prestadores_set_conta ON public.prestadores;
CREATE TRIGGER tg_prestadores_set_conta
  BEFORE INSERT ON public.prestadores
  FOR EACH ROW EXECUTE FUNCTION public.set_conta_id();

DROP TRIGGER IF EXISTS tg_prestadores_touch ON public.prestadores;
CREATE TRIGGER tg_prestadores_touch
  BEFORE UPDATE ON public.prestadores
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE POLICY prestadores_staff_select ON public.prestadores
  FOR SELECT TO authenticated
  USING (private.is_staff(auth.uid()) AND conta_id = private.minha_conta(auth.uid()));

CREATE POLICY prestadores_staff_insert ON public.prestadores
  FOR INSERT TO authenticated
  WITH CHECK (private.is_staff(auth.uid()) AND conta_id = private.minha_conta(auth.uid()));

CREATE POLICY prestadores_staff_update ON public.prestadores
  FOR UPDATE TO authenticated
  USING (private.is_staff(auth.uid()) AND conta_id = private.minha_conta(auth.uid()))
  WITH CHECK (conta_id = private.minha_conta(auth.uid()));

CREATE POLICY prestadores_staff_delete ON public.prestadores
  FOR DELETE TO authenticated
  USING (private.is_staff(auth.uid()) AND conta_id = private.minha_conta(auth.uid()));

-- ============ TIPOS DE SERVIÇO ============
CREATE TABLE IF NOT EXISTS public.tipos_servico (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conta_id uuid NOT NULL,
  nome text NOT NULL,
  area text NOT NULL,
  descricao text,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.tipos_servico ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS tg_tipos_servico_set_conta ON public.tipos_servico;
CREATE TRIGGER tg_tipos_servico_set_conta
  BEFORE INSERT ON public.tipos_servico
  FOR EACH ROW EXECUTE FUNCTION public.set_conta_id();

DROP TRIGGER IF EXISTS tg_tipos_servico_touch ON public.tipos_servico;
CREATE TRIGGER tg_tipos_servico_touch
  BEFORE UPDATE ON public.tipos_servico
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE POLICY tipos_servico_staff_select ON public.tipos_servico
  FOR SELECT TO authenticated
  USING (private.is_staff(auth.uid()) AND conta_id = private.minha_conta(auth.uid()));

CREATE POLICY tipos_servico_staff_insert ON public.tipos_servico
  FOR INSERT TO authenticated
  WITH CHECK (private.is_staff(auth.uid()) AND conta_id = private.minha_conta(auth.uid()));

CREATE POLICY tipos_servico_staff_update ON public.tipos_servico
  FOR UPDATE TO authenticated
  USING (private.is_staff(auth.uid()) AND conta_id = private.minha_conta(auth.uid()))
  WITH CHECK (conta_id = private.minha_conta(auth.uid()));

CREATE POLICY tipos_servico_staff_delete ON public.tipos_servico
  FOR DELETE TO authenticated
  USING (private.is_staff(auth.uid()) AND conta_id = private.minha_conta(auth.uid()));

-- ============ Serviços e Manutenções: prestador, tipo, avaliação ============
ALTER TABLE public.servicos_operacionais
  ADD COLUMN IF NOT EXISTS prestador_id uuid REFERENCES public.prestadores(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS tipo_servico_id uuid REFERENCES public.tipos_servico(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS avaliacao smallint CHECK (avaliacao IS NULL OR (avaliacao BETWEEN 1 AND 5)),
  ADD COLUMN IF NOT EXISTS avaliacao_comentario text;

ALTER TABLE public.manutencoes
  ADD COLUMN IF NOT EXISTS prestador_id uuid REFERENCES public.prestadores(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS tipo_servico_id uuid REFERENCES public.tipos_servico(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS prestador text,
  ADD COLUMN IF NOT EXISTS avaliacao smallint CHECK (avaliacao IS NULL OR (avaliacao BETWEEN 1 AND 5)),
  ADD COLUMN IF NOT EXISTS avaliacao_comentario text;

-- Seed inicial de tipos por área (idempotente por conta + nome+area)
-- Aplica para cada conta existente (admins)
INSERT INTO public.tipos_servico (conta_id, nome, area)
SELECT ur.conta_id, t.nome, t.area
FROM (VALUES
  ('Combustível','logistica'),
  ('Cesta','atendimento'),
  ('Multa','logistica'),
  ('Lavanderia','lavanderia'),
  ('Lavanderia de cortinas','lavanderia'),
  ('Logística extra','logistica'),
  ('Manutenção/Logística','manutencao'),
  ('Material','manutencao'),
  ('Material de Limpeza','faxina'),
  ('Passeio','atendimento'),
  ('Passeio Terceirizado','atendimento'),
  ('Pousio','faxina')
) AS t(nome, area)
CROSS JOIN (SELECT DISTINCT conta_id FROM public.user_roles WHERE role='admin') ur
WHERE NOT EXISTS (
  SELECT 1 FROM public.tipos_servico ts
  WHERE ts.conta_id = ur.conta_id AND ts.nome = t.nome AND ts.area = t.area
);
