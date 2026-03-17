import { createContext, useContext, useEffect, useMemo, useState } from "react";

const SessionContext = createContext(null);

function readStorage(key, fallback) {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : fallback;
}

export function SessionProvider({ children }) {
  const [userSession, setUserSessionState] = useState(() =>
    readStorage("snr:user-session", { token: "", id: "" })
  );
  const [adminSession, setAdminSessionState] = useState(() =>
    readStorage("snr:admin-session", { token: "" })
  );

  useEffect(() => {
    localStorage.setItem("snr:user-session", JSON.stringify(userSession));
  }, [userSession]);

  useEffect(() => {
    localStorage.setItem("snr:admin-session", JSON.stringify(adminSession));
  }, [adminSession]);

  const value = useMemo(
    () => ({
      userSession,
      adminSession,
      setUserSession(nextSession) {
        setUserSessionState((current) => ({ ...current, ...nextSession }));
      },
      setAdminSession(nextSession) {
        setAdminSessionState((current) => ({ ...current, ...nextSession }));
      },
      clearSessions() {
        setUserSessionState({ token: "", id: "" });
        setAdminSessionState({ token: "" });
      },
      hasUserSession: Boolean(userSession.token),
      hasAdminSession: Boolean(adminSession.token),
      hasDualSession: Boolean(userSession.token && adminSession.token),
    }),
    [adminSession, userSession]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within SessionProvider");
  }
  return context;
}
