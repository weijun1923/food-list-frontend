// 創建新帳號頁面
"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export function SignUpForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // 模擬 API 請求
    setTimeout(() => {
      setIsLoading(false)
      // 成功後可以導向到其他頁面
      // router.push("/dashboard")
    }, 1500)
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
            {/* 連結登入頁面   href="/login"*/}
            {/* 返回icon */}
            <Link href="/login" className="text-muted-foreground hover:text-foreground mr-2">
              <ArrowLeft className="h-4 w-4" />
            </Link>
        <CardTitle className="text-2xl font-bold">創建帳號</CardTitle>
        <CardDescription>請填寫以下資料來創建您的帳號</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">姓名</Label>
            <Input id="name" placeholder="請輸入您的姓名" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">電子郵件</Label>
            <Input id="email" type="email" placeholder="example@example.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">密碼</Label>
            <div className="relative">
              <Input id="password" type={showPassword ? "text" : "password"} placeholder="請輸入密碼" required />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="sr-only">{showPassword ? "隱藏密碼" : "顯示密碼"}</span>
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                處理中...
              </>
            ) : (
              "註冊"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
