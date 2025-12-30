import AuthLayout from "../../src/components/auth/AuthLayout";
import AuthForm from "../../src/components/auth/AuthForm";

export default function Register() {
  return (
    <AuthLayout title="Create an Account">
      <AuthForm mode="register" />
    </AuthLayout>
  );
}
