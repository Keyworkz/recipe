import { Link, NavLink } from "react-router-dom";
import { Plus } from "lucide-react";
import Button from "./Button.jsx";

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-50">
      <header className="border-b border-gray-800/90 bg-gray-950/95">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link
            to="/"
            className="text-sm font-semibold tracking-normal text-gray-100 transition hover:text-white"
            aria-label="Recipe Vault home"
          >
            Recipe Vault
          </Link>
          <nav className="flex items-center gap-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                [
                  "rounded-md px-3 py-2 text-sm font-medium transition",
                  isActive
                    ? "text-gray-50"
                    : "text-gray-400 hover:bg-gray-900 hover:text-gray-100",
                ].join(" ")
              }
            >
              Recipes
            </NavLink>
            <Button to="/new" size="sm">
              <Plus className="h-4 w-4" aria-hidden="true" />
              New
            </Button>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 lg:py-14">
        {children}
      </main>
    </div>
  );
}
