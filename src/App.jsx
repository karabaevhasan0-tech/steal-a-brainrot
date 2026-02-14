import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Community from "./components/Community";
import Rules from "./components/Rules";
import Guarantor from "./components/Guarantor";
import ScamAlert from "./components/ScamAlert";
import FAQ from "./components/FAQ";
import About from "./components/About";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Community />
        <Rules />
        <Guarantor />
        <ScamAlert />
        <FAQ />
        <About />
      </main>
      <Footer />
    </div>
  );
}

export default App;
