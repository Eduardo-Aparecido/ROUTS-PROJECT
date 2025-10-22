"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function SidebarMenu() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [open, setOpen] = useState(false);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, []);

  const links = [
    { href: "/anuncie", label: "Anuncie", color: "bg-yellow-400 text-black hover:bg-yellow-600" },
    { href: "/sobre", label: "Sobre", color: "bg-black text-white hover:bg-zinc-600" },
    { href: "/contato", label: "Contato", color: "bg-black text-white hover:bg-zinc-600" },
  ];

  return (
    <>
      {/* Desktop sidebar fixa */}
      <aside className="hidden lg:flex fixed left-6 top-3/6 -translate-y-1/2 flex-col gap-2 z-50">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-5 py-1 rounded-full font-size transition-colors ${link.color}`}
          >
            {link.label}
          </Link>
        ))}
      </aside>

      {/* Botão hambúrguer mobile */}
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-zinc-900 text-white"
        aria-label="Menu"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Menu mobile animado (de baixo pra cima) */}
      <AnimatePresence>
        {open && (
          <>
            {/* Fundo escurecido */}
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Drawer inferior */}
            <motion.aside
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="fixed bottom-0 left-0 w-full bg-zinc-950/95 backdrop-blur-lg rounded-t-2xl p-6 flex flex-col gap-4 z-50 shadow-xl"
            >
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-white">Menu</h2>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-md text-zinc-400 hover:text-white"
                >
                  <X size={22} />
                </button>
              </div>

              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`px-5 py-2.5 rounded-full text-center font-semibold transition-colors ${link.color}`}
                >
                  {link.label}
                </Link>
              ))}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
