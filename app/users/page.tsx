import prisma from "@/libs/prismadb";
import { getServerSession } from "next-auth";
import NavBar from "../components/NavBar";
import { authOptions } from "../utils/auth-options";
import AddUserForm from "./components/AddUserForm";
import DeleteUserForm from "./components/DeleteUserForm";

// for user crud
export default async function Users() {
  const { user } = (await getServerSession(authOptions)) as any;

  if (user.role !== "ADMIN") {
    return <div>Forbidden</div>;
  }

  const users = await prisma.user.findMany();

  return (
    <div className="flex flex-col items-stretch h-screen">
      <NavBar />

      <main
        className="container mx-auto px-4 py-8 overflow-y-auto"
        // minus the height of the navbar
        style={{ height: "calc(100vh - 4rem)" }}
      >
        <div className="flex justify-between items-center pb-4 mx-auto">
          <p className="text-lg font-semibold">Akun</p>
          <div className="flex items-center space-x-2">
            {/* <button className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
              Tambah
            </button> */}

            <AddUserForm />
          </div>
        </div>

        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="rounded-lg text-sm font-semibold text-gray-700">
              <th className="px-4 py-2 bg-gray-200">Username</th>
              <th className="px-4 py-2 bg-gray-200">Role</th>
              <th className="px-4 py-2 bg-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm font-normal text-gray-700">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-100 border-b border-gray-200"
              >
                <td className="px-4 py-3 text-center">{user.username}</td>
                <td className="px-4 py-3 text-center">{user.role}</td>
                <td className="px-4 py-3 text-center space-x-2">
                  <AddUserForm key={"edit_" + user.id} user={user} />
                  <DeleteUserForm key={"delete_" + user.id} user={user} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
