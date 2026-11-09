import '@fontsource/unbounded/700.css';
import '@fontsource/unbounded/900.css';
import '@fontsource/sora/400.css';
import '@fontsource/sora/600.css';
import '@fontsource/sora/700.css';
import '@fontsource/martian-mono/400.css';
import '@fontsource/martian-mono/700.css';
import './styles/fonts.css';
import './styles/tokens.css';
import './styles/app.css';
import './styles/system-fx.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Outlet,
  RouterProvider,
  createHashHistory,
  createRootRoute,
  createRoute,
  createRouter,
  useRouterState,
} from '@tanstack/react-router';
import { MotionConfig, motion } from 'motion/react';
import { registerSW } from 'virtual:pwa-register';
import { loadManifest } from './character/manifest';
import { SYSTEM } from './data/strings';
import { installDevTools } from './dev/seed';
import { ParticleField } from './ui/ParticleField';
import { Dashboard } from './routes/dashboard/Dashboard';
import { GateView } from './routes/gate/GateView';
import { Profile } from './routes/profile/Profile';
import { Settings } from './routes/settings/Settings';
import { initGithubSync } from './store/githubSync';
import { initSync } from './store/sync';
import { useWatchers } from './store/watchers';

/** Root shell: watchers (Sanctuary back-fill) run on every route. Each route fades
 *  up on entry — keyed by pathname so navigation re-runs the entrance (no exit flash). */
function Shell() {
  useWatchers();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <>
      <ParticleField />
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        <Outlet />
      </motion.div>
    </>
  );
}

const rootRoute = createRootRoute({ component: Shell });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Dashboard,
});

const gateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/gate/$sessionId',
  // optional ?date=YYYY-MM-DD lets you open/edit a previous day's gate (shifts move)
  validateSearch: (search: Record<string, unknown>): { date?: string } => {
    const date = search.date;
    return typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date) ? { date } : {};
  },
  component: GateView,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: Profile,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: Settings,
});

const hashHistory = createHashHistory();

const router = createRouter({
  routeTree: rootRoute.addChildren([indexRoute, gateRoute, profileRoute, settingsRoute]),
  history: hashHistory,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const updateSW = registerSW({
  onNeedRefresh() {
    if (window.confirm(SYSTEM.update)) void updateSW(true);
  },
});

async function boot() {
  await loadManifest(); // tiers are required before first render (theme + reducer config)
  installDevTools();
  initSync(); // Supabase backend if configured
  initGithubSync(); // GitHub cloud sync
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <MotionConfig reducedMotion="user">
        <RouterProvider router={router} />
      </MotionConfig>
    </StrictMode>,
  );
}

void boot();
