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
    // this.nonRecursiveInitial();
    // this.eliminateLambdaRules();
    // this.chainRules();
    // this.uselessSymbols();

    const advancedLength = (rule) => {
      const regex1 = RegExp('[A-Z]\\d+', 'g');
      const regex2 = RegExp('[A-Z]\\*', 'g');

      const array1 = [];
      const array2 = [];

      let a = [];
      while ((a = regex1.exec(rule)) !== null) {
        array1.push(a[0]);
      }

      let a2 = [];
      while ((a2 = regex2.exec(rule)) !== null) {
        array2.push(a2[0]);
      }

      let len = rule.length;
      len = len - array2.length;
      let lenNum = 0;
      array1.forEach((elem) => {
        lenNum = lenNum + elem.length - 1; 
      });
      len = len - lenNum;

      return len;
    };
    let newRules = new Map<string, string[]>();
    for (const key of this.rules.keys()) {
      for (const rule of this.getRule(key)) {
        const len = advancedLength(rule);
        if (len > 2) {

        }
      }
    }

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
          this.rules.set(i + "*", i);
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

  private chainRules() {
    let chains = new Map<string, string[]>();
    const equalSets = (setA, setB) => {
      if (setA.length === setB.length) {
        return setA.every((value, index) => {
          return value === setB[index]; 
        });
      } else {
        return false;
      }
    };
    const substract = (setA, setB) => {
      return setA.filter((elem) => {
        return !setB.includes(elem);
      });
    }
    for (const key of this.rules.keys()) {
      let chainSet = [];
      let prev = [];
      let newSet = [];
      chainSet.push(key);

      while (!equalSets(chainSet, prev)) {
        newSet = substract(chainSet, prev);
        prev = [...chainSet];
        for (const variable of newSet) {
          const localRules = this.getRule(variable);
          for (const localRule of localRules) {
            if (localRule.length === 1 && this.isUpperCase(localRule)) {
              if (!chainSet.includes(localRule)) {
                chainSet.push(localRule);
              }
            }
          }
        }
      }
      chains.set(key, chainSet);
    }
    console.log("Chain sets", chains);

    const unique = (value, index, self) => {
      return self.indexOf(value) === index;
    };
    for (const mainKey of chains.keys()) {
      const secondaryKeys = chains.get(mainKey);
      let mainRules = this.getRule(mainKey);
      for (const secondaryKey of secondaryKeys) {
        if (secondaryKey !== mainKey) {
          const secondaryRules = this.getRule(secondaryKey);
          for (const secondaryRule of secondaryRules) {
            if (secondaryRule !== secondaryKey) {
              mainRules.push(secondaryRule);
            }
          }
        }
        while (mainRules.includes(secondaryKey)) {
          const remIndex = mainRules.indexOf(secondaryKey);
          if (remIndex !== -1) mainRules.splice(remIndex, 1);
        }
      }
      while (mainRules.includes(mainKey)) {
        const remIndex = mainRules.indexOf(mainKey);
        if (remIndex !== -1) mainRules.splice(remIndex, 1);
      }
      mainRules = mainRules.filter(unique);
      this.rules.set(mainKey, mainRules);

    }
    console.log('After chain rules', this.rules);
  }

  private uselessSymbols() {
    let term = [];

    for (const key of this.rules.keys()) {
      const rules = this.getRule(key);
      for (const rule of rules) {
        let onlyTerminals = true;
        for (const elem of rule.split("")) {
          if (this.isUpperCase(elem)) {
            onlyTerminals = false;
            break;
          }
        }
        if (onlyTerminals) {
          if (!term.includes(key)) {
            term.push(key);
          }
          break;
        }
      }
    } 
    const equalSets = (setA, setB) => {
      if (setA.length === setB.length) {
        return setA.every((value, index) => {
          return value === setB[index]; 
        });
      } else {
        return false;
      }
    };
    const isOnlyPrevAndTerminal = ((rule, prevSet) => {
      let isValid = true;
      for (const element of rule.split("")) {
        if (this.isUpperCase(element)) {
          if (!prevSet.includes(element)) {
            isValid = false;
            break;
          }
        }
      }
      return isValid;
    });
    let prev = [];
    while (!equalSets(term, prev)) {
      prev = [...term];
      for (const variable of this.rules.keys()) {
        const rules = this.getRule(variable);
        for (const rule of rules) {
          if (isOnlyPrevAndTerminal(rule, prev)) {
            if (!term.includes(variable)) {
              term.push(variable)
            }
          }
        }
      }
    }
    console.log("Variables that lead to terminal", term);

    let allVariables = this.rules.keys();
    let variablesToRemove = [];
    for (const variable of allVariables) {
      if (!term.includes(variable)) {
        this.rules.delete(variable);
        variablesToRemove.push(variable)
      }
    }
    for (const variable of this.rules.keys()) {
      let rules = this.getRule(variable);
      for (const rule of rules) {
        for (const variableToRemove of variablesToRemove) {
          if (rule.includes(variableToRemove)) {
            const remIndex = rules.indexOf(rule);
            if (remIndex !== -1) rules.splice(remIndex, 1);
          }
        }
      }
    }
    console.log("After removing variables that don't lead to terminal", this.rules);

    const substract = (setA, setB) => {
      return setA.filter((elem) => {
        return !setB.includes(elem);
      });
    }
    let reach = [this.rules.keys().next().value];
    let prevSet = []
    let newSet = []
    while (!equalSets(reach, prevSet)) {
      newSet = substract(reach, prevSet);
      prevSet = [...reach];
      for (const variable of newSet) {
        const rules = this.getRule(variable);
        for (const rule of rules) {
          for (const elem of rule.split("")) {
            if (this.isUpperCase(elem)) {
              if (!reach.includes(elem)) {
                reach.push(elem);
              }
            }
          }
        }
      }
    }
    console.log("Variables derivable from initial", reach);
    allVariables = this.rules.keys();
    variablesToRemove = [];
    for (const variable of allVariables) {
      if (!reach.includes(variable)) {
        this.rules.delete(variable);
        variablesToRemove.push(variable)
      }
    }
    for (const variable of this.rules.keys()) {
      let rules = this.getRule(variable);
      for (const rule of rules) {
        for (const variableToRemove of variablesToRemove) {
          if (rule.includes(variableToRemove)) {
            const remIndex = rules.indexOf(rule);
            if (remIndex !== -1) rules.splice(remIndex, 1);
          }
        }
      }
    }
    console.log("After removing variables that don't derive from initial", this.rules);
  }
}

export { CFG };
