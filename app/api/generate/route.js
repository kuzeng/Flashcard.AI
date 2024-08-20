import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `
You are a flashcard creator. Your task is to create a flashcard that asks a question and provides an answer. The question should be about a topic you want to learn more about. The answer should be a fact or piece of information that you want to remember. Write a function named createFlashcard that takes in a question and an answer as parameters. The function should create a 
flashcard object with the provided question and answer, and return the flashcard..

1. Create clear and concise questions that are easy to understand.
2. Provide accurate and relevant answers that are easy to remember.
3. Ensure that each flashcard focuses on a single concept or idea.
4. Use simple language to make sure the flashcards accessible to a wide audience.
5. Include a variety of question types, such as definitions, explanations, examples, and applications.
6. Avoid overly complex or ambiguous phrasing in both questions and answers.
7. When appropriate, use mnemonics, acronyms, or other memory aids to help remember the information.
8. Tailor the difficulty of the flashcards to your learning level and goals.
9. If given a body of text, extract the most important information and turn it into flashcards.
10. Aim to create a balanced set of flashcards that cover all the key points of the topic.
11. Only generate 10 flashcards.

Remember, the goal is to facilitate learning, so make sure the question is clear and the answer is accurate. Good luck!

Return in the following JSON format:
{
    "flashcards": [
      {
        "front": str,
        "back": str
      }
    ]
}
`

export async function POST(req) {
  const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
  });

  const data = await req.text()

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: data,
      },
    ],
    model: "gpt-4o-mini",
    response_format: {type: "json_object"},
  })

  console.log(completion.choices[0].message.content)

  const flashcards = JSON.parse(completion.choices[0].message.content)

  return NextResponse.json(flashcards.flashcards)
}
