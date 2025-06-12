// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const encoder = new TextEncoder();

export async function middleware(req: NextRequest) {
  // 統一使用 "access_token" 作為 cookie 名稱
  const token = req.cookies.get("access_token")?.value;
  console.log("Access token from cookie:", token ? "存在" : "不存在");

  // 如果沒有 token，重定向到登入頁面
  if (!token) {
    console.log("沒有找到 access token，重定向到登入頁面");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // 重要：確保使用相同的 JWT_SECRET
    const secret = process.env.JWT_SECRET || "jwt-secret-key";

    // 驗證 JWT token
    await jwtVerify(token, encoder.encode(secret), {
      algorithms: ["HS256"],
    });

    console.log("Access token 有效，繼續訪問請求的頁面");
    return NextResponse.next();
  } catch (error) {
    console.log("Access token 無效或已過期，重定向到登入頁面");
    console.error("JWT 驗證錯誤:", error);

    // 清除無效的 cookie
    const response = NextResponse.redirect(new URL("/login", req.url));
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
    response.cookies.delete("csrf_access_token");
    response.cookies.delete("csrf_refresh_token");

    return response;
  }
}

/**
 * 中介軟體運行規則：
 * - 排除 /api 路由
 * - 排除靜態資源
 * - 排除圖片優化器
 * - 排除公開的認證頁面
 */
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login|register).*)"],
};
