import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { Calendar, Clock, Tag } from 'lucide-react';

// New Article: ReactiveChainDB V2
export const blogPosts = [
  {
    id: 'reactivechaindb-v2-bypassed-competition',
    title: 'ReactiveChainDB V2 just bypassed the competition. 🚀',
    date: '2026-05-01',
    readTime: '6 min read',
    tags: ['Database', 'GPU', 'Performance', 'ReactiveChainDB'],
    summary: "By moving our entire consensus and backpressure execution to the GPU and implementing a strict zero-CPU-fallback policy, we've created a literal \"CPU Bypass.\"",
    content: `
      <div class="space-y-6">
        <h2 class="text-2xl font-bold text-java-orange">Theory</h2>
        <p>By moving our entire consensus and backpressure execution to the GPU and implementing a strict zero-CPU-fallback policy, we've created a literal "CPU Bypass."</p>
        <p>When you stop context-switching on the CPU and let the GPU batch-process the workloads natively, the performance gains are staggering.</p>
        <ul class="list-disc pl-6 space-y-2 text-java-light/90">
          <li><strong>p50:</strong> 2ms (ReactiveChainDB v2) vs. 120ms (ScyllaDB)</li>
          <li><strong>p99:</strong> 1,265ms (ReactiveChainDB v2) vs. 28,873ms (ScyllaDB)</li>
        </ul>
        <p>Even at the 99th percentile, the system remains incredibly stable at just ~1.2 seconds, completely outclassing the competition in our test environment.</p>
        
        <h3 class="text-xl font-bold text-java-blue mt-8">Log-Scale Latency Analysis</h3>
        <p>Take a look at the log-scale chart. The chart highlights the staggering difference in latency across multiple percentiles (p50, p95, p99, and p99.9) for RocksDB, ScyllaDB, and ReactiveChainDB.</p>
        
        <!-- INLINE LATENCY GRAPH -->
        <div class="my-10 bg-black/40 p-6 rounded-xl border border-white/10 shadow-2xl">
          <h4 class="text-xl font-bold text-java-light mb-8 text-center">Latency Comparison (Log Scale)</h4>
          <div class="flex justify-around items-end h-64 gap-2 md:gap-4 px-2">
            <!-- p50 Group -->
            <div class="flex flex-col items-center gap-3 flex-1">
              <div class="flex items-end h-48 w-full gap-1 justify-center">
                <div class="w-1/3 bg-[#3da4db] rounded-t relative group cursor-crosshair hover:brightness-110 transition-all" style="height: 78.6%">
                  <span class="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/80 px-2 py-1 rounded">8,542ms</span>
                </div>
                <div class="w-1/3 bg-[#df742e] rounded-t relative group cursor-crosshair hover:brightness-110 transition-all" style="height: 41.6%">
                  <span class="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/80 px-2 py-1 rounded">120ms</span>
                </div>
                <div class="w-1/3 bg-[#2ecc71] rounded-t relative group cursor-crosshair hover:brightness-110 transition-all shadow-[0_0_15px_rgba(46,204,113,0.5)]" style="height: 6%">
                  <span class="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-mono text-[#2ecc71] font-bold opacity-100">2ms</span>
                </div>
              </div>
              <span class="text-xs md:text-sm text-java-light/70 font-mono border-t border-white/10 pt-2 w-full text-center">p50</span>
            </div>
            
            <!-- p95 Group -->
            <div class="flex flex-col items-center gap-3 flex-1">
              <div class="flex items-end h-48 w-full gap-1 justify-center">
                <div class="w-1/3 bg-[#3da4db] rounded-t relative group cursor-crosshair hover:brightness-110 transition-all" style="height: 95.8%">
                  <span class="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/80 px-2 py-1 rounded">61,530ms</span>
                </div>
                <div class="w-1/3 bg-[#df742e] rounded-t relative group cursor-crosshair hover:brightness-110 transition-all" style="height: 72.8%">
                  <span class="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/80 px-2 py-1 rounded">4,325ms</span>
                </div>
                <div class="w-1/3 bg-[#2ecc71] rounded-t relative group cursor-crosshair hover:brightness-110 transition-all shadow-[0_0_15px_rgba(46,204,113,0.5)]" style="height: 38.4%">
                  <span class="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-mono text-[#2ecc71] font-bold opacity-100">84ms</span>
                </div>
              </div>
              <span class="text-xs md:text-sm text-java-light/70 font-mono border-t border-white/10 pt-2 w-full text-center">p95</span>
            </div>

            <!-- p99 Group -->
            <div class="flex flex-col items-center gap-3 flex-1">
              <div class="flex items-end h-48 w-full gap-1 justify-center">
                <div class="w-1/3 bg-[#3da4db] rounded-t relative group cursor-crosshair hover:brightness-110 transition-all" style="height: 96.6%">
                  <span class="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/80 px-2 py-1 rounded">68,337ms</span>
                </div>
                <div class="w-1/3 bg-[#df742e] rounded-t relative group cursor-crosshair hover:brightness-110 transition-all" style="height: 89.2%">
                  <span class="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/80 px-2 py-1 rounded">28,873ms</span>
                </div>
                <div class="w-1/3 bg-[#2ecc71] rounded-t relative group cursor-crosshair hover:brightness-110 transition-all shadow-[0_0_15px_rgba(46,204,113,0.5)]" style="height: 62.0%">
                  <span class="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-mono text-[#2ecc71] font-bold opacity-100">1,265ms</span>
                </div>
              </div>
              <span class="text-xs md:text-sm text-java-light/70 font-mono border-t border-white/10 pt-2 w-full text-center">p99</span>
            </div>

            <!-- p99.9 Group -->
            <div class="flex flex-col items-center gap-3 flex-1">
              <div class="flex items-end h-48 w-full gap-1 justify-center">
                <div class="w-1/3 bg-[#3da4db] rounded-t relative group cursor-crosshair hover:brightness-110 transition-all" style="height: 96.8%">
                  <span class="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/80 px-2 py-1 rounded">68,574ms</span>
                </div>
                <div class="w-1/3 bg-[#df742e] rounded-t relative group cursor-crosshair hover:brightness-110 transition-all" style="height: 97.2%">
                  <span class="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/80 px-2 py-1 rounded">72,509ms</span>
                </div>
                <div class="w-1/3 bg-[#2ecc71] rounded-t relative group cursor-crosshair hover:brightness-110 transition-all shadow-[0_0_15px_rgba(46,204,113,0.5)]" style="height: 84.4%">
                  <span class="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-mono text-[#2ecc71] font-bold opacity-100">16,588ms</span>
                </div>
              </div>
              <span class="text-xs md:text-sm text-java-light/70 font-mono border-t border-white/10 pt-2 w-full text-center">p99.9</span>
            </div>
          </div>
          
          <div class="flex flex-wrap justify-center gap-6 mt-8 pt-6 border-t border-white/10">
            <div class="flex items-center gap-2"><div class="w-3 h-3 rounded-sm bg-[#3da4db]"></div><span class="text-sm font-mono text-java-light/70">RocksDB</span></div>
            <div class="flex items-center gap-2"><div class="w-3 h-3 rounded-sm bg-[#df742e]"></div><span class="text-sm font-mono text-java-light/70">ScyllaDB</span></div>
            <div class="flex items-center gap-2"><div class="w-3 h-3 rounded-sm bg-[#2ecc71] shadow-[0_0_8px_rgba(46,204,113,0.8)]"></div><span class="text-sm font-mono text-white font-bold">ReactiveChainDB</span></div>
          </div>
        </div>

        <div class="bg-black/30 p-6 rounded-lg border border-white/10 my-6 shadow-xl">
          <h4 class="text-lg font-bold text-java-orange mb-4">Graph Explanation</h4>
          <p class="mb-4">The standard latency profile (Fig. 28) reveals that <strong>ReactiveChainDB v2 consistently achieves the lowest median latency across all transaction volumes.</strong></p>
          <ul class="list-disc pl-6 space-y-4 text-java-light/80">
            <li><strong>ReactiveChainDB:</strong> Maintains an ultra-low <strong>2ms median latency</strong> and remains highly performant at the 99th percentile (1,265ms) and 99.9th percentile (16,588ms). This advantage is a direct consequence of Phase 1’s Virtual Thread Ingestion pipeline, where the LMAX Disruptor decouples transaction acceptance from downstream processing, and the GPU hardware-fused execution model natively handles the heavy lifting.</li>
            <li><strong>ScyllaDB:</strong> While its shard-per-core model provides competitive latency at lower volumes (120ms at p50), its performance degrades significantly at the tail end (28,873ms at p99 and 72,509ms at p99.9) as cross-shard coordination overhead increases under extreme ingestion pressure.</li>
            <li><strong>RocksDB:</strong> Constrained by its single-threaded compaction model and CPU bottlenecking, it exhibits severe tail latency spikes across the board, ranging from 8,542ms at the median up to ~68,574ms at the 99.9th percentile.</li>
          </ul>
        </div>

        <p>The payload processing breakdown (Fig. 39) highlights the distribution of transaction components during ingestion. By leveraging the Virtual Thread pipeline, ReactiveChainDB v2 efficiently categorizes and processes different payload types concurrently. The hardware-fused execution model ensures that larger cryptographic payloads do not monopolize execution threads, maintaining a consistent throughput stream regardless of transaction complexity.</p>

        <p>System efficiency is further detailed in the bubble chart (Fig. 40), which maps the correlation between throughput capacity, median latency, and resource consumption. ReactiveChainDB v2 occupies the optimal quadrant, representing maximum throughput with minimal latency inflation. The clustering of data points confirms the stability provided by the ZeroBlocking Double-Buffered Memtable and the asynchronous backpressure mechanisms under varying load conditions.</p>

        <p>Finally, the network connection stability (Fig. 41) illustrates the resilience of the gossip protocol and peer-to-peer routing layer. The tightly grouped strip plot for ReactiveChainDB v2 indicates minimal connection drops and consistent peer latency, which is essential for maintaining the synchronous DAG progression. This resilience is directly attributed to the Latency-Aware BFS Network Routing executed by the GPU, ensuring that the validator network remains robust even under extreme ingestion pressure.</p>
        
        <!-- SEO Tags at Bottom -->
        <div class="mt-12 pt-8 border-t border-white/10">
          <h4 class="text-sm font-mono text-java-light/50 mb-4">Related Topics:</h4>
          <div class="flex flex-wrap gap-2">
            <span class="px-3 py-1 bg-black/40 border border-java-blue/20 rounded-full text-xs font-mono text-java-blue">#DatabaseArchitecture</span>
            <span class="px-3 py-1 bg-black/40 border border-java-blue/20 rounded-full text-xs font-mono text-java-blue">#GPUComputing</span>
            <span class="px-3 py-1 bg-black/40 border border-java-blue/20 rounded-full text-xs font-mono text-java-blue">#LowLatency</span>
            <span class="px-3 py-1 bg-black/40 border border-java-blue/20 rounded-full text-xs font-mono text-java-blue">#DistributedSystems</span>
            <span class="px-3 py-1 bg-black/40 border border-java-blue/20 rounded-full text-xs font-mono text-java-blue">#PerformanceTuning</span>
            <span class="px-3 py-1 bg-black/40 border border-java-orange/20 rounded-full text-xs font-mono text-java-orange">#ReactiveChainDB</span>
          </div>
        </div>
      </div>
    `
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
