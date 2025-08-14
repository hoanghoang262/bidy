import ForgotPasswordForm from "../../components/ui/ForgotPasswordForm";
import AuthLayout from "@/components/ui/AuthLayout";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Quên mật khẩu?"
      subtitle="Nhập địa chỉ email của bạn để nhận hướng dẫn đặt lại mật khẩu"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
