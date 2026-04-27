import { createAdminClient } from "@/lib/supabase-server-client"
import { v4 as uuidv4 } from "uuid"

const BUCKET_ID = process.env.SUPABASE_BOT_MEDIA_ID!

class MediaModule {
    private db() {
        return createAdminClient()
    }

    async uploadImage(file: Buffer, fileName: string, mimeType: string): Promise<{ fileId: string; url: string }> {
        const supabase = this.db()
        const fileId = uuidv4()
        const filePath = `bot-media/images/${fileId}/${fileName}`

        const { error } = await supabase.storage
            .from(BUCKET_ID)
            .upload(filePath, file, { contentType: mimeType, upsert: false })

        if (error) throw error

        const { data: urlData } = supabase.storage.from(BUCKET_ID).getPublicUrl(filePath)

        return { fileId, url: urlData.publicUrl }
    }

    async uploadVideo(file: Buffer, fileName: string, mimeType: string): Promise<{ fileId: string; url: string }> {
        const supabase = this.db()
        const fileId = uuidv4()
        const filePath = `bot-media/videos/${fileId}/${fileName}`

        const { error } = await supabase.storage
            .from(BUCKET_ID)
            .upload(filePath, file, { contentType: mimeType, upsert: false })

        if (error) throw error

        const { data: urlData } = supabase.storage.from(BUCKET_ID).getPublicUrl(filePath)

        return { fileId, url: urlData.publicUrl }
    }

    async uploadAudio(file: Buffer, fileName: string, mimeType: string): Promise<{ fileId: string; url: string }> {
        const supabase = this.db()
        const fileId = uuidv4()
        const filePath = `bot-media/audio/${fileId}/${fileName}`

        const { error } = await supabase.storage
            .from(BUCKET_ID)
            .upload(filePath, file, { contentType: mimeType, upsert: false })

        if (error) throw error

        const { data: urlData } = supabase.storage.from(BUCKET_ID).getPublicUrl(filePath)

        return { fileId, url: urlData.publicUrl }
    }
}

export const mediaModule = new MediaModule()
