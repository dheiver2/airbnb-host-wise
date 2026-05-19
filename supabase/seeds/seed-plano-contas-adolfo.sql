-- =============================================================
-- Importa plano de contas SA7D → manutencoes + servicos_operacionais + custos_fixos
-- Tenant: adolfocfc@gmail.com
-- =============================================================
DO $$
DECLARE
  v_adolfo uuid;
  v_imovel uuid;
  v_inseridos_manut int := 0;
  v_inseridos_serv int := 0;
  v_inseridos_custo int := 0;
  v_local_nao_encontrado int := 0;
BEGIN
  SELECT id INTO v_adolfo FROM auth.users WHERE lower(email) = 'adolfocfc@gmail.com';
  IF v_adolfo IS NULL THEN RAISE EXCEPTION 'Adolfo nao encontrado'; END IF;

  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('SD 506') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-01', '3 travesseiros', 'material', 99.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO SD 506] 3 travesseiros', 99.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Wish 501') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-01', '6 colheres', 'material', 34.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Wish 501] 6 colheres', 34.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Lotus') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-01', '3 garfos', 'material', 11.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Lotus] 3 garfos', 11.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Fiordes 106') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-01', 'Porta', 'material', 611.49, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Fiordes 106] Porta', 611.49);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Rhodes 402') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-01', 'Garrafa de cafe', 'material', 44.9, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Rhodes 402] Garrafa de cafe', 44.9);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Adolfo 401') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-02', 'Bucha, gesso e tubo pvc', 'material', 14.5, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Adolfo 401] Bucha, gesso e tubo pvc', 14.5);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Sky 1304') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-02', 'Peça para ar condicionado', 'material', 400.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Sky 1304] Peça para ar condicionado', 400.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Rhodes 402') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-02', 'Peça para gelagua', 'material', 70.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Rhodes 402] Peça para gelagua', 70.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Iloa C204') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-02', 'Limpeza da piscina', 'servico_terceirizado', 150.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Iloa C204] Limpeza da piscina', 150.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Celves 403') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-03', 'Massa para madeira', 'material', 20.9, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Celves 403] Massa para madeira', 20.9);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Polinesia 205') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-05', 'Logistica', 'logistica', 65.0, 0, 'empresa', '2026-04-01', 'logistica');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Polinesia 205] Logistica', 65.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Sky 1304') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-06', 'Chuveiro', 'material', 233.9, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Sky 1304] Chuveiro', 233.9);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Sky 1304') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-06', 'Lampada', 'material', 56.9, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Sky 1304] Lampada', 56.9);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Rio negro 501') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-06', 'Fita veda rosca e ducha', 'material', 119.8, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Rio negro 501] Fita veda rosca e ducha', 119.8);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Terraço 008') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-06', 'Chuveiro', 'material', 123.9, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Terraço 008] Chuveiro', 123.9);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Lorenzo 607') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-06', 'Controle tv', 'material', 44.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Lorenzo 607] Controle tv', 44.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Luiza fernandes') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-07', 'Colchao', 'material', 455.5, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Luiza fernandes] Colchao', 455.5);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Iloa C204') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-07', '2 limpezas da piscina', 'servico_terceirizado', 300.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Iloa C204] 2 limpezas da piscina', 300.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Ibiza 507') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-07', 'Tinta', 'material', 174.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Ibiza 507] Tinta', 174.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Ibiza 507') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-07', 'Pintura', 'servico_proprio', 500.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Ibiza 507] Pintura', 500.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Adolfo 401') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-07', 'Alongador', 'material', 19.9, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Adolfo 401] Alongador', 19.9);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Walter 1111') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-09', 'Secador de cabelo', 'material', 139.99, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Walter 1111] Secador de cabelo', 139.99);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Sky 1306') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-09', 'Painel led e fita', 'material', 33.57, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Sky 1306] Painel led e fita', 33.57);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Sky 704') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-09', '1 assento sanitario e 1 sifao', 'material', 80.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Sky 704] 1 assento sanitario e 1 sifao', 80.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Lorenzo 607') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-09', 'Cortina box', 'material', 39.9, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Lorenzo 607] Cortina box', 39.9);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Lorenzo 607') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-09', 'Forno 21l', 'material', 518.7, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Lorenzo 607] Forno 21l', 518.7);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Frances 14') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-10', 'Gasolina', 'logistica', 50.0, 0, 'empresa', '2026-04-01', 'logistica');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Frances 14] Gasolina', 50.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('SD 1102') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-10', 'Conserto do forno', 'servico_terceirizado', 150.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO SD 1102] Conserto do forno', 150.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Rhodes 402') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-10', 'Conserto do forno e fogao', 'servico_terceirizado', 150.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Rhodes 402] Conserto do forno e fogao', 150.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Time 805') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-12', 'galao de agua', 'servico_terceirizado', 40.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Time 805] galao de agua', 40.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Walter 1111') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-12', '3 potes, 2 canecas e 1 air fryer', 'material', 304.44, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Walter 1111] 3 potes, 2 canecas e 1 air fryer', 304.44);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Liv 1011') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-12', 'Varal', 'material', 69.99, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Liv 1011] Varal', 69.99);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Wish 501') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-12', '2 canecas e 1 varal', 'material', 115.94, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Wish 501] 2 canecas e 1 varal', 115.94);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('SD 802') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-13', 'Controle garagem', 'material', 100.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO SD 802] Controle garagem', 100.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Sky 1308') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-13', 'Internet', 'material', 99.9, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Sky 1308] Internet', 99.9);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Liv 804') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-13', 'Ingate', 'material', 9.69, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Liv 804] Ingate', 9.69);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Liv 804') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-13', 'Caixa de descarga', 'material', 199.9, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Liv 804] Caixa de descarga', 199.9);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Facilites 110') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-14', 'Pagamento do tradutor', 'servico_terceirizado', 30.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Facilites 110] Pagamento do tradutor', 30.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Adolfo 401') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-14', 'Instalaçao do ar condicionado', 'servico_terceirizado', 550.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Adolfo 401] Instalaçao do ar condicionado', 550.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('SD 1102') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-14', 'Gatilho', 'material', 25.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO SD 1102] Gatilho', 25.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Portiville 307') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-15', 'Ventilador', 'material', 144.99, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Portiville 307] Ventilador', 144.99);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Smart 801') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-15', 'Resistencia', 'material', 53.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Smart 801] Resistencia', 53.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Facilites 110') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-15', 'Pagamento do marcos da recepçao dos hospedes', 'servico_terceirizado', 50.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Facilites 110] Pagamento do marcos da recepçao dos hospedes', 50.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Time 319') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-17', '4 travesseiros', 'material', 164.8, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Time 319] 4 travesseiros', 164.8);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Walter 1111') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-17', '2 travesseiros', 'material', 82.4, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Walter 1111] 2 travesseiros', 82.4);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Mont blanc 1005') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-21', '2 colchoes', 'material', 901.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Mont blanc 1005] 2 colchoes', 901.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('SD 1101') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-22', 'Lavagem do sofa', 'servico_terceirizado', 410.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO SD 1101] Lavagem do sofa', 410.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('SD3 808') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-23', 'Lavagem do sofa', 'servico_terceirizado', 410.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO SD3 808] Lavagem do sofa', 410.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Frances 14') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-20', 'Fita de isolamento', 'material', 32.15, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Frances 14] Fita de isolamento', 32.15);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('SD 802') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-21', 'Tampa de vaso sanitario', 'material', 75.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO SD 802] Tampa de vaso sanitario', 75.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Liv 804') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-25', 'Leiteira', 'material', 44.99, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Liv 804] Leiteira', 44.99);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Soho 103') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-23', 'Jogo de copos', 'material', 17.99, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Soho 103] Jogo de copos', 17.99);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Terraço 008') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-22', 'Grelha para ralo', 'material', 36.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Terraço 008] Grelha para ralo', 36.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('SD3 808') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-15', 'Ducha higienica', 'material', 120.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO SD3 808] Ducha higienica', 120.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Portiville 307') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-10', 'Ventilador', 'material', 129.99, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Portiville 307] Ventilador', 129.99);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Time 320') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-27', 'Air fryer', 'material', 249.99, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Time 320] Air fryer', 249.99);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Walter 1110') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-27', 'Registro, conjunto e acabamentometal', 'material', 160.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Walter 1110] Registro, conjunto e acabamentometal', 160.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Liv 613') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-24', 'Lavagem do sofa', 'servico_terceirizado', 315.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Liv 613] Lavagem do sofa', 315.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Mont blanc 1005') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-24', 'Pilhas', 'material', 50.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Mont blanc 1005] Pilhas', 50.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Liv 813') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-27', 'Lavagem do sofa', 'servico_terceirizado', 180.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Liv 813] Lavagem do sofa', 180.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('SD 1101') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-27', 'Piscineiro', 'servico_terceirizado', 200.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO SD 1101] Piscineiro', 200.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Facilites 110') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-27', 'Recepçao dos hospedes', 'servico_terceirizado', 30.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Facilites 110] Recepçao dos hospedes', 30.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Polinesia 205') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-20', 'Sabao para lavar roupa', 'material', 200.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Polinesia 205] Sabao para lavar roupa', 200.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Rhodes 402') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Reparo na maquina de lavar', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Rhodes 402] Reparo na maquina de lavar', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Rhodes 402') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Reparo no gelagua+mao de obra', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Rhodes 402] Reparo no gelagua+mao de obra', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Rhodes 402') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Conserto na gaveta do armario', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Rhodes 402] Conserto na gaveta do armario', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Rhodes 402') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', '3 desentupimentos de vaso sanitario', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Rhodes 402] 3 desentupimentos de vaso sanitario', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Rhodes 402') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Desentupimento dos ralos', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Rhodes 402] Desentupimento dos ralos', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Neo 422') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Reparo na maquina de lavar', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Neo 422] Reparo na maquina de lavar', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Neo 422') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Manutençao no disjuntor', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Neo 422] Manutençao no disjuntor', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Smart 801') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Substituiçao de resistencia+mao de obra', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Smart 801] Substituiçao de resistencia+mao de obra', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Time 805') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Desentupimento do ralo', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Time 805] Desentupimento do ralo', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Time 1111') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Conserto da torneira da pia da cozinha', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Time 1111] Conserto da torneira da pia da cozinha', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Smart 802') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Troca de bateria da fechadura eletronica', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Smart 802] Troca de bateria da fechadura eletronica', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Smart 802') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Troca da tampa do vaso sanitario', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Smart 802] Troca da tampa do vaso sanitario', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Smart 802') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Conserto da descarga', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Smart 802] Conserto da descarga', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Smart 802') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Desentupimento do vaso sanitario', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Smart 802] Desentupimento do vaso sanitario', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Portiville 711') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Sanado vazamento no baneiro', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Portiville 711] Sanado vazamento no baneiro', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Portiville 711') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Troca de lampada', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Portiville 711] Troca de lampada', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Portiville 711') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Troca de bateria da fechadura eletronica', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Portiville 711] Troca de bateria da fechadura eletronica', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Portiville 307') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Troca de Luminaria', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Portiville 307] Troca de Luminaria', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Walter 1010') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Troca de Luminaria', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Walter 1010] Troca de Luminaria', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Walter 1010') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Reparo na perciana', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Walter 1010] Reparo na perciana', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Walter 1010') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Reparo no chuveiro', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Walter 1010] Reparo no chuveiro', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Sky 910') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Conserto do box', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Sky 910] Conserto do box', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Sky 910') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Conserto da caixa de descarga', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Sky 910] Conserto da caixa de descarga', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Facilites 110') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Sanado vazamento no vaso sanitario', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Facilites 110] Sanado vazamento no vaso sanitario', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Sky 1304') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Troca de Luminaria', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Sky 1304] Troca de Luminaria', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Sky 1304') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Desentupimento do dreno do ar', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Sky 1304] Desentupimento do dreno do ar', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Soho 210') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Reparo na tampa da maquina de lavar', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Soho 210] Reparo na tampa da maquina de lavar', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Soho 210') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Desentupimento do vaso sanitario', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Soho 210] Desentupimento do vaso sanitario', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Orlx 303') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Conserto da mesa de jantar', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Orlx 303] Conserto da mesa de jantar', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Sky 1308') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Conserto da porta do guarda roupa', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Sky 1308] Conserto da porta do guarda roupa', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Sky 1308') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Troca da led do lustre', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Sky 1308] Troca da led do lustre', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('SD 1102') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Conserto das duchas', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO SD 1102] Conserto das duchas', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Smart 902') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Troca de Luminaria', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Smart 902] Troca de Luminaria', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Smart 902') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Desentupimento do vaso sanitario', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Smart 902] Desentupimento do vaso sanitario', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Smart 902') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Conserto da ducha', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Smart 902] Conserto da ducha', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Promenade 1108') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Conserto do fogao', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Promenade 1108] Conserto do fogao', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Promenade 1108') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Conserto da tomada', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Promenade 1108] Conserto da tomada', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('SD 501') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Conserto na torneira da pia da cozinha', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO SD 501] Conserto na torneira da pia da cozinha', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('SD 510') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Conserto no movl da tv da sala', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO SD 510] Conserto no movl da tv da sala', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('SD 506') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Desentupimento do vaso sanitario', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO SD 506] Desentupimento do vaso sanitario', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Sky 1306') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Trava de bateria da fechadura eletronica', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Sky 1306] Trava de bateria da fechadura eletronica', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Sky 1306') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Sanado vazamento no baneiro', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Sky 1306] Sanado vazamento no baneiro', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Sky 1303') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', '2 desentupimentos de vaso sanitario', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Sky 1303] 2 desentupimentos de vaso sanitario', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Mariela 706') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Conserto do box', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Mariela 706] Conserto do box', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Mariela 706') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Conserto da cortina da sala', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Mariela 706] Conserto da cortina da sala', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Walter 508') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Sonado vazamento do banheiro', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Walter 508] Sonado vazamento do banheiro', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Walter 508') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Conserto do box', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Walter 508] Conserto do box', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Piox 704') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Troca de bateria da fechadura eletronica', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Piox 704] Troca de bateria da fechadura eletronica', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Lotus 814') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Conserto da caixa de descarga', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Lotus 814] Conserto da caixa de descarga', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Lotus 814') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-30', 'Desentupimento do vaso sanitario', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Lotus 814] Desentupimento do vaso sanitario', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Fiordes 106') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Troca de interruptores', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Fiordes 106] Troca de interruptores', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Infinity 2') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Conserto do chuveiro', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Infinity 2] Conserto do chuveiro', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Iloa j002') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Troca de luminarias', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Iloa j002] Troca de luminarias', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Iloa j002') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Troca de cifao', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Iloa j002] Troca de cifao', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Iloa j002') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Troca de interruptores', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Iloa j002] Troca de interruptores', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Iloa C204') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Conserto da caixa de descarga', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Iloa C204] Conserto da caixa de descarga', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('New time 424') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Conserto do chuveiro', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO New time 424] Conserto do chuveiro', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Sky 1205') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Conserto de vazamento no box', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Sky 1205] Conserto de vazamento no box', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Sky 1205') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Reparo no chuveiro', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Sky 1205] Reparo no chuveiro', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('SD 705') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Troca de luminaria', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO SD 705] Troca de luminaria', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Terraço da barra 107') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Troca de chuveiro', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Terraço da barra 107] Troca de chuveiro', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Terraço 008') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Troca de ralos', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Terraço 008] Troca de ralos', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Terraço da barra 107') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Troca de rabicho', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Terraço da barra 107] Troca de rabicho', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Soho 103') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Conserto do chuveiro', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Soho 103] Conserto do chuveiro', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Soho 103') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Colagem', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Soho 103] Colagem', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Walter 1110') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Conserto do trinco do banheiro', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Walter 1110] Conserto do trinco do banheiro', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Walter 1013') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Conserto de uma poltrona', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Walter 1013] Conserto de uma poltrona', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Walter 1013') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Conserto da cortina', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Walter 1013] Conserto da cortina', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Walter 1013') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Reparo na geladeira', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Walter 1013] Reparo na geladeira', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Walter 1013') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Troca de cifao', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Walter 1013] Troca de cifao', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Soho 103') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Conserto de cadeiras da mesa de jantar', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Soho 103] Conserto de cadeiras da mesa de jantar', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Sky 1205') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Reparo no dreno do ar condicionado', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Sky 1205] Reparo no dreno do ar condicionado', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Walter 1110') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Troca de registro do chuveiro', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Walter 1110] Troca de registro do chuveiro', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('New time 303') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Desobstruçao do dreno', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO New time 303] Desobstruçao do dreno', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Rio negro 501') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Desentupimento do vaso sanitario', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Rio negro 501] Desentupimento do vaso sanitario', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Rio negro 501') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Troca de chuveiro', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Rio negro 501] Troca de chuveiro', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Time 405') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Desobstruçao do dreno do ar', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Time 405] Desobstruçao do dreno do ar', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Rio negro 402') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Desobstruçao do dreno do ar', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Rio negro 402] Desobstruçao do dreno do ar', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Walter 1111') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Conserto de uma banqueta', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Walter 1111] Conserto de uma banqueta', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Walter 1111') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Conserto do vaso sanitario', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Walter 1111] Conserto do vaso sanitario', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Walter 1111') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Reparo na geladeira', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Walter 1111] Reparo na geladeira', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Liv 1210') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Troca da tampa do vaso sanitario+mao de obra', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Liv 1210] Troca da tampa do vaso sanitario+mao de obra', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Ametista 103') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Troca de interruptores', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Ametista 103] Troca de interruptores', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Ametista 103') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Reparo na descarga', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Ametista 103] Reparo na descarga', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Loft 401') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Desobstruçao do dreno', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Loft 401] Desobstruçao do dreno', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Liv 911') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Conserto do chuveiro', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Liv 911] Conserto do chuveiro', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('SD3 808') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Troca de ducha+mao de obra', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO SD3 808] Troca de ducha+mao de obra', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('SD3 808') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Reparo no vaso', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO SD3 808] Reparo no vaso', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('SD3 808') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Reparo na cortina do quarto', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO SD3 808] Reparo na cortina do quarto', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Dom felipe 601') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Conserto da luminaria da cozinha e do quarto', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Dom felipe 601] Conserto da luminaria da cozinha e do quarto', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('St.barth') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Reparo no quadro de energia', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO St.barth] Reparo no quadro de energia', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('St.barth') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Reparo na maquina de lavar', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO St.barth] Reparo na maquina de lavar', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Walter 909') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Reparo na marçaneta', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Walter 909] Reparo na marçaneta', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Walter 1111') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Instalaçao do cofre', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Walter 1111] Instalaçao do cofre', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Lorenzo 607') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Reparo na tv da sala', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Lorenzo 607] Reparo na tv da sala', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Piox 704') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Reparo no vaso sanitario', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Piox 704] Reparo no vaso sanitario', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Sky 703') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Troca da tampa do vaso+mao de obra', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Sky 703] Troca da tampa do vaso+mao de obra', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Sky 703') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Troca do cifao da pia', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Sky 703] Troca do cifao da pia', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Ibiza 507') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Colagem do roda pe', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Ibiza 507] Colagem do roda pe', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Ibiza 507') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Sanado vazamento do box do banheiro', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Ibiza 507] Sanado vazamento do box do banheiro', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Ibiza 507') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Reparo na torneira', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Ibiza 507] Reparo na torneira', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Sky 1205') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Vazamento', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Sky 1205] Vazamento', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Sky 1304') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Troca de chuveiro+mao de obra', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Sky 1304] Troca de chuveiro+mao de obra', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Sky 1304') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Troca de porta shampoo', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Sky 1304] Troca de porta shampoo', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Sky 1304') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Troca de lampada', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Sky 1304] Troca de lampada', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Walter 403') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Reparo na marçaneta da porta principal', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Walter 403] Reparo na marçaneta da porta principal', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Loft') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Reparo no fogao', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Loft] Reparo no fogao', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Lotus 814') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Reparo no chuveiro', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Lotus 814] Reparo no chuveiro', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Lotus') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Troca de ducha+mao de obra', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Lotus] Troca de ducha+mao de obra', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Ana maria 104') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Reparo na gaveta do armario', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Ana maria 104] Reparo na gaveta do armario', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Walter 1010') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Reparo no sofa cama', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Walter 1010] Reparo no sofa cama', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Ametista 103') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Reparo na cadeira', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Ametista 103] Reparo na cadeira', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Liv 406') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Reparo na cortina', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Liv 406] Reparo na cortina', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Liv 1011') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Reparo na tampa do vaso', 'servico_proprio', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Liv 1011] Reparo na tampa do vaso', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('New time 303') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', '1 secador de cabelo', 'material', 139.9, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO New time 303] 1 secador de cabelo', 139.9);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Liv 1011') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', '5 travesseiros', 'material', 210.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Liv 1011] 5 travesseiros', 210.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Liv 1011') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', '1 colher', 'material', 10.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Liv 1011] 1 colher', 10.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Liv 1011') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', '1 concha', 'material', 10.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Liv 1011] 1 concha', 10.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Liv 1011') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', '1 varal de pe', 'material', 149.9, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Liv 1011] 1 varal de pe', 149.9);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('SD3 808') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', '1 ferro de passar', 'material', 70.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO SD3 808] 1 ferro de passar', 70.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('SD 802') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Conjunto de copos/ 6unidades', 'material', 20.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO SD 802] Conjunto de copos/ 6unidades', 20.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('SD 509') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', '2 travesseiros', 'material', 84.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO SD 509] 2 travesseiros', 84.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Time 319') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', '4 travesseiros', 'material', 168.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Time 319] 4 travesseiros', 168.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Walter 1111') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', '2 travesseiros', 'material', 84.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Walter 1111] 2 travesseiros', 84.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Walter 1111') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', '1 colchao de solteiro', 'material', 455.5, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Walter 1111] 1 colchao de solteiro', 455.5);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Smart 802') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Caixa de copos', 'material', 20.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Smart 802] Caixa de copos', 20.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Time 1502') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', '1 cifao', 'material', 10.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Time 1502] 1 cifao', 10.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Ibiza 507') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Secador de cabelo', 'material', 169.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Ibiza 507] Secador de cabelo', 169.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('SD 504') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', '3 colheres de silicone', 'material', 45.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO SD 504] 3 colheres de silicone', 45.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('SD 501') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', '2 colchoes de solteiro', 'material', 911.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO SD 501] 2 colchoes de solteiro', 911.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Rio negro') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Chuveiro', 'material', 123.9, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Rio negro] Chuveiro', 123.9);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Sky 703') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Tampa de vaso sanitario', 'material', 80.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Sky 703] Tampa de vaso sanitario', 80.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Sky 703') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Cifao', 'material', 10.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Sky 703] Cifao', 10.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Wish 501') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Cifao', 'material', 10.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Wish 501] Cifao', 10.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Portville 307') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Ventilador', 'material', 0.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Portville 307] Ventilador', 0.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Portiville 307') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Tampa de vaso sanitario', 'material', 80.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Portiville 307] Tampa de vaso sanitario', 80.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Walter 508') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Panela de presao', 'material', 60.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Walter 508] Panela de presao', 60.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Walter 508') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Faca grande', 'material', 25.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Walter 508] Faca grande', 25.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Walter 403') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Secador de cabelo', 'material', 169.9, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Walter 403] Secador de cabelo', 169.9);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Terraço 008') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', '3 depositos', 'material', 25.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Terraço 008] 3 depositos', 25.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Polinesia 203') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Logistica', 'logistica', 32.5, 0, 'empresa', '2026-04-01', 'logistica');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Polinesia 203] Logistica', 32.5);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Iloa s102') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Gasolina', 'logistica', 36.0, 0, 'empresa', '2026-04-01', 'logistica');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Iloa s102] Gasolina', 36.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Iloa C204') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Gasolina', 'logistica', 236.0, 0, 'empresa', '2026-04-01', 'logistica');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Iloa C204] Gasolina', 236.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Iloa j002') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Gasolina', 'logistica', 56.0, 0, 'empresa', '2026-04-01', 'logistica');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Iloa j002] Gasolina', 56.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Caravelas 206') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Gasolina', 'logistica', 220.0, 0, 'empresa', '2026-04-01', 'logistica');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Caravelas 206] Gasolina', 220.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Frances 14') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Gasolina', 'logistica', 136.0, 0, 'empresa', '2026-04-01', 'logistica');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Frances 14] Gasolina', 136.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Frances 14') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Pintura', 'servico_proprio', 400.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Frances 14] Pintura', 400.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Frances 14') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Mao de obra', 'servico_proprio', 200.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Frances 14] Mao de obra', 200.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Frances 14') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Gasolina', 'logistica', 80.0, 0, 'empresa', '2026-04-01', 'logistica');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Frances 14] Gasolina', 80.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('SD 705') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Luminaria', 'material', 25.67, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO SD 705] Luminaria', 25.67);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Time 320') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Cuscuizeira', 'material', 38.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Time 320] Cuscuizeira', 38.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Time 1502') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-30', 'Peça para ar condicionado', 'material', 200.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Time 1502] Peça para ar condicionado', 200.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Ibiza 507') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-30', 'Instalacao do ar condicionado', 'servico_terceirizado', 150.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Ibiza 507] Instalacao do ar condicionado', 150.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('SD 705') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.manutencoes (conta_id, imovel_id, data, descricao, categoria, custo, valor_cobrado, rateio, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'Lavagem do sofa', 'servico_terceirizado', 248.0, 0, 'empresa', '2026-04-01', 'manutencao');
    v_inseridos_manut := v_inseridos_manut + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO SD 705] Lavagem do sofa', 248.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Polinesia 205') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.servicos_operacionais (conta_id, imovel_id, data, tipo, custo_real, valor_cobrado, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-05', 'faxina', 150.0, 0, '2026-04-01', 'faxina');
    v_inseridos_serv := v_inseridos_serv + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Polinesia 205] Faxina', 150.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Polinesia 205') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.servicos_operacionais (conta_id, imovel_id, data, tipo, custo_real, valor_cobrado, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-11', 'faxina', 150.0, 0, '2026-04-01', 'faxina');
    v_inseridos_serv := v_inseridos_serv + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Polinesia 205] Faxina', 150.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Polinesia 205') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.servicos_operacionais (conta_id, imovel_id, data, tipo, custo_real, valor_cobrado, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-16', 'faxina', 150.0, 0, '2026-04-01', 'faxina');
    v_inseridos_serv := v_inseridos_serv + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Polinesia 205] Faxina', 150.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Polinesia 205') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.servicos_operacionais (conta_id, imovel_id, data, tipo, custo_real, valor_cobrado, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-21', 'faxina', 150.0, 0, '2026-04-01', 'faxina');
    v_inseridos_serv := v_inseridos_serv + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Polinesia 205] Faxina', 150.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Polinesia 205') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.servicos_operacionais (conta_id, imovel_id, data, tipo, custo_real, valor_cobrado, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'faxina', 100.0, 0, '2026-04-01', 'faxina');
    v_inseridos_serv := v_inseridos_serv + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Polinesia 205] Produto de limpeza', 100.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Polinesia 205') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.servicos_operacionais (conta_id, imovel_id, data, tipo, custo_real, valor_cobrado, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'lavanderia', 400.0, 0, '2026-04-01', 'lavanderia');
    v_inseridos_serv := v_inseridos_serv + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Polinesia 205] Lavanderia', 400.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Polinesia 203') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.servicos_operacionais (conta_id, imovel_id, data, tipo, custo_real, valor_cobrado, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-02', 'faxina', 150.0, 0, '2026-04-01', 'faxina');
    v_inseridos_serv := v_inseridos_serv + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Polinesia 203] Faxina', 150.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Polinesia 203') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.servicos_operacionais (conta_id, imovel_id, data, tipo, custo_real, valor_cobrado, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-05', 'faxina', 150.0, 0, '2026-04-01', 'faxina');
    v_inseridos_serv := v_inseridos_serv + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Polinesia 203] Faxina', 150.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Polinesia 203') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.servicos_operacionais (conta_id, imovel_id, data, tipo, custo_real, valor_cobrado, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-15', 'faxina', 150.0, 0, '2026-04-01', 'faxina');
    v_inseridos_serv := v_inseridos_serv + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Polinesia 203] Faxina', 150.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Polinesia 203') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.servicos_operacionais (conta_id, imovel_id, data, tipo, custo_real, valor_cobrado, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-22', 'faxina', 150.0, 0, '2026-04-01', 'faxina');
    v_inseridos_serv := v_inseridos_serv + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Polinesia 203] Faxina', 150.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Polinesia 203') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.servicos_operacionais (conta_id, imovel_id, data, tipo, custo_real, valor_cobrado, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'lavanderia', 400.0, 0, '2026-04-01', 'lavanderia');
    v_inseridos_serv := v_inseridos_serv + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Polinesia 203] Lavanderia', 400.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Polinesia 203') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.servicos_operacionais (conta_id, imovel_id, data, tipo, custo_real, valor_cobrado, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'faxina', 100.0, 0, '2026-04-01', 'faxina');
    v_inseridos_serv := v_inseridos_serv + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Polinesia 203] Produto de limpeza', 100.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Gravata') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.servicos_operacionais (conta_id, imovel_id, data, tipo, custo_real, valor_cobrado, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-05', 'faxina', 100.0, 0, '2026-04-01', 'faxina');
    v_inseridos_serv := v_inseridos_serv + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Gravata] Faxina', 100.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Iloa s102') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.servicos_operacionais (conta_id, imovel_id, data, tipo, custo_real, valor_cobrado, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-21', 'faxina', 70.0, 0, '2026-04-01', 'faxina');
    v_inseridos_serv := v_inseridos_serv + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Iloa s102] Faxina', 70.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Iloa s102') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.servicos_operacionais (conta_id, imovel_id, data, tipo, custo_real, valor_cobrado, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-05', 'faxina', 70.0, 0, '2026-04-01', 'faxina');
    v_inseridos_serv := v_inseridos_serv + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Iloa s102] Faxina', 70.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Iloa C204') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.servicos_operacionais (conta_id, imovel_id, data, tipo, custo_real, valor_cobrado, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-05', 'faxina', 200.0, 0, '2026-04-01', 'faxina');
    v_inseridos_serv := v_inseridos_serv + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Iloa C204] Faxina', 200.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Iloa C204') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.servicos_operacionais (conta_id, imovel_id, data, tipo, custo_real, valor_cobrado, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-08', 'faxina', 200.0, 0, '2026-04-01', 'faxina');
    v_inseridos_serv := v_inseridos_serv + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Iloa C204] Faxina', 200.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Iloa C204') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.servicos_operacionais (conta_id, imovel_id, data, tipo, custo_real, valor_cobrado, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-19', 'faxina', 200.0, 0, '2026-04-01', 'faxina');
    v_inseridos_serv := v_inseridos_serv + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Iloa C204] Faxina', 200.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Iloa C204') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.servicos_operacionais (conta_id, imovel_id, data, tipo, custo_real, valor_cobrado, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-21', 'faxina', 200.0, 0, '2026-04-01', 'faxina');
    v_inseridos_serv := v_inseridos_serv + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Iloa C204] Faxina', 200.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Iloa C204') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.servicos_operacionais (conta_id, imovel_id, data, tipo, custo_real, valor_cobrado, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-27', 'faxina', 200.0, 0, '2026-04-01', 'faxina');
    v_inseridos_serv := v_inseridos_serv + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Iloa C204] Faxina', 200.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Iloa j002') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.servicos_operacionais (conta_id, imovel_id, data, tipo, custo_real, valor_cobrado, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-05', 'faxina', 85.0, 0, '2026-04-01', 'faxina');
    v_inseridos_serv := v_inseridos_serv + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Iloa j002] Faxina', 85.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Iloa j002') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.servicos_operacionais (conta_id, imovel_id, data, tipo, custo_real, valor_cobrado, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-20', 'faxina', 85.0, 0, '2026-04-01', 'faxina');
    v_inseridos_serv := v_inseridos_serv + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Iloa j002] Faxina', 85.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Caravelas 206') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.servicos_operacionais (conta_id, imovel_id, data, tipo, custo_real, valor_cobrado, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-08', 'faxina', 70.0, 0, '2026-04-01', 'faxina');
    v_inseridos_serv := v_inseridos_serv + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Caravelas 206] Faxina', 70.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Caravelas 206') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.servicos_operacionais (conta_id, imovel_id, data, tipo, custo_real, valor_cobrado, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-12', 'faxina', 70.0, 0, '2026-04-01', 'faxina');
    v_inseridos_serv := v_inseridos_serv + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Caravelas 206] Faxina', 70.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Caravelas 206') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.servicos_operacionais (conta_id, imovel_id, data, tipo, custo_real, valor_cobrado, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-21', 'faxina', 70.0, 0, '2026-04-01', 'faxina');
    v_inseridos_serv := v_inseridos_serv + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Caravelas 206] Faxina', 70.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Caravelas 206') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.servicos_operacionais (conta_id, imovel_id, data, tipo, custo_real, valor_cobrado, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'faxina', 70.0, 0, '2026-04-01', 'faxina');
    v_inseridos_serv := v_inseridos_serv + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Caravelas 206] Faxina', 70.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Patacho') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.servicos_operacionais (conta_id, imovel_id, data, tipo, custo_real, valor_cobrado, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-05', 'faxina', 200.0, 0, '2026-04-01', 'faxina');
    v_inseridos_serv := v_inseridos_serv + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Patacho] Faxina', 200.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Patacho') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.servicos_operacionais (conta_id, imovel_id, data, tipo, custo_real, valor_cobrado, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-21', 'faxina', 200.0, 0, '2026-04-01', 'faxina');
    v_inseridos_serv := v_inseridos_serv + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Patacho] Faxina', 200.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Frances 14') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.servicos_operacionais (conta_id, imovel_id, data, tipo, custo_real, valor_cobrado, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-05', 'faxina', 85.0, 0, '2026-04-01', 'faxina');
    v_inseridos_serv := v_inseridos_serv + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Frances 14] Faxina', 85.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Frances 14') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.servicos_operacionais (conta_id, imovel_id, data, tipo, custo_real, valor_cobrado, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-20', 'faxina', 85.0, 0, '2026-04-01', 'faxina');
    v_inseridos_serv := v_inseridos_serv + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Frances 14] Faxina', 85.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Frances 14') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.servicos_operacionais (conta_id, imovel_id, data, tipo, custo_real, valor_cobrado, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-30', 'faxina', 85.0, 0, '2026-04-01', 'faxina');
    v_inseridos_serv := v_inseridos_serv + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Frances 14] Faxina', 85.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  SELECT id INTO v_imovel FROM public.imoveis
   WHERE conta_id = v_adolfo AND lower(codigo) = lower('Frances 14') LIMIT 1;
  IF v_imovel IS NOT NULL THEN
    INSERT INTO public.servicos_operacionais (conta_id, imovel_id, data, tipo, custo_real, valor_cobrado, mes_competencia, area)
    VALUES (v_adolfo, v_imovel, '2026-04-29', 'faxina', 150.0, 0, '2026-04-01', 'faxina');
    v_inseridos_serv := v_inseridos_serv + 1;
  ELSE
    INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
    VALUES (v_adolfo, '2026-04-01', 'diversos', '[ANTIGO Frances 14] Faxina pesada', 150.0);
    v_inseridos_custo := v_inseridos_custo + 1;
    v_local_nao_encontrado := v_local_nao_encontrado + 1;
  END IF;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'diversos', 'Reparo na geladeira (Mont blanc)', 0.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'diversos', 'Reparo no quadro de energia (Mont blanc)', 0.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'diversos', '2 colchoes de solteiro (Mont blanc)', 911.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'diversos', '2 tira manchas (Casa queen)', 113.38);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'diversos', 'Sabao (Casa queen)', 73.35);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'diversos', 'Essencia de roupas (Casa queen)', 531.2);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'diversos', 'Produto para roupa (Casa queen)', 85.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'diversos', 'Agua sanitaria (Casa queen)', 73.64);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'diversos', 'Agua sanitaria (Casa queen)', 47.6);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'diversos', 'Essencia de roupas (Casa queen)', 105.9);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'diversos', 'Alcool para essencia de roupas (Casa queen)', 54.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'diversos', 'Sacolas,2 bobinas e etiquetas para estoque (Casa queen)', 372.61);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'diversos', 'Alvejante (Casa queen)', 113.13);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'escritorio', 'Peixe (Casa queen)', 20.44);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'diversos', 'Pilhas (Estoque)', 216.84);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'escritorio', 'Conta de energia (Casa queen)', 1747.64);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'escritorio', '2 Fitas (Casa queen)', 25.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'escritorio', '3 bobinas e sacolas (Casa queen)', 373.86);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'diversos', '3 sifao e 2 tapas de vaso (Estoque)', 170.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'escritorio', 'Agua (Casa queen)', 36.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'escritorio', 'Ventilador (Casa queen)', 159.9);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'escritorio', 'Materiais (Casa queen)', 650.7);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'escritorio', 'internet (Casa queen)', 139.79);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'diversos', 'Varal reserva (Estoque)', 112.9);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'diversos', 'Luvas (Casa queen)', 25.4);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'diversos', 'Sanduicheira,6 copos,2 pilhas e faq 20pcs (Estoque)', 307.91);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'diversos', 'Jogo de copos (Estoque)', 17.99);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'diversos', 'Painel led e tom 2p+t (Casa queen)', 40.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'diversos', 'Ventilador grande (Casa queen)', 200.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'diversos', 'Materiais para conserto do teto da lavanderia (Casa queen)', 97.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'escritorio', 'Agua mineral (Casa queen)', 27.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'escritorio', 'Dinheiro para o matheus (Casa queen)', 500.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'escritorio', 'Gas de cozinha (Casa queen)', 150.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'diversos', 'Panos e sacos (Estoque)', 1600.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'diversos', 'Ventilador pequeno (Estoque)', 130.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'diversos', 'Secador (Estoque)', 139.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'diversos', 'Conserto da secadora 01 (Casa queen)', 400.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'diversos', 'Produtos de limpeza (Estoque)', 3633.07);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'diversos', 'Produtos  de limpeza (Estoque)', 3291.51);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'logistica', 'Moto extra para entrega de kits (Casa queen)', 150.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'logistica', 'Gasolina comum (Casa queen)', 25.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'logistica', 'Gasolina comum (Casa queen)', 25.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'logistica', 'Gasolina comum (Casa queen)', 90.62);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'logistica', 'Gasolina comum (Casa queen)', 25.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'logistica', 'Gasolina comum (Casa queen)', 27.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'logistica', 'Moto extra para entrega de kits (Casa queen)', 150.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'logistica', 'Gasolina comum (Casa queen)', 25.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'logistica', 'Gasolina comum (Casa queen)', 80.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'logistica', 'Gasolina comum (Casa queen)', 27.01);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'logistica', 'Gasolina comum (Casa queen)', 70.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'logistica', 'Moto extra para entrega de kits (Casa queen)', 150.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'logistica', 'Oleo para moto (Casa queen)', 45.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'logistica', 'Gasolina comum (Casa queen)', 26.04);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'logistica', 'Oleo para moto (Casa queen)', 40.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'logistica', 'Remendo do pneu (Casa queen)', 25.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'logistica', 'Conserto da bicicleta (Casa queen)', 20.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'logistica', 'Gasolina comum (Casa queen)', 27.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'logistica', 'Gasolina comum (Casa queen)', 27.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'logistica', 'Gasolina comum (Casa queen)', 100.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'logistica', 'Gasolina comum (Casa queen)', 24.52);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'logistica', 'Gasolina comum (Casa queen)', 80.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'logistica', 'Gasolina comum (Casa queen)', 21.62);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'logistica', 'Gasolina comum (Casa queen)', 20.12);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'logistica', 'Gasolina comum (Casa queen)', 70.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'logistica', 'Gasolina comum (Casa queen)', 19.69);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'logistica', 'Revisao e troca de peças/ pop (Casa queen)', 600.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'logistica', 'Gasolina comum (Casa queen)', 70.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'logistica', 'Pagamento da transferencia da pop (Casa queen)', 850.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'diversos', 'Chave teste (Casa queen)', 8.8);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'folha', 'Felipe (Casa queen)', 1621.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'folha', 'Eduardo (Casa queen)', 810.5);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'folha', 'Jailma (Casa queen)', 810.5);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'folha', 'Mikaelly (Casa queen)', 590.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'folha', 'Adriana (Casa queen)', 1185.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'folha', 'Jackeline (Casa queen)', 920.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'folha', 'Carla (Casa queen)', 830.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'folha', 'Mayara (Casa queen)', 575.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'folha', 'Andreia (Casa queen)', 950.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'folha', 'Rubenita (Casa queen)', 670.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'folha', 'Raniele (Casa queen)', 1110.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'folha', 'Wanessa (Casa queen)', 1135.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'folha', 'Jane (Casa queen)', 715.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'folha', 'Jailma (Casa queen)', 1125.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'folha', 'Nara (Casa queen)', 1095.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'folha', 'Val (Casa queen)', 970.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'folha', 'Luiz (Casa queen)', 980.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'folha', 'Douglas (Casa queen)', 800.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'folha', 'Yngrid (Casa queen)', 1510.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'folha', 'Cicera (Casa queen)', 2230.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'folha', 'Cleia (Casa queen)', 5086.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'folha', 'Marconi (Casa queen)', 1820.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'folha', 'Ademilson (Casa queen)', 1750.0);
  v_inseridos_custo := v_inseridos_custo + 1;
  INSERT INTO public.custos_fixos (conta_id, mes_competencia, categoria, descricao, valor)
  VALUES (v_adolfo, '2026-04-01', 'folha', 'Julia (Casa queen)', 1018.5);
  v_inseridos_custo := v_inseridos_custo + 1;
  RAISE NOTICE 'Inseridos: manutencoes=%, servicos=%, custos_fixos=%, locais sem match=%',
    v_inseridos_manut, v_inseridos_serv, v_inseridos_custo, v_local_nao_encontrado;
END $$;
