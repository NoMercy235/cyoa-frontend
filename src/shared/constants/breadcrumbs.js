import { ADMIN_ROUTE, ADMIN_STORY_VIEW_ROUTE, LANDING_ROUTE, READ_STORY_ROUTE } from './routes';
import HomeIcon from '@material-ui/icons/Home';
import ReadStoryIcon from '@material-ui/icons/ChromeReaderMode';
import AdminIcon from '@material-ui/icons/AccountCircle';
import ViewStoryIcon from '@material-ui/icons/Pageview';

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
  label: 'Story Details',
  path: ADMIN_STORY_VIEW_ROUTE,
  icon: ViewStoryIcon,
});
