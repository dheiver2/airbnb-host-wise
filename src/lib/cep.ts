// ViaCEP lookup
export async function lookupCep(cep: string): Promise<{
  endereco?: string; bairro?: string; cidade?: string; estado?: string;
} | null> {
  const clean = (cep ?? "").replace(/\D/g, "");
  if (clean.length !== 8) return null;
  try {
    const r = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
    if (!r.ok) return null;
    const data = await r.json();
    if (data.erro) return null;
    return {
      endereco: data.logradouro || "",
      bairro: data.bairro || "",
      cidade: data.localidade || "",
      estado: data.uf || "",
    };
  } catch { return null; }
}
