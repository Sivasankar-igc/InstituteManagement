import fetch, {Headers} from "node-fetch"
globalThis.fetch = fetch;
globalThis.Headers = Headers

import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import dotenv from "dotenv"
dotenv.config()

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" }) // gemini-1.5-flash   // gemini-1.5-flash-8b // use any of these model if one is not working

export { model }