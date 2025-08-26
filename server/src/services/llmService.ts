import axios from 'axios';
import { getOpenAIClient } from '../utils/openaiClient';
import { ocrLlmPrompt } from '../utils/prompt';

export const callOpenAI = async (text: string) => {
  const prompt = ocrLlmPrompt(text);
  const openai = getOpenAIClient();

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'gpt-5-nano',
    });

    let result = completion.choices[0].message.content;

    if (!result) {
      throw new Error('OpenAI response content was empty or null.');
    }

    let parsed;
    try {
      parsed = JSON.parse(result);
      return parsed;
    } catch (err) {
      const fixPrompt = `The following is invalid JSON. Please fix and return only valid JSON:\n\n${result}`;
      const fixCompletion = await openai.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: fixPrompt,
          },
        ],
        model: 'gpt-5-nano',
      });
      let fixedResult = fixCompletion.choices[0].message.content;
      if (!fixedResult) {
        throw new Error('OpenAI fixed response content was empty or null.');
      }
      parsed = JSON.parse(fixedResult);
      return parsed;
    }
  } catch (error) {
    console.error('OpenAI error:', error);
    throw new Error('Failed to process with OpenAI');
  }
};

export const callOllama = async (text: string) => {
  const llmUrl = process.env.LLM_URL;
  if (!llmUrl) {
    throw new Error('LLM_URL environment variable not set');
  }

  const prompt = ocrLlmPrompt(text);

  try {
    const response = await axios.post(`${llmUrl}`, {
      model: 'llama3.2',
      prompt,
      stream: false,
    });
    let result = response.data.response || response.data;

    let parsed;
    try {
      parsed = JSON.parse(result);
      return parsed;
    } catch (err) {
      const fixPrompt = `The following is invalid JSON. Please fix and return only valid JSON:\n\n${result}`;
      const fixResponse = await axios.post(`${llmUrl}`, {
        model: 'llama3.2',
        prompt: fixPrompt,
        stream: false,
      });
      let fixedResult = fixResponse.data.response || fixResponse.data;
      try {
        parsed = JSON.parse(fixedResult);
        return parsed;
      } catch (err2) {
        throw new Error(
          'Failed to parse LLM response as valid JSON, even after attempting to fix.'
        );
      }
    }
  } catch (error) {
    console.error('Ollama error:', error);
    throw new Error('Failed to process with Ollama');
  }
};
