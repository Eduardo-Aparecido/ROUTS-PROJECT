import { useMemo } from "react";

type OpeningHour = {
  weekday: number; // 0 = Domingo ... 6 = Sábado
  open_time: string | null;
  close_time: string | null;
  is_closed: boolean;
};

export function useIsOpenNow(openingHours: OpeningHour[] = []) {
  return useMemo(() => {
    if (!openingHours || openingHours.length === 0) return false;

    // === Ajuste de fuso horário para o Brasil (UTC-3)
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const brazilNow = new Date(utc - 3 * 60 * 60000);

    const currentDay = brazilNow.getDay(); // 0 = domingo ... 6 = sábado
    const currentTime = brazilNow.toTimeString().slice(0, 5);

    const todayHours = openingHours.filter(
      (h) => h.weekday === currentDay && !h.is_closed
    );
    if (todayHours.length === 0) return false;

    const [hNow, mNow] = currentTime.split(":").map(Number);
    const nowMinutes = hNow * 60 + mNow;

    // Verifica se está dentro de alguma faixa
    return todayHours.some((h) => {
      if (!h.open_time || !h.close_time) return false;

      const [hOpen, mOpen] = h.open_time.split(":").map(Number);
      const [hClose, mClose] = h.close_time.split(":").map(Number);

      const openMinutes = hOpen * 60 + mOpen;
      const closeMinutes = hClose * 60 + mClose;

      // Caso normal: abre e fecha no mesmo dia
      if (closeMinutes > openMinutes) {
        return nowMinutes >= openMinutes && nowMinutes < closeMinutes;
      }

      // Caso passa da meia-noite (ex: 22h → 02h)
      return nowMinutes >= openMinutes || nowMinutes < closeMinutes;
    });
  }, [openingHours]);
}
