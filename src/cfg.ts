class CFG {
  rules: Map<string, string[]>;

  constructor(array: string[]) {
    this.rules = this.parseCFG(array);
  }

  /**
   *
   * @param array An array that contains rules per line
   */
  public parseCFG(array: string[]) {
    let rules = new Map<string, string[]>();
    array.forEach(element => {
      // Remove spaces
      element = element.split(' ').join('');

      // Separate in key and values
      const key = element.split('-->')[0];
      const value = element.split('-->')[1].split('|');

      // Insert to the hashmap
      rules.set(key, value);
    });

    // Return the hashmap
    return rules;
  }

  /**
   * getRule
   */
  public getRule(letter: string) {
    if (this.isUpperCase(letter)) {
      return this.rules.get(letter);
    }
  }

  private isUpperCase(letter: string) {
    if (letter === letter.toUpperCase()) {
      return true;
    } else {
      return false;
    }
  }

  private nonRecursiveInitial() {
    const i = this.rules.keys()[0];
    const rules = this.getRule(i);

    rules.forEach(elem => {
      const letters = elem.split('');
      letters.forEach(letter => {
        if (letter === i) {
          this.rules.set(i + "'", i);
          return;
        }
      });
    });
  }

  private eliminateLambdaRules() {
    let nul = [];
    for (const key in this.rules.keys()) {
      const rules = this.getRule(key);
      rules.forEach(rule => {
        if (rule === 'λ') {
          nul.push(key);
        }
      });
    }
    let prev = [];
    let contains = true;
    while (prev != nul) {
      prev = nul;
      for (const key in this.rules.keys()) {
        const rules = this.getRule(key);
        rules.forEach(rule => {
          const letters = rule.split('');
          nul.forEach(letter => {
            if (!letters.includes(letter)) {
              contains = false;
            }
          });
          if (contains) {
            nul.push(key);
          }
        });
      }
    }
  }
}

export { CFG };
