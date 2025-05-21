
import { useParams } from "react-router-dom";
import NoteEditor from "@/components/NoteEditor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const NoteEditPage = () => {
  const { noteId } = useParams();
  
  return (
    <div className="container py-6 max-w-4xl">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>{noteId ? "Edit Note" : "Create New Note"}</CardTitle>
        </CardHeader>
        <CardContent>
          <NoteEditor noteId={noteId} />
        </CardContent>
      </Card>
    </div>
  );
};

export default NoteEditPage;
