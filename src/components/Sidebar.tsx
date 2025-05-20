
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Folder, Search, Tag, Plus, BookText, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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

const Sidebar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [folders, setFolders] = useState<Folder[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [foldersOpen, setFoldersOpen] = useState(true);
  const [tagsOpen, setTagsOpen] = useState(true);
  const [newFolderName, setNewFolderName] = useState("");
  const [newTagName, setNewTagName] = useState("");
  const [addingFolder, setAddingFolder] = useState(false);
  const [addingTag, setAddingTag] = useState(false);

  useEffect(() => {
    if (user) {
      fetchFolders();
      fetchTags();
    }
  }, [user]);

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

  const createFolder = async () => {
    if (!newFolderName.trim()) return;
    
    try {
      const { data, error } = await supabase
        .from("folders")
        .insert([{ name: newFolderName, user_id: user?.id }])
        .select();
      
      if (error) throw error;
      
      setFolders([...folders, data[0]]);
      setNewFolderName("");
      setAddingFolder(false);
      toast({
        title: "Folder created",
        description: `Folder "${newFolderName}" has been created`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const createTag = async () => {
    if (!newTagName.trim()) return;
    
    try {
      const { data, error } = await supabase
        .from("tags")
        .insert([{ name: newTagName, user_id: user?.id }])
        .select();
      
      if (error) throw error;
      
      setTags([...tags, data[0]]);
      setNewTagName("");
      setAddingTag(false);
      toast({
        title: "Tag created",
        description: `Tag "${newTagName}" has been created`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="w-64 bg-sidebar-background border-r border-sidebar-border h-full flex flex-col">
      <div className="p-4">
        <form onSubmit={handleSearch} className="mb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search notes..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
        
        <Button 
          variant="default" 
          className="w-full mb-4"
          onClick={() => navigate("/new")}
        >
          <Plus className="mr-2 h-4 w-4" /> New Note
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full mb-2"
          onClick={() => navigate("/")}
        >
          <BookText className="mr-2 h-4 w-4" /> All Notes
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full mb-4"
          onClick={() => navigate("/favorites")}
        >
          <Star className="mr-2 h-4 w-4" /> Favorites
        </Button>
      </div>
      
      <ScrollArea className="flex-1 px-4 pb-4">
        <Collapsible open={foldersOpen} onOpenChange={setFoldersOpen}>
          <div className="flex items-center justify-between mb-2">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="p-0 hover:bg-transparent">
                <Folder className="h-4 w-4 mr-2" />
                <span className="font-medium">Folders</span>
              </Button>
            </CollapsibleTrigger>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                setAddingFolder(!addingFolder);
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <CollapsibleContent>
            {addingFolder && (
              <div className="mb-2 flex items-center space-x-2">
                <Input
                  size={1}
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Folder name"
                  className="h-7 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") createFolder();
                    if (e.key === "Escape") setAddingFolder(false);
                  }}
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7" 
                  onClick={createFolder}
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
            
            {folders.map((folder) => (
              <Button
                key={folder.id}
                variant="ghost"
                className={`w-full justify-start text-sm mb-1 ${
                  location.pathname === `/folder/${folder.id}` ? "bg-accent" : ""
                }`}
                onClick={() => navigate(`/folder/${folder.id}`)}
              >
                {folder.name}
              </Button>
            ))}
          </CollapsibleContent>
        </Collapsible>
        
        <Collapsible open={tagsOpen} onOpenChange={setTagsOpen} className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="p-0 hover:bg-transparent">
                <Tag className="h-4 w-4 mr-2" />
                <span className="font-medium">Tags</span>
              </Button>
            </CollapsibleTrigger>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                setAddingTag(!addingTag);
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <CollapsibleContent>
            {addingTag && (
              <div className="mb-2 flex items-center space-x-2">
                <Input
                  size={1}
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Tag name"
                  className="h-7 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") createTag();
                    if (e.key === "Escape") setAddingTag(false);
                  }}
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7" 
                  onClick={createTag}
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
            
            {tags.map((tag) => (
              <Button
                key={tag.id}
                variant="ghost"
                className={`w-full justify-start text-sm mb-1 ${
                  location.pathname === `/tag/${tag.id}` ? "bg-accent" : ""
                }`}
                onClick={() => navigate(`/tag/${tag.id}`)}
              >
                {tag.name}
              </Button>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;
