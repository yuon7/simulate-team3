import headerSectionStyles from "./Header.module.css"
import { HeaderContent } from "../../features/Header/HeaderContent"
import { createClient } from "@/lib/supabase/server"

export async function Header() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className={headerSectionStyles.header}>
      <HeaderContent user={user} />
    </header>
  )
}