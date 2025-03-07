import {
  required,
  requiredSelect,
  name,
  nameSize,
  minValue,
  maxValue,
  validCodesList,
  emptyMeasures,
  validateEarlyTarget,
  validateExistingTarget,
  validateDuplicatesCalculated,
  validateDuplicatesExternal,
  validateDuplicatesCollected,
  validCollectedVariables,
} from 'forms/validation-rules';
import {
  TABS_PATHS,
  QUESTION_TYPE_ENUM,
  DIMENSION_TYPE,
  DIMENSION_FORMATS,
  DATATYPE_NAME,
  DEFAULT_CODES_LIST_SELECTOR_PATH,
} from 'constants/pogues-constants';
import Dictionary from 'utils/dictionary/dictionary';

const { SIMPLE, SINGLE_CHOICE, MULTIPLE_CHOICE, TABLE } = QUESTION_TYPE_ENUM;
const { NUMERIC, TEXT } = DATATYPE_NAME;
const { PRIMARY, SECONDARY, LIST_MEASURE, MEASURE } = DIMENSION_TYPE;
const { LIST, CODES_LIST } = DIMENSION_FORMATS;
const {
  RESPONSE_FORMAT,
  DECLARATIONS,
  CONTROLS,
  REDIRECTIONS,
  CALCULATED_VARIABLES,
  EXTERNAL_VARIABLES,
  COLLECTED_VARIABLES,
} = TABS_PATHS;

export const questionnaireRules = {
  serie: [requiredSelect],
  operation: [requiredSelect],
  campaigns: [required],
  name: [required, name],
  label: [required],
};

export const sequenceRules = {
  name: [required, name],
  label: [required],
};

export const questionRules = {
  name: [required, name],
  label: [required],
  [`${RESPONSE_FORMAT}.type`]: [requiredSelect],
  [`${RESPONSE_FORMAT}.${SIMPLE}.${TEXT}.maxLength`]: [
    required,
    value => minValue(1)(value),
  ],
  [`${RESPONSE_FORMAT}.${SINGLE_CHOICE}.${DEFAULT_CODES_LIST_SELECTOR_PATH}`]: [
    validCodesList,
  ],
  [`${RESPONSE_FORMAT}.${MULTIPLE_CHOICE}.${PRIMARY}.${DEFAULT_CODES_LIST_SELECTOR_PATH}`]: [
    validCodesList,
  ],
  [`${RESPONSE_FORMAT}.${MULTIPLE_CHOICE}.${MEASURE}.${CODES_LIST}.${DEFAULT_CODES_LIST_SELECTOR_PATH}`]: [
    validCodesList,
  ],
  [`${RESPONSE_FORMAT}.${TABLE}.${PRIMARY}.totalLabel`]: [required],
  [`${RESPONSE_FORMAT}.${TABLE}.${PRIMARY}.${LIST}.numLinesMin`]: [
    value => minValue(1)(value),
    value => maxValue(100)(value),
  ],
  [`${RESPONSE_FORMAT}.${TABLE}.${PRIMARY}.${LIST}.numLinesMax`]: [
    value => minValue(1)(value),
    value => maxValue(100)(value),
  ],
  [`${RESPONSE_FORMAT}.${TABLE}.${PRIMARY}.${CODES_LIST}.${DEFAULT_CODES_LIST_SELECTOR_PATH}`]: [
    validCodesList,
  ],
  [`${RESPONSE_FORMAT}.${TABLE}.${SECONDARY}.totalLabel`]: [required],
  [`${RESPONSE_FORMAT}.${TABLE}.${SECONDARY}.${DEFAULT_CODES_LIST_SELECTOR_PATH}`]: [
    validCodesList,
  ],
  [`${RESPONSE_FORMAT}.${TABLE}.label`]: [required],
  [`${RESPONSE_FORMAT}.${TABLE}.${SINGLE_CHOICE}.${DEFAULT_CODES_LIST_SELECTOR_PATH}`]: [
    validCodesList,
  ],
  [`${RESPONSE_FORMAT}.${TABLE}.${SIMPLE}.${NUMERIC}.minimum`]: [
    value => minValue(0)(value),
  ],
  [`${RESPONSE_FORMAT}.${TABLE}.${SIMPLE}.${NUMERIC}.maximum`]: [
    value => minValue(1)(value),
  ],
  [`${RESPONSE_FORMAT}.${TABLE}.${SIMPLE}.${TEXT}.maxLength`]: [
    required,
    value => minValue(1)(value),
  ],
  [`${RESPONSE_FORMAT}.${TABLE}.${LIST_MEASURE}.measures`]: [emptyMeasures],
  [`${RESPONSE_FORMAT}.${TABLE}.${MEASURE}.label`]: [required],
  [`${RESPONSE_FORMAT}.${TABLE}.${MEASURE}.${SIMPLE}.${NUMERIC}.minimum`]: [
    value => minValue(0)(value),
  ],
  [`${RESPONSE_FORMAT}.${TABLE}.${MEASURE}.${SIMPLE}.${NUMERIC}.maximum`]: [
    value => minValue(1)(value),
  ],
  [`${RESPONSE_FORMAT}.${TABLE}.${MEASURE}.${SIMPLE}.${TEXT}.maxLength`]: [
    required,
    value => minValue(1)(value),
  ],
  [`${RESPONSE_FORMAT}.${TABLE}.${MEASURE}.${SINGLE_CHOICE}.${DEFAULT_CODES_LIST_SELECTOR_PATH}`]: [
    validCodesList,
  ],
  [`${COLLECTED_VARIABLES}.collectedVariables`]: [validCollectedVariables],
};

