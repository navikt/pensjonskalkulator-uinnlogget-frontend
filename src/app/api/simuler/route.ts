'use server'

import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { requestAzureClientCredentialsToken } from "@navikt/oasis";

const generateBearerToken = async (): Promise<string> => {

    const clientCredentials = await requestAzureClientCredentialsToken(
        "api://dev-gcp:pensjonskalkulator:pensjonskalkulator-backend",
    );

    if(clientCredentials.ok){
        return clientCredentials.token;
    }
    else{
        throw new Error("Failed to generate token");
    }
}

//handler for å håndtere alle forespørsler
export async function POST(req: NextApiRequest, res: NextApiResponse) {


    if (req.method !== 'POST') {
        console.log('Method not allowed');
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const backendUrl = "https://pensjonskalkulator-backend.intern.dev.nav.no/api/v1/alderspensjon/anonym-simulering";
    
    try {
        const token = await generateBearerToken();
        const backendResponse = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body),
        });

        const data = await backendResponse.json();
        res.status(backendResponse.status).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
}