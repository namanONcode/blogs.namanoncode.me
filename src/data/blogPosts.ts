export const blogPosts = [
  {
    id: 'waking-up-event-loop-eventfd',
    title: 'Waking Up an Event Loop: How zThread Uses eventfd',
    date: '2026-08-09',
    readTime: '6 min read',
    tags: ['Java', 'Linux', 'Concurrency', 'Kernel'],
    summary: 'How do you wake a Java thread blocked in epoll_wait() from an entirely different thread? A deep dive into Linux eventfd and lock-free queues.',
    content: `
      <div class="space-y-6">
        <p class="text-xl text-java-light/90 italic mb-8 border-l-4 border-java-orange pl-4">What happens when you send a custom event to an event loop? How does a Java thread wake an event loop that is fast asleep inside a kernel syscall?</p>
        
        <p>While building <a href="https://github.com/namanONcode/zThread" target="_blank" rel="noopener noreferrer" class="text-java-orange hover:underline">zThread</a>, this was one of the most interesting problems I had to solve. The event loop is a single thread. Most of the time, it is blocked inside <code>epoll_wait()</code>, consuming zero CPU while waiting for network I/O.</p>
        
        <p>But what if a completely different thread—say, an HTTP request handler running on a worker thread—needs to submit a background task back to the event loop?</p>
        
        <h2 class="text-2xl font-bold text-java-orange mt-8">The Problem: Crossing the Boundary</h2>
        <p>In standard Java concurrency, if Thread A wants to wake Thread B, it uses <code>Object.notify()</code>, <code>LockSupport.unpark()</code>, or inserts an item into a <code>BlockingQueue</code>. The JVM handles the wake-up logic.</p>
        
        <p>But in a native event runtime, Thread B isn't waiting on a JVM lock. It's blocked inside the Linux kernel on an <code>epoll_wait()</code> syscall. The JVM doesn't know how to interrupt that gracefully without messy thread interrupts.</p>
        
        <p>We absolutely do not want the event loop to continuously poll a queue to see if other threads have submitted work. Busy polling wastes CPU cycles and destroys power efficiency.</p>
        
        <h2 class="text-2xl font-bold text-java-orange mt-8">The Linux Solution: eventfd</h2>
        <p>The answer is a specialized Linux mechanism called <code>eventfd</code>.</p>
        
        <p>An <code>eventfd</code> is a file descriptor representing an 8-byte unsigned integer counter maintained by the kernel. Because it is a file descriptor, it can be registered with <code>epoll</code> exactly like a TCP socket.</p>
        
        <p>This allows the event loop to wait for completely different kinds of events through the exact same mechanism.</p>
        
        <h2 class="text-2xl font-bold text-java-orange mt-8">The Architecture: MPSC + eventfd</h2>
        <p>Instead of passing the actual data through the kernel, zThread uses a hybrid approach combining a lock-free queue in user-space with a kernel-assisted wake-up signal.</p>
        
        <div class="not-prose my-10 p-4 md:p-8 bg-[#0a0a10] border border-white/10 rounded-xl shadow-2xl relative overflow-hidden group">
          <!-- Title -->
          <div class="text-center mb-8">
            <h3 class="text-2xl font-bold text-white mb-2">Eventfd: The Wake-Up Signal</h3>
            <p class="text-java-light/60 text-sm">How eventfd connects producers to a Linux epoll-based event loop. Hover over elements to explore.</p>
          </div>
          
          <!-- Main Flow Container -->
          <div class="flex flex-col xl:flex-row items-center xl:items-start justify-between gap-4 md:gap-8 relative z-10">
            
            <!-- Producers -->
            <div class="flex flex-col gap-3 w-full xl:w-auto z-10 transition-transform hover:-translate-y-1">
              <div class="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 text-center text-blue-200 font-medium text-sm">Producers</div>
              <div class="flex xl:flex-col gap-2 justify-center flex-wrap">
                <div class="bg-[#1a1a24] border border-white/10 rounded p-2.5 text-xs text-center flex items-center justify-center gap-2 hover:border-blue-400/50 hover:bg-blue-900/30 transition-colors cursor-default">
                  <svg class="w-3.5 h-3.5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg> Thread 1
                </div>
                <div class="bg-[#1a1a24] border border-white/10 rounded p-2.5 text-xs text-center flex items-center justify-center gap-2 hover:border-purple-400/50 hover:bg-purple-900/30 transition-colors cursor-default">
                  <svg class="w-3.5 h-3.5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg> Thread 2
                </div>
                <div class="bg-[#1a1a24] border border-white/10 rounded p-2.5 text-xs text-center flex items-center justify-center gap-2 hover:border-green-400/50 hover:bg-green-900/30 transition-colors cursor-default">
                  <svg class="w-3.5 h-3.5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg> Thread N
                </div>
              </div>
            </div>

            <!-- Arrow down/right -->
            <div class="hidden xl:flex text-blue-500/50 animate-pulse items-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </div>
            <div class="flex xl:hidden text-blue-500/50 animate-pulse rotate-90 my-1">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </div>

            <!-- MPSC Buffer -->
            <div class="bg-blue-950/20 border-2 border-blue-500/30 rounded-xl p-5 w-full xl:w-48 text-center relative hover:border-blue-400 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all z-10 group/mpsc">
              <div class="text-blue-300 font-bold mb-3 text-sm">MPSC Ring Buffer</div>
              <div class="w-12 h-12 mx-auto mb-3 border-[3px] border-dashed border-blue-400/60 rounded-full animate-[spin_8s_linear_infinite] group-hover/mpsc:border-blue-400 group-hover/mpsc:animate-[spin_3s_linear_infinite]"></div>
              <div class="text-[10px] leading-tight text-blue-200/70">Lock-free queue for<br/>custom events</div>
              <div class="absolute -top-3 -right-3 bg-blue-500 text-white text-[9px] px-2 py-0.5 rounded-full opacity-0 group-hover/mpsc:opacity-100 transition-opacity whitespace-nowrap shadow-lg">post(event)</div>
            </div>

            <!-- Arrow -->
            <div class="hidden xl:flex text-green-500/50 items-center relative group/arrow">
              <svg class="w-5 h-5 group-hover/arrow:text-green-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              <span class="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-green-400 whitespace-nowrap bg-green-950/80 px-1.5 py-0.5 rounded border border-green-500/30">write(1)</span>
            </div>
            <div class="flex xl:hidden text-green-500/50 rotate-90 relative my-1">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              <span class="absolute top-1/2 left-6 -translate-y-1/2 text-[10px] text-green-400 whitespace-nowrap bg-green-950/80 px-1.5 py-0.5 rounded border border-green-500/30 -rotate-90">write(1)</span>
            </div>

            <!-- eventfd -->
            <div class="bg-green-950/20 border-2 border-green-500/30 rounded-xl p-5 w-full xl:w-44 text-center hover:border-green-400 hover:shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all z-10 group/efd">
              <div class="text-green-400 font-bold mb-1 text-sm">eventfd</div>
              <div class="text-[10px] text-green-300/70 mb-3">(wakeup fd)</div>
              <div class="w-10 h-10 mx-auto mb-3 bg-green-500/10 border-2 border-green-500/50 rounded flex items-center justify-center text-green-400 font-bold text-lg group-hover/efd:bg-green-500/30 transition-colors">E</div>
              <div class="text-[10px] leading-tight text-green-200/70">8-byte counter<br/>(file descriptor)</div>
            </div>

            <!-- Arrow -->
            <div class="hidden xl:flex text-purple-500/50 items-center relative group/repop">
              <svg class="w-5 h-5 group-hover/repop:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              <span class="absolute -top-8 left-1/2 -translate-x-1/2 text-[9px] text-purple-300 whitespace-nowrap text-center leading-tight bg-purple-950/80 px-1 rounded border border-purple-500/30">registered<br/>with epoll</span>
            </div>
            <div class="flex xl:hidden text-purple-500/50 rotate-90 relative my-1">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </div>

            <!-- epoll instance -->
            <div class="bg-purple-950/20 border-2 border-purple-500/30 rounded-xl p-4 w-full xl:w-48 transition-all z-10 hover:border-purple-400 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <div class="flex items-center justify-between mb-3">
                <div class="text-purple-300 font-bold text-xs">epoll instance</div>
                <div class="text-[9px] border border-purple-500/50 rounded px-1 text-purple-400 bg-purple-950/50">epoll</div>
              </div>
              <div class="flex flex-col gap-1.5">
                <div class="bg-green-950/40 border border-green-500/30 rounded p-1.5 flex items-center gap-2 hover:bg-green-900/60 transition-colors">
                   <div class="w-5 h-5 border border-green-500 rounded flex items-center justify-center text-green-400 text-[10px] font-bold">E</div>
                   <div class="text-[10px] text-green-300 leading-tight">eventfd <span class="opacity-70">(wakeup)</span></div>
                </div>
                <div class="bg-yellow-950/40 border border-yellow-500/30 rounded p-1.5 flex items-center gap-2 hover:bg-yellow-900/60 transition-colors">
                   <div class="w-5 h-5 border border-yellow-500 rounded flex items-center justify-center text-yellow-400 text-[10px]"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></div>
                   <div class="text-[10px] text-yellow-300 leading-tight">timerfd <span class="opacity-70">(timer)</span></div>
                </div>
                <div class="bg-blue-950/40 border border-blue-500/30 rounded p-1.5 flex items-center gap-2 hover:bg-blue-900/60 transition-colors">
                   <div class="w-5 h-5 border border-blue-500 rounded flex items-center justify-center text-blue-400 text-[10px]"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg></div>
                   <div class="text-[10px] text-blue-300 leading-tight">socket fd <span class="opacity-70">(network)</span></div>
                </div>
              </div>
            </div>

            <!-- Arrow -->
            <div class="hidden xl:flex text-orange-500/50 items-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </div>
            <div class="flex xl:hidden text-orange-500/50 rotate-90 my-1">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </div>

            <!-- Event Loop -->
            <div class="bg-orange-950/20 border-2 border-orange-500/30 rounded-xl p-4 w-full xl:w-48 hover:border-orange-400 hover:shadow-[0_0_15px_rgba(249,115,22,0.2)] transition-all z-10 group/loop">
              <div class="flex items-center justify-between mb-3">
                <div class="text-orange-300 font-bold text-xs leading-tight">Event Loop<br/><span class="text-[9px] font-normal opacity-70">(Single Thread)</span></div>
                <div class="text-orange-400 group-hover/loop:animate-[spin_2s_linear_infinite]"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg></div>
              </div>
              
              <div class="flex flex-col gap-1.5 relative">
                <!-- Connecting Line -->
                <div class="absolute left-2.5 top-3 bottom-3 w-px bg-orange-500/20"></div>
                
                <div class="flex items-center gap-2.5 relative z-10 bg-[#1a1a24] p-1 rounded border border-transparent hover:border-orange-500/30 hover:bg-orange-900/30 transition-all cursor-default">
                  <div class="w-5 h-5 rounded-full bg-orange-500/20 border border-orange-500 flex items-center justify-center text-orange-400 text-[9px] font-bold shrink-0">1</div>
                  <div class="text-[11px] text-orange-200">drain ring buffer</div>
                </div>
                <div class="flex items-center gap-2.5 relative z-10 bg-orange-900/20 p-1 rounded transition-all cursor-default shadow-[0_0_8px_rgba(249,115,22,0.15)] border border-orange-500/40">
                  <div class="w-5 h-5 rounded-full bg-orange-500 border border-orange-500 flex items-center justify-center text-black text-[9px] font-bold shrink-0">2</div>
                  <div class="text-[11px] text-orange-100 font-mono">epoll_wait() <span class="opacity-50 font-sans text-[9px]">(blocks)</span></div>
                </div>
                <div class="flex items-center gap-2.5 relative z-10 bg-[#1a1a24] p-1 rounded border border-transparent hover:border-orange-500/30 hover:bg-orange-900/30 transition-all cursor-default">
                  <div class="w-5 h-5 rounded-full bg-orange-500/20 border border-orange-500 flex items-center justify-center text-orange-400 text-[9px] font-bold shrink-0">3</div>
                  <div class="text-[11px] text-orange-200">events ready</div>
                </div>
                <div class="flex items-center gap-2.5 relative z-10 bg-[#1a1a24] p-1 rounded border border-transparent hover:border-orange-500/30 hover:bg-orange-900/30 transition-all cursor-default">
                  <div class="w-5 h-5 rounded-full bg-orange-500/20 border border-orange-500 flex items-center justify-center text-orange-400 text-[9px] font-bold shrink-0">4</div>
                  <div class="text-[11px] text-orange-200">process events</div>
                </div>
                <div class="flex items-center gap-2.5 relative z-10 bg-[#1a1a24] p-1 rounded border border-transparent hover:border-orange-500/30 hover:bg-orange-900/30 transition-all cursor-default">
                  <div class="w-5 h-5 rounded-full bg-orange-500/20 border border-orange-500 flex items-center justify-center text-orange-400 text-[9px] font-bold shrink-0">5</div>
                  <div class="text-[11px] text-orange-200">repeat</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Flow description at bottom -->
          <div class="mt-8 pt-5 border-t border-white/10 relative z-10">
            <div class="text-center text-xs font-bold text-white/80 mb-3 uppercase tracking-wider">Execution Flow</div>
            <div class="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 text-[11px] text-java-light/70 text-center font-mono">
              <div class="px-2 py-1 bg-white/5 rounded hover:bg-blue-900/40 hover:text-blue-300 hover:border-blue-500/30 border border-transparent transition-all cursor-default">1. Producer posts</div>
              <div class="hidden md:block text-java-light/30">→</div>
              <div class="px-2 py-1 bg-white/5 rounded hover:bg-green-900/40 hover:text-green-300 hover:border-green-500/30 border border-transparent transition-all cursor-default">2. write(1) to eventfd</div>
              <div class="hidden md:block text-java-light/30">→</div>
              <div class="px-2 py-1 bg-white/5 rounded hover:bg-purple-900/40 hover:text-purple-300 hover:border-purple-500/30 border border-transparent transition-all cursor-default">3. epoll marks readable</div>
              <div class="hidden md:block text-java-light/30">→</div>
              <div class="px-2 py-1 bg-white/5 rounded hover:bg-orange-900/40 hover:text-orange-300 hover:border-orange-500/30 border border-transparent transition-all cursor-default">4. epoll_wait() returns</div>
            </div>
          </div>

          <!-- Background decorative elements -->
          <div class="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute bottom-0 right-1/4 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl pointer-events-none"></div>
        </div>
        
        <h2 class="text-2xl font-bold text-java-orange mt-8">The Execution Flow</h2>
        <p>When a producer thread wants to send an event, the exact sequence is:</p>
        
        <ol class="list-decimal pl-6 space-y-4 text-java-light/90">
          <li><strong>Enqueue the payload:</strong> The producer thread inserts the task into a Multi-Producer Single-Consumer (MPSC) Ring Buffer. This is a lock-free queue in Java memory.</li>
          <li><strong>Signal the kernel:</strong> The producer thread writes the value <code>1</code> (an 8-byte integer) to the <code>eventfd</code> using a fast syscall.</li>
          <li><strong>Kernel Notification:</strong> The Linux kernel instantly marks the <code>eventfd</code> as readable.</li>
          <li><strong>Wake up:</strong> <code>epoll_wait()</code> detects the readable file descriptor and unblocks the event loop thread.</li>
          <li><strong>Process:</strong> The event loop drains the MPSC ring buffer and executes the custom events. Finally, it reads from the <code>eventfd</code> to reset the kernel counter back to zero.</li>
        </ol>
        
        <p>The queue stores the actual work, while the <code>eventfd</code> provides the highly efficient, kernel-assisted wake-up mechanism.</p>
        
        <h2 class="text-2xl font-bold text-java-orange mt-8">Why I Love This Implementation</h2>
        <p>This is one of the implementation details I've enjoyed most while building zThread. It elegantly connects several layers that Java developers normally treat as isolated concepts:</p>
        
        <ul class="list-disc pl-6 space-y-2 text-java-light/90">
          <li>Java Concurrency (Producer/Consumer patterns)</li>
          <li>Lock-free data structures (MPSC Ring Buffers)</li>
          <li>Linux file descriptors</li>
          <li>epoll multiplexing</li>
          <li>Kernel-assisted waiting</li>
        </ul>
        
        <p>It also highlights a beautiful design philosophy in Linux: everything is a file. The event loop doesn't need custom logic to handle cross-thread communication. To <code>epoll</code>, a TCP packet arriving, a timer expiring (<code>timerfd</code>), a file system change (<code>inotify</code>), and a cross-thread wake-up (<code>eventfd</code>) all look exactly the same—just a readable file descriptor.</p>
        
        <h2 class="text-2xl font-bold text-java-orange mt-8">Documenting for Contributors</h2>
        <p>I am continuing to document these internals as I build zThread. My goal is to ensure that future contributors don't need to be Linux kernel experts to understand how the pieces fit together.</p>
        <p>If you want to read the source code mapping Java's Foreign Function Memory API to these Linux syscalls, check out the repository on GitHub.</p>
      </div>
    `
  },
  {
    id: 'building-linux-event-runtime-weekend',
    title: 'How I Built a Linux Event Runtime for Java in One Weekend',
    date: '2026-08-01',
    readTime: '4 min read',
    tags: ['Java', 'Linux', 'Open Source', 'Concurrency'],
    summary: 'From understanding how NGINX uses epoll to publishing a custom Java event runtime on Maven Central.',
    content: `
      <div class="space-y-6">
        <p class="text-xl text-java-light/90 italic mb-8 border-l-4 border-java-orange pl-4">A few weeks ago, I was preparing for backend interviews. One question kept coming up: "How does NGINX handle hundreds of thousands of concurrent connections while using almost no CPU when idle?"</p>
        
        <p>That question sent me down a rabbit hole. I started reading about Linux epoll, Netty, Project Reactor, Node.js (libuv), the Go runtime, Java Virtual Threads, and Linux kernel internals.</p>
        
        <p>By the end of the weekend, I had built my own open-source Java event runtime called zThread.</p>
        
        <h2 class="text-2xl font-bold text-java-orange mt-8">The Curiosity</h2>
        <p>Everything started with a simple observation. Traditional applications typically look like this:</p>
        
        <pre class="bg-black/30 p-4 rounded-lg font-mono text-sm text-java-light/80 overflow-x-auto"><code>while (true) {
    if (queue.hasData()) {
        process();
    }
}</code></pre>

        <p>Or they submit tasks to a thread pool:</p>
        <pre class="bg-black/30 p-4 rounded-lg font-mono text-sm text-java-light/80 overflow-x-auto"><code>executor.submit(task);</code></pre>
        
        <p>But NGINX doesn't do that. Instead, it sleeps inside <code>epoll_wait()</code> until Linux wakes it. That made me wonder: Could Java applications expose something similar?</p>
        
        <h2 class="text-2xl font-bold text-java-orange mt-8">Deep Dive into epoll</h2>
        <p>To understand the solution, you have to understand the execution flow. When an application calls <code>epoll_wait()</code>, control passes to the Linux kernel. The kernel suspends the thread, consuming zero CPU cycles. When the network card receives a packet, it triggers a hardware interrupt. The kernel processes this interrupt and wakes up the exact application thread waiting for that specific socket.</p>
        
        <div class="bg-black/30 p-4 rounded-lg font-mono text-sm text-java-light/80 my-4 text-center space-y-2">
          <div>Application</div>
          <div class="text-java-blue">↓</div>
          <div>epoll_wait()</div>
          <div class="text-java-blue">↓</div>
          <div>Linux Kernel suspends thread</div>
          <div class="text-java-blue">↓</div>
          <div>Network Card receives data</div>
          <div class="text-java-blue">↓</div>
          <div>Kernel wakes application</div>
        </div>
        
        <p>This completely eliminates busy-waiting. You rely entirely on kernel notifications to drive an event-driven architecture.</p>
        
        <h2 class="text-2xl font-bold text-java-orange mt-8">First Wrong Idea</h2>
        <p>I'll be honest. Initially, I thought: Could the JVM's Garbage Collector detect these events? After all, it manages background tasks.</p>
        <p>Then I realized that GC manages memory, while epoll manages I/O. They have completely different responsibilities. Attempting to mix them would be disastrous. This was my first practical lesson in systems architecture.</p>
        
        <h2 class="text-2xl font-bold text-java-orange mt-8">Designing zThread</h2>
        <p>I broke the architecture down into several discrete layers:</p>
        <div class="bg-black/30 p-4 rounded-lg font-mono text-sm text-java-light/80 my-4 text-center space-y-2">
          <div>Java Application</div>
          <div class="text-java-blue">↓</div>
          <div>ZRuntime</div>
          <div class="text-java-blue">↓</div>
          <div>Dispatcher</div>
          <div class="text-java-blue">↓</div>
          <div>Event Loop</div>
          <div class="text-java-blue">↓</div>
          <div>epoll_wait()</div>
          <div class="text-java-blue">↓</div>
          <div>Sockets / eventfd / timerfd / inotify / signalfd</div>
        </div>
        
        <p>The ZRuntime is the entry point for the user. It passes configurations down to the Dispatcher, which manages the core Event Loop. The Event Loop sits inside <code>epoll_wait()</code>, listening across various file descriptors.</p>
        
        <p>But I hit a specific challenge: How do you wake the event loop from a completely different Java thread? If the loop is blocked inside a syscall, you can't just set a boolean flag.</p>
        
        <p>Linux already solved this with <code>eventfd</code>. By registering an event file descriptor with epoll, a producer thread simply writes an 8-byte integer to it. The kernel instantly wakes the sleeping event loop, allowing the Dispatcher to process the new task.</p>
        
        <h2 class="text-2xl font-bold text-java-orange mt-8">The API</h2>
        <p>I wanted the developer experience to remain simple. Here is what the final API looks like:</p>
        <pre class="bg-black/30 p-4 rounded-lg font-mono text-sm text-java-light/80 overflow-x-auto"><code>ZRuntime runtime = ZRuntime.create();
runtime.start();

runtime.post(new CustomEvent());
runtime.schedule(Duration.ofSeconds(1), () -> System.out.println("Timeout"));
runtime.watch(socket);</code></pre>
        
        <h2 class="text-2xl font-bold text-java-orange mt-8">Choosing the Technology</h2>
        <p>Instead of relying on JNI (Java Native Interface), I used the modern <a href="https://openjdk.org/jeps/454" target="_blank" rel="noopener noreferrer" class="text-java-orange hover:underline">Java Foreign Function & Memory API</a>. This choice resulted in safer, cleaner, and more idiomatic Java code. There is absolutely no handwritten C or JNI code in the repository.</p>
        
        <h2 class="text-2xl font-bold text-java-orange mt-8">Benchmarking</h2>
        <p>Benchmarking proved harder than writing the runtime itself. Initially, I compared <code>queue.offer()</code> against <code>eventfd_write()</code>. Someone on a forum pointed out that those aren't equivalent workloads. A queue insertion is an in-memory operation, whereas <code>eventfd_write()</code> crosses the kernel boundary.</p>
        <p>They were absolutely right. I redesigned the entire benchmark suite to compare end-to-end pipelines: Producer submits → Kernel wakes runtime → Dispatcher routes → Handler executes → Completion. This provided a much more realistic picture of the system's capabilities.</p>
        
        <h2 class="text-2xl font-bold text-java-orange mt-8">Publishing</h2>
        <p>After confirming the runtime worked, the real work began. Getting code onto Maven Central requires documentation, examples, reproducible benchmarks, and CI pipelines.</p>
        <p>Finally, <code>io.github.namanoncode:zthread-core:1.0.0</code> became publicly available.</p>
        
        <h2 class="text-2xl font-bold text-java-orange mt-8">What I Learned</h2>
        <ul class="list-decimal pl-6 space-y-2 text-java-light/90">
          <li><strong>Performance isn't everything.</strong> Fair benchmarking matters more than synthetic throughput numbers.</li>
          <li><strong>Kernel syscalls are expensive.</strong> Crossing the user-space boundary takes time, but busy-waiting is objectively worse for system health.</li>
          <li><strong>Understanding Linux makes you a better Java developer.</strong> Many JVM features are just abstractions over kernel primitives.</li>
          <li><strong>Netty is incredibly well engineered.</strong> Building even a tiny event runtime gave me a deep appreciation for Netty's robust design.</li>
          <li><strong>Open source isn't just code.</strong> Documentation, tests, CI, and releases take just as much effort as the core logic.</li>
        </ul>
        
        <h2 class="text-2xl font-bold text-java-orange mt-8">Current Status</h2>
        <p>Today, zThread supports <code>epoll</code>, <code>eventfd</code>, <code>timerfd</code>, <code>signalfd</code>, and <code>inotify</code>. It is fully available on Maven Central.</p>
        <p>My next goals include integrating with Project Reactor, adding an <code>io_uring</code> backend, and abstracting the API for cross-platform support.</p>
        
        <h2 class="text-2xl font-bold text-java-orange mt-8">Why I'm Sharing This</h2>
        <p>I am not claiming this replaces Netty or Project Reactor. The primary goal was to understand how event-driven runtimes work by building one from scratch. The project taught me far more than simply reading documentation ever could.</p>
        <p>If you have experience with JVM internals, Linux systems programming, or Java performance tuning, I'd love to hear your feedback.</p>
        
        <div class="bg-black/30 p-6 rounded-lg border border-white/10 my-6 shadow-xl space-y-4">
          <p><strong>GitHub:</strong> <a href="https://github.com/namanONcode/zThread" target="_blank" rel="noopener noreferrer" class="text-java-orange hover:underline break-all">https://github.com/namanONcode/zThread</a></p>
          <div>
            <p><strong>Maven:</strong></p>
            <pre class="bg-black/50 p-4 rounded font-mono text-sm text-java-light/80 mt-2 overflow-x-auto"><code>&lt;dependency&gt;
    &lt;groupId&gt;io.github.namanoncode&lt;/groupId&gt;
    &lt;artifactId&gt;zthread-core&lt;/artifactId&gt;
    &lt;version&gt;1.0.0&lt;/version&gt;
&lt;/dependency&gt;</code></pre>
          </div>
        </div>
        
        <p class="italic mt-8 border-t border-white/10 pt-8">Sometimes the best way to understand a technology isn't to read about it. It's to build it. That's exactly what zThread was for.</p>
      </div>
    `
  },
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
