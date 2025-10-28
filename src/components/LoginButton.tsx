// src/components/LoginButton.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginButton() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // obtém usuário atual
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setUser(data.user);
      setLoading(false);
    });

    // escuta mudanças de sessão (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleLogin() {
    // redireciona para o provedor (Google)
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // onde quer que o usuário volte depois do fluxo (pode ser /auth/callback)
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  if (loading) {
    return <button className="px-3 py-1 text-xs rounded bg-gray-200">Carregando...</button>;
  }

  if (!user) {
    return (
      <button
        onClick={handleLogin}
        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1 rounded"
      >
        Entrar com Google
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {user.user_metadata?.avatar_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={user.user_metadata.avatar_url} alt="avatar" className="w-8 h-8 rounded-full" />
      ) : null}
      <span className="text-sm">{user.user_metadata?.full_name ?? user.email}</span>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded"
      >
        Sair
      </button>
    </div>
  );
}
