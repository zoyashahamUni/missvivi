import express from "express";
import { GoogleGenAI } from "@google/genai";

import Attraction from "../models/Attraction.js";
import Activity from "../models/Activity.js";

const router = express.Router();

function extractJsonArray(text) {
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Gemini did not return a JSON array");
  }

  return JSON.parse(text.slice(start, end + 1));
}

function isValidUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

async function isReachableUrl(url) {
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
    });

    return response.ok;
  } catch (error) {
    console.log("Bad source URL:", url, error.message);
    return false;
  }
}

function removeWww(url) {
  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname.startsWith("www.")) {
      parsedUrl.hostname = parsedUrl.hostname.replace("www.", "");
      return parsedUrl.toString();
    }

    return url;
  } catch {
    return url;
  }
}

async function getWorkingSourceUrl(url) {
  if (!isValidUrl(url)) {
    return null;
  }

  const originalWorks = await isReachableUrl(url);

  if (originalWorks) {
    return url;
  }

  const withoutWww = removeWww(url);

  if (withoutWww !== url) {
    const withoutWwwWorks = await isReachableUrl(withoutWww);

    if (withoutWwwWorks) {
      return withoutWww;
    }
  }

  return null;
}

router.post("/generate-attractions", async (req, res) => {
  try {
    const { city, age } = req.body || {};

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Missing GEMINI_API_KEY" });
    }

    if (!city || age === undefined) {
      return res.status(400).json({ error: "Missing city or age" });
    }

    const childAge = Number(age);

    if (Number.isNaN(childAge) || childAge < 0 || childAge > 18) {
      return res.status(400).json({ error: "Invalid age" });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = `
You are helping build a Hebrew web app called Miss Vivi.

Use Google Search grounding.

Find 8 real child-friendly options for things to do in or near this city in Israel.
The child age is ${childAge}, so the results must be specifically suitable for this age.

The results can include:
- attractions
- playgrounds
- parks
- indoor play areas
- museums
- libraries with children activities
- community center activities
- municipal events
- mall activities
- theater shows
- children plays
- cinema activities
- free events
- family-friendly performances
- seasonal events
- workshops

City: ${city}
Child age: ${childAge}

Important:
- Do not invent attractions.
- Prefer practical recommendations that a parent can actually use today or this week.
- The sourceUrl must be a real http or https URL.
- Do not limit yourself only to formal attractions. Include everyday family options if they are age-appropriate and have a source URL.
- Each option must have a real website or source URL.
- Prefer official websites, municipal pages, or well-known attraction pages.
- If a URL with www does not work, prefer the version without www.
- If you cannot verify a place with a source URL, do not include it.
- Return ONLY a valid JSON array.
- Do not include markdown.
- Do not include explanations.

Return this exact JSON structure:
[
  {
    "name": "real place, event, or activity name in Hebrew",
    "city": "city in Hebrew",
    "type": "category in Hebrew such as park, playground, museum, show, mall activity, free event, workshop",
    "description": "short Hebrew description based on the source",
    "sourceUrl": "https://real-source-url.com",
    "minAge": number,
    "maxAge": number,
    "activity": {
      "name": "simple activity name in Hebrew",
      "minAge": number,
      "maxAge": number,
      "maxParticipants": number,
      "pricePerParticipant": number,
      "durationMinutes": number
    }
  }
]

Rules:
- minAge must be <= ${childAge}
- maxAge must be >= ${childAge}
- minAge and maxAge must be between 0 and 18.
- maxParticipants is internal booking data, use a reasonable number between 10 and 30.
- pricePerParticipant is internal demo data. Use 0 for free activities, or a whole number between 30 and 120 for paid activities. Do not use decimals.
- durationMinutes is internal demo data, use a reasonable number between 45 and 120.
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    console.log("Gemini raw text:", result.text);

    const attractionsFromAI = extractJsonArray(result.text);

    const savedAttractions = [];

    for (const item of attractionsFromAI) {
      const workingSourceUrl = await getWorkingSourceUrl(item.sourceUrl);

      if (!workingSourceUrl) {
        console.log("Skipping unreachable source URL:", item.sourceUrl);
        continue;
      }

      const minAge = Number(item.minAge);
      const maxAge = Number(item.maxAge);

      if (
        Number.isNaN(minAge) ||
        Number.isNaN(maxAge) ||
        minAge < 0 ||
        maxAge > 18 ||
        minAge > maxAge ||
        minAge > childAge ||
        maxAge < childAge
      ) {
        console.log("Skipping invalid age range:", item.name, minAge, maxAge);
        continue;
      }

      const existingAttraction = await Attraction.findOne({
        $or: [{ sourceUrl: workingSourceUrl }, { name: item.name }],
      });

      if (existingAttraction) {
        savedAttractions.push(existingAttraction);

        if (savedAttractions.length >= 5) {
          break;
        }

        continue;
      }

      const attraction = await Attraction.create({
        name: item.name,
        city: item.city || city,
        type: item.type,
        description: item.description,
        sourceUrl: workingSourceUrl,
        minAge,
        maxAge,
        source: "ai",
      });

      await Activity.create({
        name: item.activity?.name || "פעילות ילדים",
        attractionId: attraction._id,
        minAge,
        maxAge,
        maxParticipants: Math.round(Number(item.activity?.maxParticipants ?? 20)),
        pricePerParticipant: Math.round(
          Number(item.activity?.pricePerParticipant ?? 60)
        ),
        durationMinutes: Math.round(Number(item.activity?.durationMinutes ?? 90)),
      });

      savedAttractions.push(attraction);
      if (savedAttractions.length >= 5) {
        break;
      }
    }

    if (savedAttractions.length === 0) {
      return res.status(404).json({
        error: "Gemini did not return verified attractions with working source URLs",
      });
    }
    res.status(201).json(savedAttractions);
  } catch (error) {
    console.error("Gemini generation failed:", error.message);

    res.status(500).json({
      error: "Gemini failed to generate verified attractions",
      details: error.message,
    });
  }
});

export default router;