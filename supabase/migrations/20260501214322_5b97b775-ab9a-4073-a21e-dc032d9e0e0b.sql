DELETE FROM public.reservas r
USING public.reservas r2
WHERE r.imovel_id = r2.imovel_id
  AND r.check_in = r2.check_in
  AND r.check_out = r2.check_out
  AND r.valor_bruto = r2.valor_bruto
  AND r.created_at > r2.created_at;