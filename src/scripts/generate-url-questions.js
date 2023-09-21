import { config } from 'dotenv';
import OpenAI from 'openai';
import axios from 'axios';
import cheerio from 'cheerio';

config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const shape = [{
  "question": "Who is Luke Skywalker's father?",
  "answer": "Darth Vader",
  "wrongAnswers": ["Obi-Wan Kenobi", "Emperor Palpatine", "Yoda"]
}];

export const generateUrlTriviaQuestions = async (url) => {
  // Validate the URL and scrape the webpage
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  const webpageText = $('p').text();

  let completion;
  try {
    completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-16k",
      messages: [{
        role: "user", 
        content: `
          generate 10 trivia questions based on this webpage content: ${webpageText}. 
          include wrong answers
          format the response as JSON in the shape of: ${JSON.stringify(shape)}
        `
      }],
    });

    const messageContent = completion.choices[0].message.content;
    const questions = JSON.parse(messageContent);
    return questions;
  } catch (error) {
    console.error('Error parsing OpenAI API response:', error);
    if (completion) {
      console.error('OpenAI API response:', completion);
    }
    throw error;
  }
};

if (require.main === module) {
    (async () => {
      const url = process.argv[2];
      const questions = await generateUrlTriviaQuestions(url);
      console.log(JSON.stringify(questions, null, 2));
    })();
  }  