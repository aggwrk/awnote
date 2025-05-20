
import { useState, useEffect } from "react";
import { useParams, useSearchParams, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import NoteCard from "@/components/NoteCard";

interface Note {
  id: string;
  title: string;
  content: string | null;
  created_at: string;
  updated_at: string;
  is_favorite: boolean | null;
}

const NotesPage = () => {
  const { user } = useAuth();
  const { folderId, tagId } = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q');
  
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("All Notes");

  const isFavorites = location.pathname === "/favorites";

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user, folderId, tagId, isFavorites, searchQuery]);

  useEffect(() => {
    // Set the page title based on the current view
    if (folderId) {
      fetchFolderName(folderId);
    } else if (tagId) {
      fetchTagName(tagId);
    } else if (isFavorites) {
      setTitle("Favorite Notes");
    } else if (searchQuery) {
      setTitle(`Search results for "${searchQuery}"`);
    } else {
      setTitle("All Notes");
    }
  }, [folderId, tagId, isFavorites, searchQuery]);

  const fetchFolderName = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("folders")
        .select("name")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      if (data) setTitle(`Folder: ${data.name}`);
    } catch (error) {
      console.error("Error fetching folder name:", error);
    }
  };

  const fetchTagName = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("tags")
        .select("name")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      if (data) setTitle(`Tag: ${data.name}`);
    } catch (error) {
      console.error("Error fetching tag name:", error);
    }
  };

  const fetchNotes = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("notes")
        .select("*");
      
      if (folderId) {
        query = query.eq("folder_id", folderId);
      }
      
      if (tagId) {
        const { data: noteIds } = await supabase
          .from("note_tags")
          .select("note_id")
          .eq("tag_id", tagId);
        
        if (noteIds && noteIds.length > 0) {
          query = query.in("id", noteIds.map(item => item.note_id));
        } else {
          setNotes([]);
          setLoading(false);
          return;
        }
      }
      
      if (isFavorites) {
        query = query.eq("is_favorite", true);
      }
      
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
      }
      
      const { data, error } = await query
        .order("updated_at", { ascending: false });
      
      if (error) throw error;
      setNotes(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : notes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map(note => (
            <NoteCard key={note.id} note={note} onUpdate={fetchNotes} />
          ))}
        </div>
      ) : (
        <div className="text-center p-8">
          <div className="text-muted-foreground">No notes found</div>
        </div>
      )}
    </div>
  );
};

export default NotesPage;
