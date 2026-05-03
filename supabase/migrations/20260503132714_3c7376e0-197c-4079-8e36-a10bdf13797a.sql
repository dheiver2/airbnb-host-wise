
CREATE OR REPLACE FUNCTION public._reimport_airbnb(
  p_res jsonb,
  p_adt jsonb
) RETURNS TABLE(reservas_atualizadas int, reservas_inseridas int, adt_atualizados int, adt_inseridos int)
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE
  v_upd_r int := 0; v_ins_r int := 0; v_upd_a int := 0; v_ins_a int := 0;
BEGIN
  CREATE TEMP TABLE _stg_res ON COMMIT DROP AS
  SELECT
    (e->>0)::uuid AS imovel_id,
    (e->>1)::date AS check_in,
    (e->>2)::date AS check_out,
    (e->>3)::numeric AS valor_bruto,
    (e->>4)::numeric AS taxas_airbnb,
    (e->>5)::numeric AS valor_liquido,
    (e->>6)::date AS mes_competencia
  FROM jsonb_array_elements(p_res) e;

  WITH upd AS (
    UPDATE reservas r SET valor_bruto = s.valor_bruto, taxas_airbnb = s.taxas_airbnb, valor_liquido = s.valor_liquido
    FROM _stg_res s
    WHERE r.imovel_id = s.imovel_id AND r.check_in = s.check_in AND r.check_out = s.check_out
    RETURNING 1
  ) SELECT count(*) INTO v_upd_r FROM upd;

  WITH ins AS (
    INSERT INTO reservas (imovel_id, check_in, check_out, valor_bruto, taxas_airbnb, valor_liquido, mes_competencia, hospedes)
    SELECT s.imovel_id, s.check_in, s.check_out, s.valor_bruto, s.taxas_airbnb, s.valor_liquido, s.mes_competencia, 1
    FROM _stg_res s
    WHERE NOT EXISTS (SELECT 1 FROM reservas r WHERE r.imovel_id=s.imovel_id AND r.check_in=s.check_in AND r.check_out=s.check_out)
    RETURNING 1
  ) SELECT count(*) INTO v_ins_r FROM ins;

  CREATE TEMP TABLE _stg_adt ON COMMIT DROP AS
  SELECT
    (e->>0)::uuid AS investidor_id,
    (e->>1)::uuid AS imovel_id,
    (e->>2)::date AS data,
    (e->>3)::numeric AS valor,
    (e->>4)::date AS mes_competencia
  FROM jsonb_array_elements(p_adt) e;

  WITH agg AS (
    SELECT DISTINCT ON (imovel_id, data) imovel_id, data, valor FROM _stg_adt
  ), upd AS (
    UPDATE adiantamentos a SET valor = agg.valor
    FROM agg
    WHERE a.imovel_id = agg.imovel_id AND a.data = agg.data AND a.origem='airbnb_direto'
    RETURNING 1
  ) SELECT count(*) INTO v_upd_a FROM upd;

  WITH ins AS (
    INSERT INTO adiantamentos (investidor_id, imovel_id, data, valor, mes_competencia, origem)
    SELECT s.investidor_id, s.imovel_id, s.data, s.valor, s.mes_competencia, 'airbnb_direto'::origem_adiantamento
    FROM _stg_adt s
    WHERE NOT EXISTS (SELECT 1 FROM adiantamentos a WHERE a.imovel_id=s.imovel_id AND a.data=s.data AND a.origem='airbnb_direto')
    RETURNING 1
  ) SELECT count(*) INTO v_ins_a FROM ins;

  RETURN QUERY SELECT v_upd_r, v_ins_r, v_upd_a, v_ins_a;
END;
$$;

GRANT EXECUTE ON FUNCTION public._reimport_airbnb(jsonb, jsonb) TO authenticated, anon, service_role;
