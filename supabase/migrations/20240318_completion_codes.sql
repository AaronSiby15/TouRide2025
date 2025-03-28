-- Create completion_codes table
create table if not exists completion_codes (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) not null,
    completion_code text not null unique,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    course_completed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for faster lookups
create index if not exists completion_codes_user_id_idx on completion_codes(user_id);
create index if not exists completion_codes_completion_code_idx on completion_codes(completion_code);

-- Enable RLS (Row Level Security)
alter table completion_codes enable row level security;

-- Create policy to allow users to view their own completion codes
create policy "Users can view their own completion codes"
    on completion_codes for select
    using (auth.uid() = user_id);

-- Create policy to allow users to insert their own completion codes
create policy "Users can insert their own completion codes"
    on completion_codes for insert
    with check (auth.uid() = user_id); 