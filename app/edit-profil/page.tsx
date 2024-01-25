import NavBar from "@/app/components/NavBar";
import CardUser from "./components/CardUser";
import ChangePasswordForm from "./components/ChangePasswordForm";
import EditProfilForm from "./components/EditProfilForm";

export default function EditProfil() {
  return (
    <div className="flex flex-col items-stretch h-screen">
      <NavBar />

      <main
        className="container mx-auto px-4 py-8 overflow-y-auto"
        // minus the height of the navbar
        style={{ height: "calc(100vh - 4rem)" }}
      >
        <div className="flex flex-col gap-8 md:flex-row">
          <CardUser className="basis-full md:basis-1/3 h-fit" />
          <div className="basis-2/3">
            <EditProfilForm />
            <ChangePasswordForm className="mt-8" />
          </div>
        </div>
      </main>
    </div>
  );
}
