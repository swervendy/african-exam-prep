# Quiz Anything

A quiz application that allows users to generate quizzes and get tutored about any topic, Youtube video, or URL of their choice. Powered by OpenAI's GPT-3.5-turbo model and built with Next.js and MongoDB.

## Features

- **Dynamic Quiz Generation**: Users can input any topic, and the system will generate a set of trivia questions related to that topic.
- **Persistent User Sessions**: Utilizes UUIDs to maintain user sessions and track quiz progress.
- **MongoDB Integration**: Efficiently stores and retrieves quiz questions, user sessions, and topics.
- **Tutor ChatBot**: Builds conversations based on answer responses from user
- **Responsive Design**: Adapts to various screen sizes for an optimal user experience.

## Getting Started

### Prerequisites

- Node.js
- MongoDB
- OpenAI API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/swervendy/quiz-anything.git

2. Copy code:
   ```bash
    git clone https://github.com/swervendy/quiz-anything.git


Navigate to the project directory:

bash
Copy code
cd quiz-anything
Install the required dependencies:

bash
Copy code
npm install
Create a .env.local file in the root directory and add your OpenAI API key:

env
Copy code
OPENAI_API_KEY=YOUR_API_KEY_HERE
Start the development server:

bash
Copy code
npm run dev
Open your browser and navigate to http://localhost:3000 to access the application.

Usage
On the homepage, enter a topic of your choice.
Click "Start Quiz" to generate a set of trivia questions related to the topic.
Answer the questions and see your score at the end!
