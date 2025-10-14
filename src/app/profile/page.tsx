import { Card, Text, Avatar, Group, Button, Stack, Badge } from '@mantine/core';
import { IconMail, IconPhone, IconMapPin } from '@tabler/icons-react';
import ProfileCard from '@/components/ProfileCard/ProfileCard';
import styles from './profile.module.css';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation';


export default async function ProfilePage() {
  const supabase = await createClient(); // サーバー用ヘルパーをここで使う

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) {
    console.error('auth.getUser error:', userError);
  }
  if (!user) {
    redirect('/login'); // ログインしていなければリダイレクト
  }

  // サーバー側でプロフィール情報を取得
  const { data: profile, error } = await supabase
    .from('profiles') // ❗️テーブル名を自分のDBに合わせる
    .select('username, role, bio')
    .eq('id', user.id)
    .single();
  if (error) {
    console.error('supabase profiles select error:', error);
  }
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>プロフィール</h1>
      
      {profile ? (
        <ProfileCard
          name={profile.username ?? '名前未設定'}
          email={user.email ?? '未設定'}
          phone={'未設定'}    // DB に phone カラムがないため固定で未設定
          location={'未設定'} // DB に location カラムがないため固定で未設定
          role={profile.role ?? '未設定'}
          bio={profile.bio ?? '自己紹介がありません'}
          skills={['React', 'Next.js', 'TypeScript']}
        />
      ) : (
        <Text ta="center">プロフィール情報が見つかりませんでした。</Text>
      )}
      <Group justify="center" mt="lg">
  <Link href="/profile/edit">
    {/* Buttonにはcomponentプロパティを指定しない */}
    <Button>
      プロフィールを編集
    </Button>
  </Link>
</Group>
    </div>
  );
}
