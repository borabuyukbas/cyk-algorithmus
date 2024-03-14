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
