// Grammatik in Chomsky-Normalform
export class Grammatik {
  variablen: Set<string>;
  terminale: Set<string>;
  startsymbol: string;
  produktionRegeln: Map<string, Set<string>>;

  public constructor(
    variablen: Set<string>,
    terminale: Set<string>,
    startsymbol: string
  ) {
    if (!variablen.has(startsymbol))
      throw Error("Startsymbol existiert nicht in `variablen`.");

    this.variablen = variablen;
    this.terminale = terminale;
    this.startsymbol = startsymbol;
    this.produktionRegeln = new Map();
  }

  public addRegel(variabel: string, produktion: string) {
    if (this.pruefenRegeln(variabel, produktion)) {
      if (!this.produktionRegeln.has(variabel))
        this.produktionRegeln.set(variabel, new Set());
      this.produktionRegeln.set(
        variabel,
        this.produktionRegeln.get(variabel)!.add(produktion)
      );
    }
  }

  public removeRegel(variabel: string, produktion: string) {
    if (this.produktionRegeln.has(variabel))
      this.produktionRegeln.get(variabel)!.delete(produktion);
  }

  public static fromChomskyNormalform(text: string): Grammatik {
    // _ als Platzholder für neue Grammatik
    let grammatik = new Grammatik(new Set(["_"]), new Set(), "_");

    let tempRegeln = new Map<string, Set<string>>();

    for (const [index, zeile] of text.split("\n").entries()) {
      let gefilterteZeile = zeile.replace(/\s/g, "");
      let zeileParts = gefilterteZeile.split("->");
      if (zeileParts.length == 2) {
        let [variabel, regelnText] = gefilterteZeile.split("->");
        let regeln = regelnText.split("|");

        grammatik.variablen.add(variabel);
        if (index == 0) grammatik.startsymbol = variabel;

        for (const regel of regeln) {
          if (regel.length == 1 && regel != "ϵ") grammatik.terminale.add(regel);
          tempRegeln.set(
            variabel,
            tempRegeln.has(variabel)
              ? tempRegeln.get(variabel)!.add(regel == "ϵ" ? "" : regel)
              : new Set([regel == "ϵ" ? "" : regel])
          );
        }
      }
    }

    // Löschen von Platzholder-Variabel
    grammatik.variablen.delete("_");

    tempRegeln.forEach((value, key) =>
      value.forEach((r) => grammatik.addRegel(key, r))
    );
    return grammatik;
  }

  public suchen(wort: string) {
    const allKeys = Array.from(this.produktionRegeln.keys());
    // Initialisierung neues zweidimensional-Arrays mit leeren Sets
    const ableitungen: Set<string>[][] = Array.from(
      { length: wort.length },
      (_, i) =>
        new Array(wort.length - i).fill(null).map(() => new Set<string>())
    );

    for (let len = 1; len <= wort.length; len++) {
      // Alle Kombinationen von Wort mit gegebener Länge
      const stringParts = groupString(wort, len);

      for (const [col, part] of stringParts.entries()) {
        if (len == 1) {
          // Initialisierung von Terminal-Ableitungen in erster Zeile
          ableitungen[len - 1][col] = new Set(
            allKeys.filter((k) => this.produktionRegeln.get(k)!.has(part))
          );
        } else {
          // Führe Suchen-Algorithm für Wörte mit der Länge > 2
          for (let search_len = 1; search_len < len; search_len++) {
            const completing_len = len - search_len;
            const existingCombination = ableitungen[search_len - 1][col];
            const completingCombination =
              ableitungen[completing_len - 1][search_len + col];
            const allCombinations = Array.from(existingCombination, (str1) =>
              Array.from(completingCombination, (str2) => str1 + str2)
            ).flat();
            allCombinations.forEach((c) =>
              allKeys
                .filter((k) => this.produktionRegeln.get(k)!.has(c))
                .forEach((k) => ableitungen[len - 1][col].add(k))
            );
          }
        }
      }
    }
    return ableitungen;
  }

  private pruefenRegeln(variabel: string, produktion: string): boolean {
    if (!this.variablen.has(variabel)) return false;
    if (produktion.length > 2) return false;
    if (
      produktion.length == 2 &&
      (!this.variablen.has(produktion.charAt(0)) ||
        !this.variablen.has(produktion.charAt(1)) ||
        produktion.charAt(0) == this.startsymbol ||
        produktion.charAt(1) == this.startsymbol)
    )
      return false;
    if (produktion.length == 1 && !this.terminale.has(produktion)) return false;
    if (produktion.length == 0 && variabel != this.startsymbol) return false;

    return true;
  }
}

export function groupString(str: string, n: number) {
  const result = [];
  for (let i = 0; i <= str.length - n; i++) {
    result.push(str.slice(i, i + n));
  }
  return result;
}
