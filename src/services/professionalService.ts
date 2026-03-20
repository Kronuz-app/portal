import type { Professional } from "../lib/types";
import { clientApi } from "../lib/api";

export async function getProfessionals(): Promise<Professional[]> {
  const response = await clientApi("/professionals");
  return response.json();
}
