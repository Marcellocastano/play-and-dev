import type { Topic } from '@lg/core';
import { variablesTopic } from './variables.js';
import { primitiveTypesTopic } from './primitive-types.js';
import { stringsTopic } from './strings.js';
import { numbersTopic } from './numbers.js';
import { booleansNullUndefinedTopic } from './booleans-null-undefined.js';
import { operatorsTopic } from './operators.js';
import { comparisonsTopic } from './comparisons.js';
import { conditionalsTopic } from './conditionals.js';
import { loopsTopic } from './loops.js';
import { functionsTopic } from './functions.js';
import { scopeBasicsTopic } from './scope-basics.js';
import { arraysBasicsTopic } from './arrays-basics.js';
import { objectsBasicsTopic } from './objects-basics.js';
import { arrayMethodsTopic } from './array-methods.js';
import { destructuringTopic } from './destructuring.js';
import { closuresAdvancedTopic } from './closures-advanced.js';

export const topics: Topic[] = [
  variablesTopic,
  primitiveTypesTopic,
  stringsTopic,
  numbersTopic,
  booleansNullUndefinedTopic,
  operatorsTopic,
  comparisonsTopic,
  conditionalsTopic,
  loopsTopic,
  functionsTopic,
  scopeBasicsTopic,
  arraysBasicsTopic,
  objectsBasicsTopic,
  arrayMethodsTopic,
  destructuringTopic,
  closuresAdvancedTopic,
];
