import { lazy, Suspense } from 'react';
import { createBrowserRouter, Outlet } from 'react-router';
import { PageShell } from '../components/ui/PageShell';

const Home = lazy(() => import('../pages/Home').then((m) => ({ default: m.Home })));
const Dashboard = lazy(() => import('../pages/Dashboard').then((m) => ({ default: m.Dashboard })));
const SessionSetup = lazy(() =>
  import('../pages/SessionSetup').then((m) => ({ default: m.SessionSetup })),
);
const SessionPage = lazy(() =>
  import('../pages/Session').then((m) => ({ default: m.SessionPage })),
);
const Summary = lazy(() => import('../pages/Summary').then((m) => ({ default: m.Summary })));

export const router = createBrowserRouter([
  {
    element: (
      <PageShell>
        <Suspense
          fallback={
            <p role="status" className="route-loading">
              Prepariamo il tuo spazio…
            </p>
          }
        >
          <Outlet />
        </Suspense>
      </PageShell>
    ),
    children: [
      { path: '/', element: <Home /> },
      { path: '/:subjectId', element: <Dashboard /> },
      { path: '/:subjectId/setup', element: <SessionSetup /> },
      { path: '/:subjectId/session', element: <SessionPage /> },
      { path: '/:subjectId/summary', element: <Summary /> },
    ],
  },
]);
