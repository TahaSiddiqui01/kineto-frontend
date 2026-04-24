import { NextRequest, NextResponse } from "next/server";

// 1. Correctly type the context object
export async function GET(
    request: NextRequest, 
    context: { params: Promise<{ bot: string }> }
) {
    const searchParams = request.nextUrl.searchParams;

    const metaVerifyToken = searchParams.get('hub.verify_token');
    const metaChallenge = searchParams.get('hub.challenge');

    if (metaVerifyToken === process.env.WA_VERIFY_TOKEN) {
        console.log("Verification successful for bot:", await context.params.then(params => params.bot));
        return new Response(metaChallenge || '', { status: 200 });
    } else {
        console.warn("Verification failed for bot:", await context.params.then(params => params.bot));
        return new Response('Verification token mismatch', { status: 403 });
    }

}


export async function POST(
    request: NextRequest, 
    context: { params: Promise<{ bot: string }> }
) {
    const { bot } = await context.params;
    const body = await request.json();

    console.log("Received WhatsApp webhook event for bot:", bot);
    console.log("Event body:", JSON.stringify(body, null, 2));

    

    return NextResponse.json({ 
        message: "WhatsApp webhook endpoint is working!", 
        botId: bot, 
    });
}