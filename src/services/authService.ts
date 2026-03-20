import { clientApi } from "../lib/api";

export async function login(phone: string): Promise<string> {
  const response = await clientApi("/auth/login", {
    method: "POST",
    body: JSON.stringify({ phone }),
  });
  const data = await response.json();
  return data.clientId;
}

export async function validateSession(clientId: string): Promise<boolean> {
  try {
    await clientApi(`/auth/validate?clientId=${encodeURIComponent(clientId)}`);
    return true;
  } catch {
    return false;
  }
}
