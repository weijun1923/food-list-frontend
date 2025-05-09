import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ForgotPassword() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 md:p-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center">
            {/* 連結登入頁面   href="/login"*/}
            <Link href="/login" className="text-muted-foreground hover:text-foreground mr-2">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <CardTitle className="text-2xl">忘記密碼</CardTitle>
          </div>
          <CardDescription>請輸入您的電子郵件地址，我們將發送重設密碼的連結給您。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              電子郵件
            </label>
            <Input id="email" type="email" placeholder="name@example.com" className="w-full" />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">發送重設連結</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
