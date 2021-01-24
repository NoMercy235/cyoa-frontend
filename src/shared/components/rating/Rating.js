import React from 'react';
import * as PropTypes from 'prop-types';
import MUIRating from '@material-ui/lab/Rating';
import { makeStyles, Box } from '@material-ui/core';

const useStyles = makeStyles({
  rating: {
    display: 'flex',
    alignItems: 'center',
  },
});

export default function Rating ({ initialValue, max, labels, disabled, onChange }) {
  const [value, setValue] = React.useState(initialValue || -1);
  const [hover, setHover] = React.useState(-1);
  const classes = useStyles();

  return (
    <div className={classes.rating}>
      <MUIRating
        name="hover-feedback"
        value={value}
        max={max}
        disabled={disabled}
        onChange={(event, newValue) => {
          setValue(newValue);
          onChange(newValue);
        }}
        onChangeActive={(event, newHover) => {
          setHover(newHover);
        }}
      />
      {labels && value && (
        <Box ml={2}>
          {labels[hover !== -1 ? hover : value]}
        </Box>
      )}
    </div>
  );
}

Rating.propTypes = {
  initialValue: PropTypes.number,
  max: PropTypes.number,
  disabled: PropTypes.bool,
  labels: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};
