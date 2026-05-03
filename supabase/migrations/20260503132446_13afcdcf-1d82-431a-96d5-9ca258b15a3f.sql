
-- 1) Remover adiantamentos duplicados que acabei de inserir (origem airbnb_direto, criados < 10 min, em abr+mai/2026)
DELETE FROM adiantamentos
WHERE origem = 'airbnb_direto'
  AND created_at > now() - interval '15 minutes'
  AND data >= '2026-04-01' AND data < '2026-06-01';

-- 2) Stage: Reservas
CREATE TEMP TABLE _stg_res (imovel_id uuid, check_in date, check_out date, valor_bruto numeric, taxas_airbnb numeric, valor_liquido numeric, mes_competencia date, codigo_airbnb text);

-- 3) Stage: Adiantamentos
CREATE TEMP TABLE _stg_adt (investidor_id uuid, imovel_id uuid, data date, valor numeric, mes_competencia date);
