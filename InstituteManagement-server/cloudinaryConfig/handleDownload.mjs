import fs from 'fs'; // for createWriteStream
import fsPromises from 'fs/promises'; // for async operations like readFile, writeFile, and unlink
import https from 'https';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import os from "os"

const __dirname = dirname(fileURLToPath(import.meta.url));
const tempDir = os.tmpdir(); // Use system temp directory

// Function to download a PDF chunk
const downloadChunk = (url, index) => {
    return new Promise((resolve, reject) => {
        const filePath = path.join(tempDir, `downloaded_chunk_${index}.pdf`);
        const file = fs.createWriteStream(filePath);

        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close(() => resolve(filePath));
            });
        }).on('error', async (err) => {
            await fsPromises.unlink(filePath); // Delete temp file on error
            reject(err);
        });
    });
};

// Function to combine chunks into a single PDF
const combineChunks = async (numChunks) => {
    const buffers = [];

    for (let i = 0; i < numChunks; i++) {
        const chunkPath = path.join(tempDir, `downloaded_chunk_${i}.pdf`);
        const chunkBuffer = await fsPromises.readFile(chunkPath);
        buffers.push(chunkBuffer);
    }

    const finalBuffer = Buffer.concat(buffers);
    const finalPath = path.join(tempDir, 'final_reassembled.pdf');
    await fsPromises.writeFile(finalPath, finalBuffer);
    return finalPath;
};

// Main handler function
export default async (req, res) => {
    try {
        const { studentId, subject, assignmentId } = req.query;
        const { pdf: chunkUrls } = req.body;

        // Download each chunk
        await Promise.all(chunkUrls.map((url, index) => downloadChunk(url, index)));

        // Combine chunks into a single PDF
        const finalPdfPath = await combineChunks(chunkUrls.length);

        // Send the combined PDF as a binary response
        const finalPdfBuffer = await fsPromises.readFile(finalPdfPath);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${subject}_${studentId}_${assignmentId}.pdf"`);
        res.send(finalPdfBuffer);

        // Clean up temporary files
        await Promise.all([
            ...chunkUrls.map((_, i) => fsPromises.unlink(path.join(tempDir, `downloaded_chunk_${i}.pdf`))),
            fsPromises.unlink(finalPdfPath)
        ]);

    } catch (error) {
        console.error('Error in downloadPDF endpoint:', error);
        res.status(500).send('An error occurred while downloading the PDF.');
    }
};
