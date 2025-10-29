"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { categories } from "@/data/categories";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CategoryList() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 250; // distância que rola por clique
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="mt-14 mb-14 sm:mt-10 md:mt-10 relative">
      <h2 className="text-xl text-white font-bold mb-4">
        O que você quer fazer hoje?
      </h2>

      {/* Botão esquerdo */}
      <button
        onClick={() => scroll("left")}
        className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 bg-zinc-900/70 hover:bg-zinc-800 p-2 rounded-full shadow-lg z-10"
      >
        <ChevronLeft className="text-white w-5 h-5" />
      </button>

      {/* Lista de categorias */}
      <motion.div
        ref={scrollRef}
        className="flex gap-3 overflow-x-scroll no-scrollbar scroll-smooth snap-x snap-mandatory py-2 px-1"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } },
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
              scale: 1.05,
              boxShadow: "0 6px 15px rgba(0,255,128,0.15)",
            }}
            transition={{ type: "spring", stiffness: 250, damping: 15 }}
            className="flex-shrink-0 snap-center"
          >
            <Link
              href={`/categorias/${cat.id}`}
              className="flex flex-col items-center justify-center w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-b from-zinc-900 to-black rounded-xl shadow border border-zinc-800 hover:border-green-500 transition-all duration-300"
            >
              <motion.span
                whileHover={{ scale: 1.2, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-2xl sm:text-3xl mb-1"
              >
                {cat.icon}
              </motion.span>
              <span className="text-[11px] sm:text-xs text-white text-center font-medium">
                {cat.name}
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Botão direito */}
      <button
        onClick={() => scroll("right")}
        className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 bg-zinc-900/70 hover:bg-zinc-800 p-2 rounded-full shadow-lg z-10"
      >
        <ChevronRight className="text-white w-5 h-5" />
      </button>
    </section>
  );
}
