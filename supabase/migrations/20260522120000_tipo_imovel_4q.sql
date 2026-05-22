-- =============================================================
-- Adiciona "4Q" (4 quartos ou mais) ao enum tipo_imovel
-- Conforme mapa mental SistemA7D — Cadastros › Tipos de imóvel.
-- =============================================================
-- ATENÇÃO: ALTER TYPE ADD VALUE não pode rodar dentro de transação
-- junto com uso do valor. Rode este arquivo isolado.

ALTER TYPE public.tipo_imovel ADD VALUE IF NOT EXISTS '4Q';
