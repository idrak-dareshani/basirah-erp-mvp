import { useState, useEffect } from 'react';
import { supabase, handleSupabaseError } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Tables = Database['public']['Tables'];

export function useSupabaseTable<T extends keyof Tables>(
  tableName: T
) {
  type Row = Tables[T]['Row'];
  type Insert = Tables[T]['Insert'];
  type Update = Tables[T]['Update'];

  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all records
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: result, error } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setData(result || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Create a new record
  const create = async (record: Insert): Promise<Row | null> => {
    try {
      const { data: result, error } = await supabase
        .from(tableName)
        .insert(record)
        .select()
        .single();

      if (error) throw error;
      
      setData(prev => [result, ...prev]);
      return result;
    } catch (err) {
      handleSupabaseError(err);
      return null;
    }
  };

  // Update a record
  const update = async (id: string, updates: Update): Promise<Row | null> => {
    try {
      const { data: result, error } = await supabase
        .from(tableName)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setData(prev => prev.map(item => 
        (item as any).id === id ? result : item
      ));
      return result;
    } catch (err) {
      handleSupabaseError(err);
      return null;
    }
  };

  // Delete a record
  const remove = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setData(prev => prev.filter(item => (item as any).id !== id));
      return true;
    } catch (err) {
      handleSupabaseError(err);
      return false;
    }
  };

  // Bulk delete records
  const bulkRemove = async (ids: string[]): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .in('id', ids);

      if (error) throw error;
      
      setData(prev => prev.filter(item => !ids.includes((item as any).id)));
      return true;
    } catch (err) {
      handleSupabaseError(err);
      return false;
    }
  };

  useEffect(() => {
    fetchData();
  }, [tableName]);

  return {
    data,
    loading,
    error,
    create,
    update,
    remove,
    bulkRemove,
    refetch: fetchData
  };
}