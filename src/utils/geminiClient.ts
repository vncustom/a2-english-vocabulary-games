/**
 * Gemini AI Browser Client with Fallback & Retry Mechanisms
 * Perfectly matches specifications in AI_INSTRUCTIONS.md
 */

export interface GeminiRequestOptions {
  prompt: string;
  history?: { role: 'user' | 'model'; text: string }[];
  systemInstruction?: string;
  responseMimeType?: string;
  responseSchema?: any;
  customApiKey?: string;
  selectedModel?: string;
}

export interface GeminiResponse {
  success: boolean;
  text: string;
  modelUsed: string;
  error?: string;
}

const FALLBACK_MODELS = [
  'gemini-3-flash-preview',
  'gemini-3-pro-preview',
  'gemini-2.5-flash'
];

/**
 * Clean error message extraction helper
 */
function getReadableErrorMessage(errData: any, httpStatus: number): string {
  if (errData && errData.error) {
    const apiErr = errData.error;
    return `${httpStatus} ${apiErr.status || ''}: ${apiErr.message || 'Lỗi API từ Google'}`;
  }
  return `HTTP Error ${httpStatus}`;
}

/**
 * Call the Gemini REST API directly from the browser client
 */
async function callGeminiDirect(
  model: string,
  apiKey: string,
  options: GeminiRequestOptions
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  // Form contents payload
  const contents: any[] = [];
  if (options.history && Array.isArray(options.history)) {
    for (const msg of options.history) {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      });
    }
  }
  contents.push({
    role: 'user',
    parts: [{ text: options.prompt }]
  });

  const requestBody: any = {
    contents: contents,
    generationConfig: {
      temperature: options.responseMimeType === 'application/json' ? 0.85 : 0.7
    }
  };

  if (options.systemInstruction) {
    requestBody.systemInstruction = {
      parts: [{ text: options.systemInstruction }]
    };
  }

  if (options.responseMimeType) {
    requestBody.generationConfig.responseMimeType = options.responseMimeType;
  }
  if (options.responseSchema) {
    requestBody.generationConfig.responseSchema = options.responseSchema;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    let errData;
    try {
      errData = await response.json();
    } catch {
      // Ignore parse failure on HTTP error
    }
    throw new Error(getReadableErrorMessage(errData, response.status));
  }

  const data = await response.json();
  
  if (data.error) {
    throw new Error(getReadableErrorMessage(data, response.status));
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Không nhận được văn bản phản hồi từ Gemini API.");
  }

  return text;
}

/**
 * Unified request sender with retry loop across fallback models
 */
export async function generateContentWithFallback(
  options: GeminiRequestOptions
): Promise<GeminiResponse> {
  const apiKey = options.customApiKey || localStorage.getItem('gemini_api_key_custom') || '';
  
  if (!apiKey) {
    return {
      success: false,
      text: '',
      modelUsed: '',
      error: 'Chưa cấu hình API Key. Vui lòng thêm API Key trong phần Cài đặt ở phía trên!'
    };
  }

  // Build retry list dynamically
  const initialModel = options.selectedModel || 'gemini-3-flash-preview';
  const modelsToTry = [initialModel];
  
  // Add other fallback models that aren't the initial one
  for (const m of FALLBACK_MODELS) {
    if (m !== initialModel) {
      modelsToTry.push(m);
    }
  }

  console.log(`[Gemini Client] Khởi tạo luồng gọi AI. Trình tự thử nghiệm:`, modelsToTry);

  let lastErrorMsg = '';

  for (let i = 0; i < modelsToTry.length; i++) {
    const currentModel = modelsToTry[i];
    try {
      console.log(`[Gemini Client] Thử gọi với mô hình: ${currentModel} (Lượt ${i + 1}/${modelsToTry.length})`);
      
      const responseText = await callGeminiDirect(currentModel, apiKey, options);
      
      console.log(`[Gemini Client] Thành công với mô hình: ${currentModel}`);
      return {
        success: true,
        text: responseText,
        modelUsed: currentModel
      };
    } catch (err: any) {
      console.warn(`[Gemini Client] Lỗi khi gọi mô hình ${currentModel}:`, err.message);
      lastErrorMsg = err.message || `Lỗi không xác định ở mô hình ${currentModel}`;
      
      // Auto-retry is handled implicitly by moving to the next iteration of the loop
      if (i < modelsToTry.length - 1) {
        console.log(`[Gemini Client] Tự động thử lại ngay với mô hình tiếp theo...`);
      }
    }
  }

  // If we reach here, all models in the retry loop failed
  console.error(`[Gemini Client] Tất cả các mô hình trong chuỗi dự phòng đều thất bại.`);
  return {
    success: false,
    text: '',
    modelUsed: '',
    error: `Đã dừng do lỗi: ${lastErrorMsg}`
  };
}
