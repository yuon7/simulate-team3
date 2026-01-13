"use client";

import {
  Container,
  Group,
  Button,
  TextInput,
  Burger,
  Anchor,
  Drawer,
  Stack,
  NavLink,
  Text,
  Avatar,
  UnstyledButton,
  Divider,
} from "@mantine/core";
import {
  IconSearch,
  IconUser,
  IconLogout,
  IconBuilding,
  IconBriefcase,
  IconDeviceGamepad,
  IconHelp,
  IconInfoCircle,
  IconHome,
  IconList,
  IconMapPin,
  IconMessage,
} from "@tabler/icons-react";
import { useState } from "react";
import headerContentStyles from "./HeaderContent.module.css";
import { User } from "@supabase/supabase-js";
import { Logout } from "@/app/auth/logout/action";
import { useRouter } from "next/navigation";

type ExtendedUser = User & {
  role?: string;
  name?: string;
};

type HeaderContentProps = {
  user: ExtendedUser | null;
  avatarUrl?: string | null;
};

const ProfileSection = ({
  user,
  avatarUrl,
  onClick,
}: {
  user: ExtendedUser | null;
  avatarUrl?: string | null;
  onClick: () => void;
}) => {
  if (!user) {
    return (
      <Group p="md">
        <Avatar size="md" />
        <Text fw={500}>ゲスト様</Text>
      </Group>
    );
  }

  const profileLink = user.role === "STAFF" ? "/company/profile" : "/profile";

  return (
    <UnstyledButton
      component="a"
      href={profileLink}
      className={headerContentStyles.profileLink}
      onClick={onClick}
    >
      <Group p="md">
        <Avatar
          src={avatarUrl}
          size="md"
          color="initials"
          name={user.name || user.email}
        >
          {!avatarUrl && <IconUser size={20} />}
        </Avatar>
        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {user.name || "ユーザー"}
          </Text>
          <Text c="dimmed" size="xs">
            {user.email}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  );
};

export function HeaderContent({ user, avatarUrl }: HeaderContentProps) {
  const [opened, setOpened] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await Logout();
    setOpened(false);
    router.refresh();
  };

  const handleLinkClick = () => {
    setOpened(false);
  };

  return (
    <Container size="xl">
      <Group justify="space-between" h={64}>
        <Group gap="xl">
          <Anchor href="/" underline="never" c="inherit">
            <Group gap="xs">
              <div className={headerContentStyles.logo}>
                <span className={headerContentStyles.logoText}>L</span>
              </div>
              <span className={headerContentStyles.brandName}>LocalLink</span>
            </Group>
          </Anchor>
          {/* Desktop Nav removed as per request to use Hamburger always */}
        </Group>

        <Group gap="md">
          {/* Search Input hidden for cleaner look or kept specific? User said "other headers are clear". Let's keep search for now but hide buttons */}
          <TextInput
            placeholder="地域や職種で検索..."
            leftSection={<IconSearch size={16} />}
            className={headerContentStyles.searchInput}
            visibleFrom="md"
          />
          {/* visibleFrom="md" removed from Burger to show always */}
          <Burger
            opened={opened}
            onClick={() => setOpened(!opened)}
            size="sm"
          />
        </Group>
      </Group>

      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title="メニュー"
        padding="md"
        size="xs"
        position="right"
        zIndex={2000}
      >
        <Stack gap="xs">
          <ProfileSection
            user={user}
            avatarUrl={avatarUrl}
            onClick={handleLinkClick}
          />
          <Divider />

          {!user && (
            <>
              <NavLink
                label="トップ"
                leftSection={<IconHome size={16} stroke={1.5} />}
                component="a"
                href="/"
                onClick={handleLinkClick}
              />
              <NavLink
                label="使い方ガイド"
                leftSection={<IconHelp size={16} stroke={1.5} />}
                component="a"
                href="/guide"
                onClick={handleLinkClick}
              />
              <NavLink
                label="よくある質問"
                leftSection={<IconInfoCircle size={16} stroke={1.5} />}
                component="a"
                href="/faq"
                onClick={handleLinkClick}
              />
              <NavLink
                label="AIチャット相談"
                leftSection={<IconMessage size={16} stroke={1.5} />}
                component="a"
                href="/chat"
                onClick={handleLinkClick}
              />
              <Divider />
              <Button
                component="a"
                href="/auth/login"
                fullWidth
                variant="light"
                mt="md"
              >
                ログイン
              </Button>
            </>
          )}

          {user && (
            <>
              {user.role === "CANDIDATE" && (
                <>
                  <NavLink
                    label="応募済み企業一覧"
                    leftSection={<IconBuilding size={16} stroke={1.5} />}
                    component="a"
                    href="/applications"
                    onClick={handleLinkClick}
                  />
                  <NavLink
                    label="求人を探す"
                    leftSection={<IconBriefcase size={16} stroke={1.5} />}
                    component="a"
                    href="/jobs"
                    onClick={handleLinkClick}
                  />
                  <NavLink
                    label="生活シミュレーション"
                    leftSection={<IconDeviceGamepad size={16} stroke={1.5} />}
                    component="a"
                    href="/life-simulator"
                    onClick={handleLinkClick}
                  />
                  <NavLink
                    label="地域紹介"
                    leftSection={<IconMapPin size={16} stroke={1.5} />}
                    component="a"
                    href="/#regions"
                    onClick={handleLinkClick}
                  />
                  <NavLink
                    label="AIチャット相談"
                    leftSection={<IconMessage size={16} stroke={1.5} />}
                    component="a"
                    href="/chat"
                    onClick={handleLinkClick}
                  />
                  <Divider my="sm" />
                </>
              )}

              {user.role === "STAFF" && (
                <>
                  <NavLink
                    label="求人を作成"
                    leftSection={<IconBriefcase size={16} stroke={1.5} />}
                    component="a"
                    href="/company/jobs/new"
                    onClick={handleLinkClick}
                  />
                  <NavLink
                    label="求人管理"
                    leftSection={<IconList size={16} stroke={1.5} />}
                    component="a"
                    href="/company/jobs"
                    onClick={handleLinkClick}
                  />
                  <NavLink
                    label="応募状況確認"
                    leftSection={<IconBuilding size={16} stroke={1.5} />}
                    component="a"
                    href="/company/applications"
                    onClick={handleLinkClick}
                  />
                  <NavLink
                    label="AIチャット相談"
                    leftSection={<IconMessage size={16} stroke={1.5} />}
                    component="a"
                    href="/chat"
                    onClick={handleLinkClick}
                  />
                  <Divider my="sm" />
                </>
              )}

              <Divider my="sm" />

              <Button
                color="red"
                variant="subtle"
                fullWidth
                leftSection={<IconLogout size={16} />}
                onClick={handleLogout}
              >
                ログアウト
              </Button>
            </>
          )}
        </Stack>
      </Drawer>
    </Container>
  );
}
