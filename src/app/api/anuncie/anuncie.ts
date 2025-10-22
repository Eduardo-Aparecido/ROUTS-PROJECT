// src/pages/api/anuncie.ts
import { supabase } from "@/lib/supabaseClient";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { nome, empresa, telefone, email, mensagem } = req.body;

    if (!nome || !email || !mensagem) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes." });
    }

    const { error } = await supabase.from("anuncie_mensagens").insert([
      {
        nome,
        empresa,
        telefone,
        email,
        mensagem,
      },
    ]);

    if (error) {
      console.error("Erro ao inserir mensagem:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error("Erro ao processar requisição:", err);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
}
