'use server'

import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { requestAzureClientCredentialsToken } from "@navikt/oasis";

const generateBearerToken = async (): Promise<string> => {

    const clientCredentials = await requestAzureClientCredentialsToken(
        "api://dev-gcp:pensjonskalkulator:pensjonskalkulator-backend",
    );

    if(clientCredentials.ok){
        return clientCredentials.token;
    }
    else{
        console.error("Failed to generate token: ", clientCredentials);
        throw new Error("Failed to generate token");
    }
}

//handler for å håndtere alle forespørsler
export async function POST(req: NextRequest/* req: NextApiRequest, res: NextApiResponse */) {

    if (req.method !== 'POST') {
        //return res.status(405).json({ message: 'Method not allowed' });
        return NextResponse.json({ message: 'Method not allowed' });
    }

    const backendUrl = "https://pensjonskalkulator-backend.intern.dev.nav.no/api/v1/alderspensjon/anonym-simulering";
    
    try {
        const token = await generateBearerToken();
        const reqBody = await req.json();
        const backendResponse = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reqBody),
        });

        const data = await backendResponse.json();
        //res.status(backendResponse.status).json(data);
        return NextResponse.json(data, { status: backendResponse.status });
    } catch (error) {
        console.error(`Error in POST handler: ${(error as Error).message}`, error);
        const errorObj: Error = error as Error;
        //res.status(500).json({ error: errorObj.message });
        return NextResponse.json({ error: errorObj.message }, { status: 500 });
    }
}