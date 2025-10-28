import React from "react";
import { motion } from "framer-motion";

type Event = {
  id: string | number;
  image: string;
  title: string;
  local: string;
};

type EventCardProps = {
  event: Event;
};

export default function EventCard({ event }: EventCardProps) {
  return (
    <motion.div
      className="bg-black rounded-lg shadow overflow-hidden flex flex-col cursor-pointer transition-transform duration-300"
    >
      {/* Container para controlar o zoom da imagem */}
      <div className="overflow-hidden h-36 w-full">
        <motion.img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }} // aplica o zoom apenas na imagem
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
      </div>

      <div className="h-1 w-full bg-green-500" />

      <div className="p-3 flex flex-col gap-1 flex-grow bg-black">
        {/* Título com altura fixa para até 2 linhas */}
        <p className="text-white text-sm font-bold leading-tight line-clamp-2 min-h-[2.25rem]">
          {event.title}
        </p>

        {/* Local com altura fixa para 1 linha */}
        <p className="text-green-400 text-[11px] font-semibold uppercase min-h-[1rem] truncate">
        📍 {event.local}
        </p>
      </div>
    </motion.div>
  );
}
// este componente é usado para exibir um card de evento com imagem, título e localização
// a imagem tem um efeito de zoom ao passar o mouse, e o card sobe levemente
// o título suporta até 2 linhas com truncamento, e o local é exibido em uma linha com truncamento