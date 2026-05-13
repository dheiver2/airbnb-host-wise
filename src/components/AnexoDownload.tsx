import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

/**
 * Botão que baixa um anexo do storage privado.
 * Gera uma signed URL on-demand (TTL curto) e abre em nova aba.
 *
 * Anexos antigos (pré-migration storage privado) que tinham `url` pública
 * armazenado no JSON não funcionam mais — este componente ignora `url` e usa
 * só `path` pra gerar acesso autenticado.
 */
export function AnexoDownload({ path, nome }: { path: string; nome?: string }) {
  const [loading, setLoading] = useState(false);

  async function baixar() {
    if (!path) {
      toast.error("Anexo sem caminho — registro antigo");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .storage
      .from("anexos")
      .createSignedUrl(path, 60); // 60s é suficiente pra o navegador iniciar o download
    setLoading(false);

    if (error || !data?.signedUrl) {
      toast.error(`Falha ao gerar link${error?.message ? `: ${error.message}` : ""}`);
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <Button
      size="icon"
      variant="ghost"
      className="h-7 w-7 shrink-0"
      onClick={baixar}
      disabled={loading}
      title={nome ? `Baixar ${nome}` : "Baixar"}
    >
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
    </Button>
  );
}
