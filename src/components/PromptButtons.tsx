import React from 'react';

type Props = {
  onPromptClick: (prompt: string) => void;
};

const prompts = ['Step-by-Step Explanation', 'Just the Answer'];

const PromptButtons: React.FC<Props> = ({ onPromptClick }) => {
  return (
    <div className="flex space-x-4">
      {prompts.map((prompt, index) => (
        <button
          key={index}
          className="border-2 border-indigo-500 hover:bg-indigo-500 text-indigo-500 hover:text-white font-normal py-2 px-4 rounded"
          onClick={() => onPromptClick(prompt)}
        >
          {prompt}
        </button>
      ))}
    </div>
  );
};

export default PromptButtons