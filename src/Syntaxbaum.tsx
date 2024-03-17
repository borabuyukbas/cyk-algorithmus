import { groupString } from "./Grammatik";

export function Syntaxbaum(props: {
  suchErgebnis: Set<string>[][];
  wort: string;
}) {
  const groupedStrings = [...Array(props.wort.length).keys()].map((i) =>
    groupString(props.wort, i + 1)
  );

  return (
    <table>
      {props.suchErgebnis.map((b, l) => (
        <tr key={`zeile${l}`}>
          <span className="font-bold mr-2">Länge {l + 1}</span>
          {b.map((s, i) => (
            <td
              key={`zeile${l}_spalte${i}`}
              className="border border-neutral-800 dark:border-neutral-200"
            >
              <span className="bg-neutral-200 dark:bg-neutral-700 px-1 rounded-md">
                {groupedStrings[l][i]}
              </span>
              {[...s].map((v, ri) => (
                <span
                  key={`zeile${l}_spalte${i}_regel${ri}`}
                  className="italic mx-0.5"
                >
                  {v}
                </span>
              ))}
            </td>
          ))}
        </tr>
      ))}
    </table>
  );
}
