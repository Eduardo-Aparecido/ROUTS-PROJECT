// src/data/types.ts
export type Event = {
  id: number;
  title: string;
  local: string;
  date: string;
  image: string;
  categoryId: number;
  description: string;
  gallery: string[];
  address: string;
  phone: string;
  mapEmbed: string;
  type: string;
  sectionId?: number;
};
