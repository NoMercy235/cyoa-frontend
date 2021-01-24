import { ADMIN_PROFILE_ROUTE, ADMIN_ROUTE, ADMIN_STORY_VIEW_ROUTE, LANDING_ROUTE, READ_STORY_ROUTE } from './routes';

import HomeIcon from '@material-ui/icons/Home';
import ReadStoryIcon from '@material-ui/icons/ChromeReaderMode';
import AdminIcon from '@material-ui/icons/AccountCircle';
import ViewStoryIcon from '@material-ui/icons/Pageview';
import UserIcon from '@material-ui/icons/Face';

export const publicBreadcrumb = () => ({
  label: 'Home',
  path: LANDING_ROUTE,
  icon: HomeIcon,
});

export const storyReadBreadcrumb = () => ({
  label: 'Read story',
  path: READ_STORY_ROUTE,
  icon: ReadStoryIcon,
});

export const adminBreadcrumb = () => ({
  label: 'Admin',
  path: ADMIN_ROUTE,
  icon: AdminIcon,
});

export const storyViewBreadcrumb = () => ({
  label: storyViewStore => {
    return storyViewStore.currentStory.name;
  },
  path: ADMIN_STORY_VIEW_ROUTE,
  icon: ViewStoryIcon,
  shouldHaveFlexOne: true,
});

export const profileBreadcrumb = () => ({
  label: 'Profile',
  path: ADMIN_PROFILE_ROUTE,
  icon: UserIcon,
});
