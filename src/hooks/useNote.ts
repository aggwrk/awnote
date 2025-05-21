import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import type { Tag } from "./useNoteTags";

export interface Note {
  id?: string;
  title: string;
  content: string;
  folder_id: string | null;
}

export const useNote = (noteId?: string, isDumpNote: boolean = false) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (user && noteId) {
      fetchNote(noteId);
    }
  }, [user, noteId]);

  const fetchNote = async (id: string) => {
    setIsLoading(true);
    try {
      // Fetch note details
      const { data: note, error: noteError } = await supabase
        .from("notes")
        .select("*")
        .eq("id", id)
        .single();
      
      if (noteError) throw noteError;
      
      if (note) {
        setTitle(note.title);
        setContent(note.content || "");
        setSelectedFolder(note.folder_id);
      }
      
      // Fetch note tags
      const { data: noteTags, error: tagError } = await supabase
        .from("note_tags")
        .select("tags(*)")
        .eq("note_id", id);
      
      if (tagError) throw tagError;
      
      if (noteTags) {
        const tagList = noteTags.map(item => item.tags as Tag).filter(Boolean);
        setSelectedTags(tagList);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveNote = async () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      let savedNoteId = noteId;
      
      // Convert "none" folder selection to null
      const folderIdToSave = selectedFolder === "none" ? null : selectedFolder;
      
      if (noteId) {
        // Update existing note
        const { error } = await supabase
          .from("notes")
          .update({
            title,
            content,
            folder_id: isDumpNote ? null : folderIdToSave,
            updated_at: new Date().toISOString()
          })
          .eq("id", noteId);
        
        if (error) throw error;
      } else {
        // Create new note
        const { data, error } = await supabase
          .from("notes")
          .insert([{
            title,
            content,
            user_id: user?.id,
            folder_id: isDumpNote ? null : folderIdToSave
          }])
          .select();
        
        if (error) throw error;
        
        savedNoteId = data[0].id;
      }
      
      // Handle tags only if not a dump note
      if (savedNoteId && !isDumpNote) {
        // First remove all existing tags
        await supabase
          .from("note_tags")
          .delete()
          .eq("note_id", savedNoteId);
        
        // Then add new tags
        if (selectedTags.length > 0) {
          const tagLinks = selectedTags.map(tag => ({
            note_id: savedNoteId,
            tag_id: tag.id
          }));
          
          const { error } = await supabase
            .from("note_tags")
            .insert(tagLinks);
          
          if (error) throw error;
        }
      }
      
      toast({
        title: "Success",
        description: "Note saved successfully"
      });
      
      // Navigate back to note view or notes list
      if (savedNoteId) {
        navigate(`/note/${savedNoteId}`);
      } else {
        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createDumpNote = async () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // Create new dump note with no folder or tags
      const { data, error } = await supabase
        .from("notes")
        .insert([{
          title,
          content,
          user_id: user?.id,
          folder_id: null
        }])
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Dump note created successfully"
      });
      
      // Navigate back to dump notes view
      navigate("/dump");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteNote = async () => {
    if (!noteId || !confirm("Are you sure you want to delete this note?")) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", noteId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Note deleted successfully"
      });
      
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    title,
    setTitle,
    content,
    setContent,
    selectedFolder,
    setSelectedFolder,
    selectedTags,
    setSelectedTags,
    isLoading,
    saveNote,
    createDumpNote,
    deleteNote
  };
};
