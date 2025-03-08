import About from "./components/About";
import Hero from "./components/Hero";
import NavBar from "./components/Navbar";
import Features from "./components/Features";
import Story from "./components/Story";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Text from "./components/Text";
import FlowingLogoSection from "./components/FlowingLogo";

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
