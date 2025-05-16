/*
  # Create letters collection structure

  1. Collections
    - `letters`
      - `id` (auto-generated)
      - `userId` (string, required)
      - `title` (string)
      - `content` (string)
      - `createdAt` (timestamp)
      - `updatedAt` (timestamp)
      - `paperStyle` (string)
      - `fontFamily` (string)
      - `favorite` (boolean)
      - `stickers` (array)
*/

CREATE TABLE IF NOT EXISTS letters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  title text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  paper_style text DEFAULT 'classic',
  font_family text DEFAULT 'great-vibes',
  favorite boolean DEFAULT false,
  stickers jsonb DEFAULT '[]'::jsonb
);

ALTER TABLE letters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own letters"
  ON letters
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own letters"
  ON letters
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own letters"
  ON letters
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);