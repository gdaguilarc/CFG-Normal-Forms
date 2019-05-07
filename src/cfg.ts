import * as combinations from 'combinations';

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
   * chomsky
   */
  public chomsky() {
    this.eliminateLambdaRules();
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
    const unique = (value, index, self) => {
      return self.indexOf(value) === index;
    };
    let nul = [];
    let toLambda = [];
    for (const key of this.rules.keys()) {
      const rules = this.getRule(key);
      rules.forEach(rule => {
        if (rule === 'λ') {
          nul.push(key);
          toLambda.push(key);
        }
      });
    }
    if (toLambda.length === 0) {
      return;
    } else {
      let prev = 0;
      while (prev < nul.length) {
        prev = nul.length;
        for (const key of this.rules.keys()) {
          let contains = false;
          this.getRule(key).forEach(rule => {
            rule.split('').forEach(letter => {
              if (nul.includes(letter)) {
                contains = true;
              } else {
                contains = false;
              }
            });
            if (contains) {
              nul.push(key);
            }
          });
        }
        nul = nul.filter(unique);
      }

      toLambda.forEach(ele => {
        let newStates = [];
        this.getRule(ele).forEach(rule => {
          if (rule != 'λ') {
            newStates.push(rule);
          }
          const r = rule.split('');
          r.forEach(letter => {
            if (letter === letter.toLowerCase() && letter != 'λ') {
              newStates.push(letter);
            }
          });
          newStates = newStates.filter(unique);
          this.rules.set(ele, newStates);
        });
      });

      const rulesOfIn = this.getRule(nul[nul.length - 1]);
      let newStates = [];
      rulesOfIn.forEach(rule => {
        let is = false;
        rule.split('').forEach(letter => {
          if (nul.includes(letter)) {
            is = true;
          } else {
            is = false;
          }
        });
        if (is) {
          let com = combinations(rule.split(''));
          com.forEach(rule => {
            newStates.push(rule.join(''));
          });
        } else {
          newStates.push(rule);
        }
      });

      newStates.push('λ');
      newStates = newStates.filter(unique);
      this.rules.set(nul[nul.length - 1], newStates);
      console.log('NEW', this.rules);
    }
  }
}

export { CFG };
