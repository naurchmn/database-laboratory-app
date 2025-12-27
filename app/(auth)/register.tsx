import AuthLayout from "@/components/auth/AuthLayout";
import AuthForm from "@/components/auth/AuthForm";

export default function Register() {
  return (
    <AuthLayout title="Create an Account">
      <AuthForm mode="register" />
    </AuthLayout>
  );
}
