// GENERATO da scripts/bankIO.ts (saveApproved): un import per ogni JSON in questa cartella.
import type { BankFile, BankQuestion } from '../types.js';
import arrayMethods from './array-methods.json';
import datesMath from './dates-math.json';
import destructuring from './destructuring.json';
import errors from './errors.json';
import json from './json.json';
import objectsAdvanced from './objects-advanced.json';
import spreadRest from './spread-rest.json';
import stringMethodsAdvanced from './string-methods-advanced.json';
import variables from './variables.json';

const files = [
  arrayMethods,
  datesMath,
  destructuring,
  errors,
  json,
  objectsAdvanced,
  spreadRest,
  stringMethodsAdvanced,
  variables,
] as unknown as BankFile[];

export const bankQuestions: BankQuestion[] = files.flatMap((f) => f.questions);
