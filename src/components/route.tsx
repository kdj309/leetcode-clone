import { createBrowserRouter } from 'react-router-dom';
import Home from './Pages/Home';
import ProblemsSet from './Pages/Problems';
import Problem from './Pages/Problem/Index';
import SignIn from './Pages/SignIn/Index';
import SignUp from './Pages/SignUp/Index';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/problems',
    element: <ProblemsSet />,
  },
  {
    path: '/problems/:problemname',
    element: <Problem />,
  },
  {
    path: '/signin',
    element: <SignIn />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
]);
export default router;
