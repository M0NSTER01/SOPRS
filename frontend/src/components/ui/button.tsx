import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] select-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-blue-600 text-white font-semibold hover:bg-blue-500 shadow-sm transition-colors duration-150",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors duration-150",
        outline:
          "border border-border bg-card/70 hover:bg-secondary hover:text-foreground hover:border-blue-500/40 transition-colors duration-150",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors duration-150",
        ghost:
          "hover:bg-secondary hover:text-foreground transition-colors duration-150",
        link:
          "text-primary underline-offset-4 hover:underline",
        hero:
          "bg-blue-600 text-white font-semibold hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-[transform,box-shadow,background-color] duration-150 hover:-translate-y-0.5",
        cyber:
          "border border-blue-500/40 bg-blue-500/10 text-sky-400 hover:bg-blue-500/20 hover:border-blue-500/60 transition-colors duration-150",
        cta:
          "bg-blue-600 text-white font-semibold hover:bg-blue-500 shadow-sm transition-colors duration-150",
        scan:
          "bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-colors duration-150",
        "scan-active":
          "bg-blue-600 text-white shadow-md animate-pulse",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-lg px-7 text-base",
        xl: "h-12 rounded-xl px-8 text-base font-semibold",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
