export default function Footer() {
  return (
    <footer className="relative mt-0 bg-gradient-to-t from-black via-zinc-950 to-zinc-900 border-t border-white/10">
      {/* BARRA DECORATIVA */}
      <div className="absolute left-0 top-0 w-full h-1 bg-gradient-to-r from-green-500 via-emerald-400 to-green-600"></div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between text-zinc-400 text-sm space-y-4 md:space-y-0">
        <p className="max-w-3xl leading-relaxed text-center md:text-left">
          O <span className="font-semibold text-white">ROUTS</span> não é responsável pelos eventos, 
          estabelecimentos e cinemas divulgados. horários, preços e atrações podem ser alterados 
          pelos responsáveis sem aviso prévio.
        </p>

        <div className="flex flex-col items-center md:items-end space-y-1">
          <span className="font-semibold text-white">ROUTS ® © Desde 2025</span>
          <span className="text-xs text-zinc-500">
            Desenvolvido com paixão por experiências reais 🌎
          </span>
        </div>
      </div>

      {/* LINHA FINAL */}
      <div className="w-full border-t border-white/10 py-4 text-center text-xs text-zinc-600">
        Todos os direitos reservados — ROUTS
      </div>
    </footer>
  );
}
