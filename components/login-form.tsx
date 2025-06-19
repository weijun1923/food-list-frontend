"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoaderCircle, CircleAlert, Check } from "lucide-react";
console.log(process.env.NEXT_PUBLIC_API_POINT);

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      setError("請填寫所有欄位");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("請輸入有效的電子郵件地址");
      return;
    }

    if (password.length < 6) {
      setError("密碼長度至少 6 位");
      return;
    }
    setError("");
    setLoading(true);

    const data = {
      email,
      password,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_POINT}/api/auth/login`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const { message } = await response.json();
        setError(message || "登入失敗，請稍後再試");
        return;
      }
      console.log(response);
      setSuccess("登入成功，正在跳轉...");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch {
      setError("登入失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>會員登入</CardTitle>
          <CardDescription>
            在下面輸入您的電子郵件以登入您的帳戶
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-3">
                {error && (
                  <Alert variant="destructive">
                    <CircleAlert />
                    <AlertTitle>錯誤</AlertTitle>
                    <AlertDescription>
                      <p>{error}</p>
                    </AlertDescription>
                  </Alert>
                )}
                {success && (
                  <Alert className="bg-green-50 text-green-800">
                    <Check />
                    <AlertTitle>成功</AlertTitle>
                    <AlertDescription className=" font-bold text-green-900">
                      <p>{success}</p>
                    </AlertDescription>
                  </Alert>
                )}
                <Button disabled={loading} type="submit" className="w-full">
                  {loading ? <LoaderCircle className="animate-spin" /> : "登入"}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              還沒有帳戶?{" "}
              <Link href="/register" className="underline underline-offset-4">
                註冊
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
