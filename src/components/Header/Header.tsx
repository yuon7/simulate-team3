// src/components/Header/Header.tsx
import headerSectionStyles from "./Header.module.css"
import { HeaderContent } from "../../features/Header/HeaderContent"

export function Header() {
  return (
    <header className={headerSectionStyles.header}>
      <HeaderContent />
    </header>
  )
}