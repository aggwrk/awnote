
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Folder {
  id: string;
  name: string;
}

interface NoteFolderSelectProps {
  folders: Folder[];
  selectedFolder: string | null;
  setSelectedFolder: (folderId: string) => void;
}

const NoteFolderSelect = ({ folders, selectedFolder, setSelectedFolder }: NoteFolderSelectProps) => {
  return (
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
  );
};

export default NoteFolderSelect;
