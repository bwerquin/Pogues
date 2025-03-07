import React from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';

import { InputWithVariableAutoCompletion } from 'forms/controls/control-with-suggestions';
import { SelectorView, View } from 'widgets/selector-view';
import ResponseFormatSimple from '../simple/response-format-simple';
import ResponseFormatSingle from '../single/response-format-single';
import Dictionary from 'utils/dictionary/dictionary';
import { QUESTION_TYPE_ENUM } from 'constants/pogues-constants';

const { SIMPLE, SINGLE_CHOICE } = QUESTION_TYPE_ENUM;

function InputMeasure(props) {
  return (
    <div>
      <Field
        name="label"
        type="text"
        component={InputWithVariableAutoCompletion}
        label={Dictionary.measureLabel}
        required
      />

      <SelectorView
        label={Dictionary.typeMeasure}
        selectorPath={props.selectorPath}
      >
        <View
          key={SIMPLE}
          value={SIMPLE}
          label={Dictionary.responseFormatSimple}
        >
          <ResponseFormatSimple
            selectorPathParent={props.selectorPath}
            showMandatory={false}
          />
        </View>
        <View
          key={SINGLE_CHOICE}
          value={SINGLE_CHOICE}
          label={Dictionary.responseFormatSingle}
        >
          <ResponseFormatSingle
            selectorPathParent={props.selectorPath}
            showMandatory={false}
          />
        </View>
      </SelectorView>
    </div>
  );
}

InputMeasure.propTypes = {
  selectorPath: PropTypes.string.isRequired,
};

export default InputMeasure;
