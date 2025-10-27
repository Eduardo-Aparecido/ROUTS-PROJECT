// src/app/api/event/update/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge"; // ou "nodejs" se precisar de fs (aqui não precisa)

// 🔹 Supabase Client (apenas leitura/escrita normal)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PUT(req: Request) {
  try {
    const formData = await req.formData();

    const id = Number(formData.get("id"));
    if (!id) {
      return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
    }

    // 🔹 Monta objeto de atualização
    const updates: any = {
      title: formData.get("title") || "",
      local: formData.get("local") || "",
      date: formData.get("date") || null,
      category_id: formData.get("categoryId")
        ? Number(formData.get("categoryId"))
        : null,
      section_id: formData.get("sectionId")
        ? Number(formData.get("sectionId"))
        : null,
      description: formData.get("description") || "",
      address: formData.get("address") || "",
      phone: formData.get("phone") || "",
      map_embed: formData.get("map_embed") || "",
      type: formData.get("type") || "visit",
      external_link: formData.get("external_link") || "",
    };

    // 🔹 Upload da imagem principal (se existir)
    const imageFile = formData.get("image") as File | null;
    if (imageFile && imageFile.size > 0) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);

      const fileName = `main/${Date.now()}-${imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("event-images")
        .upload(fileName, buffer, { contentType: imageFile.type });

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage
        .from("event-images")
        .getPublicUrl(fileName);

      updates.image = publicUrl.publicUrl;
    }

    // 🔹 Galeria
    const galleryUrlsRaw = formData.get("galleryUrls") as string | null;
    let galleryUrls = galleryUrlsRaw ? JSON.parse(galleryUrlsRaw) : [];

    const galleryFiles = formData.getAll("gallery") as File[];
    for (const file of galleryFiles) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);
      const fileName = `gallery/${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from("events")
        .upload(fileName, buffer, { contentType: file.type });

      if (error) throw error;

      const { data: publicUrl } = supabase.storage
        .from("events")
        .getPublicUrl(fileName);

      galleryUrls.push(publicUrl.publicUrl);
    }
    updates.gallery = galleryUrls;

    // 🔹 Atualiza evento
    const { error: updateError } = await supabase
      .from("events")
      .update(updates)
      .eq("id", id);

    if (updateError) throw updateError;

    // 🔹 Horários
    const openingHoursRaw = formData.get("openingHours") as string | null;
    if (openingHoursRaw) {
      const openingHours = JSON.parse(openingHoursRaw);

      // Deleta antigos
      const { error: delErr } = await supabase
        .from("opening_hours")
        .delete()
        .eq("event_id", id);
      if (delErr) throw delErr;

      // Insere novos
      const formatted = openingHours.map((h: any) => ({
        event_id: id,
        weekday: h.weekday,
        open_time: h.open_time || null,
        close_time: h.close_time || null,
        is_closed: !!h.is_closed,
      }));

      const { error: insErr } = await supabase
        .from("opening_hours")
        .insert(formatted);
      if (insErr) throw insErr;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erro ao atualizar evento:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
