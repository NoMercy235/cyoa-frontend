import React from 'react';

export const renderConsequenceCell = option => {
  return renderExtraCell(
    'consequences',
    (consequence) => consequence.changeValue,
  )(option);
};

export const renderRequirementCell = option => {
  return renderExtraCell(
    'requirements',
    (requirement) => requirement.value,
  )(option);
};

export const renderExtraCell = (extraField, getValue) => option => {
  return option[extraField]
    .filter(extra => extra.attribute)
    .map((extra, i) =>
      <div key={i}>
        <b>{extra.attribute}</b>&nbsp;:&nbsp;<b>{getValue(extra)}</b>
      </div>
    );
};
