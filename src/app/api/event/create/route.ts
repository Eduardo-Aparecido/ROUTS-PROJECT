// src/app/api/event/create/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import path from "path";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // 🔹 Campos de texto
    const title = (formData.get("title") as string) || "";
    const local = (formData.get("local") as string) || "";
    const date = (formData.get("date") as string) || null;
    const categoryId = Number(formData.get("categoryId")) || null;
    const sectionId = formData.get("sectionId") ? Number(formData.get("sectionId")) : null;
    const description = (formData.get("description") as string) || "";
    const address = (formData.get("address") as string) || "";
    const phone = (formData.get("phone") as string) || "";
    const map_embed = (formData.get("map_embed") as string) || "";
    const type = (formData.get("type") as string) || "visit";
    const external_link = (formData.get("external_link") as string) || "";

    const openingHoursRaw = formData.get("openingHours");
    const openingHours = openingHoursRaw
      ? JSON.parse(openingHoursRaw as string)
      : [];

    // 🔹 Upload da imagem principal
    let imageUrl: string | null = null;
    const imageFile = formData.get("image") as File | null;

    if (imageFile && imageFile.size > 0) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const fileName = `main/${Date.now()}-${path.basename(imageFile.name)}`;

      const { error } = await supabase.storage
        .from("event-images")
        .upload(fileName, buffer, {
          contentType: imageFile.type,
        });
      if (error) throw error;

      const { data } = supabase.storage.from("event-images").getPublicUrl(fileName);
      imageUrl = data.publicUrl;
    }

    // 🔹 Upload das imagens da galeria
    const galleryUrls: string[] = [];
    const galleryFiles = formData.getAll("gallery") as File[];

    for (const file of galleryFiles) {
      if (file.size === 0) continue;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const fileName = `gallery/${Date.now()}-${path.basename(file.name)}`;

      const { error } = await supabase.storage
        .from("events")
        .upload(fileName, buffer, {
          contentType: file.type,
        });
      if (error) throw error;

      const { data } = supabase.storage.from("events").getPublicUrl(fileName);
      galleryUrls.push(data.publicUrl);
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

      const { error: hoursError } = await supabase
        .from("opening_hours")
        .insert(formattedHours);
      if (hoursError) throw hoursError;
    }

    return NextResponse.json({ success: true, event: newEvent }, { status: 200 });
  } catch (error: any) {
    console.error("Erro ao criar evento:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
