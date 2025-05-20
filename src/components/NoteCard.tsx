
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface NoteCardProps {
  note: {
    id: string;
    title: string;
    content: string | null;
    created_at: string;
    updated_at: string;
    is_favorite: boolean | null;
  };
  onUpdate: () => void;
}

const NoteCard = ({ note, onUpdate }: NoteCardProps) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(note.is_favorite || false);
  const createdAt = new Date(note.updated_at || note.created_at);
  
  // Get a short preview of the content
  const contentPreview = note.content 
    ? note.content.replace(/[#*`]/g, '').slice(0, 100) + (note.content.length > 100 ? '...' : '')
    : '';
  
  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      const newValue = !isFavorite;
      const { error } = await supabase
        .from("notes")
        .update({ is_favorite: newValue })
        .eq("id", note.id);
      
      if (error) throw error;
      
      setIsFavorite(newValue);
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow" 
      onClick={() => navigate(`/note/${note.id}`)}
    >
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium line-clamp-1">{note.title}</h3>
          <button 
            className="text-gray-400 hover:text-yellow-400 transition-colors"
            onClick={toggleFavorite}
          >
            <Star className={`h-5 w-5 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
          </button>
        </div>
        <p className="text-muted-foreground text-sm mt-2 line-clamp-3">{contentPreview}</p>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        {formatDistanceToNow(createdAt, { addSuffix: true })}
      </CardFooter>
    </Card>
  );
};

export default NoteCard;
