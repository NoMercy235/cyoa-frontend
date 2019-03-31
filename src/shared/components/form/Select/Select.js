import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import MuiSelect from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import { withStyles } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClearSelectIcon from './ClearSelectIcon';
import { Utils } from '@nomercy235/utils';

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
    this.handleChange({ target: { value, name: formikField.name }});
  };

  render() {
    const { className, label, items, formikField, helperText, classes, multiple } = this.props;
    const { selected } = this.state;

    return (
      <FormControl className={className}>
        <InputLabel htmlFor="select-multiple-checkbox">{label}</InputLabel>
        <MuiSelect
          multiple={multiple}
          value={selected}
          onChange={this.handleChange}
          input={
            <Input
              id="select-multiple-checkbox"
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
  className: PropTypes.string,
  multiple: PropTypes.bool,
  classes: PropTypes.object.isRequired,
};

export default withStyles(theme => ({
  helperText: {
    color: theme.palette.error.main,
  },
}))(Select);
