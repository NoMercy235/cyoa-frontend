import Typography from '@material-ui/core/Typography';
import React from 'react';

export const parseContent = (content, options = {}) => {
  return content.split('\n').map((line, i) => {
    if (line === '') return <br key={i}/>;
    return (
      <Typography
        key={i}
        className={options.className || ''}
        variant={options.variant || 'h6'}
      >
        {line}
      </Typography>
    );
  });
};

/**
 * Returns a hook to the initial function which will debounce it by the given value
 * The hook will return a promise inside which it fires a timer to keep track of the calls (and cancel them,
 * in case a new one comes along) and inside the setTimeout method, it await for the initial function
 * and resolves the promise with the result.
 * @param fn
 * @param delay
 * @returns {function(...[*]=): Promise<any>}
 */
export const debounced = (fn, delay = 500) => {
  let timer;
  return (...args) => {
    return new Promise(resolve => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(async () => {
        const result = await fn(...args);
        resolve(result);
      }, delay);
    });
  };
};
