-- Coluna de anexos nas duas tabelas
ALTER TABLE public.servicos_operacionais ADD COLUMN IF NOT EXISTS anexos jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.manutencoes            ADD COLUMN IF NOT EXISTS anexos jsonb DEFAULT '[]'::jsonb;

-- Bucket de armazenamento (público — URLs são suficientes como controle de acesso)
INSERT INTO storage.buckets (id, name, public)
VALUES ('anexos', 'anexos', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de storage
CREATE POLICY "anexos_upload"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'anexos');

CREATE POLICY "anexos_read"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'anexos');

CREATE POLICY "anexos_delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'anexos');
