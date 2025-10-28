"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const { data } = await supabase.auth.getSession();

      // Se tiver sessão, vai pro formulário admin
      if (data.session) {
        router.replace("/admin");
      } else {
        router.replace("/formulario");
      }
    };

    handleAuth();
  }, [router]);

  return <div className="p-6 text-center">Finalizando login... aguarde ⏳</div>;
}
