// src/pages/api/get-event.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ⚠️ deve ser a service role key *somente no servidor*
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "ID é obrigatório" });
    }

    const idNum = Array.isArray(id) ? Number(id[0]) : Number(id);

    if (Number.isNaN(idNum) || idNum <= 0) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const { data, error } = await supabase
      .from("events")
      .select(
        `id,
         title,
         local,
         date,
         image,
         category_id,
         description,
         gallery,
         address,
         phone,
         map_embed,
         external_link,
         type,
         section_id,
         created_at`
      )
      .eq("id", idNum)
      .single();

    if (error) {
      // Supabase já retorna mensagens úteis — repassamos para debugging
      console.error("Supabase error in get-event:", error);
      return res.status(500).json({ error: error.message || "Erro interno ao buscar evento" });
    }

    if (!data) {
      return res.status(404).json({ error: "Evento não encontrado" });
    }

    // tudo ok
    return res.status(200).json({ event: data });
  } catch (err: any) {
    console.error("Unhandled error in get-event:", err);
    return res.status(500).json({ error: err?.message || "Erro interno" });
  }
}

// Note: Este endpoint busca um evento específico pelo ID.
// Ele é usado na página de detalhes do evento para carregar as informações completas.
// Certifique-se de que a tabela e os campos correspondam ao seu esquema no Supabase.