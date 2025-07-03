insert into
    storage.buckets (
        id,
        name,
        public,
        file_size_limit,
        allowed_mime_types
    )
values
    (
        'avatars',
        'avatars',
        true,
        10240,
        ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']
    ) ON CONFLICT (name) DO NOTHING;

CREATE POLICY "test 1" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars');
CREATE POLICY "test 2" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'avatars');