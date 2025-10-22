"use client";

import { use, useEffect, useState } from "react";
import Header from "@/components/Header";
import { categories } from "@/data/categories";
import LocalVisit from "@/components/LocalVisit";
import Footer from "@/components/Footer";
import SidebarMenu from "@/components/SidebarMenu";

export default function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  // ✅ Corrige o acesso aos parâmetros
  const { id } = use(params);
  const categoryId = Number(id);

  // ✅ Busca a categoria com base no ID
  const category = categories.find((cat) => cat.id === categoryId);

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      const res = await fetch("/api/list-events");
      const data = await res.json();

      const filtered = data.filter(
        (ev: any) =>
          ev.category_id === categoryId &&
          ev.title.toLowerCase().includes(search.toLowerCase())
      );

      setEvents(filtered);
      setLoading(false);
    }

    fetchEvents();
  }, [categoryId, search]);

  return (
    <>
      {/* Sidebar para desktop */}
      <SidebarMenu />

      <main className="px-6 sm:px-8 md:px-16 lg:px-32 xl:px-60 py-18 text-white bg-zinc-800">
        {/* Header com busca */}
        <Header search={search} setSearch={setSearch} />

        <h1 className="text-3xl font-bold mb-6 mt-10">
          Escolha onde ir em "{category ? category.name : "Desconhecida"}"
        </h1>

        {loading ? (
          <p>Carregando eventos...</p>
        ) : events.length > 0 ? (
          <LocalVisit title="" events={events} />
        ) : (
          <p>Ainda não há eventos para esta categoria.</p>
        )}

        <div className="border-t border-zinc-800 mb-4" />
      </main>

      <Footer />
    </>
  );
}
