import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Terminal, BookOpen, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navRef = useRef<HTMLElement>(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(navRef.current, 
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
      );
    }
  }, []);

  const handleMouseEnter = (index: number) => {
    const el = linksRef.current[index];
    if (!el) return;
    
    const icon = el.querySelector('.nav-icon');
    const text = el.querySelector('.nav-text');
    const brackets = el.querySelectorAll('.nav-bracket');
    
    gsap.to(icon, { 
      y: -2, 
      scale: 1.1, 
      color: '#f89820', // java-orange
      duration: 0.3, 
      ease: 'back.out(2)' 
    });
    
    gsap.to(text, { 
      color: '#f89820', 
      duration: 0.3 
    });

    gsap.to(brackets, {
      opacity: 1,
      x: (i) => i === 0 ? -4 : 4,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  const handleMouseLeave = (index: number) => {
    const el = linksRef.current[index];
    if (!el) return;
    
    const icon = el.querySelector('.nav-icon');
    const text = el.querySelector('.nav-text');
    const brackets = el.querySelectorAll('.nav-bracket');
    
    gsap.to(icon, { 
      y: 0, 
      scale: 1, 
      color: '#5382a1', // java-blue
      duration: 0.3, 
      ease: 'power2.out' 
    });
    
    gsap.to(text, { 
      color: 'rgba(224, 224, 224, 0.7)', // java-light/70
      duration: 0.3 
    });

    gsap.to(brackets, {
      opacity: 0,
      x: 0,
      duration: 0.3,
      ease: 'power2.in'
    });
  };

  const navItems = [
    { name: 'Articles', href: '/', icon: <BookOpen size={16} /> },
    { name: 'Main Portfolio', href: 'https://namanoncode.me', icon: <ArrowLeft size={16} />, external: true },
  ];

  return (
    <nav 
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-40 flex justify-center pt-6 px-4 pointer-events-none"
    >
      <div className="glass-panel px-6 py-3 flex items-center gap-6 pointer-events-auto neon-box-blue">
        <Link to="/" className="text-java-orange font-mono font-bold text-xl mr-4 flex items-center gap-2">
          <Terminal size={20} />
          <span>namanocode<span className="text-java-blue">.blog</span></span>
        </Link>
        
        <ul className="hidden md:flex items-center gap-6">
          {navItems.map((item, index) => (
            <li key={item.name}>
              {item.external ? (
                <a 
                  ref={el => { linksRef.current[index] = el; }}
                  href={item.href}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={() => handleMouseLeave(index)}
                  className="relative flex items-center gap-2 text-sm font-medium text-java-light/70"
                >
                  <span className="nav-icon text-java-blue inline-block">
                    {item.icon}
                  </span>
                  <span className="nav-bracket absolute -left-2 opacity-0 text-java-orange font-mono">{"{"}</span>
                  <span className="nav-text inline-block">
                    {item.name}
                  </span>
                  <span className="nav-bracket absolute -right-2 opacity-0 text-java-orange font-mono">{"}"}</span>
                </a>
              ) : (
                <Link 
                  ref={el => { linksRef.current[index] = el; }}
                  to={item.href}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={() => handleMouseLeave(index)}
                  className="relative flex items-center gap-2 text-sm font-medium text-java-light/70"
                >
                  <span className="nav-icon text-java-blue inline-block">
                    {item.icon}
                  </span>
                  <span className="nav-bracket absolute -left-2 opacity-0 text-java-orange font-mono">{"{"}</span>
                  <span className="nav-text inline-block">
                    {item.name}
                  </span>
                  <span className="nav-bracket absolute -right-2 opacity-0 text-java-orange font-mono">{"}"}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
