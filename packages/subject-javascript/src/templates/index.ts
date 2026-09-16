import type { QuestionTemplate } from '@lg/core';
import { variablesTemplates } from './variables/index.js';
import { primitiveTypesTemplates } from './primitive-types/index.js';
import { stringsTemplates } from './strings/index.js';
import { numbersTemplates } from './numbers/index.js';
import { booleansNullUndefinedTemplates } from './booleans-null-undefined/index.js';
import { operatorsTemplates } from './operators/index.js';
import { comparisonsTemplates } from './comparisons/index.js';
import { conditionalsTemplates } from './conditionals/index.js';
import { loopsTemplates } from './loops/index.js';
import { functionsTemplates } from './functions/index.js';
import { scopeBasicsTemplates } from './scope-basics/index.js';
import { arraysBasicsTemplates } from './arrays-basics/index.js';
import { objectsBasicsTemplates } from './objects-basics/index.js';
import { arrayMethodsTemplates } from './array-methods/index.js';
import { destructuringTemplates } from './destructuring/index.js';
import { closuresAdvancedTemplates } from './closures-advanced/index.js';
import { bankTemplates } from '../bank/index.js';

export const templates: QuestionTemplate[] = [
  ...variablesTemplates,
  ...primitiveTypesTemplates,
  ...stringsTemplates,
  ...numbersTemplates,
  ...booleansNullUndefinedTemplates,
  ...operatorsTemplates,
  ...comparisonsTemplates,
  ...conditionalsTemplates,
  ...loopsTemplates,
  ...functionsTemplates,
  ...scopeBasicsTemplates,
  ...arraysBasicsTemplates,
  ...objectsBasicsTemplates,
  ...arrayMethodsTemplates,
  ...destructuringTemplates,
  ...closuresAdvancedTemplates,
  ...bankTemplates,
];
