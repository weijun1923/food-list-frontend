// app/lib/api.ts
import { getCookie } from "@/app/libs/cookie";

const BASE = "http://localhost:5000/api";

function authHeader() {
  const csrf = getCookie("csrf_access_token");
  return {
    "Content-Type": "application/json",
    "X-CSRF-Token": csrf ?? "",
  };
}

export async function apiGet<T>(url: string): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    credentials: "include",
    headers: authHeader(),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}

export async function apiMutation(
  url: string,
  method: "POST" | "PUT" | "DELETE",
  body?: unknown
) {
  const res = await fetch(`${BASE}${url}`, {
    credentials: "include",
    method,
    headers: authHeader(),
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
