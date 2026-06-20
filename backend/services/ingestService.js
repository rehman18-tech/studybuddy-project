const pdf = require('pdf-parse');
const db = require('../config/db');
const { callLLM } = require('./llmService');

/**
 * Clean up text content if necessary
 */
function cleanText(text) {
  if (!text) return '';
  // Remove excessive spaces/newlines
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Core function to process a single syllabus PDF
 * @param {Buffer} buffer - File buffer from Multer
 * @param {string} fileName - Original uploaded file name
 */
async function processSyllabusPDF(buffer, fileName) {
  const logs = [];
  const addLog = (message) => {
    const timestamp = new Date().toISOString();
    const logMsg = `[${timestamp}] ${message}`;
    console.log(logMsg);
    logs.push(logMsg);
  };

  addLog(`Started processing file: ${fileName}`);

  try {
    // 1. Extract raw text using pdf-parse
    addLog('Parsing PDF contents...');
    const pdfData = await pdf(buffer);
    const rawText = pdfData.text;
    const charCount = rawText ? rawText.length : 0;
    addLog(`PDF parsed successfully. Total characters extracted: ${charCount}`);

    if (charCount < 50) {
      throw new Error('The PDF appears to be empty, poorly scanned, or contains insufficient text content.');
    }

    // 2. Call Google Gemini/OpenAI fallback to extract structural details
    addLog('Structuring syllabus data with AI provider...');
    const systemPrompt = `You are a curriculum parsing assistant. Your task is to analyze the raw text extracted from a syllabus PDF and structure it into a clean, hierarchical JSON object.

You must identify:
1. The student's grade/class as a number (e.g., 5, 6, 7). Look for keywords like "Class VI", "Class 6", "Grade 6", "Standard 6", "VI Class", etc. If you cannot find a class, default to 5.
2. The subject name (e.g., "Science", "Mathematics", "English", "Social Studies"). If you cannot find a subject name, default to "General".
3. A list of chapters/units. For each chapter:
   - "chapterName": The name of the chapter.
   - "topics": An array of specific concepts, topics, or sub-topics covered in that chapter.

You MUST respond in a strict JSON format with exactly the following keys:
{
  "class": 6,
  "subject": "Science",
  "chapters": [
    {
      "chapterName": "Chapter Name Here",
      "topics": ["Topic 1", "Topic 2", "Topic 3"]
    }
  ]
}

Ensure the response is valid JSON and contains nothing else (no markdown wrappers like \`\`\`json).`;

    const promptText = `Below is the raw text from the syllabus PDF. Please structure it as requested:\n\n${rawText.slice(0, 100000)}`;
    const textOutput = await callLLM(systemPrompt, promptText, true);
    if (!textOutput) {
      throw new Error('AI Provider returned an empty response.');
    }

    addLog('Syllabus structured by AI. Parsing JSON output...');
    const parsed = JSON.parse(textOutput.trim());

    // Validate structure
    const classNum = Number(parsed.class) || 5;
    const subjectName = parsed.subject || 'General';
    const chapters = parsed.chapters || [];

    if (!Array.isArray(chapters)) {
      throw new Error("Invalid structure returned from Gemini: 'chapters' must be an array.");
    }

    addLog(`JSON validation passed: Class ${classNum}, Subject: "${subjectName}", Chapters count: ${chapters.length}`);

    // Map output to required schema properties
    const extractedData = chapters.map(ch => ({
      chapterName: ch.chapterName || 'Unnamed Chapter',
      topics: Array.isArray(ch.topics) ? ch.topics : []
    }));

    addLog('Saving parsed syllabus to the pending approvals database queue...');
    const pendingSyllabus = await db.createPendingSyllabus({
      classNum,
      subjectName,
      fileName,
      status: 'pending',
      extractedData,
      logs,
      errorReport: ''
    });

    addLog('Ingestion task completed successfully!');
    // Update logs inside the saved document to include the completion message
    await db.updatePendingSyllabusStatus(pendingSyllabus._id, 'pending', { logs });

    return pendingSyllabus;

  } catch (error) {
    addLog(`Ingestion error: ${error.message}`);
    // Save a rejected pending record so the admin knows it failed
    try {
      const pendingSyllabus = await db.createPendingSyllabus({
        classNum: 5, // Default/fallback
        subjectName: 'Unknown',
        fileName,
        status: 'rejected',
        extractedData: [],
        logs,
        errorReport: error.message
      });
      return pendingSyllabus;
    } catch (dbErr) {
      console.error('Failed to write error state to database:', dbErr);
    }
    throw error;
  }
}

module.exports = {
  processSyllabusPDF
};
