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
import { spreadRestTopic } from './spread-rest.js';
import { stringMethodsAdvancedTopic } from './string-methods-advanced.js';
import { objectsAdvancedTopic } from './objects-advanced.js';
import { errorsTopic } from './errors.js';
import { jsonTopic } from './json.js';
import { datesMathTopic } from './dates-math.js';
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
  spreadRestTopic,
  stringMethodsAdvancedTopic,
  objectsAdvancedTopic,
  errorsTopic,
  jsonTopic,
  datesMathTopic,
  closuresAdvancedTopic,
];
