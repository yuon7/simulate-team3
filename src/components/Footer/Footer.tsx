import footerSectionStyles from "./Footer.module.css"
import { FooterContent } from "../../features/Footer/FooterContent"

export function Footer() {
  return (
    <footer className={footerSectionStyles.footer}>
      <FooterContent />
    </footer>
  )
}