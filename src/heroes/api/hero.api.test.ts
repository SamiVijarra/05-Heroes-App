import { describe, expect, test } from "vitest";
import { heroApi } from "./hero.api";

const BASE_UR = import.meta.env.VITE_API_URL;

describe  ("HeroApi", () => {
  test("should be configure pointing to the testing server", () => {
    expect(heroApi).toBeDefined();

    expect(heroApi.defaults.baseURL).toBe(`${BASE_UR}/api/heroes`);
    expect(BASE_UR).toContain("3001");
  }); 
});