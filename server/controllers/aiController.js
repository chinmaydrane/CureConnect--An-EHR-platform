import axios from "axios";
import PDFParser from "pdf2json";
import Tesseract from "tesseract.js";
import fetch from "node-fetch";
import { fileTypeFromBuffer } from "file-type";
import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";
// import pdf from "pdf-poppler";


// 🔍 Helper: Extract text from PDF using pdf2json (no native deps)
// 🔍 Helper: Extract text from PDF using pdf2json (no native deps)
async function extractTextFromPDFBuffer(buffer) {
  const data = await pdfParse(buffer);
  // data.text is all textual content
  return data.text || "";
}





const tmpDir = "./tmp"; // Make sure this exists
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);



// ✅ Common helper function to call Gemini API
async function callGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
  


  const response = await axios.post(
    url,
    {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    },
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  return (
    response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Sorry, I couldn't generate a response."
  );
}

// 🩺 Existing Healthcare Chat Endpoint
// 🩺 Existing Healthcare Chat Endpoint (multi-language)
export const getAIResponse = async (req, res) => {
  try {
    const { message, language } = req.body;

    if (!message || message.trim() === "") {
      return res
        .status(400)
        .json({ reply: "Please enter a health-related query." });
    }

    // 1️⃣ Decide language instruction based on client selection
    const lang = language || "en-US";
    let languageInstruction = "Reply in clear, simple English.";

    if (lang === "hi-IN") {
      languageInstruction =
        "जवाब हमेशा सरल और स्पष्ट हिंदी में दें। अंग्रेज़ी शब्द केवल तभी उपयोग करें जब बहुत जरूरी हो।";
    } else if (lang === "mr-IN") {
      languageInstruction =
        "उत्तर नेहमी साध्या आणि स्पष्ट मराठीत द्या. इंग्रजी शब्द फक्त खूपच गरजेचे असतील तेव्हाच वापरा.";
    }

    // 2️⃣ Build prompt for Gemini
    const prompt = `
You are a strict healthcare assistant. Only answer healthcare-related queries.
If the user asks anything else, politely respond: "Please ask something related to healthcare."

${languageInstruction}

User message:
"${message}"
`;

    // 3️⃣ Call model
    const aiReply = await callGemini(prompt);

    // 4️⃣ Send reply back
    res.json({ reply: aiReply });
  } catch (error) {
    console.error("AI Controller Error:", error.response?.data || error.message);
    res.status(500).json({ reply: "Failed to get AI response" });
  }
};


// 🍎 Generate Diet Plan from Typed Text
export const getDietFromText = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || message.trim() === "")
      return res.status(400).json({ reply: "Please provide a valid health query." });

    const prompt = `
You are a certified AI nutritionist. Based on this health condition:
"${message}"

Provide a detailed personalized diet plan with:
- 🕒 Meal times (Breakfast, Lunch, Snack, Dinner)
- 🍽️ Recommended foods
- 🚫 Foods to avoid
- 🔥 Calories and protein per meal
- 💡 Lifestyle suggestions

If the input is not health-related, reply: "Please ask something related to health or diet."
`;

    const aiReply = await callGemini(prompt);
    res.json({ reply: aiReply });
  } catch (error) {
    console.error("AI Diet Text Error:", error.response?.data || error.message);
    res.status(500).json({ reply: "Failed to get diet recommendation." });
  }
};

