-- Vincula servicos_operacionais a parametros_servico (igual ao que manutencoes já tem)
ALTER TABLE public.servicos_operacionais
  ADD COLUMN IF NOT EXISTS parametro_id uuid REFERENCES public.parametros_servico(id);
