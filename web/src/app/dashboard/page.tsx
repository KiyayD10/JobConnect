import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { verifyToken } from "@/src/lib/auth"

export default function DashboardRoot() {
  const token = cookies().get("token")?.value
  if (!token) redirect("/auth/login")

  const user = verifyToken(token)
  if (!user) redirect("/auth/login")

  if (user.role === "JOBSEEKER") redirect("/dashboard/jobseeker")
  if (user.role === "EMPLOYER") redirect("/dashboard/employer")
  if (user.role === "ADMIN") redirect("/dashboard/admin")
}
