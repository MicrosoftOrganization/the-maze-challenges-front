import { useAuth } from "@/context/auth-context";
import { useThemeContext } from "@/context/theme-context";
import { Button } from "@components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import clsx from "clsx";
import { CiLight } from "react-icons/ci";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function WelcomePageHeader() {
  const { changeTheme } = useThemeContext();

  function handleChangeTheme(newTheme: "light" | "dark") {
    changeTheme(newTheme);
    document.documentElement.setAttribute("data-color-mode", newTheme);
  }

  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();
  const { pathname } = useLocation();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="w-full bg-white shadow-sm dark:bg-[var(--background)]">
      <div
        className={clsx("mx-auto flex max-w-7xl items-center px-6 py-2", {
          "justify-between": isAuthenticated,
          "justify-end": !isAuthenticated,
        })}
      >
        {isAuthenticated && (
          <div
            onClick={handleLogout}
            className={clsx(
              "cursor-pointer rounded-sm border bg-red-600 p-1 px-3 text-white transition-colors",
            )}
          >
            Logout
          </div>
        )}
        <div className="flex gap-3">
          {isAuthenticated && (
            <>
              <div className="hidden space-x-3 sm:block">
                <Link
                  to="/admin-leaderboard"
                  className={clsx({
                    hidden: pathname === "/admin-leaderboard",
                  })}
                >
                  <Button variant="outline">Leaderboard</Button>
                </Link>
                <Link to="/" className={clsx({ hidden: pathname === "/" })}>
                  <Button variant="outline">Evaluation Form</Button>
                </Link>
                <Link
                  to="/challenges"
                  className={clsx({ hidden: pathname === "/challenges" })}
                >
                  <Button variant="outline">Challenges</Button>
                </Link>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="block sm:hidden">
                  <Button
                    variant="outline"
                    className="cursor-pointer select-none"
                  >
                    Go to
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {pathname !== "/admin-leaderboard" && (
                    <DropdownMenuItem
                      onClick={() => navigate("/admin-leaderboard")}
                    >
                      Leaderboard
                    </DropdownMenuItem>
                  )}
                  {pathname !== "/" && (
                    <DropdownMenuItem onClick={() => navigate("/")}>
                      Evaluation Form
                    </DropdownMenuItem>
                  )}
                  {pathname !== "/challenges" && (
                    <DropdownMenuItem onClick={() => navigate("/challenges")}>
                      Challenges
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline">
                <CiLight />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end">
              <DropdownMenuItem onClick={() => handleChangeTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleChangeTheme("dark")}>
                Dark
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
