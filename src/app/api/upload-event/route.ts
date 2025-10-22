// src/app/api/upload-event/route.ts
import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import formidable from "formidable";
import fs from "fs";
import path from "path";

// 🔹 Desativa o parsing automático do Next
export const config = {
  api: { bodyParser: false },
};

export async function POST(req: NextRequest) {
  try {
    const buffer = await req.arrayBuffer();
    const form = new formidable.IncomingForm({ multiples: true });
    const tmpFile = Buffer.from(buffer);

    // 🔹 Cria uma promise para parsear o formulário
    const parseForm = () =>
      new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
        form.parse({ body: tmpFile } as any, (err, fields, files) => {
          if (err) reject(err);
          else resolve({ fields, files });
        });
      });

    const { fields, files } = await parseForm();

    // Salvar arquivos
    const mainFile = Array.isArray(files.image) ? files.image[0] : files.image;
    const galleryFiles = Array.isArray(files.gallery)
      ? files.gallery
      : files.gallery
      ? [files.gallery]
      : [];

    let mainUrl = "";
    if (mainFile) {
      const data = fs.readFileSync(mainFile.filepath);
      const filename = `${Date.now()}_${mainFile.originalFilename || "image"}`;
      const filePath = path.join(process.cwd(), "public/uploads", filename);
      fs.writeFileSync(filePath, data);
      mainUrl = `/uploads/${filename}`;
    }

    const galleryUrls: string[] = [];
    for (const file of galleryFiles) {
      const data = fs.readFileSync(file.filepath);
      const filename = `${Date.now()}_${file.originalFilename || "gallery"}`;
      const filePath = path.join(process.cwd(), "public/uploads", filename);
      fs.writeFileSync(filePath, data);
      galleryUrls.push(`/uploads/${filename}`);
    }

    const { error } = await supabase.from("events").insert([
      {
        ...fields,
        image: mainUrl,
        gallery: JSON.stringify(galleryUrls),
      },
    ]);

    if (error) throw error;

    return new Response(JSON.stringify({ message: "Evento cadastrado com sucesso!" }), { status: 200 });
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Erro ao salvar evento" }), { status: 500 });
  }
}
