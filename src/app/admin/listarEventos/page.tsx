"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Event = {
  id: number;
  title: string;
  description: string;
  image: string;
  local: string;
  date: string;
};

export default function ListarEventosPage() {
  const [eventos, setEventos] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventos = async () => {
      const { data, error } = await supabase.from("events").select("*");
      if (error) {
        console.error("Erro ao buscar eventos:", error);
      } else {
        setEventos(data as Event[]);
      }
      setLoading(false);
    };

    fetchEventos();
  }, []);

  async function handleDelete(id: number) {
    if (!confirm("Tem certeza que deseja deletar este evento?")) return;
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) {
      alert("Erro ao deletar evento!");
      return;
    }
    setEventos((prev) => prev.filter((ev) => ev.id !== id));
  }

  return (
    <main className="min-h-screen bg-zinc-900 text-white">
      <Header search="" setSearch={() => {}} />

      <section className="w-[90%] md:w-[80%] mx-auto pt-24 pb-16">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">
            Eventos Cadastrados
          </h1>
          <p className="text-white text-base">
            Clique em um evento para editar ou deletar.
          </p>
        </div>

        {loading ? (
          <p className="text-center text-zinc-600">Carregando eventos...</p>
        ) : eventos.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-white text-lg mb-4">
              Nenhum evento cadastrado ainda.
            </p>
            <Link
              href="/formulario"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2.5 rounded-md shadow transition-all duration-200"
            >
              Criar novo evento
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {eventos.map((evento) => (
              <motion.div
                key={evento.id}
                className="bg-black rounded-lg shadow overflow-hidden flex flex-col transition-transform duration-300"
              >
                {/* Imagem com zoom */}
                <div className="overflow-hidden h-36 w-full">
                  <motion.img
                    src={evento.image}
                    alt={evento.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4, }}
                  />
                </div>

                {/* Barra verde */}
                <div className="h-1 w-full bg-green-500" />

                {/* Conteúdo */}
                <div className="p-3 flex flex-col gap-1 flex-grow bg-black">
                  <p className="text-white text-sm font-bold leading-tight line-clamp-2 min-h-[2.25rem]">
                    {evento.title}
                  </p>
                  <p className="text-green-400 text-[11px] font-semibold uppercase min-h-[1rem] truncate">
                    {evento.local}
                  </p>

                  {/* Botões */}
                  <div className="mt-3 flex gap-2 pt-2">
                    <Link
                      href={`/admin?id=${evento.id}`}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-semibold px-3 py-1.5 rounded text-center transition-all duration-200"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(evento.id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded transition-all duration-200"
                    >
                      Deletar
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
