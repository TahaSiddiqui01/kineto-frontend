'use client'

import { useEffect, useMemo, useRef } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { debounce } from "lodash"
import { useShallow } from "zustand/react/shallow"
import { botDataService } from "@/services/bot-data.service"
import { useFlowStore } from "@/store/flow.store"
import type { BotFlowData } from "@/types/bot"

export const botDataKeys = {
    detail: (botId: string) => ["bot-data", botId] as const,
}

/**
 * Fetches bot data and initialises the flow store once.
 * Does NOT subscribe to nodes/edges — safe to call in a parent layout component.
 */
export function useBotDataLoader(botId: string) {
    const initializeFlow = useFlowStore((s) => s.initializeFlow)
    const flowInitialized = useFlowStore((s) => s.flowInitialized)

    const { data, isLoading } = useQuery({
        queryKey: botDataKeys.detail(botId),
        queryFn: () => botDataService.getBotData(botId),
        enabled: !!botId,
        staleTime: Infinity,
    })

    useEffect(() => {
        if (!data || flowInitialized) return
        const flow = data.data
        if (flow) {
            initializeFlow(flow.nodes ?? [], flow.edges ?? [], flow.variables ?? [])
        } else {
            // No saved data yet — mark as ready so the canvas shows immediately
            initializeFlow([], [], [])
        }
    }, [data, flowInitialized, initializeFlow])

    return { isLoading: isLoading || !flowInitialized }
}

/**
 * Watches the flow store for changes and debounce-saves to Supabase.
 * Subscribes to nodes/edges — put this in a null-rendering component so
 * re-renders from drag events stay isolated from the layout tree.
 */
export function useBotAutoSave(botId: string) {
    const { nodes, edges, variables, flowInitialized } = useFlowStore(
        useShallow((s) => ({
            nodes: s.nodes,
            edges: s.edges,
            variables: s.variables,
            flowInitialized: s.flowInitialized,
        }))
    )

    const { mutate: save } = useMutation({
        mutationFn: (flowData: BotFlowData) => botDataService.saveBotData(botId, flowData),
    })

    // Keep the mutation ref fresh without recreating the debounced fn on every render
    const saveRef = useRef(save)
    useEffect(() => {
        saveRef.current = save
    }, [save])

    const debouncedSave = useMemo(
        () => debounce((flowData: BotFlowData) => saveRef.current(flowData), 1000),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [botId]
    )

    useEffect(() => {
        return () => debouncedSave.cancel()
    }, [debouncedSave])

    useEffect(() => {
        if (!flowInitialized) return
        debouncedSave({ nodes, edges, variables })
    }, [nodes, edges, variables, flowInitialized, debouncedSave])
}
