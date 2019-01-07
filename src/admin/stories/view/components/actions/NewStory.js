import React, { Component, Fragment } from 'react';
import Button from '@material-ui/core/Button';

class NewStory extends Component {
  render() {
    return (
      <Fragment>
        <Button
          variant="contained"
          color="primary"
        >
          New
        </Button>
      </Fragment>
    );
  }
}

NewStory.propTypes = {
};

export default NewStory;
