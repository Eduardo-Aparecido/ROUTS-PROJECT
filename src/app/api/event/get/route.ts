// src/app/api/event/get/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
    }

    const idNum = Number(id);
    if (Number.isNaN(idNum) || idNum <= 0) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // ⚠️ service role só no server
    );

    const { data, error } = await supabase
      .from("events")
      .select(
        `
        id,
        title,
        local,
        date,
        image,
        category_id,
        description,
        gallery,
        address,
        phone,
        map_embed,
        external_link,
        type,
        section_id,
        created_at
      `
      )
      .eq("id", idNum)
      .single();

    if (error) {
      console.error("Supabase error in get-event:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Evento não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ event: data });
  } catch (err: any) {
    console.error("Unhandled error in get-event:", err);
    return NextResponse.json(
      { error: err?.message || "Erro interno" },
      { status: 500 }
    );
  }
}
