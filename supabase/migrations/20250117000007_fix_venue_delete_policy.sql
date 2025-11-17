-- Add DELETE policy for venues table
-- This allows authenticated users to delete venues

create policy "Authenticated users can delete venues"
  on public.venues
  for delete
  to authenticated
  using (true);
