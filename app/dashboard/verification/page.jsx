import UserVerificationForm from "@/app/component/user/UserVerificationForm";

export const dynamic = "force-dynamic";

export default function VerificationPage() {
  return (
    <div className="container mx-auto py-8">
      <UserVerificationForm />
    </div>
  );
}
