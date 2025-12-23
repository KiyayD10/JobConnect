import * as React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/src/lib/utils"

// 1. Tambahkan tipe ukuran di sini
type ButtonVariant = "primary" | "outline" | "ghost"
type ButtonSize = "default" | "sm" | "lg" | "icon"

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize // 2. Daftarkan prop size
  isLoading?: boolean
}

// 3. Definisikan gaya untuk masing-masing variant
const variants: Record<ButtonVariant, string> = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm border-transparent",
  outline: "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50",
  ghost: "bg-transparent text-gray-700 hover:bg-gray-100 border-transparent",
}

// 4. Definisikan gaya untuk masing-masing size
const sizes: Record<ButtonSize, string> = {
  default: "h-10 px-4 py-2",
  sm: "h-9 px-3 text-xs",
  lg: "h-11 px-8 text-base",
  icon: "h-10 w-10",
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", isLoading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border",
          variants[variant], 
          sizes[size], // 5. Terapkan size di class name
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"