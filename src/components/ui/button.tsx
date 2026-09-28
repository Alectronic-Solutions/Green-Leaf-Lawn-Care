import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-[transform,background-color,box-shadow,color,border-color] duration-(--dur-ui) disabled:pointer-events-none disabled:opacity-50 [&_img]:pointer-events-none shrink-0 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive hover:-translate-y-px active:translate-y-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-soft hover:bg-forest-800 hover:shadow-lift",
        cta:
          "bg-cta text-cta-foreground shadow-soft hover:bg-cta-hover hover:shadow-lift",
        destructive:
          "bg-destructive text-paper shadow-soft hover:bg-destructive/90",
        outline:
          "border border-border bg-card text-foreground shadow-soft hover:border-primary/40 hover:bg-sage-50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-sage-200",
        ghost:
          "hover:bg-accent hover:text-accent-foreground hover:translate-y-0",
        glass:
          "border border-cream/35 bg-cream/10 text-cream backdrop-blur-md hover:bg-cream/20",
        link: "text-primary underline-offset-4 hover:underline hover:translate-y-0",
      },
      size: {
        default: "h-10 px-5",
        sm: "h-9 px-4 text-[13px]",
        lg: "h-12 px-7 text-[15px]",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
