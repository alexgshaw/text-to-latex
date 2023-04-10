import { useEffect, useState } from "react";
import Latex from "react-latex-next";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";

export default function Home() {
  const [latex, setLatex] = useState("");
  const [displayIsCopied, setDisplayIsCopied] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const text = formData.get("text") as string;

    const response = await fetch("/api/convert", {
      method: "POST",
      body: JSON.stringify({ text }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const { latex } = await response.json();

    setLatex(latex);
  };

  const handleCopy = () => {
    setDisplayIsCopied(true);
    navigator.clipboard.writeText(latex);
  };

  useEffect(() => {
    if (displayIsCopied) {
      const timeout = setTimeout(() => {
        setDisplayIsCopied(false);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [displayIsCopied]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center py-24 px-4">
      <h1 className="text-6xl font-extrabold text-center mb-10 leading-tighter">
        Convert PDF-copied text to latex.
      </h1>
      <div className="w-full max-w-3xl flex flex-col">
        <form onSubmit={handleSubmit} className="w-full">
          <textarea
            name="text"
            id="text"
            rows={5}
            className="w-full px-4 py-2 text-slate-700 bg-white border-2 border-slate-900 rounded-md focus:border-indigo-500 focus:outline-none focus:text-slate-900"
          />
          <button
            type="submit"
            className="bg-slate-900 w-full mt-6 px-4 py-3 text-white font-medium text-lg rounded-md hover:bg-slate-700 active:bg-slate-800"
          >
            Convert
          </button>
        </form>
        {latex && (
          <>
            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-4">Result</h2>
              <div
                className="flex items-center bg-white border-2 border-slate-900 rounded-md py-2 px-4 cursor-pointer"
                onClick={handleCopy}
              >
                <code className="flex-1 py-2">{latex}</code>
                {displayIsCopied ? (
                  <span className="px-2 py-1 bg-slate-100 rounded-md text-sm text-slate-600">
                    Copied!
                  </span>
                ) : (
                  <div className="p-1 hover:bg-slate-100 active:bg-slate-200 rounded-md">
                    <ClipboardDocumentIcon className="h-6 w-6" />
                  </div>
                )}
              </div>
            </div>
            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-4">Rendered</h2>
              <div
                className="flex items-center bg-white border-2 border-slate-900 rounded-md py-2 px-4 cursor-pointer"
                onClick={handleCopy}
              >
                <div className="flex-1 py-2">
                  <Latex>{latex}</Latex>
                </div>
                {displayIsCopied ? (
                  <span className="px-2 py-1 bg-slate-100 rounded-md text-sm text-slate-600">
                    Copied!
                  </span>
                ) : (
                  <div className="p-1 hover:bg-slate-100 active:bg-slate-200 rounded-md">
                    <ClipboardDocumentIcon className="h-6 w-6" />
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
