import React from 'react';

type Props = {
  onPromptClick: (prompt: string) => void;
  mode: string;
};

const prompts = ['Step-by-step explanation'];
const stepByStepPrompt = 'Next step';

const PromptButtons: React.FC<Props> = ({ onPromptClick, mode }) => {
  return (
    <div className="flex space-x-4 px-4 sm:px-0">
      {mode === 'normal' && prompts.map((prompt, index) => (
        <button
          key={index}
          className="border-2 border-indigo-500 hover:bg-indigo-500 text-indigo-500 hover:text-white font-normal py-2 px-2 sm:px-4 rounded w-full sm:w-auto"
          onClick={() => onPromptClick(prompt)}
        >
          {prompt}
        </button>
      ))}
      {mode === 'step-by-step' && (
        <button
          className="border-2 border-indigo-500 hover:bg-indigo-500 text-indigo-500 hover:text-white font-normal py-2 px-2 sm:px-4 rounded w-full sm:w-auto"
          onClick={() => onPromptClick(stepByStepPrompt)}
        >
          {stepByStepPrompt}
        </button>
      )}
    </div>
  );
};

export default PromptButtons;