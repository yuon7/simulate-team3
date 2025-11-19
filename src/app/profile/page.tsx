"use client"
import ProfileCard from '@/components/ProfileCard/ProfileCard';
import styles from './profile.module.css';

export default function ProfilePage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>プロフィール</h1>
      
      <ProfileCard
        name="田中太郎"
        email="tanaka@example.com"
        phone="090-1234-5678"
        location="東京都"
        role="フロントエンド開発者"
        bio="Next.jsとReactが大好きな開発者です。ユーザー体験を重視したWebアプリケーションの開発に取り組んでいます。"
        skills={['React', 'Next.js', 'TypeScript', 'Mantine UI']}
      />
    </div>
  );
}
