import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a fallback for development and should not be hit in production
  console.warn("API_KEY for Gemini is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

interface GenerateOptions {
    thinkingMode?: boolean;
}

const generateContentWithFallback = async (prompt: string, fallback: string, options: GenerateOptions = {}): Promise<string> => {
    if (!API_KEY) {
        return Promise.resolve(fallback);
    }
    try {
        const modelConfig: {
            model: string;
            contents: string;
            config?: { thinkingConfig?: { thinkingBudget: number } };
        } = {
            model: options.thinkingMode ? 'gemini-2.5-pro' : 'gemini-2.5-flash',
            contents: prompt,
        };

        if (options.thinkingMode) {
            modelConfig.config = {
                thinkingConfig: { thinkingBudget: 32768 }
            };
        }
        
        const response = await ai.models.generateContent(modelConfig);
        return response.text;
    } catch (error) {
        console.error("Errore durante la chiamata all'API Gemini:", error);
        return fallback;
    }
};

const getDocumentContext = (fileName: string): string => {
    const lowerCaseName = fileName.toLowerCase();
    if (lowerCaseName.includes('rapporto') || lowerCaseName.includes('finanziario') || lowerCaseName.includes('budget')) {
        return 'finanziario';
    }
    if (lowerCaseName.includes('contratto') || lowerCaseName.includes('accordo') || lowerCaseName.includes('legale')) {
        return 'legale';
    }
    if (lowerCaseName.includes('proposta') || lowerCaseName.includes('progetto')) {
        return 'di progetto';
    }
    if (lowerCaseName.includes('marketing') || lowerCaseName.includes('linee guida') || lowerCaseName.includes('campagna')) {
        return 'di marketing';
    }
    return 'generico';
};


export const summarizeDocument = async (fileName: string, thinkingMode: boolean = false): Promise<string> => {
  const context = getDocumentContext(fileName);
  const prompt = thinkingMode
    ? `Esegui un'analisi approfondita per un documento ipotetico di tipo ${context} chiamato "${fileName}". Vai oltre un semplice riepilogo. Identifica i punti chiave, le possibili implicazioni strategiche, i rischi potenziali e il pubblico di destinazione. Struttura la risposta in modo chiaro e dettagliato. Il tuo output deve essere in italiano.`
    : `Fornisci un riepilogo conciso e professionale, in italiano, di un ipotetico documento di tipo ${context} chiamato "${fileName}". Il riepilogo dovrebbe essere lungo circa 1-2 frasi e riflettere la natura del file.`;
  const fallback = `Riepilogo fittizio per ${fileName}: Questo documento sembra trattare argomenti importanti che richiedono un'attenta revisione e analisi. (Nessuna chiave API trovata)`;
  return generateContentWithFallback(prompt, fallback, { thinkingMode });
};

export const summarizeMergeAction = async (fileNames: string[]): Promise<string> => {
    const prompt = `Genera un riepilogo conciso, in italiano, per un nuovo documento PDF creato unendo i seguenti file: ${fileNames.join(', ')}. Spiega brevemente che il documento è il risultato di questa fusione.`;
    const fallback = `Questo documento è stato creato unendo i seguenti file: ${fileNames.join(', ')}. (Nessuna chiave API trovata)`;
    return generateContentWithFallback(prompt, fallback);
};

export const summarizeSplitAction = async (originalFileName: string, newFileName: string): Promise<string> => {
    const prompt = `Genera un riepilogo conciso, in italiano, per un nuovo documento PDF chiamato "${newFileName}", che è stato creato dividendo il documento originale "${originalFileName}". Spiega brevemente che questo file rappresenta una parte del documento originale.`;
    const fallback = `Questo documento, "${newFileName}", è una sezione estratta dal file originale "${originalFileName}". (Nessuna chiave API trovata)`;
    return generateContentWithFallback(prompt, fallback);
};