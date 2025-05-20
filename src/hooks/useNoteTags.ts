
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export interface Tag {
  id: string;
  name: string;
}

export const useNoteTags = () => {
  const { user } = useAuth();
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    if (user) {
      fetchTags();
    }
  }, [user]);

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

  return { tags, fetchTags };
};
