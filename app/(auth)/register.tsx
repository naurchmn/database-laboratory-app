import AuthForm from "../../src/components/auth/AuthForm";
import AuthLayout from "../../src/components/auth/AuthLayout";

export default function Register() {
  return (
    <AuthLayout title="Create an Account" testID="register-screen">
      <AuthForm mode="register" />
    </AuthLayout>
  );
}
