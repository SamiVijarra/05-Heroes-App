import { heroApi } from "../api/hero.api";
import type { Hero } from "../types/hero.interface";

const VITE_API_URL = import.meta.env.VITE_API_URL;

interface Option {
  name?: string;
  team?: string;
  category?: string;
  universe?: string;
  status?: string;
  strength?: number;
}


export const searchHeroesAction = async (options: Option = {}) => {

  const { name, team, category, universe, status, strength } = options;
  if (!name && !team && !category && !universe && !status && !strength) {
    return [];
  }

  const { data } = await heroApi.get<Hero[]>('/search', {
    params: {
      name,
      team,
      category,
      universe,
      status,
      strength, 
    },
  });
  return data.map(hero => ({
    ...hero,
    image: `${VITE_API_URL}/images/${hero.image}`,
  }));
}