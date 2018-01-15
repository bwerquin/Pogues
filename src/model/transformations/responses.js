import * as Response from './response';
import { QUESTION_TYPE_ENUM } from 'constants/pogues-constants'

export function stateToModel(state, collectedVariables, collectedVariablesStore, type) {
  const responsesModel = collectedVariables.map(cv => Response.stateToRemote({ ...state, collectedVariable: cv }));
  const mappingModel = responsesModel.map(r => {
    const x = collectedVariablesStore[r.CollectedVariableReference].x;
    const y = collectedVariablesStore[r.CollectedVariableReference].y;
    // Consider that we return lines first, and then if exist, columns
    const MappingTarget = type === QUESTION_TYPE_ENUM.MULTIPLE_CHOICE ? `${y}` : `${y} ${x}`;
    return ({ MappingSource: r.id, MappingTarget, });
  });

  return {
    Response: responsesModel,
    Mapping: mappingModel,
  };
}
