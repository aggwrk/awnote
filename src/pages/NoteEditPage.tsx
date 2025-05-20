
import { useParams } from "react-router-dom";
import NoteEditor from "@/components/NoteEditor";

const NoteEditPage = () => {
  const { noteId } = useParams();
  
  return <NoteEditor noteId={noteId} />;
};

export default NoteEditPage;
