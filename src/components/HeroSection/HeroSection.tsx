import heroSectionStyles from "./HeroSection.module.css"
import { HeroContent } from "../../features/HeroSection/HeroContent"

export function HeroSection() {
  return (
    <section className={heroSectionStyles.section}>
      <div className={heroSectionStyles.background} />
      <HeroContent />
    </section>
  )
}