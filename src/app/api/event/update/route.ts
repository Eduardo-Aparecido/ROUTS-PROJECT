// src/app/api/event/update/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import fs from "fs/promises";
import path from "path";
import multiparty from "multiparty";

// ⚙️ Inicializa o Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ❗ Desabilita o bodyParser (não é mais feito via `config` no App Router)
export const runtime = "nodejs"; // necessário para usar fs e multiparty

// ✅ Método PUT
export async function PUT(req: Request) {
  try {
    // Multiparty ainda funciona, mas precisa de um parse manual da stream
    const form = new multiparty.Form();

    const { fields, files } = await new Promise<{ fields: any; files: any }>(
      (resolve, reject) => {
        form.parse(req as any, (err: any, fields: any, files: any) => {
          if (err) reject(err);
          else resolve({ fields, files });
        });
      }
    );

    const id = Number(fields.id?.[0]);
    if (!id) {
      return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
    }

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

    // 🔹 Upload da imagem principal (se existir)
    const imageFile = files.image?.[0];
    if (imageFile) {
      const buffer = await fs.readFile(imageFile.path);
      const fileName = `main/${Date.now()}-${path.basename(imageFile.originalFilename)}`;
      const { error } = await supabase.storage
        .from("event-images")
        .upload(fileName, buffer, {
          contentType: imageFile.headers["content-type"],
        });

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

    // 🔹 Atualiza evento no Supabase
    const { error: updateError } = await supabase
      .from("events")
      .update(updates)
      .eq("id", id);

    if (updateError) throw updateError;

    // 🔹 Atualiza horários de funcionamento
    const openingHours = fields.openingHours ? JSON.parse(fields.openingHours[0]) : [];
    if (openingHours.length > 0) {
      // Deleta horários antigos
      const { error: deleteError } = await supabase
        .from("opening_hours")
        .delete()
        .eq("event_id", id);
      if (deleteError) throw deleteError;

      // Insere novos
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

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erro ao atualizar evento:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
