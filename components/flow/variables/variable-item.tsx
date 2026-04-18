"use client"

import { useRef, useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Trash, Info, Braces, BookmarkCheck, MoreHorizontal } from "lucide-react"
import { Variable } from "@/types/flow"
import { cn } from "@/lib/utils"

interface Props {
  variable: Variable
  onToggleSave: (id: string) => void
  onDelete: (id: string) => void
}

export function VariableItem({ variable, onToggleSave, onDelete }: Props) {
  const [hovered, setHovered] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [infoTooltipOpen, setInfoTooltipOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-colors cursor-default",
        "hover:bg-accent"
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Icon */}
      <div className={cn(
        "flex items-center justify-center w-6 h-6 rounded-md shrink-0 transition-colors",
        variable.saveInResults
          ? "bg-orange-500/15 text-orange-500"
          : "bg-muted text-muted-foreground"
      )}>
        {variable.saveInResults
          ? <BookmarkCheck className="h-3.5 w-3.5" />
          : <Braces className="h-3.5 w-3.5" />
        }
      </div>

      {/* Name */}
      <span className={cn(
        "flex-1 text-sm font-mono truncate transition-colors",
        variable.saveInResults ? "text-foreground" : "text-foreground/80"
      )}>
        {variable.name}
      </span>

      {/* Saved badge */}
      {variable.saveInResults && !hovered && (
        <span className="text-[10px] font-medium text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded shrink-0">
          saved
        </span>
      )}

      {/* Actions — visible on hover */}
      <div className={cn(
        "flex items-center gap-0.5 transition-opacity",
        hovered ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        {/* Three dots */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="flex items-center justify-center w-6 h-6 rounded-md transition-colors hover:bg-muted text-muted-foreground hover:text-foreground"
        >
          <MoreHorizontal className="h-3.5 w-3.5" />
        </button>

        {/* Delete */}
        <button
          onClick={() => onDelete(variable.id)}
          className="flex items-center justify-center w-6 h-6 rounded-md transition-colors hover:bg-destructive/15 text-muted-foreground hover:text-destructive"
        >
          <Trash className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Options box */}
      {menuOpen && (
        <>
          {/* Backdrop to close */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 z-50 min-w-50 rounded-lg border border-border bg-popover shadow-md p-1">
            <label className="flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-accent cursor-pointer select-none">
              <input
                type="checkbox"
                checked={!!variable.saveInResults}
                onChange={() => onToggleSave(variable.id)}
                className="h-3.5 w-3.5 cursor-pointer accent-orange-500"
              />
              <span className="flex-1 text-sm text-foreground">Save in results</span>

              <TooltipProvider>
                <Tooltip open={infoTooltipOpen}>
                  <TooltipTrigger asChild>
                    <Info
                      className="h-3.5 w-3.5 text-muted-foreground shrink-0"
                      onMouseEnter={() => setInfoTooltipOpen(true)}
                      onMouseLeave={() => setInfoTooltipOpen(false)}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-50 text-xs">
                    Check this option if you want to save the variable value in the typebot Results table.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </label>
          </div>
        </>
      )}
    </div>
  )
}
