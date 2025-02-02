export default function LoadingPageSpinner() {
  return (
    <div className="dark:[rgba(222.2 84% 4.9%)] fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-opacity-90">
      <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-gray-900 dark:border-gray-100"></div>
    </div>
  );
}
