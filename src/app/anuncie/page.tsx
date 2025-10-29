"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import SidebarMenu from "@/components/SidebarMenu";

export default function AnunciePage() {
  const [form, setForm] = useState({
    nome: "",
    empresa: "",
    telefone: "",
    email: "",
    mensagem: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Mensagem enviada! Em breve entraremos em contato.");
  };

  return (
    <>
    <SidebarMenu />
    <Header search="" setSearch={() => {}} />
    
    <main className="bg-zinc-900 text-white px-4 sm:px-8 md:px-16 lg:px-32 xl:px-60 py-18">
      {/* HERO */}
      <section className="relative text-center px-6 py-16 bg-[url('/bg-anuncie.jpg')] bg-cover bg-center bg-black/60 bg-blend-overlay">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">
          PRINCIPAL MÍDIA DIGITAL SOBRE LAZER, <br /> CULTURA E ENTRETENIMENTO DA REGIÃO
        </h1>
        <p className="text-green-400 text-lg font-semibold">
          Interior de Goiás <br /> +238 mil habitantes
        </p>
      </section>

      {/* BLOCO #1 */}
      <section className="grid md:grid-cols-3 gap-4 text-center py-10 px-6 bg-black">
        <div className="border border-green-400 rounded-lg p-6 hover:bg-zinc-900 transition">
          <h3 className="text-green-400 font-semibold mb-2">#interação</h3>
          <p className="text-zinc-300 text-sm">
            Apresente-se de forma convincente e descontraída, atraindo o interesse e gerando comentários e indicações.
          </p>
        </div>

        <div className="border border-green-400 rounded-lg p-6 hover:bg-zinc-900 transition">
          <h3 className="text-green-400 font-semibold mb-2">#relevância</h3>
          <p className="text-zinc-300 text-sm">
            O público confia nas nossas dicas! Tenha sua marca divulgada por um veículo que é bem avaliado pelas pessoas.
          </p>
        </div>

        <div className="border border-green-400 rounded-lg p-6 hover:bg-zinc-900 transition">
          <h3 className="text-green-400 font-semibold mb-2">#resultado</h3>
          <p className="text-zinc-300 text-sm">
            Visualizou, curtiu, consumiu e indicou! Perfeito para campanhas criativas e locais.
          </p>
        </div>
      </section>

      {/* AUDIÊNCIA */}
      <section className="grid md:grid-cols-3 gap-6 py-16 px-6 bg-zinc-950">
        <div className="rounded-xl bg-gradient-to-br from-purple-700 to-purple-500 p-6 text-center">
          <h3 className="text-white text-lg font-semibold mb-3">AUDIÊNCIA DO SITE</h3>
          <p className="text-4xl font-bold">+110k</p>
          <p className="text-sm text-zinc-200 mb-2">usuários/mês</p>
          <p className="text-4xl font-bold">+345k</p>
          <p className="text-sm text-zinc-200">visualizações/mês</p>
        </div>

        <div className="rounded-xl bg-green-500 text-black p-6 text-center font-bold">
          <h3 className="text-purple-800 text-sm mb-3">PERFIL DE PÚBLICO</h3>
          <p className="text-2xl mb-1">33% <span className="font-light">homens</span></p>
          <p className="text-2xl">67% <span className="font-light">mulheres</span></p>
        </div>

        <div className="rounded-xl bg-green-400 text-black p-6 text-center font-bold">
          <h3 className="text-purple-800 text-sm mb-3">IDADE</h3>
          <p className="text-2xl">25 a 34 anos</p>
          <p className="text-xs text-purple-900 font-semibold">42% do público está nessa faixa</p>
        </div>
      </section>

      {/* FORMULÁRIO */}
      <section className="py-20 px-6 bg-black text-center">
        <h2 className="text-2xl font-bold mb-6">Anuncie também!</h2>
        <motion.form
          onSubmit={handleSubmit}
          className="max-w-md mx-auto bg-gradient-to-br from-purple-700 to-green-400 p-[2px] rounded-lg"
          whileHover={{ scale: 1.02 }}
        >
          <div className="bg-black rounded-lg p-6 flex flex-col gap-4">
            {["nome", "empresa", "telefone", "email"].map((field) => (
              <input
                key={field}
                name={field}
                type={field === "email" ? "email" : "text"}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={form[field as keyof typeof form]}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md bg-zinc-900 text-white border border-green-400 placeholder-zinc-500 focus:ring-2 focus:ring-green-400 outline-none"
                required
              />
            ))}

            <textarea
              name="mensagem"
              placeholder="Mensagem"
              value={form.mensagem}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-zinc-900 text-white border border-green-400 placeholder-zinc-500 focus:ring-2 focus:ring-green-400 outline-none h-28"
              required
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-black font-semibold py-2 rounded-md hover:bg-green-300 transition"
            >
              Enviar
            </button>
          </div>
        </motion.form>

        {/* CONTATOS */}
        <div className="mt-10 space-y-4 text-sm text-zinc-300">
          <p>
            Ou fale direto pelo WhatsApp:{" "}
            <span className="text-green-400 font-semibold">(15) 9 9760-7098</span>
          </p>
          <p>Email comercial:{" "}
            <a href="mailto:comercial@agendasorocaba.com.br" className="text-green-400">
              comercialrouts@gmail.com
            </a>
          </p>
          <p>Redação:{" "}
            <a href="mailto:redacao@agendasorocaba.com.br" className="text-green-400">
              redacaorouts@gmail.com
            </a>
          </p>
        </div>
      </section>
    </main>
    </>
  );
}
