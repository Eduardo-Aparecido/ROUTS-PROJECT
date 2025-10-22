// src/pages/api/chat.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { userId, message } = req.body;

    // 🔹 Validação básica
    if (!userId || !message) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes" });
    }

    // Aqui você poderia salvar no Supabase se quiser
    // await supabase.from("chat_messages").insert([{ user_id: userId, content: message }]);

    return res.status(200).json({
      success: true,
      info: "Chat recebido com sucesso",
      userId,
      message,
    });
  } catch (error: any) {
    console.error("Erro no chat:", error);
    return res.status(500).json({ error: error.message });
  }
}
