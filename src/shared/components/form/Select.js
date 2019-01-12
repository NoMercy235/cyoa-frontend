import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import MuiSelect from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import FormControl from '@material-ui/core/FormControl';
import { TagModel } from '../../../admin/stories/domain/models/TagModel';

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

let id = 1;
function createTag(metadata) {
  return new TagModel({
    _id: id++,
    name: metadata.toLowerCase().replace(/\s/g, '_'),
    label: metadata,
  });
}

const tags = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
].map(createTag);

class Select extends Component {
  state = {
    selectedTags: [],
  };

  handleChange = e => {
    this.setState({ selectedTags: e.target.value });
    this.props.formikField.onChange(e);
  };

  render() {
    return (
      <FormControl className={this.props.className}>
        <InputLabel htmlFor="select-multiple-checkbox">{this.props.label}</InputLabel>
        <MuiSelect
          multiple
          value={this.state.selectedTags}
          onChange={this.handleChange}
          input={
            <Input
              id="select-multiple-checkbox"
              {...this.props.formikField}
            />
          }
          renderValue={selected => {
            return selected
              .map(s => {
                return tags.find(t => t.name === s);
              })
              .map(t => t.label)
              .join(', ');
          }}
          MenuProps={MenuProps}
        >
          {tags.map(tag => {
            return (
              <MenuItem key={tag._id} value={tag.name}>
                <Checkbox
                  checked={!!this.state.selectedTags.find(t => t === tag.name)}
                />
                <ListItemText primary={tag.label} />
              </MenuItem>
            );
          })}
        </MuiSelect>
      </FormControl>
    );
  }
}

Select.propTypes = {
  formikField: PropTypes.object.isRequired,
  label: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.shape(TagModel)),
  className: PropTypes.string,
};

export default Select;
