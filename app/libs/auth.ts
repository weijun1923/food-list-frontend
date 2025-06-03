// lib/auth.ts
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation"; // for post-login redirects
const API = "http://127.0.0.1:5000"; // keep server-only (NOT NEXT_PUBLIC)

/**
 * POST /login  —— stores access & refresh cookies sent by Flask
 */
export async function loginAction(prevState: any, formData: FormData) {
  "use server";
  const body = JSON.stringify({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  const res = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    credentials: "include",
  });
  if (!res.ok) throw new ApiError(await res.json(), res.status);
  // cookies() automatically picks up Set-Cookie from the response
  redirect("/"); // success → home page
}

/**
 * DELETE /logout —— clears auth cookies (Flask sets ‘unset’ cookies)
 */
export async function logoutAction() {
  "use server";
  const res = await fetch(`${API}/api/auth/logout`, {
    method: "DELETE",
    credentials: "include",
  });
  const cookieStore = await cookies();
  cookieStore.delete("access"); // double-check; remove stale copies
  cookieStore.delete("refresh");
  redirect("/login");
}

/**
 * fetchWithAuth —— transparently refreshes the access token once.
 */
export async function fetchWithAuth(path: string, init: RequestInit = {}) {
  "use server";
  const cookieStore = await cookies();
  const access = cookieStore.get("access")?.value ?? "";
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { ...init.headers, Authorization: `Bearer ${access}` },
    credentials: "include",
  });
  if (res.status !== 401) return res; // token still valid

  // ↻ try refresh (POST /refresh needs only the HttpOnly refresh cookie)
  const ok = await fetch(`${API}/api/auth/refresh`, {
    method: "POST",
    credentials: "include",
  }).then((r) => r.ok);

  if (!ok) throw new ApiError({ msg: "Unauthenticated" }, 401);
  // access cookie has just been rotated by Flask → retry original call
  return fetchWithAuth(path, init);
}

export class ApiError extends Error {
  constructor(public payload: any, public status: number) {
    super(JSON.stringify(payload));
  }
}
