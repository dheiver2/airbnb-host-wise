-- =============================================================
-- Liga payouts a investidores (FK + matching automático por recebedor)
-- =============================================================
-- Objetivo: tornar payouts.investidor_id explícito pra que DRE Investidor
-- subtraia corretamente os repasses diretos do Airbnb do "saldo a repassar".
--
-- Sem isto, DRE Investidor superestima o saldo (só desconta lançamentos
-- manuais da tabela `adiantamentos`, ignorando o que o Airbnb pagou direto
-- na conta do investidor via co-host).
-- =============================================================

-- 1. Coluna + index
ALTER TABLE public.payouts
  ADD COLUMN IF NOT EXISTS investidor_id uuid REFERENCES public.investidores(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_payouts_investidor ON public.payouts(investidor_id);

-- 2. Backfill: match exato (lower(nome) = lower(recebedor)) dentro da mesma conta
UPDATE public.payouts p
   SET investidor_id = i.id
  FROM public.investidores i
 WHERE p.investidor_id IS NULL
   AND p.is_sa7d = false
   AND p.conta_id = i.conta_id
   AND lower(i.nome) = lower(p.recebedor);

-- 3. Backfill fuzzy: o recebedor começa com o primeiro nome do investidor
--    (ex: "ANA SOUZA ALMEIDA" → investidor "Ana Souza"). Usa o nome mais
--    longo como tie-breaker pra evitar matches genéricos.
WITH candidates AS (
  SELECT
    p.id AS payout_id,
    i.id AS investidor_id,
    ROW_NUMBER() OVER (
      PARTITION BY p.id
      ORDER BY length(i.nome) DESC
    ) AS rn
  FROM public.payouts p
  JOIN public.investidores i
    ON i.conta_id = p.conta_id
   AND length(split_part(i.nome, ' ', 1)) >= 3
   AND lower(p.recebedor) LIKE lower(split_part(i.nome, ' ', 1)) || ' %'
  WHERE p.investidor_id IS NULL
    AND p.is_sa7d = false
)
UPDATE public.payouts p
   SET investidor_id = c.investidor_id
  FROM candidates c
 WHERE p.id = c.payout_id
   AND c.rn = 1;

-- 4. Trigger pra futuros inserts (Importar.tsx ou outros)
--    Roda BEFORE INSERT. Não sobrescreve investidor_id se já preenchido.
CREATE OR REPLACE FUNCTION public.payouts_auto_link_investidor()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NEW.investidor_id IS NOT NULL OR NEW.is_sa7d THEN
    RETURN NEW;
  END IF;

  -- Exato
  SELECT id INTO NEW.investidor_id
    FROM public.investidores
   WHERE conta_id = NEW.conta_id
     AND lower(nome) = lower(NEW.recebedor)
   LIMIT 1;

  -- Fuzzy (primeiro nome + espaço)
  IF NEW.investidor_id IS NULL THEN
    SELECT id INTO NEW.investidor_id
      FROM public.investidores
     WHERE conta_id = NEW.conta_id
       AND length(split_part(nome, ' ', 1)) >= 3
       AND lower(NEW.recebedor) LIKE lower(split_part(nome, ' ', 1)) || ' %'
     ORDER BY length(nome) DESC
     LIMIT 1;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tg_payouts_auto_link ON public.payouts;
CREATE TRIGGER tg_payouts_auto_link
  BEFORE INSERT ON public.payouts
  FOR EACH ROW EXECUTE FUNCTION public.payouts_auto_link_investidor();

-- 5. Diagnóstico (vai aparecer em NOTICES depois de rodar)
DO $$
DECLARE
  v_total_nao_sa7d int;
  v_linked int;
  v_orfaos int;
  rec record;
BEGIN
  SELECT COUNT(*) INTO v_total_nao_sa7d FROM public.payouts WHERE is_sa7d = false;
  SELECT COUNT(*) INTO v_linked        FROM public.payouts WHERE is_sa7d = false AND investidor_id IS NOT NULL;
  v_orfaos := v_total_nao_sa7d - v_linked;

  RAISE NOTICE '═══════════════════════════════════════';
  RAISE NOTICE 'Backfill payouts → investidor concluído';
  RAISE NOTICE '  Payouts não-SA7D totais: %', v_total_nao_sa7d;
  RAISE NOTICE '  Com investidor matched:  %', v_linked;
  RAISE NOTICE '  Órfãos (sem match):      %', v_orfaos;
  RAISE NOTICE '═══════════════════════════════════════';

  IF v_orfaos > 0 THEN
    RAISE NOTICE 'Top 10 recebedores órfãos (renomeie ou cadastre o investidor):';
    FOR rec IN (
      SELECT recebedor, COUNT(*) AS n, SUM(valor_pago) AS total
        FROM public.payouts
       WHERE is_sa7d = false AND investidor_id IS NULL
       GROUP BY recebedor
       ORDER BY total DESC
       LIMIT 10
    ) LOOP
      RAISE NOTICE '  % (% linhas, R$ %)', rec.recebedor, rec.n, rec.total;
    END LOOP;
  END IF;
END $$;