// 📄 Generate Diet Plan from Uploaded Report (PDF)
// 📄 Generate Diet Plan from Uploaded Report (PDF or Image)
export const getDietFromReport = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ reply: "No file uploaded." });

    const buffer = file.buffer;
    const filename = file.originalname;
    const ext = path.extname(filename).toLowerCase();

    const tempPath = path.join(tmpDir, filename);
    fs.writeFileSync(tempPath, buffer); // still useful for Tesseract

    let extractedText = "";

    if (ext === ".pdf") {
      // ✅ Extract text from PDF using pdf-parse (works for text-based PDFs)
      try {
        const data = await pdfParse(buffer);
        extractedText = data.text || "";
        console.log(
          "getDietFromReport → PDF text length (pdf-parse):",
          extractedText.length
        );
      } catch (err) {
        console.error("getDietFromReport → PDF parse error:", err);
      }
    } else {
      // 🧠 For images (jpg/png/etc), use Tesseract OCR
      try {
        console.log("getDietFromReport → running Tesseract on image");
        const ocrResult = await Tesseract.recognize(
          tempPath,
          "eng+hin+mar" // you can tweak languages if needed
        );
        extractedText = ocrResult.data.text || "";
        console.log(
          "getDietFromReport → OCR text length:",
          extractedText.length
        );
      } catch (err) {
        console.error("getDietFromReport → OCR error:", err);
      }
    }

    // Cleanup temp file
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);

    extractedText = (extractedText || "").trim().slice(0, 4000);

    if (!extractedText) {
      return res.status(400).json({
        reply:
          "No readable text found in the report. If this is a scanned PDF, please upload it as a clear image (JPG/PNG) or a text-based PDF.",
      });
    }

    // Call Gemini API
    const prompt = `
You are a certified AI nutritionist. Based on this health report text:
"${extractedText}"

Create a detailed personalized diet plan including:
- Meal schedule (Breakfast, Lunch, Snack, Dinner)
- Recommended foods with approximate calories & protein
- Foods to avoid
- Short lifestyle suggestions

If the document isn’t health-related, reply: "Please upload a health-related report."
`;

    const aiReply = await callGemini(prompt);
    res.json({ reply: aiReply });
  } catch (err) {
    console.error("Diet Report Error:", err);
    res.status(500).json({ reply: "Failed to generate diet plan." });
  }
};




// 🧾 Summarize Report (PDF or Image)
// 🧾 Summarize Report (PDF or Image)
export const summarizeReport = async (req, res) => {
  try {
    const { url, filename } = req.body;

    if (!url || !filename)
      return res.status(400).json({ reply: "Missing file URL or filename." });

    // Download file from Cloudinary
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data);

    const ext = path.extname(filename).toLowerCase();
    let detectedType = await fileTypeFromBuffer(buffer);

    console.log("SummarizeReport → filename:", filename);
    console.log("SummarizeReport → detectedType:", detectedType);
    console.log("SummarizeReport → ext:", ext);

    let extractedText = "";

    if (
      detectedType?.mime === "application/pdf" ||
      ext === ".pdf"
    ) {
      // ✅ Use pdf-parse on the buffer directly
      const data = await pdfParse(buffer);
      extractedText = data.text || "";
      console.log(
        "SummarizeReport → PDF text length (pdf-parse):",
        extractedText.length
      );
    } else if (detectedType?.mime?.startsWith("image/")) {
      // 🧠 For images, run OCR
      console.log("SummarizeReport → running Tesseract on image");
      const tempPath = path.join(tmpDir, filename);
      fs.writeFileSync(tempPath, buffer);

      const ocrResult = await Tesseract.recognize(
        tempPath,
        "eng+hin+mar"
      );
      extractedText = ocrResult.data.text || "";

      fs.unlinkSync(tempPath);
      console.log(
        "SummarizeReport → OCR text length:",
        extractedText.length
      );
    } else {
      console.warn(
        "SummarizeReport → Unsupported file type. mime:",
        detectedType?.mime
      );
    }

    extractedText = extractedText.trim().slice(0, 4000);

    if (!extractedText) {
      return res.status(400).json({
        reply:
          "No readable text found. If this is a scanned PDF, please upload it as an image (JPG/PNG) or a text-based PDF.",
      });
    }

    const prompt = `
You are a medical AI assistant. Summarize the following medical report content briefly and professionally.
Only focus on medical data, test results, and observations.

Text:
"${extractedText}"
`;

    const aiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const reply =
      aiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn’t generate a summary.";

    res.json({ reply });
  } catch (error) {
    console.error("Summarization failed:", error);
    res.status(500).json({ reply: "Failed to summarize the report." });
  }
};


