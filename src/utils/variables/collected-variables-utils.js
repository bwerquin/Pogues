import {
  QUESTION_TYPE_ENUM,
  DIMENSION_TYPE,
  DIMENSION_FORMATS,
  DEFAULT_CODES_LIST_SELECTOR_PATH,
  DATATYPE_NAME,
} from 'constants/pogues-constants';
import { uuid } from 'utils/utils';
import { hasChild } from 'utils/codes-lists/codes-lists-utils';

const { SIMPLE, SINGLE_CHOICE, MULTIPLE_CHOICE, TABLE } = QUESTION_TYPE_ENUM;
const { PRIMARY, SECONDARY, MEASURE, LIST_MEASURE } = DIMENSION_TYPE;
const { CODES_LIST } = DIMENSION_FORMATS;
const { TEXT, BOOLEAN } = DATATYPE_NAME;

export function sortByYAndX(store) {
  return (id1, id2) => {
    let c1 = id1;
    let c2 = id2;
    if (store) {
      c1 = store[id1];
      c2 = store[id2];
    }

    if (!c1.y) return c1.x - c2.x;
    return c1.y * 100 + c1.x - (c2.y * 100 + c2.x);
  };
}

export function getCollecteVariable(
  name,
  label,
  coordinates,
  reponseFormatValues = {},
) {
  let collectedVariable = {
    ...reponseFormatValues,
    id: uuid(),
    name,
    label,
  };

  if (coordinates) collectedVariable = { ...collectedVariable, ...coordinates };

  return collectedVariable;
}

export function getCollectedVariablesMultiple(
  questionName,
  form,
  codesListStore,
) {
  /**
   * This method will recursively sort an array of code.
   * A code have a depth, a weight and maybe a parent.
   * We will first sort codes with the depth=1, and recurively for each code,
   * sort its direct children.
   */
  function sortCodes(codes = [], depth = 1, parent = '') {
    const filtered = codes.filter(
      code => code.depth === depth && code.parent === parent,
    );
    if (filtered.length === 0) {
      return [];
    }
    return filtered
      .sort((code1, code2) => {
        const weight1 = code1.weight;
        const weight2 = code2.weight;
        if (weight1 < weight2) return -1;
        if (weight1 > weight2) return 1;
        return 0;
      })
      .map(code => [code, ...sortCodes(codes, depth + 1, code.value)])
      .reduce((acc, res) => [...acc, ...res], []);
  }

  const {
    [PRIMARY]: {
      [DEFAULT_CODES_LIST_SELECTOR_PATH]: { codes, id },
    },
    [MEASURE]: { type: typeMeasure },
  } = form;
  let listCodes = sortCodes(codes);
  if (listCodes.length === 0 && codesListStore[id]) {
    const codesStore = codesListStore[id].codes;
    listCodes = Object.keys(codesStore).map(key => codesStore[key]);
  }

  let reponseFormatValues = {
    type: BOOLEAN,
    [BOOLEAN]: {},
  };

  if (typeMeasure === CODES_LIST) {
    reponseFormatValues = {
      codeListReference: form[MEASURE][CODES_LIST].CodesList.id,
      codeListReferenceLabel: form[MEASURE][CODES_LIST].CodesList.label,
      type: TEXT,
      [TEXT]: {
        maxLength: 1,
        pattern: '',
      },
    };
  }
  const listFiltered = listCodes.filter(code => !hasChild(code, listCodes));
  return listFiltered.map((c, index) =>
    getCollecteVariable(
      `${questionName}${index + 1}`,
      `${c.value} - ${c.label}`,
      { x: index + 1 },
      reponseFormatValues,
    ),
  );
}

