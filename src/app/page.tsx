import Image from "next/image";
import { Button } from "@/components/ui/button";

// 連結登入頁面
import Link from "next/link";


export default function Home() {
  return (
  // 登入的路由/login
    <Link href="/login">
      <Button>
        登入
      </Button>
    </Link>
    
  );
}


