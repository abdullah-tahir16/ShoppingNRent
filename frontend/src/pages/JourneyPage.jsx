import { AdminLoginContainer } from "../features/auth/containers/AdminLoginContainer";
import { RegisterUserContainer } from "../features/auth/containers/RegisterUserContainer";
import { UserLoginContainer } from "../features/auth/containers/UserLoginContainer";

export function JourneyPage() {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <RegisterUserContainer />
      <div className="grid gap-5">
        <UserLoginContainer />
        <AdminLoginContainer />
      </div>
    </div>
  );
}
