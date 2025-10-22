"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useIsOpenNow } from "@/hooks/useIsOpenNow";
import SidebarMenu from "@/components/SidebarMenu";

export default function EventDetail({ params }: { params: Promise<{ id: string }> }) {
  const [event, setEvent] = useState<any | undefined>(undefined);
  const [modalImg, setModalImg] = useState<string | null>(null);

  const isEventOpen = useIsOpenNow(event?.opening_hours || []);

  useEffect(() => {
    const fetchEvent = async () => {
      const { id } = await params;

      const { data: eventData, error: eventError } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

      if (eventError) {
        console.error("Erro ao buscar evento:", eventError.message);
        setEvent(null);
        return;
      }

      const { data: openingHours, error: hoursError } = await supabase
        .from("opening_hours")
        .select("*")
        .eq("event_id", id)
        .order("weekday", { ascending: true })
        .order("open_time", { ascending: true });

      if (hoursError) {
        console.error("Erro ao buscar horários:", hoursError.message);
      }

      setEvent({
        ...eventData,
        opening_hours: openingHours || [],
      });
    };

    fetchEvent();
  }, [params]);

  if (event === undefined) {
    return (
      <main className="min-h-screen text-white pt-20 flex items-center justify-center">
        <Header search="" setSearch={() => {}} />
        <div>Carregando...</div>
        <Footer />
      </main>
    );
  }

  if (!event) return notFound();

  const formattedDateTime = event.date
    ? new Date(event.date).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const formattedDate = event.date
    ? new Date(event.date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : null;

  return (
    <>
      <SidebarMenu />
      <main className="min-h-screen text-white pt-20 bg-zinc-800">
        <Header search="" setSearch={() => {}} />

        {/* 🔹 Mantida exatamente como você pediu */}
        <div className="w-[95%] sm:w-[85%] md:w-[75%] lg:w-[55%] xl:w-[60%] mx-auto bg-black rounded-t-2xl">
            
            {/* Imagem principal */}
            <div className="relative w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[400px] overflow-hidden mb-2 md:mb-1">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover rounded-t-2xl"
              />
            </div>
          <div className="p-4 sm:p-6 md:p-4">

            {/* Título e informações */}
            <div className="rounded-lg p-2 py-1 overflow-hidden w-full">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h1 className="text-2xl font-semibold mt-0 sm:mt-4">{event.title}</h1>

                <span
                  className={`relative inline-flex items-center justify-center mt-2 sm:mt-0 text-xs font-semibold px-3 py-2 rounded-full ${
                    isEventOpen
                      ? "bg-green-600 text-white"
                      : "bg-red-600 text-white"
                  }`}
                >
                  {isEventOpen ? "Aberto agora" : "Fechado agora"}
                  {isEventOpen && (
                    <span className="absolute inline-flex h-3 w-3 top-0 right-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                  )}
                </span>
              </div>

              <p className="text-sm text-green-500 mt-2">
                {event.local}
                {formattedDate && ` – ${formattedDate}`}
              </p>
            </div>

            {/* Horário de funcionamento */}
            {event.opening_hours && event.opening_hours.length > 0 && (
              <div className="bg-zinc-900 rounded-lg p-5 w-full max-w-md py-5 mt-6">
                <h2 className="text-lg font-semibold text-green-500 mb-6">
                  🕓 Horário de funcionamento
                </h2>

                <ul className="divide-y divide-zinc-800">
                    {["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"].map(                    (day, index) => {
                      const targetWeekday = index;
                      const dayHours = event.opening_hours.filter(
                        (h: any) => h.weekday === targetWeekday
                      );

                      if (dayHours.length === 0 || dayHours.every((h: any) => h.is_closed)) {
                        return (
                          <li key={index} className="flex justify-between py-2 text-sm text-zinc-400">
                            <span>{day}</span>
                            <span className="text-red-600">Fechado</span>
                          </li>
                        );
                      }

                      return (
                        <li key={index} className="flex justify-between py-2 text-sm">
                          <span className="text-white">{day}</span>
                          <span className="text-green-400">
                            {dayHours
                              .filter((h: any) => !h.is_closed)
                              .map((h: any) => {
                                const open = h.open_time ? h.open_time.slice(0, 5) : "–";
                                const close = h.close_time ? h.close_time.slice(0, 5) : "–";
                                return `${open} – ${close}`;
                              })
                              .join(", ")}
                          </span>
                        </li>
                      );
                    }
                  )}
                </ul>
              </div>
            )}

            {/* Descrição */}
            <div className="space-y-4">
              <div className="rounded-lg p-4">
                <div className="prose max-w-none">
                  <p className="font-extrabold mt-0 whitespace-pre-line">
                    {event.description}
                  </p>
                </div>
              </div>
            </div>

            <hr className="border-zinc-700 my-4" />

            {/* Galeria */}
            {Array.isArray(event.gallery) && event.gallery.length > 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 rounded-lg p-4">
                  {event.gallery.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setModalImg(img)}
                      className="relative overflow-hidden rounded-xl focus:outline-none group"
                    >
                      <img
                        src={img}
                        alt={`galeria-${idx}`}
                        className="w-full h-56 sm:h-64 md:h-72 object-cover rounded-xl transform transition-transform duration-300 group-hover:scale-105"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Modal da imagem */}
            {modalImg && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
                <div className="relative">
                  <button
                    onClick={() => setModalImg(null)}
                    className="absolute top-2 right-2 text-white text-2xl font-bold"
                    aria-label="Fechar"
                  >
                    &times;
                  </button>
                  <img
                    src={modalImg}
                    alt="Imagem ampliada"
                    className="max-h-[80vh] max-w-[90vw] rounded"
                  />
                </div>
              </div>
            )}

            <hr className="border-zinc-700 my-8" />

            {/* Contato + Localização */}
            <div className="mt-8 space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                {event.external_link && (
                  <a
                    href={event.external_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full sm:w-1/2 px-4 py-2 border border-cyan-500 rounded-full text-white hover:bg-cyan-500 hover:text-black transition-all duration-300"
                  >
                    <span className="text-lg">🔗</span>
                    <span className="text-sm font-medium">Link do local</span>
                  </a>
                )}

                {event.phone && (
                  <a
                    href={`tel:${event.phone}`}
                    className="flex items-center justify-center gap-2 w-full sm:w-1/2 px-4 py-2 border border-cyan-500 rounded-full text-white hover:bg-cyan-500 hover:text-black transition-all duration-300"
                  >
                    <span className="text-lg">📞</span>
                    <span className="text-sm font-medium">{event.phone}</span>
                  </a>
                )}
              </div>

              {event.map_embed && (
                <div className="mt-6 border border-cyan-500 rounded-2xl p-3 overflow-hidden w-full bg-black/40">
                  <div
                    className="rounded-xl overflow-hidden w-full"
                    dangerouslySetInnerHTML={{ __html: event.map_embed }}
                  />
                </div>
              )}

              <div className="bg-zinc-900 rounded-lg p-4 overflow-hidden w-full">
                <p className="text-xs">
                  ⚠️ Os horários de atendimento, opções e preços podem ser alterados pelos locais sem aviso!
                </p>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </main>
    </>
  );
}
