
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Edit, Folder } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface Note {
  id: string;
  title: string;
  content: string | null;
  created_at: string;
  updated_at: string;
  is_favorite: boolean | null;
  folder_id: string | null;
}

interface Folder {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
}

const NoteDetailPage = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState<Note | null>(null);
  const [folder, setFolder] = useState<Folder | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  
  useEffect(() => {
    if (noteId) {
      fetchNote(noteId);
    }
  }, [noteId]);
  
  const fetchNote = async (id: string) => {
    setLoading(true);
    try {
      // Fetch note details
      const { data: noteData, error: noteError } = await supabase
        .from("notes")
        .select("*")
        .eq("id", id)
        .single();
      
      if (noteError) throw noteError;
      
      if (noteData) {
        setNote(noteData);
        setIsFavorite(noteData.is_favorite || false);
        
        // Fetch folder if exists
        if (noteData.folder_id) {
          const { data: folderData, error: folderError } = await supabase
            .from("folders")
            .select("*")
            .eq("id", noteData.folder_id)
            .single();
          
          if (!folderError && folderData) {
            setFolder(folderData);
          }
        }
        
        // Fetch tags
        const { data: tagData, error: tagError } = await supabase
          .from("note_tags")
          .select("tags(*)")
          .eq("note_id", id);
        
        if (!tagError && tagData) {
          const noteTags = tagData.map(item => item.tags as Tag).filter(Boolean);
          setTags(noteTags);
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      navigate("/");
    } finally {
      setLoading(false);
    }
  };
  
  const toggleFavorite = async () => {
    if (!note) return;
    
    try {
      const newValue = !isFavorite;
      const { error } = await supabase
        .from("notes")
        .update({ is_favorite: newValue })
        .eq("id", note.id);
      
      if (error) throw error;
      
      setIsFavorite(newValue);
      toast({
        title: newValue ? "Added to favorites" : "Removed from favorites"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!note) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-bold">Note not found</h2>
          <Button className="mt-4" onClick={() => navigate("/")}>
            Back to Notes
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">{note.title}</h1>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleFavorite}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Star 
              className={`h-4 w-4 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} 
            />
          </Button>
          <Button 
            onClick={() => navigate(`/edit/${note.id}`)}
            title="Edit note"
          >
            <Edit className="h-4 w-4 mr-2" /> Edit
          </Button>
        </div>
      </div>
      
      <div className="border-b p-4">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span>
            Updated {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}
          </span>
          
          {folder && (
            <div className="flex items-center">
              <Folder className="h-4 w-4 mr-1" />
              {folder.name}
            </div>
          )}
        </div>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.map(tag => (
              <Badge key={tag.id} variant="secondary" onClick={() => navigate(`/tag/${tag.id}`)}>
                {tag.name}
              </Badge>
            ))}
          </div>
        )}
      </div>
      
      <div className="overflow-auto flex-grow p-6">
        <div className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeHighlight]}
          >
            {note.content || ''}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default NoteDetailPage;
