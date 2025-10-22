"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu as MenuIcon, X as CloseIcon, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (s: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, []);

  const sidebarLinks = [
    { href: "/anuncie", label: "Anuncie", color: "bg-yellow-400 text-black hover:bg-yellow-300" },
    { href: "/sobre", label: "Sobre", color: "bg-zinc-800 text-white hover:bg-zinc-700" },
    { href: "/contato", label: "Contato", color: "bg-zinc-800 text-white hover:bg-zinc-700" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-black/60 border-b border-white/10">
      <div className="flex items-center justify-between max-w-6xl mx-auto px-6 py-4">
        {/* LOGO */}
        <Link href="/index" className="text-2xl font-bold text-white tracking-tight">
          <span className="text-green-400">ROUTS</span>
        </Link>

        {/* DESKTOP SEARCH + BUTTON */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <input
              type="text"
              placeholder="Buscar experiências..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 rounded-lg bg-zinc-900 text-white border border-zinc-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all outline-none placeholder-zinc-500 w-64"
            />
          </div>
          <Link
            href="/formulario"
            className="ml-4 px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 shadow-md transition-all"
          >
            Criar evento
          </Link>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          className="block md:hidden text-white transition-transform hover:scale-110"
          onClick={() => setOpen(!open)}
        >
          {open ? <CloseIcon size={26} /> : <MenuIcon size={26} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-black/90 text-white px-6 py-6 border-t border-white/10 space-y-4"
          >
            {/* Busca */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
              />
              <input
                type="text"
                placeholder="Buscar experiências..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-md bg-zinc-900 text-white border border-zinc-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none placeholder-zinc-500"
              />
            </div>

            {/* Botão criar evento */}
            <Link
              href="/formulario"
              onClick={() => setOpen(false)}
              className="block text-center w-full px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 shadow-md transition-all"
            >
              Criar evento
            </Link>

            {/* Sidebar links (modo mobile) */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              {sidebarLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block text-center px-5 py-2.5 rounded-full font-semibold transition-colors ${link.color}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
