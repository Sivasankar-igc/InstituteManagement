import { model } from "./AI_configuration.mjs";

export default async (req, res) => {
    try {
        const { paperName, numberOfQuestions } = req.query;
        const prompt = `Generate ${numberOfQuestions} multiple-choice ${paperName} question with four options, the correct answer. Output the response only in JSON format. Put it in an array. The keys should be question, answer, options. And generate it without any further explanation. Please name the key as I have given.`

        const result = await model.generateContent(prompt);

        // 1. Remove the code block markers (```json\n and \n```)
        const cleanedText = result.response.text().replace(/^```json\n|\n```$/g, '');

        // 2. Parse the cleaned string as JSON
        const jsonObject = JSON.parse(cleanedText);

        res.status(200).json({
            status: jsonObject !== null || jsonObject !== undefined,
            message: jsonObject
        })

    } catch (error) {
        console.error(`Server error : AI response error --> ${error}`)
        res.status(500).json({ error: "Error processing AI response." });
    }
}

// import { model } from "./AI_configuration.mjs";

// export default async (req, res) => {
//     try {
//         const { paperName, numberOfQuestions } = req.query;
//         const prompt = `Generate ${numberOfQuestions} multiple-choice ${paperName} questions with four options and the correct answer. Output only in JSON format. Use the keys: question, answer, options.`;

//         const result = await callModelWithRetry(prompt);

//         const cleanedText = result.response.text().replace(/^```json\n|\n```$/g, '');
//         let jsonObject;

//         try {
//             jsonObject = JSON.parse(cleanedText);
//         } catch (parseError) {
//             console.error("Error parsing JSON:", parseError);
//             return res.status(500).json({ error: "Invalid JSON format received from AI response." });
//         }

//         res.status(200).json({
//             status: true,
//             message: jsonObject
//         });
//     } catch (error) {
//         console.error(`Server error : AI response error --> ${error}`);
//         res.status(500).json({
//             error: error.message || "Error processing AI response.",
//             details: error.stack
//         });
//     }
// };

// async function callModelWithRetry(prompt, retries = 3, delay = 1000) {
//     for (let i = 0; i < retries; i++) {
//         try {
//             return await model.generateContent(prompt);
//         } catch (error) {
//             if (error.response?.status === 503 && i < retries - 1) {
//                 console.log(`Retrying... (${i + 1})`);
//                 await new Promise(resolve => setTimeout(resolve, delay));
//                 delay *= 2;
//             } else {
//                 throw error;
//             }
//         }
//     }
// }
