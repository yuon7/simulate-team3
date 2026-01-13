"use client";

import { Container, Grid, Stack, Text, Group, Anchor } from "@mantine/core";
import { IconMapPin, IconMail, IconPhone } from "@tabler/icons-react";
import footerContentStyles from "./FooterContent.module.css";

export function FooterContent() {
  return (
    <Container size="xl" py={48}>
      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Stack gap="md">
            <Group gap="xs">
              <div className={footerContentStyles.logo}>
                <Text fw={700} c="white">
                  L
                </Text>
              </div>
              <Text fw={700} size="lg">
                LocalLink
              </Text>
            </Group>
            <Text size="sm" c="dimmed">
              地方での新しいキャリアと理想の暮らしをつなぐ、AIマッチングプラットフォームです。
            </Text>
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Stack gap="md">
            <Text fw={600}>サービス</Text>
            <Stack gap="xs">
              <Anchor
                href="#"
                size="sm"
                c="dimmed"
                className={footerContentStyles.link}
              >
                求人検索
              </Anchor>
              <Anchor
                href="#"
                size="sm"
                c="dimmed"
                className={footerContentStyles.link}
              >
                生活シミュレーション
              </Anchor>
              <Anchor
                href="#"
                size="sm"
                c="dimmed"
                className={footerContentStyles.link}
              >
                地域情報
              </Anchor>
              <Anchor
                href="#"
                size="sm"
                c="dimmed"
                className={footerContentStyles.link}
              >
                移住支援
              </Anchor>
            </Stack>
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Stack gap="md">
            <Text fw={600}>企業向け</Text>
            <Stack gap="xs">
              <Anchor
                href="#"
                size="sm"
                c="dimmed"
                className={footerContentStyles.link}
              >
                求人掲載
              </Anchor>
              <Anchor
                href="#"
                size="sm"
                c="dimmed"
                className={footerContentStyles.link}
              >
                採用支援
              </Anchor>
              <Anchor
                href="#"
                size="sm"
                c="dimmed"
                className={footerContentStyles.link}
              >
                地域PR
              </Anchor>
              <Anchor
                href="#"
                size="sm"
                c="dimmed"
                className={footerContentStyles.link}
              >
                料金プラン
              </Anchor>
            </Stack>
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Stack gap="md">
            <Text fw={600}>お問い合わせ</Text>
            <Stack gap="sm">
              <Group gap="xs">
                <IconMail size={16} className={footerContentStyles.icon} />
                <Text size="sm" c="dimmed">
                  support@locallink.jp
                </Text>
              </Group>
              <Group gap="xs">
                <IconPhone size={16} className={footerContentStyles.icon} />
                <Text size="sm" c="dimmed">
                  03-xxxx-xxxx
                </Text>
              </Group>
              <Group gap="xs">
                <IconMapPin size={16} className={footerContentStyles.icon} />
                <Text size="sm" c="dimmed">
                  LocalLink 運営事務局
                </Text>
              </Group>
            </Stack>
          </Stack>
        </Grid.Col>
      </Grid>

      <div className={footerContentStyles.copyright}>
        <Text size="sm" c="dimmed" ta="center">
          &copy; 2026 LocalLink. All rights reserved.
        </Text>
      </div>
    </Container>
  );
}
