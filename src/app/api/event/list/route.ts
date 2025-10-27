// src/app/api/event/list/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// 🔹 Criar cliente Supabase (no servidor)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ events: data });
  } catch (err: any) {
    console.error("Erro ao listar eventos:", err.message);
    return NextResponse.json(
      { error: "Erro ao listar eventos" },
      { status: 500 }
    );
  }
}

