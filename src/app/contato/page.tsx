"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import SidebarMenu from "@/components/SidebarMenu";
import Footer from "../../components/Footer";

export default function ContatoPage() {
  return (
    <>
    <SidebarMenu />
    <Header search="" setSearch={() => {}} />
    
    <main className="bg-zinc-900 text-white min-h-screen overflow-x-hidden py-10">
      {/* HERO */}
      <section className="relative text-center px-6 py-16 bg-[url('/bg-contato.jpg')] bg-zinc-900 bg-center bg-black/60 bg-blend-overlay">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-8">
          ENTRE EM CONTATO COM O <span className="text-green-400">ROUTS</span>
        </h1>
        <p className="text-green-400 text-lg font-semibold">
          Cultura • Lazer • Gastronomia
        </p>
      </section>

      {/* CONTEÚDO */}
      <section className="py-5 px-6 max-w-3xl mx-auto space-y-8 text-zinc-300 leading-relaxed">
        <p>
          O <span className="text-green-400 font-semibold">Routs</span> é um
          canal de comunicação que reúne o melhor da{" "}
          <span className="text-white font-medium">
            cultura, entretenimento e gastronomia
          </span>{" "}
          de Rio Verde e região. Nosso propósito é conectar pessoas a experiências
          incríveis, valorizando tudo que há de melhor na cidade.
        </p>

        <p>
          Caso tenha dúvidas sobre algum local ou evento, entre em contato
          diretamente com os responsáveis por meio das informações disponíveis
          nas páginas de cada estabelecimento (telefone, e-mail ou redes sociais).
        </p>

        <div>
          <h2 className="text-green-400 text-xl font-semibold mb-2">
            💡 Sugestões de conteúdo
          </h2>
          <p>
            Tem uma pauta, evento ou novo local que gostaria de ver por aqui?
            Envie sua sugestão para{" "}
            <a
              href="mailto:redacaorouts@gmail.com"
              className="text-green-400 hover:underline"
            >
              redacaorouts@gmail.com
            </a>
            .
          </p>
        </div>

        <div>
          <h2 className="text-green-400 text-xl font-semibold mb-2">
            📣 Fale com nossa equipe
          </h2>
          <p>
            Quer conversar com o time do{" "}
            <span className="text-green-400 font-semibold">Routs</span>? Estamos
            disponíveis nos seguintes canais:
          </p>

          <ul className="mt-4 space-y-2">
            <li>
              <a
                href="https://facebook.com/routsrioverde"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:underline"
              >
                Facebook: fb.com/routsrioverde
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/routsrioverde"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:underline"
              >
                Instagram: instagram.com/routsrioverde
              </a>
            </li>
            <li>
              <a
                href="https://tiktok.com/@routsrioverde"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:underline"
              >
                TikTok: tiktok.com/@routsrioverde
              </a>
            </li>
          </ul>
        </div>
      </section>

        <Footer />
    </main>
    </>
  );
}
