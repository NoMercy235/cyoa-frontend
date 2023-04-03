# Rigamo

Rigamo brings some much needed attention to the world of stories told in the "choose your own adventure" style. Besides the usual ability to read such stories, Rigamo also allows its users to because authors and write something themselves.

## The Time Travelers Anonymous team

This whole idea started from the adventurous group of travelers founded on [Habitica](https://habitica.com/) and lead by the mighty warrior, Tuesday.

#### Disclaimer

I started this project as a means to have some sort of "portofolio" which shows some of the technologies I've dealt with, and the way I structure/build things. Therefore, it will almost always be a work in progress, since it mostly serves as a place for me to test out new technologies/architectures/stuff.

#### Technologies used
- Technologies: React, Express, Docker, Socket.IO
- Languages: JavaScript, Bash
- Others: [MobX](https://mobx.js.org/README.html) (State management), [Material UI](http://material-ui.com/) (Design System), [Formik](https://github.com/jaredpalmer/formik) (Form management), [Jest](https://jestjs.io/) (E2E testing)

#### Bragging points
- Progressive Web App with support for client-side caching and offline capabilities (read stories offline after you download them) using Service Workers (through Workbox) and IndexedDB
- Optimize for mobile usage and discovery (responisve layout, 100% accessibility and 92% SEO score on Lighthouse, compressed everything as much as possible to keep the bundle size small)
- Email verification on registering + Password reset
- Cross-tab communication with BroadcastChannel API
- Cloud/Local progress saving on stories
- Easy deployment through Docker (containers for frotend, backend and database)
- HTTPS support (HTTP connections are automatically redirected to HTTPS) with automatic SSL generation (when it expires)
- Nginx setup and sub-domain configuration (`https://rigamo.xyz` for the app and `https://api.rigamo.xyz` for API calls)
