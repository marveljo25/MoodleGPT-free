import normalizeText from 'background/utils/normalize-text';
import getContentWithHistory from './get-content-with-history';
async function getResponse(config, question, questionElement, // optional
imageUrl) {
    const controller = new AbortController();
    const timeoutControler = setTimeout(() => controller.abort(), 20 * 1000);
    let contentHandler;
    if (questionElement) {
        contentHandler = await getContentWithHistory(config, questionElement, question);
    }
    else {
        // Test mode
        contentHandler = {
            messages: [
                {
                    role: 'user',
                    content: imageUrl
                        ? [
                            { type: 'text', text: question },
                            { type: 'image_url', image_url: { url: imageUrl } }
                        ]
                        : question
                }
            ]
        };
    }
    const baseURL = config.baseURL && config.baseURL.trim() !== ''
        ? config.baseURL.replace(/\/+$/, '')
        : 'https://openrouter.ai';
    const OR_API_URL = `${baseURL}/api/v1/chat/completions`;
    const messagesToSend = [...contentHandler.messages];
    const response = await fetch(OR_API_URL, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${config.apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: config.model,
            messages: messagesToSend,
            max_tokens: config.maxTokens || 200
        }),
        signal: config.timeout ? controller.signal : null
    });
    clearTimeout(timeoutControler);
    if (!response.ok) {
        throw new Error(`OpenRouter API error ${response.status}: ${await response.text()}`);
    }
    const result = await response.json();
    const text = result.choices?.[0]?.message?.content ?? JSON.stringify(result);
    if ('saveResponse' in contentHandler && typeof contentHandler.saveResponse === 'function') {
        contentHandler.saveResponse(text);
    }
    return {
        question,
        response: text,
        normalizedResponse: normalizeText(text)
    };
}
export default getResponse;
//# sourceMappingURL=get-response.js.map