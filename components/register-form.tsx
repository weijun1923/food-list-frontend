"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderCircle, CircleAlert } from "lucide-react";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username || !email || !password) {
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
      username,
      email,
      password,
    };

    try {
      const response = await fetch(
        `${process.env.API_POINT}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const { message } = await response.json();
        setError(message || "註冊失敗，請稍後再試");
        return;
      }

      setUsername("");
      setEmail("");
      setPassword("");
      setOpenDialog(true);
    } catch {
      setError("註冊失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {openDialog && (
        <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>恭喜註冊成功</AlertDialogTitle>
              <AlertDialogDescription>
                接下來，請登入您的帳戶以繼續使用我們的服務。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
                onClick={() => {
                  router.replace("/login");
                  setOpenDialog(false);
                }}
              >
                確定
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      <Card>
        <CardHeader>
          <CardTitle>會員註冊</CardTitle>
          <CardDescription>
            在下面輸入您的電子郵件以註冊您的帳戶
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="username">使用者名稱</Label>
                <Input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">電子郵件</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@example.com"
                  required
                  value={email}
                  autoComplete="new-password"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">密碼</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-3">
                {error && (
                  <Alert variant="destructive">
                    <CircleAlert />
                    <AlertTitle>註冊失敗</AlertTitle>
                    <AlertDescription>
                      <p>{error}</p>
                    </AlertDescription>
                  </Alert>
                )}

                <Button disabled={loading} type="submit" className="w-full">
                  {loading ? <LoaderCircle className="animate-spin" /> : "註冊"}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              已經有帳戶?{" "}
              <Link href="/login" className="underline underline-offset-4">
                登入
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
