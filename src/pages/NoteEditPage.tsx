
import { useParams } from "react-router-dom";
import NoteEditor from "@/components/NoteEditor";

const NoteEditPage = () => {
  const { noteId } = useParams();
  
  // We pass noteId to NoteEditor, which will be undefined for /new route
  return <NoteEditor noteId={noteId} />;
};

export default NoteEditPage;
