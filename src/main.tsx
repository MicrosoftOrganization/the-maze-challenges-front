import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "sonner";
import App from "./App.tsx";
import { LoadingPageImages } from "./components/LoadingPageImages.tsx";
import ThemeContextProvider from "./context/ThemeProvider.tsx";
import "./index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeContextProvider>
        <Toaster position="bottom-right" richColors />
        <ReactQueryDevtools initialIsOpen={false} />
        <Suspense fallback={<LoadingPageImages />}>
          <App />
        </Suspense>
      </ThemeContextProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
