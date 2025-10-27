// src/app/api/event/create/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import multiparty from "multiparty";
import fs from "fs/promises";
import path from "path";

export const config = { api: { bodyParser: false } };

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Tipos próprios compatíveis com multiparty
type FormFields = Record<string, string[]>;
type FormFile = {
  fieldName: string;
  originalFilename?: string;
  path: string;
  headers: Record<string, string>;
  size: number;
};
type FormFiles = Record<string, FormFile[]>;

// Função para parsear multiparty com Promise
function parseForm(req: any): Promise<{ fields: FormFields; files: FormFiles }> {
  return new Promise((resolve, reject) => {
    const form = new multiparty.Form();
    form.parse(req, (err: Error | null, fields: FormFields, files: FormFiles) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export async function POST(req: Request) {
  try {
    // Como o App Router não usa NextApiRequest, precisamos converter o corpo para stream
    const buffers: Uint8Array[] = [];
    const reader = req.body?.getReader();
    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) buffers.push(value);
      }
    }
    const stream = Buffer.concat(buffers);
    (stream as any).headers = Object.fromEntries(req.headers.entries());

    const { fields, files } = await parseForm(stream);

    const title = fields.title?.[0] || "";
    const local = fields.local?.[0] || "";
    const date = fields.date?.[0] || null;
    const categoryId = Number(fields.categoryId?.[0]) || null;
    const sectionId = fields.sectionId?.[0] ? Number(fields.sectionId[0]) : null;
    const description = fields.description?.[0] || "";
    const address = fields.address?.[0] || "";
    const phone = fields.phone?.[0] || "";
    const map_embed = fields.map_embed?.[0] || "";
    const type = fields.type?.[0] || "visit";
    const external_link = fields.external_link?.[0] || "";
    const openingHours = fields.openingHours ? JSON.parse(fields.openingHours[0]) : [];

    // 🔹 Upload da imagem principal
    let imageUrl: string | null = null;
    const imageFile = files.image?.[0];
    if (imageFile) {
      const buffer = await fs.readFile(imageFile.path);
      const fileName = `main/${Date.now()}-${path.basename(imageFile.originalFilename || "image")}`;
      const { error } = await supabase.storage
        .from("event-images")
        .upload(fileName, buffer, { contentType: imageFile.headers["content-type"] });
      if (error) throw error;

      const { data: publicUrl } = supabase.storage.from("event-images").getPublicUrl(fileName);
      imageUrl = publicUrl.publicUrl;
    }

    // 🔹 Upload da galeria
    const galleryFiles = files.gallery || [];
    const galleryUrls: string[] = [];
    for (const file of galleryFiles) {
      const buffer = await fs.readFile(file.path);
      const fileName = `gallery/${Date.now()}-${path.basename(file.originalFilename || "file")}`;
      const { error } = await supabase.storage
        .from("events")
        .upload(fileName, buffer, { contentType: file.headers["content-type"] });
      if (error) throw error;

      const { data: publicUrl } = supabase.storage.from("events").getPublicUrl(fileName);
      galleryUrls.push(publicUrl.publicUrl);
    }

    // 🔹 Inserir evento no banco
    const { data: newEvent, error: eventError } = await supabase
      .from("events")
      .insert([
        {
          title,
          local,
          date,
          category_id: categoryId,
          section_id: sectionId,
          description,
          address,
          phone,
          map_embed,
          type,
          external_link,
          image: imageUrl,
          gallery: galleryUrls,
        },
      ])
      .select()
      .single();

    if (eventError) throw eventError;

    // 🔹 Inserir horários de funcionamento
    if (openingHours.length > 0) {
      const formattedHours = openingHours.map((h: any) => ({
        event_id: newEvent.id,
        weekday: h.weekday,
        open_time: h.open_time || null,
        close_time: h.close_time || null,
        is_closed: !!h.is_closed,
      }));

      const { error: hoursError } = await supabase.from("opening_hours").insert(formattedHours);
      if (hoursError) throw hoursError;
    }

    return NextResponse.json({ success: true, event: newEvent }, { status: 200 });
  } catch (error: any) {
    console.error("Erro ao criar evento:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
