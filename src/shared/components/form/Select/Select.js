import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import {
  withStyles,
  Checkbox,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  ListItemText,
  MenuItem,
  Select as MuiSelect,
} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { Utils } from '@nomercy235/utils';
import classNames from 'classnames';

import ClearSelectIcon from './ClearSelectIcon';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 6 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

class Select extends Component {
  state = {
    selected: this.props.formikField.value,
  };

  handleChange = e => {
    this.setState({ selected: e.target.value });
    this.props.formikField.onChange(e);
  };

  onClear = () => {
    const { formikField, multiple } = this.props;
    const value = multiple ? [] : '';
    this.handleChange({ target: { value, name: formikField.name } });
  };

  static getDerivedStateFromProps(nextProps){
    return { selected: nextProps.formikField.value };
  }

  render() {
    const {
      classes,
      className,
      label,
      items,
      disabled,
      formikField,
      helperText,
      multiple,
      fullWidth,
    } = this.props;
    const { selected } = this.state;

    return (
      <FormControl
        className={classNames(className, {
          [classes.fullWidth]: fullWidth,
        })}
      >
        <InputLabel htmlFor={`select-${label}`}>{label}</InputLabel>
        <MuiSelect
          multiple={multiple}
          value={selected}
          onChange={this.handleChange}
          input={
            <Input
              classes={{ disabled: classes.fieldDisabled }}
              disabled={disabled}
              {...formikField}
              error={!!helperText}
            />
          }
          IconComponent={
            Utils.safeAccess(selected, 'length')
              ? () => <ClearSelectIcon onClick={this.onClear} />
              : ArrowDropDownIcon
          }
          renderValue={selectedItems => {
            if (!Array.isArray(selectedItems)) {
              return items.find(t => t._id === selectedItems).name;
            }
            return selectedItems
              .map(s => {
                return items.find(t => t._id === s);
              })
              .map(t => t.name)
              .join(', ');
          }}
          MenuProps={MenuProps}
        >
          {items.map(item => {
            return (
              <MenuItem key={item._id} value={item._id}>
                {multiple && <Checkbox
                  checked={!!selected.find(t => t === item._id)}
                />}
                <ListItemText primary={item.name} />
              </MenuItem>
            );
          })}
        </MuiSelect>
        {helperText && (
          <FormHelperText
            className={classes.helperText}
          >
            {helperText}
          </FormHelperText>
        )}
      </FormControl>
    );
  }
}

Select.propTypes = {
  formikField: PropTypes.object.isRequired,
  label: PropTypes.string,
  helperText: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
  })),
  disabled: PropTypes.bool,
  className: PropTypes.string,
  multiple: PropTypes.bool,
  fullWidth: PropTypes.bool,
  classes: PropTypes.object.isRequired,
};

export default withStyles(theme => ({
  helperText: {
    color: theme.palette.error.main,
  },
  fieldDisabled: {
    backgroundColor: 'rgba(0,0,0,0.06)',
    '&:hover': {
      cursor: 'not-allowed',
    },
  },
  fullWidth: {
    width: '100%',
  },
}))(Select);
