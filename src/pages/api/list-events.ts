// src/pages/api/list-events.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Método não permitido" });

  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return res.status(200).json(data);
  } catch (err: any) {
    console.error("Erro ao listar eventos:", err.message);
    return res.status(500).json({ error: "Erro ao listar eventos" });
  }
}
