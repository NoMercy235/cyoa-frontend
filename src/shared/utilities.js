import Typography from '@material-ui/core/Typography';
import React from 'react';

export const parseContent = (content) => {
  return content.split('\n').map((line, i) => {
    if (line === '') return <br key={i}/>;
    return (
      <Typography component="p" key={i}>
        {line}
      </Typography>
    );
  });
};
