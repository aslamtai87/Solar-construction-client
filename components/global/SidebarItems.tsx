"use client"

import type { LucideIcon } from "lucide-react"
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { useState } from "react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

export interface SubMenuItem {
  title: string
  url: string
}

interface SidebarItemProps {
  title: string
  icon: LucideIcon
  url?: string
  isActive?: boolean
  subItems?: SubMenuItem[]
  isSubItemActive?: (url: string) => boolean
}

export function SidebarItem({ 
  title, 
  icon: Icon, 
  url, 
  isActive, 
  subItems,
  isSubItemActive 
}: SidebarItemProps) {
  const [isOpen, setIsOpen] = useState(isActive)

  // If there are no subitems, render a simple link
  if (!subItems || subItems.length === 0) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isActive}>
          <Link
            href={url || "#"}
            className={cn(
              "flex items-center gap-3 py-2.5 px-3 transition-colors",
              isActive
                ? "!bg-[#1a1d29] hover:bg-[#1a1d29]/90 !text-background"
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

  // Render collapsible menu with subitems
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton 
            className={cn(
              "flex items-center gap-3 h-10 py-2.5 px-3 transition-colors w-full",
              isActive
                ? "!bg-[#1a1d29] hover:bg-[#1a1d29]/90 !text-background"
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="text-sm font-medium flex-1 text-left">{title} </span>
            <ChevronDown 
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                isOpen && "rotate-180"
              )}
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="gap-2 mt-2">
            {subItems.map((subItem, index) => {
              const subIsActive = isSubItemActive ? isSubItemActive(subItem.url) : false
              return (
                <SidebarMenuSubItem key={index}>
                  <SidebarMenuSubButton asChild isActive={subIsActive}>
                    <Link
                      href={subItem.url}
                      className={cn(
                        "flex items-center gap-3 py-2 px-3 pl-11 transition-colors",
                        subIsActive
                          ? "!bg-[#1a1d29] hover:bg-[#1a1d29]/90 !text-background"
                          : "hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <span className="text-sm">{subItem.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              )
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}
