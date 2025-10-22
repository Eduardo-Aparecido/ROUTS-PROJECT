"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type EventForm = {
  id?: number;
  title: string;
  local: string;
  date: string;
  categoryId: number;
  description: string;
  address: string;
  phone: string;
  map_embed: string;
  type: "visit" | "date";
  galleryUrls: string[];
  sectionId?: number; // <-- Adicione aqui!
};

export default function EditarEventoPage() {
  const { id } = useParams<{ id: string }>()!;
  const router = useRouter();

  const [form, setForm] = useState<EventForm>({
    title: "",
    local: "",
    date: "",
    categoryId: 1,
    description: "",
    address: "",
    phone: "",
    map_embed: "",
    type: "visit",
    galleryUrls: [],
  });

  const [sections, setSections] = useState<{ id: number; name: string }[]>([]);

  // 🔹 Buscar dados do evento
  useEffect(() => {
    async function fetchEvent() {
      if (!id) return;

      try {
        const res = await fetch(`/api/get-event?id=${Number(id)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        const ev = data.event;
        console.log("Evento carregado:", ev);

        setForm({
          id: ev.id, // 🔹 agora garante que o ID venha certo
          title: ev.title || "",
          local: ev.local || "",
          date: ev.date ? ev.date.split("T")[0] : "",
          categoryId: ev.category_id || 1,
          description: ev.description || "",
          address: ev.address || "",
          phone: ev.phone || "",
          map_embed: ev.map_embed || "",
          type: ev.type || "visit",
          // 🔹 aqui corrigimos a galeria que estava vindo com colchetes extras
          galleryUrls: (() => {
            try {
              if (Array.isArray(ev.gallery)) return ev.gallery;
              if (typeof ev.gallery === "string") return JSON.parse(ev.gallery);
              return [];
            } catch {
              return [];
            }
          })(),
        });
      } catch (err: any) {
        console.error("Erro ao carregar evento:", err);
        alert("Falha ao carregar evento: " + err.message);
      }
    }

    fetchEvent();
  }, [id]);

  // 🔹 Buscar seções
  useEffect(() => {
    async function fetchSections() {
      const res = await fetch("/api/sections");
      const data = await res.json();
      setSections(data.sections || []);
    }
    fetchSections();
  }, []);

  // 🔹 Submeter formulário como JSON
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.id) return alert("ID do evento não encontrado.");

    try {
      const res = await fetch("/api/update-event", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form), // envia como JSON
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      alert("Evento atualizado com sucesso!");
      router.push("/listarEventos");
    } catch (err: any) {
      console.error("Erro ao atualizar evento:", err);
      alert("Erro ao atualizar evento.");
    }
  }

  return (
    <>
      <Header search="" setSearch={() => {}} />
      <main className="min-h-screen bg-zinc-100 pt-24 px-4 flex flex-col items-center">
        <div className="w-full max-w-4xl space-y-8">
          <h1 className="text-3xl font-bold text-zinc-800 mb-4">Editar Evento</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campos do evento */}
            <div>
              <label className="block font-medium">Nome do evento</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 border rounded text-black"
              />
            </div>

            <div>
              <label className="block font-medium">Local</label>
              <input
                value={form.local}
                onChange={(e) => setForm({ ...form, local: e.target.value })}
                className="w-full px-3 py-2 border rounded text-black"
              />
            </div>

            <div>
              <label className="block font-medium">Data</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-3 py-2 border rounded text-black"
              />
            </div>

            <div>
              <label className="block font-medium">Descrição</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 border rounded text-black"
                rows={4}
              />
            </div>

            <div>
              <label className="block font-medium">Endereço</label>
              <input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-3 py-2 border rounded text-black"
              />
            </div>

            <div>
              <label className="block font-medium">Telefone</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 border rounded text-black"
              />
            </div>

            <div>
              <label className="block font-medium">Mapa (embed)</label>
              <input
                value={form.map_embed}
                onChange={(e) => setForm({ ...form, map_embed: e.target.value })}
                className="w-full px-3 py-2 border rounded text-black"
              />
            </div>

            {/* Tipo de evento */}
            <div className="flex gap-4">
              <label>
                <input
                  type="radio"
                  name="type"
                  value="visit"
                  checked={form.type === "visit"}
                  onChange={(e) => setForm({ ...form, type: e.target.value as "visit" | "date" })}
                />
                Visit
              </label>
              <label>
                <input
                  type="radio"
                  name="type"
                  value="date"
                  checked={form.type === "date"}
                  onChange={(e) => setForm({ ...form, type: e.target.value as "visit" | "date" })}
                />
                Date
              </label>
            </div>

            <div>
              <label className="block font-medium">Seção</label>
              <select
                value={form.sectionId ?? ""}
                onChange={(e) => setForm({ ...form, sectionId: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded text-black"
              >
                <option value="">Selecione a seção</option>
                {sections.map((sec) => (
                  <option key={sec.id} value={sec.id}>
                    {sec.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
            >
              Atualizar Evento
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
