import { auth } from "@/auth";
import { getUsers } from "@/lib/users-query";
import { UserAccessClient } from "@/components/users/UserAccessClient";

export default async function UsersPage() {
  const session = await auth();
  const users = await getUsers();

  return <UserAccessClient users={users} currentUserId={session!.user.id} />;
}
