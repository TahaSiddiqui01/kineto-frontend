'use client'

import { useEffect, useMemo, useRef, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { debounce } from "lodash"
import { useShallow } from "zustand/react/shallow"
import { botDataService } from "@/services/bot-data.service"
import { useFlowStore } from "@/store/flow.store"
import type { BotFlowData } from "@/types/bot"

export const botDataKeys = {
    detail: (botId: string) => ["bot-data", botId] as const,
}

export function useBotDataSync(botId: string) {
    const { nodes, edges, variables, initializeFlow } = useFlowStore(
        useShallow((s) => ({
            nodes: s.nodes,
            edges: s.edges,
            variables: s.variables,
            initializeFlow: s.initializeFlow,
        }))
    )

    // State (not ref) so it's safe to read in the return value
    const [initialized, setInitialized] = useState(false)

    // Load bot data on mount
    const { data, isLoading } = useQuery({
        queryKey: botDataKeys.detail(botId),
        queryFn: () => botDataService.getBotData(botId),
        enabled: !!botId,
        staleTime: Infinity,
    })

    // Save mutation
    const { mutate: save } = useMutation({
        mutationFn: (flowData: BotFlowData) => botDataService.saveBotData(botId, flowData),
    })

    // Keep save ref up-to-date so the debounced fn below never goes stale,
    // but we don't need to recreate the debounce on every render.
    // Reading saveRef.current happens inside the debounced callback (async),
    // never during render — so this is safe.
    const saveRef = useRef(save)
    useEffect(() => {
        saveRef.current = save
    }, [save])

    // Stable debounced function — recreated only when botId changes
    const debouncedSave = useMemo(
        () => debounce((flowData: BotFlowData) => saveRef.current(flowData), 1000),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [botId]
    )

    useEffect(() => {
        return () => debouncedSave.cancel()
    }, [debouncedSave])

    // Initialize store from DB once data arrives
    useEffect(() => {
        if (!data || initialized) return
        const flow = data.data
        if (flow) {
            initializeFlow(flow.nodes ?? [], flow.edges ?? [], flow.variables ?? [])
        }
        setInitialized(true)
    }, [data, initialized, initializeFlow])

    // Watch for changes after initialization and debounce-save
    useEffect(() => {
        if (!initialized) return
        debouncedSave({ nodes, edges, variables })
    }, [nodes, edges, variables, initialized, debouncedSave])

    return { isLoading: isLoading && !initialized }
}
