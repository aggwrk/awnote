
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

interface Tag {
  id: string;
  name: string;
}

interface NoteTagSelectorProps {
  tags: Tag[];
  selectedTags: Tag[];
  tagToAdd: string;
  setTagToAdd: (tagId: string) => void;
  addTag: (tagId: string) => void;
  removeTag: (tagId: string) => void;
}

const NoteTagSelector = ({ 
  tags, 
  selectedTags, 
  tagToAdd, 
  setTagToAdd, 
  addTag, 
  removeTag 
}: NoteTagSelectorProps) => {
  return (
    <>
      <div className="flex-grow">
        <Select value={tagToAdd || undefined} onValueChange={addTag}>
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
    </>
  );
};

export default NoteTagSelector;
