import { connect } from 'react-redux';

import GenericInput from '../components/generic-input';

import {
  saveActiveQuestionnaire,
  visualizeActiveQuestionnaire,
  handleNewPageBreak,
} from 'actions/app-state';
import {
  getNewSequencePlaceholder,
  getNewSubsequencePlaceholder,
  getNewQuestionPlaceholder,
} from '../utils/generic-input-utils';
import { COMPONENT_TYPE } from 'constants/pogues-constants';

const { QUESTION, SEQUENCE, SUBSEQUENCE } = COMPONENT_TYPE;

// Utils

function getPlaceholders(
  componentsStore,
  selectedComponentId,
  questionnaireId,
) {
  const selectedComponent = componentsStore[selectedComponentId];

  return {
    [SEQUENCE]: getNewSequencePlaceholder(
      componentsStore,
      questionnaireId,
      selectedComponent,
    ),
    [SUBSEQUENCE]: getNewSubsequencePlaceholder(
      componentsStore,
      selectedComponent,
    ),
    [QUESTION]: getNewQuestionPlaceholder(componentsStore, selectedComponent),
  };
}

function isQuestionnaireValid(questionnaireErrors = {}) {
  return (
    Object.keys(questionnaireErrors).reduce(
      (acc, key) => acc + questionnaireErrors[key].length,
      0,
    ) === 0
  );
}

// Container

const mapStateToProps = state => {
  const {
    activeComponentsById,
    selectedComponentId,
    activeQuestionnaire,
  } = state.appState;
  const errors = state.errors || { errorsIntegrity: {} };
  const questionnaireErrors =
    errors.errorsIntegrity[activeQuestionnaire.id] || {};

  return {
    placeholders: getPlaceholders(
      activeComponentsById,
      selectedComponentId,
      activeQuestionnaire.id,
    ),
    isQuestionnaireModified: state.appState.isQuestionnaireModified,
    isQuestionnaireValid: isQuestionnaireValid(questionnaireErrors),
    componentIdForPageBreak: state.appState.componentIdForPageBreak,
  };
};

const mapDispatchToProps = {
  saveActiveQuestionnaire,
  visualizeActiveQuestionnaire,
  handleNewPageBreak,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GenericInput);
