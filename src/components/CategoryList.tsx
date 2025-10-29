"use client";

import { motion } from "framer-motion";
import { categories } from "@/data/categories";
import Link from "next/link";

export default function CategoryList() {
  return (
    <section className="mt-14 mb-14 sm:mt-10 md:mt-10">
      <h2 className="text-xl text-white font-bold mb-4">
        O que você quer fazer hoje?
      </h2>

      <motion.div
        className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-2"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.08 },
          },
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

    </section>
  );
}
