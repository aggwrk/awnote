
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Save, Trash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";

type Folder = {
  id: string;
  name: string;
};

type Tag = {
  id: string;
  name: string;
};

interface NoteEditorProps {
  noteId?: string;
}

const NoteEditor = ({ noteId }: NoteEditorProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [tagToAdd, setTagToAdd] = useState<string>("");
  const [folders, setFolders] = useState<Folder[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");
  const isNewNote = !noteId;

  useEffect(() => {
    if (user) {
      fetchFolders();
      fetchTags();
      
      if (noteId) {
        fetchNote(noteId);
      }
    }
  }, [user, noteId]);

  const fetchFolders = async () => {
    try {
      const { data, error } = await supabase
        .from("folders")
        .select("*")
        .order("name");
      
      if (error) throw error;
      setFolders(data || []);
    } catch (error: any) {
      console.error("Error fetching folders:", error.message);
    }
  };

  const fetchTags = async () => {
    try {
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .order("name");
      
      if (error) throw error;
      setTags(data || []);
    } catch (error: any) {
      console.error("Error fetching tags:", error.message);
    }
  };

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
      
      if (noteId) {
        // Update existing note
        const { error } = await supabase
          .from("notes")
          .update({
            title,
            content,
            folder_id: selectedFolder,
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
            folder_id: selectedFolder
          }])
          .select();
        
        if (error) throw error;
        
        savedNoteId = data[0].id;
      }
      
      // Handle tags
      if (savedNoteId) {
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

  const addTag = (tagId: string) => {
    if (!tagId) return;
    
    const tagToAdd = tags.find(t => t.id === tagId);
    if (tagToAdd && !selectedTags.some(t => t.id === tagId)) {
      setSelectedTags([...selectedTags, tagToAdd]);
      setTagToAdd("");
    }
  };

  const removeTag = (tagId: string) => {
    setSelectedTags(selectedTags.filter(tag => tag.id !== tagId));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4 flex justify-between items-center">
        <Input
          className="text-xl font-medium border-none focus-visible:ring-0 p-0 w-auto flex-grow"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
        />
        <div className="flex items-center space-x-2">
          {noteId && (
            <Button 
              variant="outline" 
              size="icon" 
              onClick={deleteNote}
              disabled={isLoading}
            >
              <Trash className="h-4 w-4 text-destructive" />
            </Button>
          )}
          <Button 
            onClick={saveNote}
            disabled={isLoading}
          >
            <Save className="mr-2 h-4 w-4" /> Save
          </Button>
        </div>
      </div>
      
      <div className="border-b p-4">
        <div className="flex flex-wrap gap-2 mb-2">
          <div className="flex-shrink-0">
            <Select value={selectedFolder || ''} onValueChange={setSelectedFolder}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select folder" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No folder</SelectItem>
                {folders.map(folder => (
                  <SelectItem key={folder.id} value={folder.id}>{folder.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-grow">
            <Select value={tagToAdd} onValueChange={addTag}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Add tags" />
              </SelectTrigger>
              <SelectContent>
                {tags
                  .filter(tag => !selectedTags.some(t => t.id === tag.id))
                  .map(tag => (
                    <SelectItem key={tag.id} value={tag.id}>{tag.name}</SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-2">
          {selectedTags.map(tag => (
            <Badge key={tag.id} variant="secondary" className="flex items-center gap-1">
              {tag.name}
              <button 
                onClick={() => removeTag(tag.id)} 
                className="ml-1 h-3 w-3 rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col">
        <TabsList className="mx-4 mt-4 justify-start">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="edit" className="flex-grow p-4 pt-0 mt-0">
          <Textarea
            className="h-full font-mono resize-none p-4"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type markdown content here..."
          />
        </TabsContent>
        
        <TabsContent value="preview" className="flex-grow p-4 pt-0 mt-0 overflow-auto">
          <div className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none p-4">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeHighlight]}
            >
              {content}
            </ReactMarkdown>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NoteEditor;
