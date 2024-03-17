import { useState } from "react";
import { Grammatik } from "./Grammatik.ts";
import { Syntaxbaum } from "./Syntaxbaum.tsx";

function App() {
  const [rules, setRules] = useState("S->AB|BC\nA->BA|a\nB->CC|b\nC->AB|a");
  const [word, setWord] = useState("baaba");
  const [baum, setBaum] = useState<Set<string>[][]>([]);

  return (
    <>
      <div className="flex flex-col lg:flex-row mb-4 items-center justify-between">
        <h1 className="text-4xl font-bold flex-shrink-0 mb-2 lg:mb-0">
          CYK Algorithmus
        </h1>
        <p>
          Cocke-Younger-Kasami-Algorithmus für Lösen des Wortproblems für
          kontextfreie Sprachen
        </p>
      </div>
      <div className="flex flex-col lg:flex-row">
        <div className="flex flex-col basis-1/4 mb-4 lg:mr-4 lg:mb-0">
          <div className="mb-4 flex flex-col">
            <label htmlFor="produktionsregeln">
              Produktionsregeln von Grammatik mit Chomsky-Normalform
            </label>
            <textarea
              id="produktionsregeln"
              className="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg resize-none h-48"
              onChange={(e) => setRules(e.target.value)}
              value={rules}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="wort">Wort</label>
            <input
              id="wort"
              type="text"
              className="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg mb-4"
              value={word}
              onChange={(e) => setWord(e.target.value)}
            />
          </div>
          <button
            className="bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 transition-colors px-4 py-2 rounded-lg"
            onClick={() =>
              setBaum(Grammatik.fromChomskyNormalform(rules).suchen(word))
            }
          >
            Rechnen
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <span className="mb-2">Suchergebnis</span>
          <div>
            <Syntaxbaum suchErgebnis={baum} wort={word}></Syntaxbaum>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
