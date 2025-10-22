import { Event } from "@/data/types"; // ✅ importando o tipo global
import LocalVisit from "./LocalVisit";

interface LocalDateProps {
  title: string;
  events: Event[];
}

export default function LocalDate({ title, events }: LocalDateProps) {
  return <LocalVisit title={title} events={events} />;
}
