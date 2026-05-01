import React, { useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import gsap from 'gsap';

const BlogLayout: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Background animation similar to main site
    if (containerRef.current) {
      const orbs = containerRef.current.querySelectorAll('.bg-orb');
      orbs.forEach((orb, i) => {
        gsap.to(orb, {
          x: `random(-100, 100)`,
          y: `random(-100, 100)`,
          duration: `random(10, 20)`,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 2,
        });
      });
    }
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-java-darker text-java-light font-sans overflow-x-hidden selection:bg-java-orange/30 selection:text-white">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="bg-orb absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-java-orange/5 blur-[120px]"></div>
        <div className="bg-orb absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-java-blue/5 blur-[150px]"></div>
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      ></div>

      <Navbar />

      <main className="relative z-10 pt-32 pb-20 px-4 min-h-screen">
        <Outlet />
      </main>
      
      <footer className="relative z-10 py-8 text-center text-java-light/40 font-mono text-sm border-t border-white/5">
        <p>return &copy; {new Date().getFullYear()} Naman Jain;</p>
      </footer>
    </div>
  );
};

export default BlogLayout;
