
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

interface MarkdownEditorProps {
  content: string;
  setContent: (content: string) => void;
}

const MarkdownEditor = ({ content, setContent }: MarkdownEditorProps) => {
  const [activeTab, setActiveTab] = useState("edit");

  return (
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
  );
};

export default MarkdownEditor;
