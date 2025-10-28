"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function FormularioLoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Verifica se o usuário já está logado
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        router.replace("/admin"); // já logado → vai pro formulário
      }
    });
  }, [router]);

  async function handleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`, // onde o Google volta
      },
    });
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-xl shadow-md text-center max-w-sm w-full">
        <h1 className="text-xl font-semibold mb-4">Acesse o painel Routis</h1>
        <button
          onClick={handleLogin}
          className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded w-full"
        >
          Entrar com Google
        </button>
      </div>
    </main>
  );
}
