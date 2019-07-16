import React from 'react';
import { createMuiTheme, Typography } from '@material-ui/core';
import { runInAction } from 'mobx';

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

export const noop = () => {};

export const KeyCode = {
  Backspace: 8,
};

export const ThemeColors = {
  Primary: '#432874',
  Secondary: '#d87000',
};

export const getMainMuiTheme = (asTheme = true) => {
  const options = {
    palette: {
      primary: { main: ThemeColors.Primary }, // Purple and green play nicely together.
      secondary: { main: ThemeColors.Secondary }, // This is just green.A700 as hex.
    },
  };

  return asTheme ? createMuiTheme(options) : options;
};

export class QueryParams {
  static defaultPagination = { page: 0, limit: 10 };

  custom = {};
  filters = {};
  sort = {};
  pagination = {};

  constructor (options) {
    if (options.pagination) {
      this.pagination = options.pagination;
    }
  }

  addCustomQueryParam ({ name, value }) {
    runInAction(() => {
      this.custom[name] = value;
    });
  }

  addFilter ({ name, op, value }, options = {}) {
    runInAction(() => {
      this.filters[name] = { op, value, options };
    });
  }

  setFilter (filters) {
    runInAction(() => {
      this.filters = filters;
    });
  }

  setSort ({ field, order }) {
    runInAction(() => {
      this.sort = field
        ? { [field]: order }
        : {};
    });
  }

  setPagination (pagination) {
    runInAction(() => {
      this.pagination = Object.assign(
        {},
        this.pagination,
        pagination
      );
    });
  }

  nextPage () {
    runInAction(() => {
      this.pagination.page++;
    });
  }

  refreshPage () {
    runInAction(() => {
      this.pagination.page = 0;
    });
  }

  reset ({ filters, sort, pagination } = {}) {
    this.setFilter(filters || {});
    this.setSort(sort || {});
    this.setPagination(pagination || QueryParams.defaultPagination);
  }

  static adaptResponse ({ resource, ResourceModel }) {
    return response => ({
      page: response.page,
      total: response.total,
      [resource]: response.data.map(d => new ResourceModel(d)),
    });
  }
}
