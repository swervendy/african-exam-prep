import { config } from 'dotenv';
import OpenAI from 'openai';

config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const shape = [{
  "question": "Who is Luke Skywalker's father?",
  "answer": "Darth Vader",
  "wrongAnswers": ["Obi-Wan Kenobi", "Emperor Palpatine", "Yoda"]
}];

export const generateYoutubeTriviaQuestions = async (transcriptArray = []) => {
  const transcriptText = transcriptArray.map(item => item.text).join(' ');

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-16k",
    messages: [{
      role: "user", 
      content: `
        generate 10 trivia questions based on this YouTube transcript: ${transcriptText}. 
        include wrong answers
        format the response as JSON in the shape of: ${JSON.stringify(shape)}
      `
    }],
  });

  const questions = JSON.parse(completion.choices[0].message.content);
  return questions;
};

if (require.main === module) {
    (async () => {
      const transcriptArray = JSON.parse(process.argv[2]);
      const questions = await generateYoutubeTriviaQuestions(transcriptArray);
      console.log(JSON.stringify(questions, null, 2));
    })();
  }  