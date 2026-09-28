import { useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { LockKeyhole } from "lucide-react";
import axios from "axios";
import { apiBaseUrl } from "../../api/apiClient";
import { Button } from "./components/ui/Button";
import { FormField, TextInput } from "./components/ui/FormField";
import { isAdminSignedIn, setAdminSession } from "./auth/adminSession";
import logo from "../../assets/Logo.png";
import "./admin-theme.css";

// Only paths inside the admin panel may be returned to after sign-in.
const safeNext = (value) => (/^\/adminDashboard(\/|$|\?)/.test(value || "") ? value : "/adminDashboard");

// The admin panel's own sign-in. It has nothing to do with the shop's
// login: the session it creates is stored separately and only works here.
export const AdminLogin = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = safeNext(params.get("next"));
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(params.get("expired") ? "Your session ended. Please sign in again." : "");
  const [busy, setBusy] = useState(false);

  if (isAdminSignedIn()) return <Navigate to={next} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      // Plain request (no shop token, no guest cart) to the admin-only endpoint.
      const { data } = await axios.post(`${apiBaseUrl}/auth/admin/login`, form);
      setAdminSession({ token: data.token, user: data.user });
      navigate(next, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't sign in. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div className="zs-root flex min-h-screen items-center justify-center bg-zs-page px-4 py-10 font-body">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <img src={logo} alt="ZeeScents" className="h-12 w-12 rounded-xl object-contain invert" />
          <h1 className="zs-display mt-4 text-2xl font-semibold text-zs-charcoal">Admin sign in</h1>
          <p className="mt-1 text-sm text-zs-charcoal/55">ZeeScents store management</p>
        </div>

        <form onSubmit={submit} className="rounded-3xl border border-zs-beigeLine bg-white p-6 shadow-sm">
          {error ? (
            <p role="alert" className="mb-4 rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700">{error}</p>
          ) : null}
          <FormField label="Email" htmlFor="admin-email" required>
            <TextInput id="admin-email" type="email" autoComplete="username" required autoFocus value={form.email} onChange={set("email")} />
          </FormField>
          <FormField label="Password" htmlFor="admin-password" required>
            <TextInput id="admin-password" type="password" autoComplete="current-password" required value={form.password} onChange={set("password")} />
          </FormField>
          <Button type="submit" variant="primary" icon={LockKeyhole} loading={busy} className="mt-2 w-full justify-center">
            Sign in
          </Button>
        </form>

        <p className="mt-5 text-center text-xs text-zs-charcoal/50">
          Forgot your password? Use <a href="/" className="font-medium text-zs-gold underline">Forgot password</a> on the shop's sign-in, then come back here.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
