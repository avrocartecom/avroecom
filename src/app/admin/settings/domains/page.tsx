import { redirect } from "next/navigation";

export default function DomainsRedirectPage() {
  redirect("/admin/settings");
}
