import About from "@/components/About";
import Contact from "@/components/Contact";
import Features from "@/components/Features";
import FlowingLogoSection from "@/components/FlowingLogo";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import NavBar from "@/components/Navbar";
import Story from "@/components/Story";
import Text from "@/components/Text";

export default function Home() {
  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden bg-gray-50">
      <NavBar />
      <Hero />
      <About />
      <Text />
      <Features />
      <Story />
      <FlowingLogoSection />
      <Contact />
      <Footer />
    </main>
  );
}
