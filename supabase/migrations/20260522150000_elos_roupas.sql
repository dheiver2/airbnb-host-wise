-- =============================================================
-- EMISSOR DOS ELOS DE ROUPAS — comandas/etiquetas de lavanderia
-- Mapa mental SistemA7D › Emissor dos Elos de Roupas
-- Cada "elo" é uma comanda de roupas enviadas à lavanderia,
-- vinculada a um imóvel, com lista de itens e quantidades.
-- =============================================================

CREATE TABLE IF NOT EXISTS public.elos_roupas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conta_id uuid NOT NULL,
  imovel_id uuid REFERENCES public.imoveis(id) ON DELETE SET NULL,
  data date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'aberto',  -- aberto | enviado | recebido
  itens jsonb NOT NULL DEFAULT '[]'::jsonb,  -- [{ item, quantidade }]
  observacoes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.elos_roupas ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_elos_roupas_conta ON public.elos_roupas(conta_id);
CREATE INDEX IF NOT EXISTS idx_elos_roupas_data  ON public.elos_roupas(data);

DROP TRIGGER IF EXISTS tg_elos_roupas_set_conta ON public.elos_roupas;
CREATE TRIGGER tg_elos_roupas_set_conta
  BEFORE INSERT ON public.elos_roupas
  FOR EACH ROW EXECUTE FUNCTION public.set_conta_id();

DROP TRIGGER IF EXISTS tg_elos_roupas_touch ON public.elos_roupas;
CREATE TRIGGER tg_elos_roupas_touch
  BEFORE UPDATE ON public.elos_roupas
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- RLS: staff da conta
CREATE POLICY elos_roupas_staff_select ON public.elos_roupas
  FOR SELECT TO authenticated
  USING (private.is_staff(auth.uid()) AND conta_id = private.minha_conta(auth.uid()));

CREATE POLICY elos_roupas_staff_insert ON public.elos_roupas
  FOR INSERT TO authenticated
  WITH CHECK (private.is_staff(auth.uid()) AND conta_id = private.minha_conta(auth.uid()));

CREATE POLICY elos_roupas_staff_update ON public.elos_roupas
  FOR UPDATE TO authenticated
  USING (private.is_staff(auth.uid()) AND conta_id = private.minha_conta(auth.uid()))
  WITH CHECK (conta_id = private.minha_conta(auth.uid()));

CREATE POLICY elos_roupas_staff_delete ON public.elos_roupas
  FOR DELETE TO authenticated
  USING (private.is_staff(auth.uid()) AND conta_id = private.minha_conta(auth.uid()));
