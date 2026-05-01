import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { monthInputValue } from "@/lib/format";

let cachedMes: string | null =
  typeof window !== "undefined" ? sessionStorage.getItem("latest_competencia") : null;
let inflight: Promise<string | null> | null = null;

async function fetchLatest(): Promise<string | null> {
  if (cachedMes) return cachedMes;
  if (!inflight) {
    inflight = (async () => {
      const { data } = await supabase
        .from("reservas")
        .select("mes_competencia")
        .order("mes_competencia", { ascending: false })
        .limit(1);
      const mc = data?.[0]?.mes_competencia as string | undefined;
      if (mc) {
        cachedMes = mc.slice(0, 7);
        try { sessionStorage.setItem("latest_competencia", cachedMes); } catch {}
      }
      return cachedMes;
    })();
  }
  return inflight;
}

/**
 * Returns [mes, setMes]. Initial value is the most recent month with reservations
 * (cached across navigation). Falls back to current month while loading.
 */
export function useCompetenciaState(): [string, (m: string) => void] {
  const [mes, setMes] = useState<string>(cachedMes || monthInputValue());
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (touched || cachedMes) return;
    let cancelled = false;
    fetchLatest().then((v) => {
      if (!cancelled && v && !touched) setMes(v);
    });
    return () => { cancelled = true; };
  }, [touched]);

  return [mes, (m: string) => { setTouched(true); setMes(m); }];
}
