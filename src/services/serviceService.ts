import type { Service } from "../lib/types";
import { clientApi } from "../lib/api";
import { centsToReais } from "../lib/price";

export async function getServices(): Promise<Service[]> {
  const response = await clientApi("/services");
  const data: Service[] = await response.json();
  return data.map((service) => ({
    ...service,
    price: centsToReais(service.price),
  }));
}
