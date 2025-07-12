export const ocrLlmPrompt = (
  text: string
) => `You are a helpful assistant. The following is a raw OCR scan of a recipe. Please extract and organize the information into a structured JSON format with the following fields:

{
  "title": "Recipe title",
  "description": "Recipe description",
  "ingredients": [
    {"name": "ingredient name", "amount": "amount/quantity"}
  ],
  "instructions": [
  
  ],
  "cookingTime": 30,
  "servings": 4
}

Make sure to list all the ingredients and their amounts.

Make sure to get the instructions and make each step a string in the array.

If you can't find a description, try to come up with a short creative description in complete sentence or two.

If any information is missing, use empty strings for text fields, empty arrays for lists, and 0 for numbers. Return ONLY the JSON object, no additional text.

Generate the JSON output as a single, continuous line. This means there should be no newlines (\n), tabs (\t), or any spaces used for indentation. Ensure all string values and keys are properly escaped (e.g., \" for internal double quotes). Crucially, use only standard ASCII characters for all text within the JSON, including apostrophes and quotation marks (e.g., ' for apostrophes, " for quotation marks, not ’ or “/”). Do not use non-breaking spaces (U+00A0).

Raw OCR Text:
${text}`;
