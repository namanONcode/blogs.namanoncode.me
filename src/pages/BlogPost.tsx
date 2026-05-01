import React, { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import gsap from 'gsap';
import { Calendar, Clock, Tag, ArrowLeft } from 'lucide-react';
import { blogPosts } from '../data/blogPosts';

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const post = blogPosts.find(p => p.id === id);
  const articleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (articleRef.current) {
      gsap.fromTo(articleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
      );
    }
  }, [id]);

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
        <Link to="/" className="text-java-blue hover:underline">Return to Articles</Link>
      </div>
    );
  }

  return (
    <div ref={articleRef} className="max-w-3xl mx-auto">
      {/* JSON-LD Structured Data for SEO */}
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.summary,
            "datePublished": post.date,
            "author": {
              "@type": "Person",
              "name": "Naman Jain",
              "url": "https://namanoncode.me"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Naman Jain Technical Blog",
              "logo": {
                "@type": "ImageObject",
                "url": "https://blogs.namanoncode.me/favicon.svg"
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "https://blogs.namanoncode.me/post/" + post.id
            },
            "keywords": post.tags.join(', ')
          })
        }} 
      />

      <Link to="/" className="inline-flex items-center gap-2 text-java-light/50 hover:text-java-orange mb-8 transition-colors font-mono text-sm">
        <ArrowLeft size={16} /> cd ..
      </Link>

      <div className="mb-10">
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map(tag => (
            <span key={tag} className="px-3 py-1 bg-java-darker/50 border border-java-blue/30 rounded text-xs font-mono text-java-blue flex items-center gap-1">
              <Tag size={12} /> {tag}
            </span>
          ))}
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
          {post.title}
        </h1>
        
        <div className="flex items-center gap-6 text-sm font-mono text-java-light/50 pb-8 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-java-orange" />
            {post.date}
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-java-blue" />
            {post.readTime}
          </div>
        </div>
      </div>

      <div className="prose prose-invert prose-lg max-w-none text-java-light/80 leading-relaxed">
        <p className="text-xl text-java-light/90 italic mb-8 border-l-4 border-java-orange pl-4">
          {post.summary}
        </p>
        
        <div 
          className="glass-panel p-8 mt-8 text-java-light/90 font-sans" 
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
      </div>
    </div>
  );
};

export default BlogPost;
