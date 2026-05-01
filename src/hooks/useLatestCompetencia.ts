import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { monthInputValue } from "@/lib/format";

const STORAGE_KEY = "latest_competencia_v2";

let cachedMes: string | null =
  typeof window !== "undefined" ? sessionStorage.getItem(STORAGE_KEY) : null;
let inflight: Promise<string | null> | null = null;

async function fetchLatest(): Promise<string | null> {
  if (!inflight) {
    inflight = (async () => {
      const { data, error } = await supabase
        .from("reservas")
        .select("mes_competencia")
        .order("mes_competencia", { ascending: false })
        .limit(1);
      if (error) {
        console.warn("[useLatestCompetencia] fetch error", error);
        return null;
      }
      const mc = data?.[0]?.mes_competencia as string | undefined;
      if (mc) {
        cachedMes = mc.slice(0, 7);
        try { sessionStorage.setItem(STORAGE_KEY, cachedMes); } catch {}
        return cachedMes;
      }
      return null;
    })();
  }
  return inflight;
}

/**
 * Returns [mes, setMes]. Initial value is the most recent month with reservations
 * (cached across navigation). Falls back to current month while loading.
 */
export function useCompetenciaState(): [string, (m: string) => void] {
  const [mes, setMesState] = useState<string>(cachedMes || monthInputValue());
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (touched) return;
    let cancelled = false;
    fetchLatest().then((v) => {
      if (!cancelled && v && !touched) setMesState(v);
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [mes, (m: string) => { setTouched(true); setMesState(m); }];
}
