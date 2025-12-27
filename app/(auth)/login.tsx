import AuthLayout from "../../src/components/auth/AuthLayout";
import AuthForm from "../../src/components/auth/AuthForm";

export default function Login() {
  return (
    <AuthLayout title="Welcome Back">
      <AuthForm mode="login" />
    </AuthLayout>
  );
}
