"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import SidebarMenu from "@/components/SidebarMenu";


export default function SobrePage() {
  return (
    <>
    <SidebarMenu />
    <Header search="" setSearch={() => {}} />
    
    <main className="bg-zinc-900 text-white px-4 sm:px-8 md:px-16 lg:px-32 xl:px-60 py-18">
      {/* HERO */}
      <section className="relative text-center px-6 py-16 bg-[url('/bg-sobre.jpg')] bg-cover bg-center bg-black/60 bg-blend-overlay">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
          SOBRE O <span className="text-green-400">ROUTS</span>
        </h1>
        <p className="text-green-400 text-lg font-semibold">
          Cultura, lazer e experiências reais no interior de Goiás
        </p>
      </section>

      {/* MISSÃO / VISÃO / VALORES */}
      <section className="grid md:grid-cols-3 gap-6 text-center py-16 px-6 bg-black">
        <div className="border border-green-400 rounded-lg p-6 hover:bg-zinc-900 transition">
          <h3 className="text-green-400 font-semibold mb-2 uppercase">Missão</h3>
          <p className="text-zinc-300 text-sm">
            Conectar pessoas, lugares e experiências, valorizando o que o interior de Goiás tem de melhor — sua cultura, sua energia e sua autenticidade.
          </p>
        </div>

        <div className="border border-green-400 rounded-lg p-6 hover:bg-zinc-900 transition">
          <h3 className="text-green-400 font-semibold mb-2 uppercase">Visão</h3>
          <p className="text-zinc-300 text-sm">
            Ser referência digital em lazer, cultura e entretenimento, inspirando novas formas de explorar a cidade e viver o presente.
          </p>
        </div>

        <div className="border border-green-400 rounded-lg p-6 hover:bg-zinc-900 transition">
          <h3 className="text-green-400 font-semibold mb-2 uppercase">Valores</h3>
          <p className="text-zinc-300 text-sm">
            Criatividade, verdade, proximidade e paixão por experiências locais. Cada post é feito com propósito.
          </p>
        </div>
      </section>

      {/* SOBRE O PROJETO */}
      <section className="py-16 px-6 bg-zinc-950 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <motion.h2
            className="text-3xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            A HISTÓRIA DO <span className="text-green-400">ROUTS</span>
          </motion.h2>

          <p className="text-zinc-300 text-sm leading-relaxed">
            O ROUTS nasceu com o propósito de reunir e divulgar o melhor da vida urbana e cultural de <span className="text-green-400 font-semibold">Rio Verde (GO)</span>, 
            uma das cidades que mais crescem no estado, com <span className="font-semibold">238 mil habitantes (IBGE/2024)</span>.
          </p>

          <p className="text-zinc-300 text-sm leading-relaxed">
            Inspirado pelo movimento das ruas, dos artistas e dos empreendedores locais, o projeto oferece um olhar moderno e acessível sobre 
            eventos, gastronomia, turismo, lazer e experiências únicas do interior.
          </p>

          <p className="text-zinc-300 text-sm leading-relaxed">
            Mais do que uma plataforma digital, o ROUTS é um ponto de encontro entre pessoas e ideias — um guia vivo que reflete o que há de mais 
            autêntico, divertido e inspirador em Goiás.
          </p>
        </div>
      </section>

      {/* BLOCO ESTILO “ESTATÍSTICAS” */}
      <section className="grid md:grid-cols-3 gap-6 py-16 px-6 bg-black text-center">
        <div className="rounded-xl bg-gradient-to-br from-green-500 to-green-700 p-6 font-bold text-black">
          <p className="text-5xl mb-2">+238k</p>
          <p className="text-sm uppercase">habitantes em Rio Verde</p>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-purple-700 to-purple-500 p-6 font-bold">
          <p className="text-5xl mb-2 text-white">+1M</p>
          <p className="text-sm text-zinc-200 uppercase">interações anuais</p>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-green-400 to-purple-600 p-6 font-bold text-black">
          <p className="text-5xl mb-2">+400</p>
          <p className="text-sm uppercase">eventos divulgados</p>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 px-6 text-center bg-zinc-950">
        <motion.h2
          className="text-2xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Um projeto feito com <span className="text-green-400">paixão por experiências reais.</span>
        </motion.h2>
        <p className="text-zinc-400 max-w-lg mx-auto mb-8 text-sm">
          Desenvolvido com o propósito de inspirar, informar e fortalecer o cenário cultural do interior.  
          Quer fazer parte dessa história?
        </p>

        <motion.a
          href="/anuncie"
          whileHover={{ scale: 1.05 }}
          className="inline-block bg-green-500 text-black font-semibold py-2 px-6 rounded-md hover:bg-green-400 transition"
        >
          Seja um parceiro ROUTS
        </motion.a>
      </section>
    </main>
    </>
  );
}
