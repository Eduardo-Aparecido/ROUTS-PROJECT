import { Event } from "@/data/types";
import Link from "next/link";
import CardBase from "./CardBase";

type LocalVisitProps = {
  title: string;
  emoji?: string;
  events?: Event[];
};

export default function LocalVisit({ title, emoji, events = [] }: LocalVisitProps) {
  return (
    <section className="my-8">
      <div className="flex items-center mb-2">
        {emoji && <span className="text-2xl mr-2">{emoji}</span>}
        <h2 className="text-xl text-white font-bold">{title}</h2>
      </div>
      <div className="border-t border-black mb-4" />
      <div
        className="
          flex gap-4 overflow-x-auto 
          md:grid md:grid-cols-5 md:gap-5 md:overflow-visible 
          xl:grid-cols-5
        "
      >
        {events.map((ev) => (
          <Link
            key={ev.id}
            href={`/eventos/${ev.id}?type=${ev.type}`}
            className="block flex-shrink-0 w-[45%] sm:w-[40%] md:w-auto"
          >
            <CardBase event={ev} />
          </Link>
        ))}
      </div>
    </section>
  );
}

