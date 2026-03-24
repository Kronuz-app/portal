const UNIT_NAME_KEY = "trinity_unit_name";
const UNIT_ADDRESS_KEY = "trinity_unit_address";

export function useShopName(): { name: string; isLoading: false } {
  const name = localStorage.getItem(UNIT_NAME_KEY) ?? "";
  return { name, isLoading: false };
}

export function useUnitAddress(): string | null {
  return localStorage.getItem(UNIT_ADDRESS_KEY);
}
