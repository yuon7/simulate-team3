"use client"

import { Container, Group, Button, TextInput, Burger, Anchor } from "@mantine/core"
import { IconSearch, IconUser } from "@tabler/icons-react"
import { useState } from "react"
import headerContentStyles from "./HeaderContent.module.css"

export function HeaderContent() {
  const [opened, setOpened] = useState(false)

  return (
    <Container size="xl">
      <Group justify="space-between" h={64}>
        <Group gap="xl">
          <Group gap="xs">
            <div className={headerContentStyles.logo}>
              <span className={headerContentStyles.logoText}>地</span>
            </div>
            <span className={headerContentStyles.brandName}>地方創生</span>
          </Group>

          <Group gap="lg" visibleFrom="md">
            <Anchor href="#jobs" className={headerContentStyles.navLink}>
              求人情報
            </Anchor>
            <Anchor href="#simulator" className={headerContentStyles.navLink}>
              生活シミュレーション
            </Anchor>
            <Anchor href="#regions" className={headerContentStyles.navLink}>
              地域紹介
            </Anchor>
          </Group>
        </Group>

        <Group gap="md">
          <TextInput
            placeholder="地域や職種で検索..."
            leftSection={<IconSearch size={16} />}
            className={headerContentStyles.searchInput}
            visibleFrom="md"
          />

          <Button 
            variant="outline" 
            size="sm" 
            leftSection={<IconUser size={16} />} 
            visibleFrom="md"
            component="a"
            href="/auth/login"
          >
            ログイン
          </Button>

          <Button 
            size="sm" 
            visibleFrom="md"
            component="a"
            href="/auth/select-role"
          >
            新規登録
          </Button>

          <Burger opened={opened} onClick={() => setOpened(!opened)} hiddenFrom="md" size="sm" />
        </Group>
      </Group>
    </Container>
  )
}