export const blogPosts = [
  {
    id: 'building-linux-native-java-runtime',
    title: 'What I learned while building a Linux-native Java runtime',
    date: '2026-07-29',
    readTime: '4 min read',
    tags: ['Java', 'Linux', 'Concurrency', 'JVM', 'FFM'],
    summary: "Building my own runtime taught me how modern event-driven systems actually work under the hood. Here are the five biggest lessons I learned about CPU usage, kernel APIs, and performance benchmarking.",
    content: `
      <div class="space-y-6">
        <p>Building zThread taught me far more about Linux and the JVM than I expected.</p>
        <p>When I started this project, my goal wasn't to replace <a href="https://netty.io/" target="_blank" rel="noopener noreferrer" class="text-java-orange hover:underline">Netty</a> or <a href="https://projectreactor.io/" target="_blank" rel="noopener noreferrer" class="text-java-orange hover:underline">Project Reactor</a>. I wanted to understand how modern event-driven systems actually work under the hood. (This same curiosity eventually led to building <a href="/post/reactivechaindb-v2-bypassed-competition" class="text-java-orange hover:underline">ReactiveChainDB v2</a> to bypass CPU limitations entirely.)</p>
        <p>After months of reading <a href="https://man7.org/linux/man-pages/man7/epoll.7.html" target="_blank" rel="noopener noreferrer" class="text-java-orange hover:underline">Linux documentation</a>, JVM internals, NGINX, Netty, and implementing my own runtime, here are the five biggest lessons.</p>

        <h2 class="text-2xl font-bold text-java-orange mt-8">1. "Zero CPU" doesn't exist</h2>
        <p>When I first learned about NGINX and epoll, I kept hearing:</p>
        <p class="italic border-l-4 border-java-orange pl-4">"NGINX uses almost no CPU while waiting."</p>
        <p>I interpreted that as zero CPU.</p>
        <p>That's not actually true.</p>
        <p>What's really happening is:</p>
        
        <div class="bg-black/30 p-4 rounded-lg font-mono text-sm text-java-light/80 my-4 text-center space-y-2">
          <div>Application</div>
          <div class="text-java-blue">↓</div>
          <div>epoll_wait()</div>
          <div class="text-java-blue">↓</div>
          <div>Kernel blocks thread</div>
          <div class="text-java-blue">↓</div>
          <div>No CPU consumed while sleeping</div>
          <div class="text-java-blue">↓</div>
          <div>Kernel wakes thread only when an event occurs</div>
        </div>

        <p>The application still uses CPU while processing events.</p>
        <p>The real optimization is:</p>
        <p class="font-bold">Don't waste CPU while waiting.</p>
        <p>That changed how I thought about concurrency.</p>

        <h2 class="text-2xl font-bold text-java-orange mt-8">2. The kernel already solves waiting</h2>
        <p>Before this project, I assumed event loops were mostly implemented in Java.</p>
        <p>They're not.</p>
        <p>Linux already provides mechanisms for nearly every kind of asynchronous waiting:</p>
        <ul class="list-disc pl-6 space-y-1 text-java-light/90 font-mono text-sm">
          <li>epoll</li>
          <li>eventfd</li>
          <li>timerfd</li>
          <li>signalfd</li>
          <li>inotify</li>
        </ul>
        <p>Instead of writing complicated polling loops, applications can ask the kernel:</p>
        <p class="italic border-l-4 border-java-orange pl-4">"Wake me when something interesting happens."</p>
        <p>That realization became the foundation of zThread.</p>

        <h2 class="text-2xl font-bold text-java-orange mt-8">3. Throughput benchmarks can be misleading</h2>
        <p>One of my earliest benchmarks compared:</p>
        <ul class="list-disc pl-6 space-y-1 text-java-light/90 font-mono text-sm">
          <li>ArrayBlockingQueue.offer()</li>
          <li>eventfd_write()</li>
        </ul>
        <p>The results looked terrible.</p>
        <p>Then I realized I wasn't measuring equivalent work.</p>
        <p>A queue insertion is an in-memory operation.</p>
        <p>An <code>eventfd_write()</code> crosses into the kernel and wakes an event loop.</p>
        <p>Those aren't comparable.</p>
        <p>I completely redesigned the benchmark suite to compare end-to-end event processing pipelines instead of isolated API calls.</p>
        <p>That was probably the most valuable lesson I learned about benchmarking.</p>

        <h2 class="text-2xl font-bold text-java-orange mt-8">4. Foreign Function & Memory API changes everything</h2>
        <p>A few years ago, calling Linux APIs from Java usually meant JNI.</p>
        <p>Today, Java's <a href="https://openjdk.org/jeps/454" target="_blank" rel="noopener noreferrer" class="text-java-orange hover:underline">Foreign Function & Memory (FFM) API</a> makes native interoperability much more approachable.</p>
        <p>For zThread, that meant I could call Linux APIs like:</p>
        <ul class="list-disc pl-6 space-y-1 text-java-light/90 font-mono text-sm">
          <li>epoll_create1</li>
          <li>epoll_wait</li>
          <li>eventfd</li>
          <li>timerfd_create</li>
        </ul>
        <p>directly from Java with a much cleaner integration model.</p>
        <p>It's one of the most exciting additions to the modern JVM ecosystem.</p>

        <h2 class="text-2xl font-bold text-java-orange mt-8">5. Building the runtime was easier than building good benchmarks</h2>
        <p>Ironically, writing the event loop wasn't the hardest part.</p>
        <p>Designing benchmarks that were:</p>
        <ul class="list-disc pl-6 space-y-1 text-java-light/90">
          <li>fair</li>
          <li>reproducible</li>
          <li>statistically meaningful</li>
          <li>comparable across frameworks</li>
        </ul>
        <p>turned out to be significantly more challenging.</p>
        <p>It's surprisingly easy to publish impressive-looking numbers.</p>
        <p>It's much harder to build benchmarks that other engineers trust.</p>
        <p>That experience fundamentally changed how I read performance claims online.</p>

        <h2 class="text-xl font-bold text-java-blue mt-8">What's next for zThread?</h2>
        <p>The project is now:</p>
        <ul class="list-disc pl-6 space-y-1 text-java-light/90">
          <li>Open source</li>
          <li>Available on Maven Central</li>
          <li>Focused on Linux event-driven programming in Java</li>
        </ul>
        <p>My next goals are:</p>
        <ul class="list-disc pl-6 space-y-1 text-java-light/90">
          <li>Better benchmarking</li>
          <li>Reactor integration</li>
          <li>More examples</li>
          <li>Better documentation</li>
          <li>Community feedback</li>
        </ul>

        <h2 class="text-xl font-bold text-java-blue mt-8">Final thoughts</h2>
        <p>This project started as a curiosity:</p>
        <p class="italic border-l-4 border-java-orange pl-4">"How does NGINX actually wait without wasting CPU?"</p>
        <p>That single question led me down a rabbit hole of Linux kernel APIs, JVM internals, concurrency, benchmarking, and systems programming.</p>
        <p>Whether <a href="https://github.com/namanONcode/zThread" target="_blank" rel="noopener noreferrer" class="text-java-orange hover:underline">zThread</a> becomes widely adopted or simply remains a learning project, it has already achieved its biggest goal:</p>
        <p>It taught me how modern event-driven systems really work.</p>
        <p>If you've worked on Netty, Reactor, <a href="https://vertx.io/" target="_blank" rel="noopener noreferrer" class="text-java-orange hover:underline">Vert.x</a>, or JVM performance engineering, I'd love to hear your thoughts or feedback.</p>
        <p>Project link: <a href="https://github.com/namanONcode/zThread" class="text-java-orange hover:underline break-all">https://github.com/namanONcode/zThread</a></p>
        
        <div class="mt-8 aspect-video w-full rounded-xl overflow-hidden border border-white/10 shadow-2xl">
          <iframe 
            width="100%" 
            height="100%" 
            src="https://www.youtube.com/embed/rOwoRVD0NrA" 
            title="YouTube video player" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerpolicy="strict-origin-when-cross-origin" 
            allowfullscreen>
          </iframe>
        </div>
      </div>
    `
  },
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
          <li><strong>p50:</strong> 2ms (ReactiveChainDB v2) vs. 120ms (<a href="https://www.scylladb.com/" target="_blank" rel="noopener noreferrer" class="text-java-orange hover:underline">ScyllaDB</a>)</li>
          <li><strong>p99:</strong> 1,265ms (ReactiveChainDB v2) vs. 28,873ms (ScyllaDB)</li>
        </ul>
        <p>Even at the 99th percentile, the system remains incredibly stable at just ~1.2 seconds, completely outclassing the competition in our test environment. If you want to understand the kernel mechanisms that make this possible, you can read my deep dive on <a href="/post/building-linux-native-java-runtime" class="text-java-orange hover:underline">building a Linux-native Java runtime</a>.</p>
        
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
          <p class="mb-4">The log-scale latency chart above reveals that <strong>ReactiveChainDB v2 consistently achieves the lowest latency profile across all percentiles.</strong></p>
          <ul class="list-disc pl-6 space-y-4 text-java-light/80">
            <li><strong>ReactiveChainDB:</strong> Maintains an ultra-low <strong>2ms median latency</strong> and remains highly performant at the 99th percentile (1,265ms). This advantage is a direct consequence of Phase 1’s Virtual Thread Ingestion pipeline, where the <a href="https://lmax-exchange.github.io/disruptor/" target="_blank" rel="noopener noreferrer" class="text-java-orange hover:underline">LMAX Disruptor</a> decouples transaction acceptance from downstream processing. Because we move the entire consensus and backpressure execution to the GPU with a strict zero-CPU-fallback policy, the hardware-fused execution model natively handles the heavy lifting, eliminating context-switching bottlenecks entirely.</li>
            <li><strong>ScyllaDB:</strong> While its shard-per-core model provides competitive latency at lower volumes (120ms at p50), its performance degrades significantly at the tail end (28,873ms at p99 and 72,509ms at p99.9) as cross-shard coordination overhead increases under extreme ingestion pressure on the CPU.</li>
            <li><strong><a href="https://rocksdb.org/" target="_blank" rel="noopener noreferrer" class="text-java-orange hover:underline">RocksDB</a>:</strong> Constrained by its single-threaded compaction model and CPU bottlenecking, it exhibits severe tail latency spikes across the board, ranging from 8,542ms at the median up to ~68,574ms at the 99.9th percentile.</li>
          </ul>
        </div>
        
        <h3 class="text-xl font-bold text-java-blue mt-10">The Bottleneck: Why CPU-Bound Systems Fail at Scale</h3>
        <p>Traditional database architectures—even highly optimized ones like ScyllaDB—eventually hit a hard ceiling when deployed in extreme-throughput environments. The primary culprit? <strong>CPU context switching and cross-shard coordination.</strong></p>
        <p>In a typical thread-per-core or shard-per-core model, lower volumes are handled gracefully. However, as ingestion pressure surges and cryptographic verification workloads multiply, the CPU spends an increasing percentage of its time simply managing thread states, acquiring locks, and coordinating state across shards rather than executing actual business logic. This is exactly why we see ScyllaDB’s latency explode from 120ms at p50 to a crippling 72,509ms at p99.9.</p>

        <h3 class="text-xl font-bold text-java-blue mt-8">The Solution: Zero-CPU-Fallback & Virtual Thread Ingestion</h3>
        <p>To shatter this ceiling, ReactiveChainDB v2 completely abandons the CPU for heavy execution. By implementing our <strong>Virtual Thread Ingestion pipeline</strong>, we fundamentally decoupled transaction acceptance from downstream processing. We utilize an LMAX Disruptor pattern to rapidly ingest and sequence incoming payloads without blocking.</p>
        <p>Once sequenced, the payloads are offloaded directly to the GPU. Our strict <strong>Zero-CPU-Fallback policy</strong> ensures that under no circumstances does the system attempt to route overflow processing back to the CPU. If the GPU is saturated, our asynchronous backpressure mechanisms engage instantly, applying backpressure at the network edge rather than allowing the internal CPU queues to bloat and crash the node.</p>
        
        <h3 class="text-xl font-bold text-java-blue mt-8">Hardware-Fused Execution: Taming the 99.9th Percentile</h3>
        <p>The true magic of this architecture reveals itself at the tail end of the latency curve. Cryptographic validation—signature verification, hashing, and state trie updates—are notoriously expensive. On a CPU, a few massive transactions can stall an entire shard. On a GPU, thousands of these validations are processed concurrently in massively parallel SIMT (Single Instruction, Multiple Threads) batches.</p>
        <p>This "Hardware-Fused Execution" model prevents large or complex payloads from monopolizing execution resources. The result is undeniable: even at the absolute extreme 99.9th percentile, ReactiveChainDB v2 processes transactions in just 16.5 seconds (16,588ms), whereas legacy architectures are completely overwhelmed, taking over a full minute to recover.</p>
        
        <p class="mt-8 text-java-light/90 italic border-l-4 border-java-orange pl-4">By rethinking the fundamental relationship between the database engine and the underlying hardware, ReactiveChainDB v2 isn't just an iterative improvement—it is a paradigm shift in distributed systems engineering.</p>
        </div>
    `
  }
];
