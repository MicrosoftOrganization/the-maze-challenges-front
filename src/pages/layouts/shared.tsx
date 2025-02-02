import { Outlet } from "react-router-dom";
import WelcomePageHeader from "../../components/welcome-page-header";
import { useEffect } from "react";

export default function Shared() {
  useEffect(() => {
    if (document.documentElement.getAttribute("class") === "dark") {
      document.documentElement.setAttribute("data-color-mode", "dark");
    } else {
      document.documentElement.setAttribute("data-color-mode", "light");
    }
  }, []);

  return (
    <div className="min-h-full bg-slate-50 font-mulish dark:bg-[var(--background)]">
      <WelcomePageHeader />
      <Outlet />
    </div>
  );
}
