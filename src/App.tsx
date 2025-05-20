
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import NotesPage from "@/pages/NotesPage";
import NoteDetailPage from "@/pages/NoteDetailPage";
import NoteEditPage from "@/pages/NoteEditPage";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<NotesPage />} />
              <Route path="/favorites" element={<NotesPage />} />
              <Route path="/folder/:folderId" element={<NotesPage />} />
              <Route path="/tag/:tagId" element={<NotesPage />} />
              <Route path="/search" element={<NotesPage />} />
              <Route path="/note/:noteId" element={<NoteDetailPage />} />
              <Route path="/new" element={<NoteEditPage />} />
              <Route path="/edit/:noteId" element={<NoteEditPage />} />
            </Route>
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
