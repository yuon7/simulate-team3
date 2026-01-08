"use client"
import ProfileCard from '@/components/ProfileCard/ProfileCard';
import { EditProfileForm } from '@/features/Profile/EditProfileForm';
import styles from './profile.module.css';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { IconInfoCircle } from '@tabler/icons-react';
import { Center, Loader, Container, Alert, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

export default function ProfilePage() {
  const [opened, { open, close }] = useDisclosure(false);
  const { data, error, isLoading } = useSWR('/api/profile', fetcher);

  if (isLoading) {
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );
  }

  if (error) {
    return (
      <Container py="xl">
         <Alert icon={<IconInfoCircle />} title="エラー" color="red">
          プロフィールの取得に失敗しました。
        </Alert>
      </Container>
    );
  }

  const profile = data;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>プロフィール</h1>
      
      <ProfileCard
        name={profile.name}
        email={profile.email}
        phone={profile.phone}
        location={profile.location}
        role={profile.role}
        bio={profile.bio}
        skills={profile.skills}
        onEdit={open}
      />

      <Modal opened={opened} onClose={close} title="プロフィール編集" size="lg">
        <EditProfileForm
          initialData={profile}
          onSuccess={close}
          onCancel={close}
        />
      </Modal>
    </div>
  );
}

