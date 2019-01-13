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
    selected: [],
  };

  handleChange = e => {
    this.setState({ selected: e.target.value });
    this.props.formikField.onChange(e);
  };

  render() {
    const { className, label, items, formikField, helperText, classes } = this.props;

    return (
      <FormControl className={className}>
        <InputLabel htmlFor="select-multiple-checkbox">{label}</InputLabel>
        <MuiSelect
          multiple
          value={this.state.selected}
          onChange={this.handleChange}
          input={
            <Input
              id="select-multiple-checkbox"
              {...formikField}
              error={!!helperText}
            />
          }
          renderValue={selected => {
            return selected
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
                <Checkbox
                  checked={!!this.state.selected.find(t => t === item._id)}
                />
                <ListItemText primary={item.name} />
              </MenuItem>
            );
          })}
        </MuiSelect>
        <FormHelperText
          className={classes.helperText}
        >
          {helperText}
        </FormHelperText>
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
  classes: PropTypes.object.isRequired,
};

export default withStyles(theme => ({
  helperText: {
    color: theme.palette.error.main,
  },
}))(Select);
