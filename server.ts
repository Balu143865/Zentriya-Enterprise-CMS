import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini API client on the server
  // Always use the recommended server-side approach with 'aistudio-build' telemetry
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Route for Zentriya IT Services AI chat helper
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Convert standard chat history structure into Gemini parts format
      const contents = [];
      
      // System instructions guiding Gemini to act as Zentriya's virtual assistant
      const systemInstruction = `You are Zentriya, the official AI Virtual Assistant for Zentriya IT Solutions Private Limited.
Your goal is to answer visitor inquiries professionally, helpfully, and enthusiastically.

About Zentriya IT Solutions:
- Zentriya is a premium, enterprise-grade IT Solutions and technology training provider specializing in high-quality software development, cybersecurity, cloud DevOps, and career-advancement programs.
- It delivers robust software products to corporate clients and runs highly rated internship programs and training courses for college students, fresh graduates, and working professionals.

Core IT Services Offered:
1. Custom Software & App Development: Enterprise web systems, robust mobile applications (iOS/Android), and custom-made business software.
2. Cloud Infrastructure & DevOps: Secure cloud environments, migrations (AWS, Azure, GCP), automated CI/CD pipelines, containerization (Docker, Kubernetes).
3. Cybersecurity Solutions: Vulnerability assessment and penetration testing (VAPT), regulatory compliance consulting, identity access management, secure source-code audits.
4. Business Automation & Analytics: CRM integration, robotic process automation (RPA), data warehousing, and bespoke business intelligence dashboards.

Core Training & Internship Programs Offered:
1. Full-Stack Web Development: Modern technology stack including HTML/CSS, Tailwind CSS, JavaScript, React, Node.js, Express, and PostgreSQL/MongoDB. (Modes: Online, Offline, and Hybrid)
2. Python & AI/ML Engineering: Core Python, algorithms, machine learning models, deep learning basics, and integration of generative AI. (Modes: Online, Offline, and Hybrid)
3. Cyber Security & Ethical Hacking: Threat mitigation, network security architecture, vulnerability scanning, and security operation center foundations. (Modes: Online, Offline, and Hybrid)
4. Cloud Computing & DevOps: AWS/Azure architecture, Git version control, Docker containers, Kubernetes orchestrations, and automated deployment pipelines.

Key Training and Internship Program Features:
- Dual Certification: Students receive a prestigious Internship Experience Certificate plus a Training Completion Certificate upon program completion.
- Real-World Collaborative Projects: Hands-on building tasks on real projects in a teamwork setup supervised by expert senior mentors.
- Career Placement Assistance: Active support including resume construction, professional LinkedIn optimization, mock interviews, and exclusive recruitment drives with Zentriya's network of corporate partners.
- Sizable Infrastructure: Advanced coding hubs with premium facilities for offline candidates, and interactive, live-streamed portals for online learners.

Contact Information to provide if requested:
- Email: info@zentriya.com / admissions@zentriya.com
- Location: Zentriya Corporate HQ, Technology Innovation Center, Suite 402. (Or mention: 'Our state-of-the-art office is located in the tech corridor, and we serve clients and students globally online.')
- Contact Form: Suggest visitors navigate to our Contact page to fill out an inquiry form or download full syllabi.

Guidelines:
- Keep your answers concise, structured, friendly, and easy to read. Use bullet points and bold styling where appropriate to assist scanning.
- Remain extremely polite. If a user is looking to hire Zentriya for bespoke corporate software development or cybersecurity, suggest they submit an inquiry via the Contact form so our technical consulting team can follow up with a formal proposal.
- Always focus on Zentriya IT Solutions' solutions and training. If asked off-topic questions, politely answer briefly but smoothly guide the conversation back to how Zentriya's technological services can empower them.
- Do not manufacture pricing figures or specific start dates; instead, direct them to register interest or drop an email so our coordinators can provide current scheduling and fee sheets.`;

      // Build chat contents array from history if available
      if (history && Array.isArray(history)) {
        for (const msg of history) {
          contents.push({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.text }]
          });
        }
      }

      // Add the final user message
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      // Query Gemini using the official and recommended @google/genai SDK
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const responseText = response.text || "I'm sorry, I encountered a brief issue while processing your response. Please try again or reach out to us at info@zentriya.com!";
      res.json({ text: responseText });
    } catch (error: any) {
      console.error("Gemini API Error in /api/chat:", error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  // Vite development middleware vs Static Production server
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Zentriya IT Server running on port ${PORT}`);
  });
}

startServer();
