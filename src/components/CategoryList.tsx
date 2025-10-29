"use client";

import { motion } from "framer-motion";
import { categories } from "@/data/categories";
import Link from "next/link";
import { useRef } from "react";

export default function CategoryList() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const scrollAmount = clientWidth * 0.8; // rola 80% da largura
    scrollRef.current.scrollTo({
      left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="mt-14 mb-14 sm:mt-10 md:mt-10 relative">
      <h2 className="text-xl text-white font-bold mb-4">
        O que você quer fazer hoje?
      </h2>

      {/* Botão esquerdo */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full"
      >
        ←
      </button>

      {/* Lista de categorias */}
      <motion.div
        ref={scrollRef}
        className="flex gap-4 overflow-x-scroll scroll-smooth snap-x snap-mandatory w-full px-8 py-2"
        style={{
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE e Edge
          overflowY: "hidden", // evita barra vertical
        }}
      >
        {categories.map((cat) => (
          <motion.div
            key={cat.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            whileHover={{
              scale: 1,
              boxShadow: "0 6px 15px rgba(0,255,128,0.15)",
            }}
            transition={{ type: "spring", stiffness: 250, damping: 15 }}
            className="flex-shrink-0 snap-center"
          >
            <Link
              href={`/categorias/${cat.id}`}
              className="flex flex-col items-center justify-center w-25 h-25 bg-gradient-to-b from-zinc-900 to-black rounded-xl shadow border border-zinc-800 hover:border-green-500 transition-all duration-300"
            >
              <motion.span
                whileHover={{ scale: 1.2, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-3xl mb-1"
              >
                {cat.icon}
              </motion.span>
              <span className="text-xs text-white text-center font-medium">
                {cat.name}
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Botão direito */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full"
      >
        →
      </button>

      {/* Remove scrollbar WebKit */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
