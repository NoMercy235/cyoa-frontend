/* eslint-disable react/prop-types, react/jsx-handler-names */

import React from 'react';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';
import ReactSelect from 'react-select';
import {
  withStyles,
  Chip,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';

import { noop } from '../../../utilities';

import { styles } from './Autocomplete.css';

function NoOptionsMessage(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps,
        },
      }}
      {...props.selectProps.textFieldProps}
    />
  );
}

function Option(props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

function Placeholder(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function SingleValue(props) {
  return (
    <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function ValueContainer(props) {
  return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

function MultiValue(props) {
  return (
    <Chip
      tabIndex={-1}
      label={props.children}
      className={classNames(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused,
      })}
      onDelete={props.removeProps.onClick}
      deleteIcon={<CancelIcon {...props.removeProps} />}
    />
  );
}

function Menu(props) {
  return (
    <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
      {props.children}
    </Paper>
  );
}

const components = {
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
};

class Autocomplete extends React.Component {
  getSelectStyles = () => {
    const { theme } = this.props;
    return {
      input: base => ({
        ...base,
        color: theme.palette.text.primary,
        '& input': {
          font: 'inherit',
        },
      }),
    };
  };

  render() {
    const {
      classes,
      suggestions,
      isMulti,
      disabled,
      value,
      onChange,
      onFocus = noop,
      onBlur = noop,
      onKeyDown = noop,
      onInputChange = noop,
      placeholder,
      inputProps,
    } = this.props;

    return (
      <div className={classes.root}>
        <ReactSelect
          className={classNames({
            [classes.reactSelectContainerDisabled]: disabled,
          })}
          classes={classes}
          styles={this.getSelectStyles()}
          isDisabled={disabled}
          textFieldProps={{
            InputLabelProps: {
              shrink: true,
            },
            ...inputProps,
          }}
          options={suggestions}
          components={components}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          onInputChange={onInputChange}
          placeholder={placeholder}
          isMulti={isMulti}
          backspaceRemovesValue={true}
        />
      </div>
    );
  }
}

const autocompleteSuggestionProp = PropTypes.shape({
  value: PropTypes.string,
  label: PropTypes.string,
});

Autocomplete.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,

  placeholder: PropTypes.string.isRequired,
  isMulti: PropTypes.bool,
  disabled: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.oneOf(['']),
    autocompleteSuggestionProp,
    PropTypes.arrayOf(autocompleteSuggestionProp),
  ]).isRequired,
  suggestions: PropTypes.arrayOf(autocompleteSuggestionProp),
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  onInputChange: PropTypes.func,

  inputProps: PropTypes.shape({
    label: PropTypes.string.isRequired,
    error: PropTypes.bool,
    helperText: PropTypes.string,
  }),
};

export default withStyles(
  styles,
  { withTheme: true },
)(Autocomplete);
