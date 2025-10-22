// src/pages/api/upload-event.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";
import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido" });

  try {
    const form = new formidable.IncomingForm({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).json({ error: "Erro ao processar formulário" });

      // Salvar arquivos
      const mainFile = Array.isArray(files.image) ? files.image[0] : files.image;
      const galleryFiles = Array.isArray(files.gallery) ? files.gallery : files.gallery ? [files.gallery] : [];

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

      res.status(200).json({ message: "Evento cadastrado com sucesso!" });
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Erro ao salvar evento" });
  }
}
