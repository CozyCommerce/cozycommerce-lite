import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = async ({ children }: AdminLayoutProps) => {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    // If user is not an admin or not logged in, redirect to home page
    redirect("/");
  }

  return (
    <div>
      {/* We can add a shared admin sidebar or header here later */}
      <main>{children}</main>
    </div>
  );
};

export default AdminLayout;
