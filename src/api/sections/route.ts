import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

// ✅ GET - listar seções
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("sections")
      .select("id, name, description, sort_order, emoji, title")
      .order("sort_order", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ sections: data });
  } catch (error: any) {
    console.error("Erro ao buscar seções:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ POST - criar nova seção
export async function POST(req: Request) {
  try {
    const { name, description, sort_order, emoji, title } = await req.json();

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
  } catch (error: any) {
    console.error("Erro ao criar seção:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ PUT - atualizar seção existente
export async function PUT(req: Request) {
  try {
    const { id, name, description, sort_order, emoji, title } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID da seção é obrigatório" }, { status: 400 });
    }

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
  } catch (error: any) {
    console.error("Erro ao atualizar seção:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ DELETE - remover seção
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID da seção é obrigatório" }, { status: 400 });
    }

    const { error } = await supabase.from("sections").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erro ao deletar seção:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
