import { HeroSection } from "../components/HeroSection/HeroSection"
import { FeaturesSection } from "../components/FeaturesSection/FeaturesSection"
import { JobListings } from "../components/JobListings/JobListings"
import { LifeSimulation } from "../components/LifeSimulator/LifeSimulator"
import { RegionSpotlight } from "../components/RegionSpotlight/RegionSpotlight"
import { Footer } from "../components/Footer/Footer"

export default function HomePage() {
  return (
    <>
      <main>
        <HeroSection />
        <FeaturesSection />
        <JobListings />
        <LifeSimulation />
        <RegionSpotlight />
      </main>
      <Footer />
    </>
  )
}