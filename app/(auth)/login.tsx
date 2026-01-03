import AuthForm from "../../src/components/auth/AuthForm";
import AuthLayout from "../../src/components/auth/AuthLayout";

export default function Login() {
  return (
    <AuthLayout title="Welcome Back" testID="login-screen">
      <AuthForm mode="login" />
    </AuthLayout>
  );
}
