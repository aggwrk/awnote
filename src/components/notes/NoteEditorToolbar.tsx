
import { Button } from "@/components/ui/button";
import { Save, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NoteEditorToolbarProps {
  isLoading: boolean;
  onSave: () => void;
}

const NoteEditorToolbar = ({ isLoading, onSave }: NoteEditorToolbarProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center space-x-2">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Back
      </Button>
      
      <Button 
        size="sm"
        onClick={onSave}
        disabled={isLoading}
        className="ml-auto"
      >
        <Save className="h-4 w-4 mr-1" /> Save
      </Button>
    </div>
  );
};

export default NoteEditorToolbar;
