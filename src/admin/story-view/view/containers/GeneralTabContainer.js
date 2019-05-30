import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { StoryModel } from '../../../../infrastructure/models/StoryModel';
import GeneralTab from '../components/general/GeneralTab';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import styles from './GeneralTabContainer.module.scss';
import Card from '@material-ui/core/Card';
import PublishBtn from '../components/general/PublishBtn';
import { renderGeneralTitle } from '../components/general/GeneralTitle';

class GeneralTabContainer extends Component {
  render() {
    const { story } = this.props;

    return (
      <Card className={styles.container}>
        <CardHeader title={renderGeneralTitle(story)}/>
        <CardContent className={styles.content}>
          <GeneralTab story={story}/>
        </CardContent>
        <CardActions disableSpacing>
          <PublishBtn story={story}/>
        </CardActions>
      </Card>
    );
  }
}

GeneralTabContainer.propTypes = {
  story: PropTypes.instanceOf(StoryModel).isRequired,
};

export default GeneralTabContainer;
