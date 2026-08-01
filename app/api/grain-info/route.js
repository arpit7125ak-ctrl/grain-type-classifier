// app/api/grain-info/route.js

import { Mistral } from "@mistralai/mistralai";

const client = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

export async function POST(req) {
  const { grain } = await req.json();

  const response = await client.chat.complete({
    model: "mistral-large-latest",
    messages: [
  {
    role: "system",
    content: `
You are an expert in agriculture and food science.

Always return ONLY valid JSON.

Rules:
1. Return ONLY the JSON object.
2. Do NOT use markdown.
3. Do NOT add extra fields.
4. Do NOT omit any field.
5. If information is unavailable, return "Unknown".
6. Arrays must always be arrays.
7. Booleans must always be true or false.
`
  },
  {
    role: "user",
    content: `
The predicted grain is "${grain}".

Return the information using EXACTLY this JSON schema.

{
  "grainName": "",
  "scientificName": "",
  "origin": "",
  "cropType": "",
  "family": "",

  "nutritionalInformation": {
    "calories": "",
    "carbohydrates": "",
    "protein": "",
    "fat": "",
    "fiber": "",
    "minerals": [],
    "vitamins": []
  },

  "growingConditions": {
    "temperature": "",
    "rainfall": "",
    "soilType": "",
    "waterRequirement": "",
    "growingSeason": ""
  },

  "uses": {
    "foodProducts": [],
    "animalFeed": false,
    "industrialUses": [],
    "flour": false,
    "noodles": false,
    "biscuits": false
  },

  "healthBenefits": [],

  "storageGuidelines": {
    "idealTemperature": "",
    "moistureContent": "",
    "storageMethod": "",
    "shelfLife": ""
  }
}

Return ONLY the JSON object.
`
  }
],
    responseFormat: {
      type: "json_object"
    }
  });

  return Response.json(
    JSON.parse(response.choices[0].message.content)
  );
}