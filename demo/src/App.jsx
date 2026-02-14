import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import PlaygroundSection from './components/PlaygroundSection';
import Documentation from './components/Documentation';
import ShapeShowcase from './components/ShapeShowcase';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <main>
              <Hero />
              <ShapeShowcase />
              <PlaygroundSection />
              <Documentation />
            </main>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
}
