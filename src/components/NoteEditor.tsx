
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useNoteFolders } from "@/hooks/useNoteFolders";
import { useNoteTags } from "@/hooks/useNoteTags";
import { useNote } from "@/hooks/useNote";
import MarkdownEditor from "./notes/MarkdownEditor";
import NoteFolderSelect from "./notes/NoteFolderSelect";
import NoteTagSelector from "./notes/NoteTagSelector";
import NoteEditorToolbar from "./notes/NoteEditorToolbar";

interface NoteEditorProps {
  noteId?: string;
  isDumpNote?: boolean;
}

const NoteEditor = ({ noteId, isDumpNote = false }: NoteEditorProps) => {
  const { folders } = useNoteFolders();
  const { tags } = useNoteTags();
  const [tagToAdd, setTagToAdd] = useState<string>("");
  
  const {
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
  } = useNote(noteId, isDumpNote);

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
          <NoteEditorToolbar 
            isLoading={isLoading}
            onSave={isDumpNote ? createDumpNote : saveNote}
          />
        </div>
      </div>
      
      {!isDumpNote && (
        <div className="border-b p-4 bg-gray-50">
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Folder</label>
              <NoteFolderSelect 
                folders={folders} 
                selectedFolder={selectedFolder} 
                setSelectedFolder={setSelectedFolder} 
              />
            </div>
            
            <div className="w-full md:w-2/3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <NoteTagSelector
                tags={tags}
                selectedTags={selectedTags}
                tagToAdd={tagToAdd}
                setTagToAdd={setTagToAdd}
                addTag={addTag}
                removeTag={removeTag}
              />
            </div>
          </div>
        </div>
      )}
      
      <div className="flex-grow">
        <MarkdownEditor content={content} setContent={setContent} />
      </div>
    </div>
  );
};

export default NoteEditor;
