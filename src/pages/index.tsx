import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center sm:min-h-screen px-4 sm:px-0 pb-4">
      <Image src="/logo.svg" alt="Logo" width={200} height={200} className="w-48 sm:w-48 md:w-64 lg:w-96 mt-4 sm:mt-0" />
      <p className="text-xl text-gray-600 mb-4 px-2 sm:px-0 py-4 text-center">Practice JAMB questions and tutor with AI for free</p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link href="/test" className="border-2 border-gray-300 shadow-sm rounded-lg p-6 flex flex-col items-center justify-center max-w-xs mx-auto sm:mx-2">
          <h2 className="text-5xl mb-2 font-jomhuria text-indigo-500">test</h2>
          <p className="mb-4 text-center">Past questions, with a tutor for follow up</p>
          <Image src="/img/test-screenshot.png" alt="Test Screenshot" width={200} height={200} />
        </Link>
        <span className="text-5xl text-indigo-500 font-jomhuria">&amp;</span>
        <Link href="/tutor?source=home" className="border-2 border-gray-300 shadow-sm rounded-lg p-6 flex flex-col items-center justify-center max-w-xs mx-auto sm:mx-2">
          <h2 className="text-5xl mb-2 font-jomhuria text-indigo-500">tutor</h2>
          <p className="mb-4 text-center">Drop questions into our tutor and get answers explained</p>
          <Image src="/img/tutor-screenshot.png" alt="Tutor Screenshot" width={200} height={200} />
        </Link>
      </div>
    </div>
  );
}