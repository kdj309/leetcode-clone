import { createBrowserRouter } from 'react-router-dom';
import LeaderBoard from './Pages/LeaderBoard/LeaderBoard';
import { withProtected } from './Protected';
import { lazy, Suspense } from 'react';
import Loader from './UI/Loader';
const Home = lazy(() => import('./Pages/Home'));
const Problem = lazy(() => import('./Pages/Problem/Index'));
const SignIn = lazy(() => import('./Pages/SignIn/Index'));
const SignUp = lazy(() => import('./Pages/SignUp/Index'));

const ProtectedLeaderBoard = withProtected(LeaderBoard);

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<Loader />}>
        <Home />
      </Suspense>
    ),
  },
  {
    path: '/problems/:problemname',
    element: (
      <Suspense fallback={<Loader />}>
        <Problem />
      </Suspense>
    ),
  },
  {
    path: '/signin',
    element: (
      <Suspense fallback={<Loader />}>
        <SignIn />
      </Suspense>
    ),
  },
  {
    path: '/signup',
    element: (
      <Suspense fallback={<Loader />}>
        <SignUp />
      </Suspense>
    ),
  },
  {
    path: '/leaderboard',
    element: <ProtectedLeaderBoard />,
  },
]);
export default router;