export function getCollectedVariablesTable(questionName, form, codesListStore) {
  /**
   * This method will recursively sort an array of code.
   * A code have a depth, a weight and maybe a parent.
   * We will first sort codes with the depth=1, and recurively for each code,
   * sort its direct children.
   */
  function sortCodes(codes = [], depth = 1, parent = '') {
    const filtered = codes.filter(
      code => code.depth === depth && code.parent === parent,
    );
    if (filtered.length === 0) {
      return [];
    }
    return filtered
      .sort((code1, code2) => {
        const weight1 = code1.weight;
        const weight2 = code2.weight;
        if (weight1 < weight2) return -1;
        if (weight1 > weight2) return 1;
        return 0;
      })
      .map(code => [code, ...sortCodes(codes, depth + 1, code.value)])
      .reduce((acc, res) => [...acc, ...res], []);
  }

  function getReponsesValues(measure) {
    let reponseFormatValues = {};

    if (measure.type === SIMPLE) {
      reponseFormatValues = {
        codeListReference: '',
        codeListReferenceLabel: '',
        type: measure[SIMPLE].type,
        BOOLEAN: measure[SIMPLE].BOOLEAN,
        DATE: measure[SIMPLE].DATE,
        NUMERIC: measure[SIMPLE].NUMERIC,
        TEXT: measure[SIMPLE].TEXT,
      };
    } else if (measure.type === SINGLE_CHOICE) {
      reponseFormatValues = {
        codeListReference: measure[SINGLE_CHOICE].CodesList.id,
        codeListReferenceLabel: measure[SINGLE_CHOICE].CodesList.label,
        type: TEXT,
        [TEXT]: {
          maxLength: 1,
          pattern: '',
        },
      };
    }
    return reponseFormatValues;
  }
  const collectedVariables = [];
  let codesListState;
  let codesStore;
  let codesStatePrimary;
  let codesStateSecondary;
  let codePrimary;
  let codeSecondary;
  let measure;
  const {
    [PRIMARY]: primaryState,
    [SECONDARY]: secondaryState,
    [MEASURE]: measureState,
    [LIST_MEASURE]: listMeasuresState,
  } = form;

  if (primaryState.type === CODES_LIST) {
    const {
      [CODES_LIST]: {
        [DEFAULT_CODES_LIST_SELECTOR_PATH]: {
          codes: componentCodesStatePrimary,
          id: codesListIdPrimary,
        },
      },
    } = primaryState;

    codesListState = codesListStore[codesListIdPrimary] || {};
    codesStore = codesListState.codes || {};
    codesStatePrimary = Object.keys(codesStore).map(key => codesStore[key]);

    codesStatePrimary = componentCodesStatePrimary;
    codesStatePrimary = sortCodes(codesStatePrimary);
    if (secondaryState && secondaryState.showSecondaryAxis) {
      const {
        [DEFAULT_CODES_LIST_SELECTOR_PATH]: {
          codes: componentCodesStateSecondary,
          id: codesListIdSecondary,
        },
      } = secondaryState;

      codesListState = codesListStore[codesListIdSecondary] || {};
      codesStore = codesListState.codes || {};
      codesStateSecondary = Object.keys(codesStore).map(key => codesStore[key]);

      codesStateSecondary = componentCodesStateSecondary;
      codesStateSecondary = sortCodes(codesStateSecondary);
      // First case
      const codesStatePrimaryFiltered = codesStatePrimary.filter(
        code => !hasChild(code, codesStatePrimary),
      );
      const codesStateSecondaryFiltered = codesStateSecondary.filter(
        code => !hasChild(code, codesStateSecondary),
      );
      for (let i = 0; i < codesStatePrimaryFiltered.length; i += 1) {
        codePrimary = codesStatePrimaryFiltered[i];
        for (let j = 0; j < codesStateSecondaryFiltered.length; j += 1) {
          codeSecondary = codesStateSecondaryFiltered[j];
          collectedVariables.push(
            getCollecteVariable(
              `${questionName}${i + 1}${j + 1}`,
              `${codePrimary.label}-${codeSecondary.label}-${measureState.label}`,
              { x: i + 1, y: j + 1 },
              getReponsesValues(measureState),
            ),
          );
        }
      }
    } else {
      // Second case
      const codesStatePrimaryFiltered = codesStatePrimary.filter(
        code => !hasChild(code, codesStatePrimary),
      );
      for (let i = 0; i < codesStatePrimaryFiltered.length; i += 1) {
        codePrimary = codesStatePrimaryFiltered[i];
        for (let j = 0; j < listMeasuresState.measures.length; j += 1) {
          measure = listMeasuresState.measures[j];
          collectedVariables.push(
            getCollecteVariable(
              `${questionName}${i + 1}${j + 1}`,
              `${codePrimary.label}-${measure.label}`,
              {
                x: i + 1,
                y: j + 1,
              },
              getReponsesValues(measure),
            ),
          );
        }
      }
    }
  } else {
    for (let j = 0; j < listMeasuresState.measures.length; j += 1) {
      measure = listMeasuresState.measures[j];

      collectedVariables.push(
        getCollecteVariable(
          `${questionName}${j + 1}`,
          `${measure.label}`,
          { x: 1, y: j + 1 },
          getReponsesValues(measure),
        ),
      );
    }
  }
  return collectedVariables.sort(sortByYAndX());
}

export function generateCollectedVariables(
  responseFormat,
  questionName,
  form,
  codesListStore,
) {
  let generatedCollectedVariables = [];

  if (responseFormat === SIMPLE) {
    generatedCollectedVariables = [
      getCollecteVariable(
        questionName,
        `${questionName} label`,
        undefined,
        form,
      ),
    ];
  } else if (responseFormat === SINGLE_CHOICE) {
    generatedCollectedVariables = [
      getCollecteVariable(questionName, `${questionName} label`, undefined, {
        codeListReference: form.CodesList.id,
        codeListReferenceLabel: form.CodesList.label,
        type: TEXT,
        [TEXT]: {
          maxLength: 1,
          pattern: '',
        },
      }),
    ];
  } else if (responseFormat === MULTIPLE_CHOICE) {
    generatedCollectedVariables = getCollectedVariablesMultiple(
      questionName,
      form,
      codesListStore,
    );
  } else if (responseFormat === TABLE) {
    generatedCollectedVariables = getCollectedVariablesTable(
      questionName,
      form,
      codesListStore,
    );
  }

  return generatedCollectedVariables;
}
