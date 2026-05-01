import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { monthInputValue } from "@/lib/format";

/**
 * Returns the YYYY-MM of the most recent month that has reservations.
 * Falls back to the current month while loading or if no data exists.
 * Cached in sessionStorage to avoid extra queries during navigation.
 */
export function useLatestCompetencia(): string {
  const cached = typeof window !== "undefined" ? sessionStorage.getItem("latest_competencia") : null;
  const [mes, setMes] = useState<string>(cached || monthInputValue());

  useEffect(() => {
    if (cached) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("reservas")
        .select("mes_competencia")
        .order("mes_competencia", { ascending: false })
        .limit(1);
      if (cancelled) return;
      const mc = data?.[0]?.mes_competencia as string | undefined;
      if (mc) {
        const value = mc.slice(0, 7);
        sessionStorage.setItem("latest_competencia", value);
        setMes(value);
      }
    })();
    return () => { cancelled = true; };
  }, [cached]);

  return mes;
}
