ALTER TABLE public.servicos_operacionais ADD COLUMN IF NOT EXISTS area text;
ALTER TABLE public.manutencoes ADD COLUMN IF NOT EXISTS area text;