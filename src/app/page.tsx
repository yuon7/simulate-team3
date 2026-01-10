import { HeroSection } from "../components/HeroSection/HeroSection"
import { FeaturesSection } from "../components/FeaturesSection/FeaturesSection"
import { JobListings } from "../components/JobListings/JobListings"
import { LifeSimulator } from "../components/LifeSimulator/LifeSimulator"
import { RegionSpotlight } from "../components/RegionSpotlight/RegionSpotlight"
import { Footer } from "../components/Footer/Footer"

export default function HomePage() {
  return (
    <>
      <main>
        <HeroSection />
        <FeaturesSection />
        <JobListings />
        <LifeSimulator />
        <RegionSpotlight />
      </main>
      <Footer />
    </>
  )
}