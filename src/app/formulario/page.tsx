"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { LogIn } from "lucide-react";

export default function FormularioLoginPage() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace("/admin");
    });
  }, [router]);

  async function handleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/60 shadow-2xl p-10 rounded-2xl max-w-md w-full text-center"
      >
        {/* LOGO COM ANIMAÇÃO */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <img
            src="/logo-routis.svg"
            alt="Routis Logo"
            className="w-20 h-20 drop-shadow-md"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold mb-2 tracking-tight"
        >
          Painel Administrativo
        </motion.h1>

        <p className="text-slate-400 text-sm mb-8">
          Faça login para acessar o gerenciador de conteúdo Routis.
        </p>

        {/* BOTÃO GOOGLE */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleLogin}
          className="flex items-center justify-center gap-3 bg-white text-slate-800 font-semibold px-5 py-3 rounded-xl shadow-lg hover:bg-slate-100 transition-all w-full"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google Logo"
            className="w-5 h-5"
          />
          Entrar com Google
        </motion.button>

        {/* RODAPÉ */}
        <div className="mt-10 text-xs text-slate-500 flex items-center justify-center gap-2">
          <LogIn className="w-4 h-4" />
          Acesso restrito a administradores Routis
        </div>
      </motion.div>
    </main>
  );
}
