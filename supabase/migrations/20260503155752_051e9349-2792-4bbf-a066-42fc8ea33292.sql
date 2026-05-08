-- Tabela de Payouts (transferências do Airbnb) - fonte de Faturamento Bruto
CREATE TABLE public.payouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  data DATE NOT NULL,
  valor_pago NUMERIC NOT NULL DEFAULT 0,
  recebedor TEXT NOT NULL,
  is_sa7d BOOLEAN NOT NULL DEFAULT false,
  codigo_referencia TEXT,
  importacao_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_payouts_data ON public.payouts(data);
CREATE INDEX idx_payouts_is_sa7d ON public.payouts(is_sa7d);
-- dedup natural: mesma data + mesmo valor + mesmo recebedor + mesmo codigo_referencia
CREATE UNIQUE INDEX uq_payouts_dedup ON public.payouts(data, valor_pago, recebedor, COALESCE(codigo_referencia,''));

ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "payouts_staff_select" ON public.payouts FOR SELECT TO authenticated USING (private.is_staff(auth.uid()));
CREATE POLICY "payouts_staff_insert" ON public.payouts FOR INSERT TO authenticated WITH CHECK (private.is_staff(auth.uid()));
CREATE POLICY "payouts_staff_update" ON public.payouts FOR UPDATE TO authenticated USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));
CREATE POLICY "payouts_staff_delete" ON public.payouts FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));

-- Marca em adiantamentos para identificar repasses para SA7D LTDA (empresa)
ALTER TABLE public.adiantamentos ADD COLUMN IF NOT EXISTS recebedor TEXT;
ALTER TABLE public.adiantamentos ADD COLUMN IF NOT EXISTS is_sa7d BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS idx_adiantamentos_is_sa7d ON public.adiantamentos(is_sa7d);