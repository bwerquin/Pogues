import * as Response from './response';
import { QUESTION_TYPE_ENUM } from 'constants/pogues-constants';

export function stateToModel(
  state,
  collectedVariables,
  collectedVariablesStore,
  type,
) {
  const responsesModel = collectedVariables.map(cv =>
    Response.stateToRemote({ ...state, collectedVariable: cv }),
  );
  const mappingModel = responsesModel.map(r => {
    const { x, y } = collectedVariablesStore[r.CollectedVariableReference];

    // Table : Fix lines and look into columns
    const MappingTarget =
      type === QUESTION_TYPE_ENUM.MULTIPLE_CHOICE ? `${x}` : `${x} ${y}`;
    return { MappingSource: r.id, MappingTarget };
  });

  return {
    Response: responsesModel,
    Mapping: mappingModel,
  };
}
