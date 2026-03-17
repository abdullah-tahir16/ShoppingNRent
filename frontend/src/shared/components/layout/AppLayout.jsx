import { Outlet, NavLink } from "react-router-dom";
import { useSession } from "../../../app/providers/SessionProvider";
import { useHealthQuery } from "../../../features/system/queries";
import { StatusBadge } from "../ui/StatusBadge";

const navItems = [
  { to: "/", label: "Journey", end: true },
  { to: "/marketplace", label: "Marketplace" },
  { to: "/studio", label: "Seller Studio" },
  { to: "/orders", label: "Orders" },
  { to: "/admin", label: "Admin" },
  { to: "/profile", label: "Profile" },
];

export function AppLayout() {
  const { hasUserSession, hasAdminSession, clearSessions, userSession } = useSession();
  const healthQuery = useHealthQuery();

  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
      <header className="mb-5 grid gap-4 lg:grid-cols-[1.4fr_0.9fr]">
        <section className="panel panel-padding">
          <p className="eyebrow">ShoppingNRent</p>
          <h1 className="mt-2 text-5xl font-bold tracking-[-0.08em] text-stone-950 md:text-7xl">
            Real React Frontend
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600 md:text-base">
            Structured with routes, containers, presentational components, React Query, Final Form, Zod, and Tailwind.
            It follows the actual backend flow rather than acting like a raw API playground.
          </p>
        </section>
        <section className="panel panel-padding">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="eyebrow">System</p>
              <h2 className="mt-2 text-xl font-semibold text-stone-950">Runtime Status</h2>
            </div>
            <StatusBadge tone={healthQuery.data?.success ? "success" : "danger"}>
              {healthQuery.data?.success ? "API Online" : "API Offline"}
            </StatusBadge>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">User Session</p>
              <p className="mt-2 text-sm font-medium text-stone-900">
                {hasUserSession ? `Connected as ${userSession.id}` : "Missing"}
              </p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Admin Session</p>
              <p className="mt-2 text-sm font-medium text-stone-900">{hasAdminSession ? "Connected" : "Missing"}</p>
            </div>
          </div>
          <button type="button" className="secondary-button mt-5 w-full" onClick={clearSessions}>
            Clear Sessions
          </button>
        </section>
      </header>

      <nav className="mb-5 flex flex-wrap gap-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            end={item.end}
            to={item.to}
            className={({ isActive }) =>
              isActive
                ? "rounded-2xl bg-clay-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-clay-600/20"
                : "rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm font-semibold text-stone-800 shadow-panel"
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
