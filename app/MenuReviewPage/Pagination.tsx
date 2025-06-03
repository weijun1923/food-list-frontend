
"use client"
// react 套件 Function Component
import { FC } from "react"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (p: number) => void
}

const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const generatePageNumbers = () => {
    const pages: Array<number | string> = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push("...")
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push("...")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      }
    }
    return pages
  }

  return (
    <div className="flex justify-center items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
      >
        上一頁
      </Button>

      {generatePageNumbers().map((page, idx) => (
        <Button
          key={idx}
          variant={page === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => typeof page === "number" && onPageChange(page)}
          disabled={page === "..."}
          className="min-w-[40px]"
        >
          {page}
        </Button>
      ))}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
      >
        下一頁
      </Button>
    </div>
  )
}

export default Pagination
