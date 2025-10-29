"use client"

import type { LucideIcon } from "lucide-react"
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface SidebarItemProps {
  title: string
  icon: LucideIcon
  url: string
  isActive?: boolean
}

export function SidebarItem({ title, icon: Icon, url, isActive }: SidebarItemProps) {

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link
          href={url}
          className={cn(
            "flex items-center gap-3 py-2.5 px-3 transition-colors",
            isActive
              ? "!bg-black !text-background"
              : "hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <Icon className="h-4 w-4" />
          <span className="text-sm font-medium">{title}</span>  
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
