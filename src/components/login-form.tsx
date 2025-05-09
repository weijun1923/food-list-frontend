// 登入頁面
// login.tsx
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"



export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="space-y-1">
          {/* 連結回首頁*/}
            {/* 返回icon */}
            <Link href="/" className="text-muted-foreground hover:text-foreground mr-2">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          <CardTitle>登入帳戶</CardTitle>
          <CardDescription>
            請輸入電子郵件和密碼登入帳戶
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="yourEmail@gmail.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  {/* 忘記密碼路由 */}
                  <Label htmlFor="password">密碼</Label>
                  <a
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                    忘記密碼？
                  </a>
                </div>
                <Input id="password" type="password" required />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  登入
                </Button>
                <Button variant="outline" className="w-full">
                  使用Google登入
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              還沒有帳號嗎?{" "}
              <a href="/sign-up" className="underline underline-offset-4">
                註冊新帳號
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
