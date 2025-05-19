
import { useAuth } from "@/context/AuthContext";
import LogoutButton from "@/components/LogoutButton";

const Index = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">NoteNest</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {user?.email}
          </span>
          <LogoutButton />
        </div>
      </header>
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Welcome to your Notes</h2>
            <p className="text-xl text-gray-600 mb-8">
              Create, organize, and manage your notes efficiently
            </p>
            <div className="bg-white rounded-lg shadow-md p-8">
              <p className="text-gray-700">
                Your notes will appear here. Start by creating your first note!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
