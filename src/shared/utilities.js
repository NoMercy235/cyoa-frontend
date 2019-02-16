import Typography from '@material-ui/core/Typography';
import React from 'react';

export const parseContent = (content, options = {}) => {
  return content.split('\n').map((line, i) => {
    if (line === '') return <br key={i}/>;
    return (
      <Typography
        key={i}
        variant={options.variant || 'h6'}
      >
        {line}
      </Typography>
    );
  });
};
