// src/app/profile/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { TextInput, Textarea, Button, Stack, Title, Loader } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function ProfileEditPage() {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) console.error('auth.getUser error:', userError);
      if (user) {
        const { data, error } = await supabase.from('profiles').select('username,role,bio').eq('id', user.id).single();
        if (error) {
          console.error('fetch profile error:', error);
        } else if (data) {
          setName(data.username ?? '');
          setRole(data.role ?? '');
          setBio(data.bio ?? '');
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, [supabase]);

  const handleSave = async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error('auth.getUser error:', userError);
      return alert('ユーザー情報の取得に失敗しました。');
    }
    if (!user) return alert('ログインしていません。');

    const payload = {
      id: user.id,
      username: name,
      role: role,
      bio: bio,
    };

    // upsert: 存在しなければ insert、あれば update
    const { data, error } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'id' })
      .select();

    console.log('upsert result data:', data);
    console.log('upsert result error:', error);

    if (error) {
      alert('エラーが発生しました: ' + error.message);
    } else {
      alert('プロフィールを更新しました！');
      router.push('/profile');
      // router.refresh(); // 必要なら有効化
    }
  };

  if (loading) return <Loader style={{ margin: 'auto' }} />;

  return (
    <Stack maw={800} mx="auto" p="md">
      <Title order={1} ta="center" mb="lg">プロフィール編集</Title>
      <TextInput label="名前" value={name} onChange={(e) => setName(e.currentTarget.value)} />
      <TextInput label="役割" value={role} onChange={(e) => setRole(e.currentTarget.value)} />
      <Textarea label="自己紹介" value={bio} onChange={(e) => setBio(e.currentTarget.value)} minRows={4} />
      <Button onClick={handleSave} mt="md">保存する</Button>
    </Stack>
  );
}
