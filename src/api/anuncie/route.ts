import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { nome, empresa, telefone, email, mensagem } = await request.json();

    if (!nome || !email || !mensagem) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes." }, { status: 400 });
    }

    const { error } = await supabase.from("anuncie_mensagens").insert([
      {
        nome,
        empresa,
        telefone,
        email,
        mensagem,
      },
    ]);

    if (error) {
      console.error("Erro ao inserir mensagem:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erro ao processar requisição:", err);
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
  }
}
