
WITH dup AS (
  SELECT imovel_id, check_in, check_out,
         (array_agg(id ORDER BY created_at))[1] AS keep_id,
         SUM(valor_bruto) AS sum_vb,
         SUM(taxas_airbnb) AS sum_tx,
         SUM(valor_liquido) AS sum_vl
  FROM reservas
  GROUP BY imovel_id, check_in, check_out
  HAVING COUNT(*) > 1
),
upd AS (
  UPDATE reservas r
  SET valor_bruto = d.sum_vb, taxas_airbnb = d.sum_tx, valor_liquido = d.sum_vl
  FROM dup d WHERE r.id = d.keep_id
  RETURNING r.id
),
del AS (
  DELETE FROM reservas r USING dup d
  WHERE r.imovel_id = d.imovel_id AND r.check_in = d.check_in AND r.check_out = d.check_out AND r.id <> d.keep_id
  RETURNING r.id
)
SELECT (SELECT COUNT(*) FROM upd) AS atualizadas, (SELECT COUNT(*) FROM del) AS removidas;
