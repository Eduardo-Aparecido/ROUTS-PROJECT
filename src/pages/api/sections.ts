// src/pages/api/sections.ts
import { supabase } from "@/lib/supabaseClient";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case "GET": {
        const { data, error } = await supabase
          .from("sections")
          .select("id, name, description, sort_order, emoji, title")
          .order("sort_order", { ascending: true });

        if (error) throw error;

        return res.status(200).json({ sections: data });
      }

      case "POST": {
        const { name, description, sort_order, emoji, title } = req.body;

        const { data, error } = await supabase
          .from("sections")
          .insert([
            {
              name,
              description: description || "",
              sort_order: sort_order ?? 0,
              emoji: emoji || "",
              title: title || "",
            },
          ])
          .select()
          .single();

        if (error) throw error;

        return res.status(200).json({ success: true, section: data });
      }

      case "PUT": {
        const { id, name, description, sort_order, emoji, title } = req.body;

        if (!id) return res.status(400).json({ error: "ID da seção é obrigatório" });

        const { data, error } = await supabase
          .from("sections")
          .update({
            name,
            description: description || "",
            sort_order: sort_order ?? 0,
            emoji: emoji || "",
            title: title || "",
          })
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;

        return res.status(200).json({ success: true, section: data });
      }

      case "DELETE": {
        const { id } = req.body;

        if (!id) return res.status(400).json({ error: "ID da seção é obrigatório" });

        const { error } = await supabase.from("sections").delete().eq("id", id);
        if (error) throw error;

        return res.status(200).json({ success: true });
      }

      default:
        return res.status(405).json({ error: "Método não permitido" });
    }
  } catch (err: any) {
    console.error("Erro ao processar requisição:", err);
    return res.status(500).json({ error: err.message || "Erro interno no servidor" });
  }
}
