export const SHOP_ID_KEY = "trinity_shop_id";
export const UNIT_ID_KEY = "trinity_unit_id";
export const UNIT_NAME_KEY = "trinity_unit_name";
export const UNIT_ADDRESS_KEY = "trinity_unit_address";

export interface UnitInfo {
  shopId: string;
  unitId: string;
  unitName: string;
  shopName: string;
  address: string | null;
}

/**
 * Salva os dados da unidade resolvida no localStorage.
 * Chamado após resolução de slug bem-sucedida.
 */
export function saveUnitInfo(info: UnitInfo): void {
  localStorage.setItem(SHOP_ID_KEY, info.shopId);
  localStorage.setItem(UNIT_ID_KEY, info.unitId);
  localStorage.setItem(UNIT_NAME_KEY, info.unitName);
  if (info.address) localStorage.setItem(UNIT_ADDRESS_KEY, info.address);
  else localStorage.removeItem(UNIT_ADDRESS_KEY);
}

/**
 * Retorna true se já existem dados de shop/unit em cache no localStorage.
 */
export function hasCachedUnitInfo(): boolean {
  return (
    localStorage.getItem(SHOP_ID_KEY) !== null &&
    localStorage.getItem(UNIT_NAME_KEY) !== null
  );
}

/**
 * Retorna o nome da unidade salvo no localStorage.
 */
export function useShopName(): { name: string; isLoading: false } {
  const name = localStorage.getItem(UNIT_NAME_KEY) ?? "";
  return { name, isLoading: false };
}

/**
 * Retorna o endereço da unidade salvo no localStorage.
 */
export function useUnitAddress(): string | null {
  return localStorage.getItem(UNIT_ADDRESS_KEY);
}
