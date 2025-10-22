// src/pages/api/update-event.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import multiparty from "multiparty";
import fs from "fs/promises";
import path from "path";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const form = new multiparty.Form();

  form.parse(req, async (err: any, fields: any, files: any) => {
    if (err) return res.status(500).json({ error: "Erro ao processar formulário" });

    try {
      const id = Number(fields.id?.[0]);
      if (!id) return res.status(400).json({ error: "ID não fornecido" });

      // 🔹 Campos do evento
      const updates: any = {
        title: fields.title?.[0] || "",
        local: fields.local?.[0] || "",
        date: fields.date?.[0] || null,
        category_id: fields.categoryId?.[0] ? Number(fields.categoryId[0]) : null,
        section_id: fields.sectionId?.[0] ? Number(fields.sectionId[0]) : null,
        description: fields.description?.[0] || "",
        address: fields.address?.[0] || "",
        phone: fields.phone?.[0] || "",
        map_embed: fields.map_embed?.[0] || "",
        type: fields.type?.[0] || "visit",
        external_link: fields.external_link?.[0] || "",
      };

      // 🔹 Nova imagem principal
      const imageFile = files.image?.[0];
      if (imageFile) {
        const buffer = await fs.readFile(imageFile.path);
        const fileName = `main/${Date.now()}-${path.basename(imageFile.originalFilename)}`;
        const { error } = await supabase.storage
          .from("event-images")
          .upload(fileName, buffer, { contentType: imageFile.headers["content-type"] });
        if (error) throw error;

        const { data: publicUrl } = supabase.storage
          .from("event-images")
          .getPublicUrl(fileName);
        updates.image = publicUrl.publicUrl;
      }

      // 🔹 Galeria
      const galleryFiles = files.gallery || [];
      let galleryUrls = fields.galleryUrls ? JSON.parse(fields.galleryUrls[0]) : [];

      for (const file of galleryFiles) {
        const buffer = await fs.readFile(file.path);
        const fileName = `gallery/${Date.now()}-${path.basename(file.originalFilename)}`;
        const { error } = await supabase.storage
          .from("events")
          .upload(fileName, buffer, { contentType: file.headers["content-type"] });
        if (error) throw error;

        const { data: publicUrl } = supabase.storage
          .from("events")
          .getPublicUrl(fileName);
        galleryUrls.push(publicUrl.publicUrl);
      }
      updates.gallery = galleryUrls;

      // 🔹 Atualizar evento
      const { error: updateError } = await supabase
        .from("events")
        .update(updates)
        .eq("id", id);
      if (updateError) throw updateError;

      // 🔹 Atualizar horários de funcionamento
      const openingHours = fields.openingHours ? JSON.parse(fields.openingHours[0]) : [];
      if (openingHours.length > 0) {
        // Deleta horários antigos do evento
        const { error: deleteError } = await supabase
          .from("opening_hours")
          .delete()
          .eq("event_id", id);
        if (deleteError) throw deleteError;

        // Insere os novos horários
        const formattedHours = openingHours.map((h: any) => ({
          event_id: id,
          weekday: h.weekday,
          open_time: h.open_time || null,
          close_time: h.close_time || null,
          is_closed: !!h.is_closed,
        }));

        const { error: hoursError } = await supabase
          .from("opening_hours")
          .insert(formattedHours);
        if (hoursError) throw hoursError;
      }

      res.status(200).json({ success: true });
    } catch (error: any) {
      console.error("Erro ao atualizar evento:", error);
      res.status(500).json({ error: error.message });
    }
  });
}
