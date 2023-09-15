import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import OpenAI from 'openai';

export default function Tutor() {
    const router = useRouter();
    const { question, answer, correct } = router.query;
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (correct === 'false') {
            const prompt = `The user answered "${answer}" to the question "${question}", which is incorrect. How did they arrive at this answer?`;

            const openai = new OpenAI(process.env.OPENAI_API_KEY); // Move this line here

            openai.ChatCompletion.create({
                model: 'gpt-4.0-turbo',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: prompt },
                ],
            })
            .then(response => {
                const assistantMessage = response['choices'][0]['message']['content'];
                setMessage(assistantMessage);
            })
            .catch(error => console.error('Error generating message:', error));
        }
    }, [question, answer, correct]);

    return (
        <div>
            <h2 className="text-3xl text-center font-bold mb-4">Chat with a Tutor</h2>
            <p className="text-xl text-center font-bold mb-12">Question: {question}</p>
            <p className="text-xl text-center font-bold mb-12">Your Answer: {answer}</p>
            <p className="text-xl text-center font-bold mb-12">Tutor: {message}</p>
            <div className="flex justify-center space-x-4 mt-6">
                <textarea 
                    className="w-full p-2 border rounded mb-4"
                    placeholder="Type your message here..."
                />
                <button 
                    className="flex justify-center items-center w-full h-full text-lg uppercase font-bold hover:text-slate-600 bg-white dark:bg-slate-500 hover:bg-yellow-300 border-4 border-cyan-300 hover:border-yellow-500 py-2 px-4 rounded">
                    Send
                </button>
            </div>
        </div>
    );
}