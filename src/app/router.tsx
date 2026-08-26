import { createHashRouter } from 'react-router-dom';
import { SiteLayout } from './layout';
import { ROUTES } from '@/shared/config';
import { HomePage } from '@/pages/home';
import { ThemesPage } from '@/pages/themes';
import { PapersPage } from '@/pages/papers';
import { BlogsPage } from '@/pages/blogs';
import { PeoplePage } from '@/pages/people';
import { JoinPage } from '@/pages/join';

/** Hash routing preserves the `#papers`-style links the design shipped with. */
export const router = createHashRouter([
  {
    path: ROUTES.home,
    element: <SiteLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'home/:feedFilter?', element: <HomePage /> },
      { path: 'themes', element: <ThemesPage /> },
      { path: 'papers', element: <PapersPage /> },
      { path: 'blogs', element: <BlogsPage /> },
      { path: 'people', element: <PeoplePage /> },
      { path: 'join', element: <JoinPage /> },
    ],
  },
]);
