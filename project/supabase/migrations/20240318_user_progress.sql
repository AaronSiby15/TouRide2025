-- Create user_progress table
create table if not exists user_progress (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) not null unique,
    course_completed boolean default false,
    completed_at timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for faster lookups
create index if not exists user_progress_user_id_idx on user_progress(user_id);

-- Enable RLS (Row Level Security)
alter table user_progress enable row level security;

-- Create policy to allow users to view their own progress
create policy "Users can view their own progress"
    on user_progress for select
    using (auth.uid() = user_id);

-- Create policy to allow users to update their own progress
create policy "Users can update their own progress"
    on user_progress for update
    using (auth.uid() = user_id);

-- Create policy to allow users to insert their own progress
create policy "Users can insert their own progress"
    on user_progress for insert
    with check (auth.uid() = user_id);

-- Create function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Create trigger to automatically update updated_at
create trigger update_user_progress_updated_at
    before update on user_progress
    for each row
    execute function update_updated_at_column(); 