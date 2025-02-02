import { Suspense, lazy } from "react";
import { useRoutes } from "react-router-dom";
import NotFoundPage from "./components/not-found";
import Protected from "./components/Protected";
import LoadingPageSpinner from "./components/LoadingPageSpinner";

const LoginPage = lazy(() => import("@/pages/login"));
const SubmissionFormPage = lazy(() => import("@/pages/submission-form"));
const AdminLeaderboardPage = lazy(() => import("@/pages/admin-leaderboard"));
const Shared = lazy(() => import("@/pages/layouts/shared"));
const ChallengeManagementPage = lazy(
  () => import("@/pages/challenge-management"),
);
const CreateChallengePage = lazy(() => import("@/pages/create-challenge"));
const EditChallengePage = lazy(() => import("@/pages/edit-challenge"));
const ChallengeDetailsPage = lazy(() => import("@/pages/challenge-details"));

export default function RenderedRoutes() {
  const routes = useRoutes([
    {
      path: "/",
      element: <Shared />,
      children: [
        {
          index: true,
          element: (
            <Protected>
              <Suspense fallback={<LoadingPageSpinner />}>
                <SubmissionFormPage />
              </Suspense>
            </Protected>
          ),
        },
        {
          path: "/admin-leaderboard",
          element: (
            <Protected>
              <Suspense fallback={<LoadingPageSpinner />}>
                <AdminLeaderboardPage />
              </Suspense>
            </Protected>
          ),
        },
        {
          path: "/challenges/:id",
          element: (
            <Protected>
              <Suspense fallback={<LoadingPageSpinner />}>
                <ChallengeDetailsPage />
              </Suspense>
            </Protected>
          ),
        },
        {
          path: "/challenges",
          element: (
            <Protected>
              <Suspense fallback={<LoadingPageSpinner />}>
                <ChallengeManagementPage />
              </Suspense>
            </Protected>
          ),
        },
        {
          path: "/challenges/new",
          element: (
            <Protected>
              <Suspense fallback={<LoadingPageSpinner />}>
                <CreateChallengePage />
              </Suspense>
            </Protected>
          ),
        },
        {
          path: "/edit/:id",
          element: (
            <Protected>
              <Suspense fallback={<LoadingPageSpinner />}>
                <EditChallengePage />
              </Suspense>
            </Protected>
          ),
        },
      ],
    },
    {
      path: "/login",
      element: (
        <Suspense fallback={<LoadingPageSpinner />}>
          <LoginPage />
        </Suspense>
      ),
    },

    // others
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ]);

  return <>{routes}</>;
}
