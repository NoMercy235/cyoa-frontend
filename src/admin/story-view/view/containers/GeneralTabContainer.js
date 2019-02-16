import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { StoryModel } from '../../../../infrastructure/models/StoryModel';
import GeneralTab from '../components/general/GeneralTab';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import styles from './GeneralTabContainer.module.scss';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import PublishBtn from '../components/general/PublishBtn';
import HelpCmp from '../../../../shared/components/help/HelpCmp';

class GeneralTabContainer extends Component {
  getTitle = () => {
    return (
      <Typography
        variant="h4"
        color="inherit"
      >
        {this.props.story.name}
        <HelpCmp title="hello" description="world"/>
      </Typography>
    );
  };

  render() {
    const { story } = this.props;

    return (
      <Card className={styles.container}>
        <CardHeader title={this.getTitle()}/>
        <CardContent>
          <GeneralTab story={story}/>
        </CardContent>
        <CardActions disableActionSpacing>
          <PublishBtn story={story}/>
        </CardActions>
      </Card>
    );
  }
}

GeneralTabContainer.propTypes = {
  story: PropTypes.shape(StoryModel).isRequired,
};

export default GeneralTabContainer;
