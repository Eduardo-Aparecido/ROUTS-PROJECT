// src/app/api/sections/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// 🟢 GET - Buscar seções
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("sections")
      .select("id, name, description, sort_order, emoji, title")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return NextResponse.json({ sections: data });
  } catch (err: any) {
    console.error("Erro no GET /sections:", err);
    return NextResponse.json(
      { error: err.message || "Erro ao buscar seções" },
      { status: 500 }
    );
  }
}

// 🟡 POST - Criar seção
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, sort_order, emoji, title } = body;

    const { data, error } = await supabase
      .from("sections")
      .insert([
        {
          name,
          description: description || "",
          sort_order: sort_order ?? 0,
          emoji: emoji || "",
          title: title || "",
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, section: data });
  } catch (err: any) {
    console.error("Erro no POST /sections:", err);
    return NextResponse.json(
      { error: err.message || "Erro ao criar seção" },
      { status: 500 }
    );
  }
}

// 🟠 PUT - Atualizar seção
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, description, sort_order, emoji, title } = body;

    if (!id)
      return NextResponse.json({ error: "ID da seção é obrigatório" }, { status: 400 });

    const { data, error } = await supabase
      .from("sections")
      .update({
        name,
        description: description || "",
        sort_order: sort_order ?? 0,
        emoji: emoji || "",
        title: title || "",
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, section: data });
  } catch (err: any) {
    console.error("Erro no PUT /sections:", err);
    return NextResponse.json(
      { error: err.message || "Erro ao atualizar seção" },
      { status: 500 }
    );
  }
}

// 🔴 DELETE - Excluir seção
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id)
      return NextResponse.json({ error: "ID da seção é obrigatório" }, { status: 400 });

    const { error } = await supabase.from("sections").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Erro no DELETE /sections:", err);
    return NextResponse.json(
      { error: err.message || "Erro ao deletar seção" },
      { status: 500 }
    );
  }
}
