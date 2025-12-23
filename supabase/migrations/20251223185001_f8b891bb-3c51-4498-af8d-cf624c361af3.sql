-- Add edited_at column to messages table to track message edits
ALTER TABLE public.messages ADD COLUMN edited_at timestamp with time zone DEFAULT NULL;

-- Create policy to allow senders to delete their own messages
CREATE POLICY "Users can delete own messages" 
ON public.messages 
FOR DELETE 
USING (auth.uid() = sender_id);

-- Update the existing UPDATE policy to allow editing content (not just read status)
DROP POLICY IF EXISTS "Recipients can update read status" ON public.messages;

CREATE POLICY "Senders can edit messages or recipients mark read" 
ON public.messages 
FOR UPDATE 
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);