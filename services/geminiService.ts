

import { GoogleGenAI, Type } from '@google/genai';
import { Holding, SearchResult } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const analyzePortfolio = async (holdings: Holding[], cash: number): Promise<string> => {
    const prompt = `
        Analyze the following investment portfolio for an investor. The portfolio may contain stocks and commodities. Provide a concise analysis covering:
        1.  Overall Risk Assessment (Low, Medium, High).
        2.  Diversification commentary (across sectors, asset classes like stocks/commodities).
        3.  Volatility potential.
        4.  Provide 2-3 actionable, smart suggestions for improvement (e.g., "Consider adding a stock from the healthcare sector to improve diversification.").

        The portfolio consists of:
        - Cash Balance: $${cash.toFixed(2)}
        - Holdings: ${JSON.stringify(holdings.map(h => ({ ticker: h.ticker, quantity: h.quantity, averageCost: h.purchasePrice.toFixed(2) })))}

        Keep the entire response under 200 words and format it nicely for a web dashboard. Use markdown for headings and lists.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error analyzing portfolio:", error);
        return "There was an error analyzing your portfolio. Please ensure your API key is configured correctly.";
    }
};

export const searchAssets = async (query: string): Promise<SearchResult[]> => {
    const prompt = `
        You are a smart trading assistant. A user is asking: "${query}".
        Based on general market knowledge, provide a list of 3-5 assets (stocks or commodities) that match this query.
        Return ONLY a valid JSON array of objects. Each object must have a "ticker" (string), a "reason" (string, max 20 words), and a "type" ('Stock' or 'Commodity').
        Example: [{"ticker": "GOOGL", "reason": "Dominant in search and AI, with strong growth.", "type": "Stock"}, {"ticker": "XAUUSD", "reason": "A traditional safe-haven asset against inflation.", "type": "Commodity"}]
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            ticker: { type: Type.STRING },
                            reason: { type: Type.STRING },
                            type: { type: Type.STRING, "enum": ['Stock', 'Commodity'] },
                        },
                        required: ["ticker", "reason", "type"],
                    },
                },
            },
        });
        return JSON.parse(response.text) as SearchResult[];
    } catch (error) {
        console.error("Error searching assets:", error);
        throw new Error("Failed to fetch asset suggestions from AI. Please try a different query.");
    }
};

export const generateSmartAlerts = async (): Promise<string[]> => {
    const prompt = `
        Generate 3 distinct, concise, and insightful "smart alerts" for a stock and commodity trader.
        Each alert should be a single sentence and feel like it's coming from an intelligent assistant.
        Mix positive and cautionary alerts.
        
        Return ONLY a valid JSON array of strings.
        Example: [
            "Market sentiment for the tech sector is showing unusual volatility; proceed with caution.",
            "Gold (XAUUSD) has broken a key resistance level, indicating potential for further upside.",
            "Inflation data is expected this week, which could impact consumer discretionary stocks."
        ]
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                },
            },
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error generating smart alerts:", error);
        return [
            "Could not load AI alerts.",
            "Please check your API key and network connection.",
            "Market data is currently being updated."
        ];
    }
};