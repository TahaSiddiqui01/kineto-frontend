import { authentication } from "@/modules/auth";
import { NextResponse } from "next/server";


// This route is used to login the user via the magic link token. The token is created in the login page and sent to the user's email. When the user clicks on the link, they are redirected to this route with the token as a query parameter. This route then verifies the token and logs the user in if the token is valid.
export async function POST(req: Request) {

    const body = await req.json()
    const response = authentication.createMagicUrlToken(body)
    return NextResponse.json(response)

}


