// src/pages/api/upload-event.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";
import formidable, { File, Files } from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: { bodyParser: false },
};

// 🔧 Função auxiliar com tipagem correta
const parseForm = (
  req: NextApiRequest
): Promise<{
  fields: Record<string, any>;
  files: Record<string, File | File[]>;
}> => {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: true });

    form.parse(req, (err, fields, files: Files) => {
      if (err) return reject(err);

      // 🔒 Remove `undefined` e força tipo seguro
      const safeFiles: Record<string, File | File[]> = {};

      Object.entries(files).forEach(([key, value]) => {
        if (value) {
          safeFiles[key] = Array.isArray(value) ? value : value;
        }
      });

      resolve({ fields, files: safeFiles });
    });
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { fields, files } = await parseForm(req);

    const mainImageFile = Array.isArray(files.image)
      ? files.image[0]
      : (files.image as File | undefined);

    const galleryFiles = Array.isArray(files.gallery)
      ? files.gallery
      : files.gallery
      ? [files.gallery as File]
      : [];

    let mainUrl = "";

    // 🖼️ Salva imagem principal localmente
    if (mainImageFile) {
      const data = fs.readFileSync(mainImageFile.filepath);
      const filename = `${Date.now()}_${mainImageFile.originalFilename || "image"}`;
      const filePath = path.join(process.cwd(), "public/uploads", filename);
      fs.writeFileSync(filePath, data);
      mainUrl = `/uploads/${filename}`;
    }

    // 🖼️ Salva imagens da galeria
    const galleryUrls: string[] = [];
    for (const file of galleryFiles) {
      const data = fs.readFileSync(file.filepath);
      const filename = `${Date.now()}_${file.originalFilename || "gallery"}`;
      const filePath = path.join(process.cwd(), "public/uploads", filename);
      fs.writeFileSync(filePath, data);
      galleryUrls.push(`/uploads/${filename}`);
    }

    // 💾 Salva evento no banco
    const { error: insertError } = await supabase.from("events").insert([
      {
        ...fields,
        image: mainUrl,
        gallery: JSON.stringify(galleryUrls), // ✅ força JSON
      },
    ]);

    if (insertError) throw insertError;

    res.status(200).json({ message: "Evento cadastrado com sucesso!" });
  } catch (err: any) {
    console.error("Erro ao salvar evento:", err);
    res.status(500).json({ error: "Erro ao salvar evento" });
  }
}
