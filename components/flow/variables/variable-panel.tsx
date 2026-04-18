"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Search, Plus, Variable as VariableIcon } from "lucide-react"
import { useState, useMemo } from "react"
import { VariableItem } from "./variable-item"
import { cn } from "@/lib/utils"
import { useFlowStore } from "@/store/flow.store"
import { useShallow } from "zustand/shallow"

interface VariablesPanelProps {
  panOpen: boolean
  onPanChange: (val: boolean) => void
}

export function VariablesPanel({ panOpen, onPanChange }: VariablesPanelProps) {
  const { variables, setVariable, updateVariable, deleteVarible } = useFlowStore(
    useShallow((s) => ({
      variables: s.variables,
      setVariable: s.setVariable,
      updateVariable: s.updateVariable,
      deleteVarible: s.deleteVariable
    }))
  )

  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    if (!query.trim()) return variables
    const q = query.toLowerCase()
    return variables.filter((v) => v.name.toLowerCase().includes(q))
  }, [variables, query])

  const canCreate = query.trim().length > 0 && !variables.some(
    (v) => v.name.toLowerCase() === query.trim().toLowerCase()
  )

  const handleCreate = () => {
    const name = query.trim()
    if (!name) return
    setVariable({ id: crypto.randomUUID(), name })
    setQuery("")
  }

  const handleToggleSave = (id: string) => {
    updateVariable({ id: id, saveInResults: true })
  }

  const handleDelete = (id: string) => {
    deleteVarible(id)
  }

  const savedCount = variables.filter((v) => v.saveInResults).length

  return (
    <Sheet open={panOpen} onOpenChange={onPanChange}>
      <SheetContent
        className="flex flex-col p-0 bg-background border-l border-border w-[320px] sm:w-90"
      >
        {/* Header */}
        <SheetHeader
          className="px-4 pt-5 pb-4 border-b border-border shrink-0"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-orange-500/10 text-orange-500">
              <VariableIcon className="h-3.5 w-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-sm font-semibold text-foreground" style={{ color: "var(--color-foreground)" }}>
                Variables
              </SheetTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {variables.length} variable{variables.length !== 1 ? "s" : ""}
                {savedCount > 0 && ` · ${savedCount} saved`}
              </p>
            </div>
          </div>
        </SheetHeader>

        {/* Search / Create */}
        <div className="px-3 py-3 border-b border-border shrink-0">
          <div className={cn(
            "flex items-center gap-2 h-8 rounded-lg px-2.5 transition-colors",
            "bg-muted/60 border border-transparent",
            "focus-within:bg-background focus-within:border-border"
          )}>
            <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && canCreate && handleCreate()}
              placeholder="Search or create..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
            {canCreate && (
              <button
                onClick={handleCreate}
                className="flex items-center gap-1 text-xs text-orange-500 font-medium hover:text-orange-400 transition-colors shrink-0"
              >
                <Plus className="h-3.5 w-3.5" />
                Create
              </button>
            )}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-2 py-2">
          {filtered.length > 0 ? (
            <div className="space-y-0.5">
              {filtered.map((variable) => (
                <VariableItem
                  key={variable.id}
                  variable={variable}
                  onToggleSave={handleToggleSave}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-muted mb-3">
                <VariableIcon className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">No variables found</p>
              {query ? (
                <p className="text-xs text-muted-foreground mt-1">
                  Press Enter or click Create to add &ldquo;{query}&rdquo;
                </p>
              ) : (
                <p className="text-xs text-muted-foreground mt-1">
                  Type a name above to create your first variable
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer hint */}
        {variables.length > 0 && (
          <div className="px-4 py-3 border-t border-border shrink-0">
            <p className="text-[11px] text-muted-foreground/70 text-center">
              Hover a variable to see actions · Enter to create
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
