import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { Calendar, Clock, Tag } from 'lucide-react';

// Sample data for MVP.
export const blogPosts = [
  {
    id: 'understanding-distributed-systems',
    title: 'A Primer on Distributed Systems Design',
    date: '2023-10-15',
    readTime: '8 min read',
    tags: ['Architecture', 'Distributed Systems'],
    summary: 'An introduction to the core concepts of building reliable, scalable distributed systems, focusing on consensus, replication, and fault tolerance.',
    content: 'Full article content goes here...'
  },
  {
    id: 'spring-boot-microservices',
    title: 'Building Resilient Microservices with Spring Boot',
    date: '2023-11-02',
    readTime: '12 min read',
    tags: ['Java', 'Spring Boot', 'Microservices'],
    summary: 'A deep dive into creating robust microservices architectures using Spring Cloud, handling failures gracefully with resilience patterns.',
    content: 'Full article content goes here...'
  },
  {
    id: 'jvm-performance-tuning',
    title: 'Advanced JVM Performance Tuning in Production',
    date: '2024-01-20',
    readTime: '10 min read',
    tags: ['Java', 'Performance', 'JVM'],
    summary: 'Techniques and strategies for profiling and tuning the Java Virtual Machine for high-throughput and low-latency applications.',
    content: 'Full article content goes here...'
  }
];

const BlogList: React.FC = () => {
  const listRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(headerRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
    }

    if (listRef.current) {
      const cards = listRef.current.querySelectorAll('.blog-card');
      gsap.fromTo(cards,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 0.8,
          ease: 'power2.out',
          delay: 0.2
        }
      );
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div ref={headerRef} className="mb-12">
        <div className="inline-block px-3 py-1 rounded-md bg-java-blue/10 border border-java-blue/30 text-java-blue font-mono text-sm mb-4">
          public class TechnicalBlog
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Insights & <span className="text-java-orange">Articles</span>
        </h1>
        <p className="text-java-light/70 text-lg max-w-2xl">
          Thoughts, learnings, and deep dives into software engineering, architecture, and backend systems.
        </p>
      </div>

      <div ref={listRef} className="grid grid-cols-1 gap-8">
        {blogPosts.map((post) => (
          <Link 
            key={post.id} 
            to={`/post/${post.id}`}
            className="blog-card block glass-panel p-6 hover:border-java-blue/50 transition-colors group"
          >
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-java-darker/50 border border-white/10 rounded text-xs font-mono text-java-light/70 flex items-center gap-1 group-hover:border-java-orange/30 transition-colors">
                  <Tag size={10} className="text-java-orange" /> {tag}
                </span>
              ))}
            </div>
            
            <h2 className="text-2xl font-bold mb-3 text-java-light group-hover:text-java-blue transition-colors">
              {post.title}
            </h2>
            
            <p className="text-java-light/70 mb-6 line-clamp-2">
              {post.summary}
            </p>
            
            <div className="flex items-center gap-6 text-sm font-mono text-java-light/50">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-java-blue" />
                {post.date}
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-java-orange" />
                {post.readTime}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
