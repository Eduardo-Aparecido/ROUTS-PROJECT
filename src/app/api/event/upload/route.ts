// src/app/api/event/upload/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import fs from "fs/promises";
import path from "path";
import formidable from "formidable";

// ⚙️ Inicializa Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 🚫 O App Router não usa mais `config.api.bodyParser`
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    // ⚙️ Criar uma instância do formidable
    const form = formidable({ multiples: true });

    // ⚡️ Parse manual da stream
    const { fields, files } = await new Promise<{ fields: any; files: any }>(
      (resolve, reject) => {
        form.parse(req as any, (err: any, fields: any, files: any) => {
          if (err) reject(err);
          else resolve({ fields, files });
        });
      }
    );

    // 🔹 Imagem principal
    const mainFile = Array.isArray(files.image) ? files.image[0] : files.image;
    let mainUrl = "";

    if (mainFile) {
      const buffer = await fs.readFile(mainFile.filepath);
      const fileName = `main/${Date.now()}-${path.basename(mainFile.originalFilename)}`;
      const { error } = await supabase.storage
        .from("event-images")
        .upload(fileName, buffer, {
          contentType: mainFile.mimetype || "image/jpeg",
        });
      if (error) throw error;

      const { data } = supabase.storage
        .from("event-images")
        .getPublicUrl(fileName);
      mainUrl = data.publicUrl;
    }

    // 🔹 Galeria
    const galleryFiles = Array.isArray(files.gallery)
      ? files.gallery
      : files.gallery
      ? [files.gallery]
      : [];

    const galleryUrls: string[] = [];

    for (const file of galleryFiles) {
      const buffer = await fs.readFile(file.filepath);
      const fileName = `gallery/${Date.now()}-${path.basename(file.originalFilename)}`;
      const { error } = await supabase.storage
        .from("events")
        .upload(fileName, buffer, { contentType: file.mimetype || "image/jpeg" });
      if (error) throw error;

      const { data } = supabase.storage.from("events").getPublicUrl(fileName);
      galleryUrls.push(data.publicUrl);
    }

    // 🔹 Insere o evento no banco
    const { error: insertError } = await supabase.from("events").insert([
      {
        title: fields.title?.[0] || "",
        local: fields.local?.[0] || "",
        date: fields.date?.[0] || null,
        category_id: fields.categoryId?.[0] ? Number(fields.categoryId[0]) : null,
        description: fields.description?.[0] || "",
        address: fields.address?.[0] || "",
        phone: fields.phone?.[0] || "",
        map_embed: fields.map_embed?.[0] || "",
        type: fields.type?.[0] || "visit",
        image: mainUrl,
        gallery: galleryUrls,
      },
    ]);

    if (insertError) throw insertError;

    return NextResponse.json({ message: "Evento criado com sucesso!" });
  } catch (err: any) {
    console.error("Erro ao criar evento:", err);
    return NextResponse.json(
      { error: err.message || "Erro ao salvar evento" },
      { status: 500 }
    );
  }
}
