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
}

export { CFG };
