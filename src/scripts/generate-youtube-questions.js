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

  // Split the transcript into chunks of approximately 500 words each
  const chunks = transcriptText.split(/\s+/).reduce((acc, word, i) => {
    if (i % 500 === 0) acc.push('');
    acc[acc.length - 1] += ' ' + word;
    return acc;
  }, []);

  let questions = [];
  let counter = 0;

  for (const chunk of chunks) {
    let completion;
    try {
      completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-16k",
        messages: [{
          role: "user", 
          content: `
            generate 10 trivia questions in English based on this YouTube transcript: ${chunk}. 
            The questions should be related to the content of the transcript.
            include wrong answers
            format the response as JSON in the shape of: ${JSON.stringify(shape)}
          `
        }],
      });

      console.log('OpenAI API response:', completion);
      const chunkQuestions = JSON.parse(completion.choices[0].message.content);
      questions = [...questions, ...chunkQuestions];
    } catch (error) {
      console.error('Error during OpenAI API call:', error);
      if (completion) {
        console.error('OpenAI API response:', completion);
      }
    }

    counter++;
    if (counter >= 10) break; // Limit the number of iterations to 10
  }

  return questions;
};

if (require.main === module) {
    (async () => {
      const transcriptArray = JSON.parse(process.argv[2]);
      const questions = await generateYoutubeTriviaQuestions(transcriptArray);
      console.log(JSON.stringify(questions, null, 2));
    })();
}