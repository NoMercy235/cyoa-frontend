import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import {
  Divider,
  Tooltip,
  Typography,
  withStyles,
} from '@material-ui/core';

import { publicUserService } from '../../../../../infrastructure/services/UserService';
import { PROFILE_PIC_SIZE_SM } from '../../../../../shared/constants/profile';
import LoadingCmp from '../../../../../shared/components/loading/LoadingCmp';

import { styles } from './AuthorSummary.css';

class AuthorSummary extends Component {
  state = {
    canRender: false,
    overview: {},
    picture: '',
  };

  getProfilePicture = async () => {
    const { authorId } = this.props;
    const { profile } = this.state;

    if (profile) return ;

    const { profile: authorProfile } = await publicUserService.getProfilePicture(authorId);
    const overview = await publicUserService.getUserOverview(authorId);
    this.setState({
      canRender: true,
      overview,
      profile: authorProfile,
    });
  };

  renderSummary = () => {
    const { classes, authorName } = this.props;
    const {
      canRender,
      profile,
      overview: {
        storiesWritten,
        user,
      },
    } = this.state;

    if (!canRender) {
      return <LoadingCmp className={classes.loading}/>;
    }

    return (
      <div className={classes.tooltipContentContainer}>
        <img
          alt={`Profile: ${authorName}`}
          style={PROFILE_PIC_SIZE_SM}
          src={profile}
        />
        <div className={classes.authorNameContainer}>
          <Typography>
            {authorName}
          </Typography>
          <Divider className={classes.divider} />
          <div>Joined on: {user.createdAtShort}</div>
          <div>Email: {user.email}</div>
          <div>Stories written: {storiesWritten}</div>
        </div>
      </div>
    );
  };

  render () {
    const { classes, authorName } = this.props;
    return (
      <Tooltip
        placement="bottom-start"
        classes={{ tooltip: classes.tooltip }}
        title={this.renderSummary()}
        onOpen={this.getProfilePicture}
      >
        <b className={classes.authorName}>{authorName}</b>
      </Tooltip>
    );
  }
}

AuthorSummary.propTypes = {
  classes: PropTypes.object.isRequired,
  authorId: PropTypes.string.isRequired,
  authorName: PropTypes.string.isRequired,
};

export default withStyles(styles)(AuthorSummary);
