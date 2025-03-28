

CREATE TABLE user_progress (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    module_id text NOT NULL,
    completed boolean DEFAULT false,
    completed_at timestamptz,
    created_at timestamptz DEFAULT now(),
    UNIQUE(user_id, module_id)
);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
    ON user_progress
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
    ON user_progress
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
    ON user_progress
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);