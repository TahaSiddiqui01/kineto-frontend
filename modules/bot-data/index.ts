import { createAdminClient } from "@/lib/supabase-server-client"
import type { BotDataRecord, BotFlowData } from "@/types/bot"

class BotDataModule {
    private db() {
        return createAdminClient()
    }

    async getBotData(botId: string): Promise<BotDataRecord | null> {
        const { data, error } = await this.db()
            .from("bot_data")
            .select("*")
            .eq("bot_id", botId)
            .maybeSingle()

        if (error) throw error
        return data as unknown as BotDataRecord | null
    }

    async saveBotData(botId: string, flowData: BotFlowData): Promise<BotDataRecord> {
        const existing = await this.getBotData(botId)

        if (existing) {
            const { data, error } = await this.db()
                .from("bot_data")
                .update({ bot_data: flowData, updated_at: new Date().toISOString() })
                .eq("bot_id", botId)
                .select()
                .single()

            if (error) throw error
            return data as unknown as BotDataRecord
        }

        const { data, error } = await this.db()
            .from("bot_data")
            .insert({ bot_id: botId, bot_data: flowData })
            .select()
            .single()

        if (error) throw error
        return data as unknown as BotDataRecord
    }
}

export const botDataModule = new BotDataModule()