export const declarationRules = {
  [`${DECLARATIONS}.label`]: [
    value => required(value) && Dictionary.validation_declaration_label,
  ],
};

export const redirectionRules = {
  [`${REDIRECTIONS}.label`]: [
    value => required(value) && Dictionary.validation_goTo_description,
  ],
  [`${REDIRECTIONS}.condition`]: [
    value => required(value) && Dictionary.validation_condition,
  ],
  [`${REDIRECTIONS}.cible`]: [
    value => required(value) && Dictionary.validation_target,
    validateEarlyTarget,
    validateExistingTarget,
  ],
};

export const controlRules = {
  [`${CONTROLS}.label`]: [
    value => required(value) && Dictionary.validation_control_description,
  ],
  [`${CONTROLS}.condition`]: [
    value => required(value) && Dictionary.validation_expression,
  ],
  [`${CONTROLS}.message`]: [
    value => required(value) && Dictionary.validation_control_message,
  ],
};

export const calculatedVariableRules = {
  [`${CALCULATED_VARIABLES}.label`]: [
    value => required(value) && Dictionary.validation_calculatedvariable_label,
  ],
  [`${CALCULATED_VARIABLES}.name`]: [
    value => required(value) && Dictionary.validation_calculatedvariable_name,
    name,
    nameSize,
    (value, conf) =>
      validateDuplicatesCalculated(value, conf) &&
      Dictionary.validation_calculatedvariable_existing,
  ],
  [`${CALCULATED_VARIABLES}.formula`]: [
    value =>
      required(value) && Dictionary.validation_calculatedvariable_formula,
  ],
};

export const externalVariableRules = {
  [`${EXTERNAL_VARIABLES}.label`]: [
    value => required(value) && Dictionary.validation_externalvariable_label,
  ],
  [`${EXTERNAL_VARIABLES}.name`]: [
    value => required(value) && Dictionary.validation_externalvariable_name,
    name,
    nameSize,
    (value, conf) =>
      validateDuplicatesExternal(value, conf) &&
      Dictionary.validation_externalvariable_existing,
  ],
};

export const collectedVariableRules = {
  [`${COLLECTED_VARIABLES}.label`]: [
    value => required(value) && Dictionary.validation_collectedvariable_label,
  ],
  [`${COLLECTED_VARIABLES}.name`]: [
    value => required(value) && Dictionary.validation_collectedvariable_name,
    name,
    nameSize,
    (value, conf) =>
      validateDuplicatesCollected(value, conf) &&
      Dictionary.validation_collectedvariable_existing,
  ],
};

export const tableListMeasuresRules = {
  [`${RESPONSE_FORMAT}.${TABLE}.${LIST_MEASURE}.label`]: [
    value => required(value) && Dictionary.validationMeasureLabel,
  ],
  [`${RESPONSE_FORMAT}.${TABLE}.${LIST_MEASURE}.${SINGLE_CHOICE}.${DEFAULT_CODES_LIST_SELECTOR_PATH}`]: [
    validCodesList,
  ],
  [`${RESPONSE_FORMAT}.${TABLE}.${LIST_MEASURE}.${SIMPLE}.${NUMERIC}.minimum`]: [
    value => minValue(0)(value),
  ],
  [`${RESPONSE_FORMAT}.${TABLE}.${LIST_MEASURE}.${SIMPLE}.${NUMERIC}.maximum`]: [
    value => minValue(1)(value),
  ],
  [`${RESPONSE_FORMAT}.${TABLE}.${LIST_MEASURE}.${SIMPLE}.${TEXT}.maxLength`]: [
    required,
    value => minValue(1)(value),
  ],
};
