import BotCanvas from '@/components/bot/bot-canvas'
import React from 'react'

interface BotPageProps {
    botId: string
}

function BotPage({ botId }: BotPageProps) {
    return (
        <>
            <BotCanvas botId={botId} />
        </>
    )
}

export default BotPage
