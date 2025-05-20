
import { useParams } from "react-router-dom";
import NoteEditor from "@/components/NoteEditor";

const DumpNotePage = () => {
  const { noteId } = useParams();
  
  return <NoteEditor noteId={noteId} isDumpNote={true} />;
};

export default DumpNotePage;
