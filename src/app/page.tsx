// Home.tsx

"use client";

import { useEffect, useState } from "react";
import Header from "../components/Header";
import CategoryList from "../components/CategoryList";
import LocalVisit from "../components/LocalVisit";
import Footer from "../components/Footer";
import { supabase } from "@/lib/supabaseClient";
import { Event } from "@/data/types";
import SidebarMenu from "@/components/SidebarMenu";

export default function Home() {
  const [search, setSearch] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Converte snake_case → camelCase
  const mapEvent = (dbEvent: any): Event => ({
    id: dbEvent.id,
    title: dbEvent.title,
    local: dbEvent.local,
    date: dbEvent.date,
    image: dbEvent.image,
    categoryId: dbEvent.category_id,
    description: dbEvent.description,
    gallery: dbEvent.gallery || [],
    address: dbEvent.address,
    phone: dbEvent.phone,
    mapEmbed: dbEvent.map_embed,
    type: dbEvent.type,
    sectionId: dbEvent.section_id,
  });

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      const [{ data: eventsData, error: eventsError }, { data: sectionsData, error: sectionsError }] = await Promise.all([
        supabase.from("events").select("*"),
        supabase.from("sections").select("*").order("sort_order", { ascending: true }),
      ]);
      if (eventsError) console.error("Erro eventos:", eventsError.message);
      if (sectionsError) console.error("Erro seções:", sectionsError.message);

      setEvents(eventsData ? eventsData.map(mapEvent) : []);
      setSections(sectionsData || []);
      setLoading(false);
    }
    fetchAll();
  }, []);

  // Filtra eventos por seção e busca
  function getEventsForSection(sectionId: number) {
    return events.filter(
      (event) =>
        event.sectionId === sectionId &&
        (event.title.toLowerCase().includes(search.toLowerCase()) ||
          event.local.toLowerCase().includes(search.toLowerCase()))
    );
  }

  return (
    <>
      <SidebarMenu />
      <Header search={search} setSearch={setSearch} />
      <main className="font-sans bg-zinc-800 text-white min-h-screen pt-15 pb-20">
        <div className="max-w-[1600px] mx-auto mb-5 px-4 sm:px-8 md:px-16 lg:px-32 xl:px-60 2xl:px-100">
          <CategoryList />
          {loading ? (
            <p className="text-center text-gray-500">Carregando eventos...</p>
          ) : (
            <>
              {sections.map((section) => (
                <LocalVisit
                  key={section.id}
                  title={section.title || section.name}
                  emoji={section.emoji}
                  events={getEventsForSection(section.id)}
                />
              ))}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
