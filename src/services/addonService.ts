import type { AddonService } from "../lib/types";
import { clientApi } from "../lib/api";
import { centsToReais } from "../lib/price";

export async function getAddons(): Promise<AddonService[]> {
  const response = await clientApi("/addons");
  const data: AddonService[] = await response.json();
  return data.map((addon) => ({
    ...addon,
    price: centsToReais(addon.price),
  }));
}
