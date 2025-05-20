
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export interface Folder {
  id: string;
  name: string;
}

export const useNoteFolders = () => {
  const { user } = useAuth();
  const [folders, setFolders] = useState<Folder[]>([]);

  useEffect(() => {
    if (user) {
      fetchFolders();
    }
  }, [user]);

  const fetchFolders = async () => {
    try {
      const { data, error } = await supabase
        .from("folders")
        .select("*")
        .order("name");
      
      if (error) throw error;
      setFolders(data || []);
    } catch (error: any) {
      console.error("Error fetching folders:", error.message);
    }
  };

  return { folders, fetchFolders };
};
