/*
  # Create accounting tables

  1. New Tables
    - `accounts`
      - `id` (uuid, primary key)
      - `account_number` (text, unique)
      - `account_name` (text)
      - `account_type` (text)
      - `category` (text)
      - `balance` (numeric)
      - `description` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `journal_entries`
      - `id` (uuid, primary key)
      - `entry_number` (text, unique)
      - `date` (date)
      - `description` (text)
      - `reference` (text, optional)
      - `total_debit` (numeric)
      - `total_credit` (numeric)
      - `status` (text, check constraint)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `journal_entry_items`
      - `id` (uuid, primary key)
      - `journal_entry_id` (uuid, foreign key)
      - `account_name` (text)
      - `debit` (numeric)
      - `credit` (numeric)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage all records

  3. Indexes
    - Add indexes for frequently queried columns
    - Add foreign key indexes for performance
*/

-- Create accounts table
CREATE TABLE IF NOT EXISTS public.accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_number text NOT NULL UNIQUE,
  account_name text NOT NULL,
  account_type text NOT NULL,
  category text NOT NULL,
  balance numeric(10,2) DEFAULT 0 NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT accounts_account_type_check CHECK (account_type IN ('Asset', 'Liability', 'Equity', 'Revenue', 'Expense'))
);

-- Create journal_entries table
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_number text NOT NULL UNIQUE,
  date date NOT NULL,
  description text NOT NULL,
  reference text,
  total_debit numeric(10,2) DEFAULT 0 NOT NULL,
  total_credit numeric(10,2) DEFAULT 0 NOT NULL,
  status text DEFAULT 'draft' NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT journal_entries_status_check CHECK (status IN ('draft', 'posted', 'voided')),
  CONSTRAINT journal_entries_balance_check CHECK (total_debit = total_credit)
);

-- Create journal_entry_items table
CREATE TABLE IF NOT EXISTS public.journal_entry_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  journal_entry_id uuid NOT NULL REFERENCES public.journal_entries(id) ON DELETE CASCADE,
  account_name text NOT NULL,
  debit numeric(10,2) DEFAULT 0 NOT NULL,
  credit numeric(10,2) DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT journal_entry_items_amount_check CHECK ((debit > 0 AND credit = 0) OR (credit > 0 AND debit = 0))
);

-- Enable RLS
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entry_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage accounts"
  ON public.accounts
  FOR ALL
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can manage journal entries"
  ON public.journal_entries
  FOR ALL
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can manage journal entry items"
  ON public.journal_entry_items
  FOR ALL
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_accounts_account_number ON public.accounts USING btree (account_number);
CREATE INDEX IF NOT EXISTS idx_accounts_account_type ON public.accounts USING btree (account_type);

CREATE INDEX IF NOT EXISTS idx_journal_entries_entry_number ON public.journal_entries USING btree (entry_number);
CREATE INDEX IF NOT EXISTS idx_journal_entries_date ON public.journal_entries USING btree (date);
CREATE INDEX IF NOT EXISTS idx_journal_entries_status ON public.journal_entries USING btree (status);

CREATE INDEX IF NOT EXISTS idx_journal_entry_items_journal_entry_id ON public.journal_entry_items USING btree (journal_entry_id);
CREATE INDEX IF NOT EXISTS idx_journal_entry_items_account_name ON public.journal_entry_items USING btree (account_name);

-- Create triggers for updated_at
CREATE TRIGGER update_accounts_updated_at
  BEFORE UPDATE ON public.accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journal_entries_updated_at
  BEFORE UPDATE ON public.journal_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample accounts data
INSERT INTO public.accounts (account_number, account_name, account_type, category, balance, description) VALUES
  ('1000', 'Cash', 'Asset', 'Current Assets', 25000, 'Company cash account'),
  ('1200', 'Accounts Receivable', 'Asset', 'Current Assets', 15000, 'Money owed by customers'),
  ('1500', 'Inventory', 'Asset', 'Current Assets', 30000, 'Product inventory'),
  ('1700', 'Equipment', 'Asset', 'Fixed Assets', 50000, 'Office and production equipment'),
  ('2000', 'Accounts Payable', 'Liability', 'Current Liabilities', 8000, 'Money owed to suppliers'),
  ('2100', 'Notes Payable', 'Liability', 'Long-term Liabilities', 20000, 'Long-term debt'),
  ('3000', 'Owner Equity', 'Equity', 'Owner Equity', 50000, 'Owner investment in business'),
  ('3100', 'Retained Earnings', 'Equity', 'Retained Earnings', 42000, 'Accumulated profits'),
  ('4000', 'Sales Revenue', 'Revenue', 'Sales Revenue', 0, 'Revenue from sales'),
  ('4100', 'Service Revenue', 'Revenue', 'Service Revenue', 0, 'Revenue from services'),
  ('5000', 'Cost of Goods Sold', 'Expense', 'Operating Expenses', 0, 'Direct costs of products sold'),
  ('6000', 'Office Expenses', 'Expense', 'Operating Expenses', 0, 'General office expenses'),
  ('6100', 'Marketing Expenses', 'Expense', 'Operating Expenses', 0, 'Marketing and advertising costs')
ON CONFLICT (account_number) DO NOTHING;

-- Insert sample journal entries
INSERT INTO public.journal_entries (entry_number, date, description, reference, total_debit, total_credit, status) VALUES
  ('JE001', '2024-01-15', 'Sales revenue for January', 'INV-2024-001', 5000, 5000, 'posted'),
  ('JE002', '2024-01-16', 'Office supplies purchase', 'PO-2024-001', 500, 500, 'posted'),
  ('JE003', '2024-01-20', 'Equipment purchase', 'INV-2024-002', 10000, 10000, 'posted')
ON CONFLICT (entry_number) DO NOTHING;

-- Insert sample journal entry items
DO $$
DECLARE
    je1_id uuid;
    je2_id uuid;
    je3_id uuid;
BEGIN
    -- Get journal entry IDs
    SELECT id INTO je1_id FROM public.journal_entries WHERE entry_number = 'JE001';
    SELECT id INTO je2_id FROM public.journal_entries WHERE entry_number = 'JE002';
    SELECT id INTO je3_id FROM public.journal_entries WHERE entry_number = 'JE003';
    
    -- Insert items for JE001
    IF je1_id IS NOT NULL THEN
        INSERT INTO public.journal_entry_items (journal_entry_id, account_name, debit, credit) VALUES
          (je1_id, 'Cash', 5000, 0),
          (je1_id, 'Sales Revenue', 0, 5000)
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Insert items for JE002
    IF je2_id IS NOT NULL THEN
        INSERT INTO public.journal_entry_items (journal_entry_id, account_name, debit, credit) VALUES
          (je2_id, 'Office Expenses', 500, 0),
          (je2_id, 'Cash', 0, 500)
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Insert items for JE003
    IF je3_id IS NOT NULL THEN
        INSERT INTO public.journal_entry_items (journal_entry_id, account_name, debit, credit) VALUES
          (je3_id, 'Equipment', 10000, 0),
          (je3_id, 'Cash', 0, 10000)
        ON CONFLICT DO NOTHING;
    END IF;
END $$;