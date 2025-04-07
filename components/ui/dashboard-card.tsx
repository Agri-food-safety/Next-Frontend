import React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  footer?: React.ReactNode
  headerAction?: React.ReactNode
  noPadding?: boolean
  className?: string
  contentClassName?: string
  headerClassName?: string
  footerClassName?: string
  children: React.ReactNode
}

export function DashboardCard({
  title,
  description,
  footer,
  headerAction,
  noPadding = false,
  className,
  contentClassName,
  headerClassName,
  footerClassName,
  children,
  ...props
}: DashboardCardProps) {
  return (
    <Card 
      className={cn(
        "dark:bg-secondary/10",
        className
      )} 
      {...props}
    >
      {(title || description || headerAction) && (
        <CardHeader className={cn("bg-transparent dark:bg-transparent", headerClassName)}>
          <div>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </CardHeader>
      )}
      <CardContent className={cn(
        noPadding ? "p-0" : "", 
        "bg-transparent dark:bg-transparent",
        contentClassName
      )}>
        {children}
      </CardContent>
      {footer && (
        <CardFooter className={cn(
          "bg-transparent dark:bg-transparent", 
          footerClassName
        )}>
          {footer}
        </CardFooter>
      )}
    </Card>
  )
}
