/**
 * Curated knowledge base chunks for Retrieval-Augmented Generation (RAG).
 * Grounded in standard technical interview syllabi for OS, DBMS, CN, and OOPs.
 */
export const knowledgeBase = [
  // ==========================
  // OPERATING SYSTEMS (OS)
  // ==========================
  {
    id: 'os-1',
    subject: 'os',
    topic: 'Processes and Threads',
    section: 'OS Internals §1.1',
    title: 'Process vs Thread and Process Control Block (PCB)',
    content: `A Process is an instance of a program in execution, possessing its own independent address space (Text, Data, Heap, Stack). A Thread (lightweight process) is the smallest execution unit within a process; multiple threads in the same process share code, data, and open file descriptors, but each thread has its own Program Counter (PC), registers, and stack.
Key Trade-offs:
- Context Switching: Process context switching involves swapping page tables and cache invalidation (costly). Thread context switching is significantly faster because the address space remains unchanged.
- IPC vs Shared Memory: Processes require Inter-Process Communication (pipes, sockets, message queues, shared memory). Threads communicate directly via shared process heap and variables (requiring synchronization).
- PCB (Process Control Block) stores: PID, Process State (New, Ready, Running, Waiting, Terminated), CPU registers, PC, CPU scheduling info, and memory-management pointers.`,
    keyConcepts: ['process', 'thread', 'pcb', 'context switch', 'lightweight process', 'address space', 'ipc', 'registers', 'stack', 'heap'],
    interviewQuestions: [
      'What is the difference between a process and a thread?',
      'Why is thread switching cheaper than process switching?',
      'What information is stored inside a PCB?'
    ]
  },
  {
    id: 'os-2',
    subject: 'os',
    topic: 'Process Synchronization',
    section: 'Concurrency §2.3',
    title: 'Critical Section, Mutex, and Semaphores',
    content: `A Critical Section is a segment of code accessing shared variables or resources that must not be concurrently accessed by more than one process or thread.
Requirements for a valid solution:
1. Mutual Exclusion: Only one thread can execute in the critical section at any given time.
2. Progress: If no thread is in the critical section, only threads waiting to enter can participate in deciding who enters next.
3. Bounded Waiting: A bound must exist on the number of times other threads can enter after a thread has requested entry (prevents starvation).

Primitives:
- Mutex (Mutual Exclusion Lock): A locking mechanism with ownership. Only the thread that locked the mutex can unlock it. It is binary (0 or 1).
- Semaphore: A signaling mechanism introduced by Dijkstra.
  * Binary Semaphore: Integer value 0 or 1 (similar to mutex, but has no ownership; any thread can signal).
  * Counting Semaphore: Integer value initialized to N, used to manage access to a finite pool of N identical resources.
  * Operations: wait() / P() decrements the counter (blocks if <= 0); signal() / V() increments the counter.`,
    keyConcepts: ['critical section', 'mutex', 'semaphore', 'mutual exclusion', 'bounded waiting', 'progress', 'counting semaphore', 'binary semaphore', 'race condition'],
    interviewQuestions: [
      'What is a race condition and how do you prevent it?',
      'Differentiate between a Mutex and a Semaphore.',
      'Can a thread unlock a mutex acquired by another thread?'
    ]
  },
  {
    id: 'os-3',
    subject: 'os',
    topic: 'Deadlocks',
    section: 'Concurrency §2.5',
    title: 'Deadlock Conditions and Banker\'s Algorithm',
    content: `A Deadlock is a situation where a set of processes are blocked because each process is holding a resource and waiting for another resource acquired by some other process.
Coffman Conditions (All 4 must hold simultaneously for deadlock):
1. Mutual Exclusion: At least one resource is held in a non-shareable mode.
2. Hold and Wait: A process holds at least one resource and is waiting to acquire additional resources held by others.
3. No Preemption: Resources cannot be preempted; they are released only voluntarily by the holding process.
4. Circular Wait: A closed chain of processes exists such that each process holds one resource needed by the next.

Handling Strategies:
- Deadlock Prevention: Invalidate at least one of the 4 Coffman conditions (e.g., impose strict global resource ordering to eliminate circular wait).
- Deadlock Avoidance: System assesses resource allocation state before granting requests using Banker's Algorithm (checks if granting leads to a Safe State).
- Deadlock Detection and Recovery: Allow deadlocks to occur, periodically run cycle detection (Wait-For Graph), and recover via process termination or resource preemption.`,
    keyConcepts: ['deadlock', 'coffman conditions', 'banker algorithm', 'safe state', 'circular wait', 'hold and wait', 'mutual exclusion', 'resource allocation graph', 'wait-for graph'],
    interviewQuestions: [
      'What are the four necessary conditions for a deadlock?',
      'Explain Banker\'s algorithm for deadlock avoidance.',
      'How can you prevent circular wait in multi-threaded applications?'
    ]
  },
  {
    id: 'os-4',
    subject: 'os',
    topic: 'Memory Management',
    section: 'Virtual Memory §3.2',
    title: 'Paging, Segmentation, and Virtual Memory',
    content: `Virtual Memory provides an illusion of a large contiguous memory space exceeding physical RAM, implemented via demand paging.
Paging:
- Divides physical memory into fixed-size blocks called Frames, and logical address space into equal-sized blocks called Pages.
- Eliminates External Fragmentation entirely, but can suffer from Internal Fragmentation (unused space in the last page).
- Hardware Translation: The MMU (Memory Management Unit) uses a Page Table to translate Logical Address (Page Number + Offset) to Physical Address (Frame Number + Offset).
- TLB (Translation Lookaside Buffer): A high-speed associative hardware cache for fast page table lookups. TLB hit avoids accessing main memory twice.

Page Fault Handling:
1. CPU references page whose valid-invalid bit in the page table is 0 (invalid/not in RAM).
2. Trap to OS kernel (Page Fault interrupt).
3. OS checks validity of reference; locates page on secondary storage (swap/disk).
4. OS finds a free frame (or evicts a victim frame via page replacement algorithms like LRU, FIFO, or Clock).
5. Disk I/O reads requested page into frame; page table updated (valid bit = 1).
6. Instruction is restarted.

Paging vs Segmentation:
- Paging is fixed-size and transparent to programmer (avoids external fragmentation).
- Segmentation is variable-size based on logical segments (Code, Stack, Heap) reflecting programmer's view (can suffer from external fragmentation).`,
    keyConcepts: ['virtual memory', 'paging', 'segmentation', 'page fault', 'tlb', 'frame', 'internal fragmentation', 'external fragmentation', 'lru', 'mmu'],
    interviewQuestions: [
      'Explain how a Page Fault is resolved step-by-step.',
      'What is the difference between Paging and Segmentation?',
      'Why does TLB hit speed up memory access?'
    ]
  },
  {
    id: 'os-5',
    subject: 'os',
    topic: 'CPU Scheduling',
    section: 'Process Scheduling §1.4',
    title: 'CPU Scheduling Algorithms and Turnaround Time',
    content: `CPU Scheduling determines which process in the Ready queue is assigned CPU core execution by the dispatcher.
Key Scheduling Metrics:
- Turnaround Time = Completion Time - Arrival Time.
- Waiting Time = Turnaround Time - Burst Time.
- Response Time = Time from submission to first CPU response.

Algorithms:
1. FCFS (First-Come, First-Served): Non-preemptive, simple, suffers from Convoy Effect (short processes wait behind long CPU-burst process).
2. SJF (Shortest Job First): Provably optimal average waiting time; non-preemptive or preemptive (SRTF: Shortest Remaining Time First). Hard to know burst times in advance.
3. Round Robin (RR): Preemptive, designed for time-sharing. Each process gets a fixed Time Quantum.
   - If quantum is too large: degrades to FCFS.
   - If quantum is too small: high context switching overhead.
4. Priority Scheduling: Priority inversion can occur (low priority holding lock needed by high priority); solved by Priority Inheritance Protocol.`,
    keyConcepts: ['cpu scheduling', 'fcfs', 'sjf', 'round robin', 'time quantum', 'convoy effect', 'turnaround time', 'waiting time', 'preemptive', 'priority inversion'],
    interviewQuestions: [
      'What is the convoy effect in FCFS scheduling?',
      'How do you choose the ideal time quantum in Round Robin?',
      'What is priority inversion and how is it resolved?'
    ]
  },

  // ==========================
  // DATABASE MANAGEMENT (DBMS)
  // ==========================
  {
    id: 'dbms-1',
    subject: 'dbms',
    topic: 'Transactions and ACID',
    section: 'Transaction Management §4.1',
    title: 'ACID Properties and Transaction States',
    content: `A Transaction is a logical unit of database processing consisting of one or more SQL operations.
ACID Properties guarantee database reliability:
- A - Atomicity: "All or nothing". Either all operations succeed and commit, or in the event of failure, the entire transaction is rolled back. Maintained by the Transaction Log / Undo-Redo Logs.
- C - Consistency: Database transitions from one valid state satisfying all integrity constraints (foreign keys, check constraints) to another.
- I - Isolation: Concurrent execution of transactions yields the same database state as if they were executed serially. Maintained by Concurrency Control protocols (Locking, 2PL, MVCC).
- D - Durability: Once a transaction commits, its modifications persist permanently even in the event of power loss or crash. Maintained by write-ahead logging (WAL).`,
    keyConcepts: ['acid', 'atomicity', 'consistency', 'isolation', 'durability', 'wal', 'write-ahead logging', 'commit', 'rollback', 'transaction log'],
    interviewQuestions: [
      'Explain the ACID properties with real-world banking examples.',
      'How does a DBMS ensure durability across system crashes?',
      'What is Write-Ahead Logging (WAL)?'
    ]
  },
  {
    id: 'dbms-2',
    subject: 'dbms',
    topic: 'Concurrency Control',
    section: 'Transaction Management §4.3',
    title: 'Transaction Isolation Levels and Anomalies',
    content: `Concurrency anomalies happen when transactions execute simultaneously without adequate isolation:
1. Dirty Read: Transaction T1 reads data modified by T2 before T2 has committed. If T2 aborts, T1 read dirty uncommitted data.
2. Non-Repeatable Read: T1 reads a row; T2 updates/deletes that row and commits; T1 re-reads the row and gets different data.
3. Phantom Read: T1 queries a range of rows matching a WHERE clause; T2 inserts/deletes rows matching that predicate and commits; T1 re-executes query and sees newly inserted "phantom" rows.

SQL Standard Isolation Levels (from lowest to highest isolation):
- Read Uncommitted: Permits dirty reads, non-repeatable reads, phantoms.
- Read Committed: Prevents dirty reads; permits non-repeatable reads and phantoms (default in Postgres, Oracle, SQL Server).
- Repeatable Read: Prevents dirty and non-repeatable reads; permits phantoms (MySQL InnoDB prevents phantoms here using Next-Key Locks).
- Serializable: Highest isolation. Completely eliminates all anomalies via strict serial scheduling or Snapshot Isolation with serializable conflict detection (costly performance penalty).`,
    keyConcepts: ['isolation levels', 'dirty read', 'non-repeatable read', 'phantom read', 'serializable', 'repeatable read', 'read committed', 'mvcc'],
    interviewQuestions: [
      'What is the difference between a dirty read and a phantom read?',
      'Compare Read Committed vs Repeatable Read.',
      'How does PostgreSQL achieve MVCC without table-level locking?'
    ]
  },
  {
    id: 'dbms-3',
    subject: 'dbms',
    topic: 'Database Normalization',
    section: 'Relational Design §2.2',
    title: 'Normal Forms (1NF, 2NF, 3NF, BCNF)',
    content: `Normalization is the systematic process of organizing relational tables to eliminate data redundancy and prevent update, insertion, and deletion anomalies.
Normal Forms:
1. 1NF (First Normal Form):
   - Each column contains atomic (indivisible) values.
   - No repeating groups or arrays. Unique primary key identified.
2. 2NF (Second Normal Form):
   - Table is in 1NF.
   - No Partial Dependency: All non-prime attributes must be fully functionally dependent on the entire composite primary key.
3. 3NF (Third Normal Form):
   - Table is in 2NF.
   - No Transitive Dependency: Non-prime attributes must not depend on other non-prime attributes (X -> Y: either X is a superkey or Y is a prime attribute).
4. BCNF (Boyce-Codd Normal Form / 3.5NF):
   - Strict version of 3NF. For every functional dependency X -> Y, X MUST be a Super Key.
   - Eliminates anomalies arising from multiple overlapping candidate keys.`,
    keyConcepts: ['normalization', '1nf', '2nf', '3nf', 'bcnf', 'partial dependency', 'transitive dependency', 'candidate key', 'superkey', 'redundancy'],
    interviewQuestions: [
      'Differentiate between 3NF and BCNF with an example.',
      'What is a transitive dependency?',
      'Why can excessive normalization negatively impact query read latency?'
    ]
  },
  {
    id: 'dbms-4',
    subject: 'dbms',
    topic: 'Indexing and Storage',
    section: 'Storage Engines §3.1',
    title: 'B-Trees, B+ Trees, and Clustered vs Non-Clustered Indexes',
    content: `An Index is an auxiliary data structure that enhances the speed of data retrieval operations on a table at the cost of additional storage and slower writes (INSERT/UPDATE/DELETE).
B-Tree vs B+ Tree:
- B-Tree: Stores both keys and record pointers in internal nodes as well as leaf nodes.
- B+ Tree (Industry Standard in DBs):
  1. Internal nodes store only search keys (routing pointers), allowing much higher fanout and shallower tree depth (fewer disk I/O reads).
  2. All data pointers/records reside exclusively in the leaf nodes.
  3. Leaf nodes are linked sequentially via a doubly-linked list, enabling O(log N) point lookups AND extremely fast O(range) scan queries.

Clustered vs Non-Clustered Index:
- Clustered Index: Dictates the physical storage order of the rows on disk. Only ONE clustered index can exist per table (usually the Primary Key). Leaves contain the actual row data.
- Non-Clustered (Secondary) Index: Separate structure containing sorted index keys and pointers (RowID or Primary Key value) pointing back to the physical clustered record. A table can have multiple non-clustered indexes.`,
    keyConcepts: ['indexing', 'b-tree', 'b+ tree', 'clustered index', 'non-clustered index', 'range queries', 'leaf nodes', 'fanout', 'disk i/o'],
    interviewQuestions: [
      'Why do relational databases use B+ trees instead of Binary Search Trees or B-trees for indexing?',
      'What is the difference between a clustered and non-clustered index?',
      'When should you NOT create an index on a database column?'
    ]
  },

  // ==========================
  // COMPUTER NETWORKS (CN)
  // ==========================
  {
    id: 'cn-1',
    subject: 'cn',
    topic: 'Network Models',
    section: 'Architecture §1.1',
    title: 'OSI 7-Layer Model vs TCP/IP 4-Layer Model',
    content: `Network models provide modular, layered abstractions for end-to-end data communication.
OSI 7-Layer Reference Model (Top to Bottom):
7. Application: User interface & network services (HTTP, SMTP, FTP, DNS).
6. Presentation: Data syntax, encryption/decryption (TLS/SSL), serialization, compression.
5. Session: Establishes, maintains, and synchronizes communication sessions.
4. Transport: End-to-end process-to-process delivery, segmentation, flow/error control (TCP, UDP). Unit: Segment / Datagram.
3. Network: Logical addressing (IP address) and packet routing across networks (IPv4, IPv6, ICMP, OSPF, BGP). Unit: Packet.
2. Data Link: Framing, physical node-to-node MAC addressing, hop-to-hop flow/error control (Ethernet, Wi-Fi, switches). Unit: Frame.
1. Physical: Transmission of raw binary bits over physical medium (cables, fiber, radio). Unit: Bit.

TCP/IP Model (Practical Standard):
Combines layers into 4: Application (Layers 7, 6, 5) -> Transport (Layer 4) -> Internet (Layer 3) -> Network Access (Layers 2, 1).`,
    keyConcepts: ['osi model', 'tcp/ip', 'transport layer', 'network layer', 'data link', 'packet', 'frame', 'segment', 'mac address', 'ip address'],
    interviewQuestions: [
      'Walk through the OSI layers and name the data unit at each layer.',
      'Which layer does a Router operate on vs a Network Switch?',
      'Why was the 4-layer TCP/IP model adopted over OSI in the real internet?'
    ]
  },
  {
    id: 'cn-2',
    subject: 'cn',
    topic: 'Transport Protocols',
    section: 'Transport Layer §3.2',
    title: 'TCP vs UDP, 3-Way Handshake and Congestion Control',
    content: `Comparison:
- TCP (Transmission Control Protocol): Connection-oriented, reliable (guaranteed in-order delivery via sequence numbers and ACKs), supports Flow Control (Sliding Window) and Congestion Control (Slow Start, Congestion Avoidance, AIMD). Used for HTTP/HTTPS, SSH, FTP, Email.
- UDP (User Datagram Protocol): Connectionless, unreliable, lightweight (no handshake, no ACKs, minimal 8-byte header vs TCP's 20-60 bytes). Used for real-time video streaming, VoIP, DNS lookups, online gaming.

TCP 3-Way Handshake (Connection Establishment):
1. Client -> Server: Sends SYN packet with initial sequence number Seq = x.
2. Server -> Client: Responds with SYN-ACK packet with Seq = y and Ack = x + 1.
3. Client -> Server: Sends ACK packet with Ack = y + 1. Connection established.

TCP 4-Way Handshake (Connection Termination):
1. Client -> Server: Sends FIN packet.
2. Server -> Client: Sends ACK packet (server enters CLOSE_WAIT).
3. Server -> Client: When finished sending remaining data, sends FIN packet.
4. Client -> Server: Sends ACK packet and waits for TIME_WAIT duration (2*MSL) before closing to ensure the final ACK reached the server.`,
    keyConcepts: ['tcp', 'udp', '3-way handshake', 'syn', 'ack', 'fin', 'congestion control', 'flow control', 'sliding window', 'time_wait'],
    interviewQuestions: [
      'Explain the TCP 3-way handshake step-by-step.',
      'Why is TIME_WAIT state necessary in TCP teardown?',
      'What happens during TCP slow start?'
    ]
  },
  {
    id: 'cn-3',
    subject: 'cn',
    topic: 'Application Layer and Web Protocols',
    section: 'Application Layer §4.1',
    title: 'DNS Resolution and What Happens When You Type a URL in Browser',
    content: `Classic interview question: "What happens when you type https://www.google.com and press Enter?"
1. URL Parsing & HSTS Check: Browser parses protocol (HTTPS), domain, and port (443).
2. DNS Resolution:
   - Checks Browser Cache -> OS Cache -> Local Hosts file -> Router Cache.
   - If not found, queries Local DNS Resolver (ISP).
   - Resolver queries Root Nameserver (.) -> TLD Nameserver (.com) -> Authoritative Nameserver (google.com) to retrieve IP address.
3. TCP Connection Establishment: Client initiates 3-Way Handshake (SYN, SYN-ACK, ACK) with target IP.
4. TLS/SSL Handshake (HTTPS):
   - ClientHello (supported cipher suites, TLS version).
   - ServerHello + sends digital certificate containing public key signed by trusted CA.
   - Client validates certificate, generates pre-master secret encrypted with server's public key.
   - Both derive symmetric session keys for encrypted communication.
5. HTTP Request & Response: Browser sends HTTP GET request; Server returns HTTP 200 OK with HTML.
6. Browser Rendering: DOM & CSSOM trees parsed, Render tree constructed, Layout computed, and pixels painted.`,
    keyConcepts: ['dns', 'url flow', 'https', 'tls handshake', 'ssl', 'certificate authority', 'symmetric encryption', 'asymmetric encryption', 'browser cache'],
    interviewQuestions: [
      'Describe the complete lifecycle of a URL request from keystroke to page render.',
      'How does DNS recursive resolution work?',
      'Differentiate symmetric vs asymmetric encryption in TLS.'
    ]
  },

  // ==========================
  // OBJECT-ORIENTED PROGRAMMING (OOPS)
  // ==========================
  {
    id: 'oops-1',
    subject: 'oops',
    topic: 'Core OOP Principles',
    section: 'OOP Fundamentals §1.1',
    title: 'The 4 Pillars of Object-Oriented Programming',
    content: `Object-Oriented Programming (OOP) is structured around objects containing data fields and methods.
The Four Fundamental Pillars:
1. Encapsulation: Bundling data (state) and methods operating on that data into a single unit (class), while restricting direct external access to internal components using access specifiers (private, protected, public). Achieved via getters/setters and data hiding.
2. Abstraction: Hiding internal implementation complexity and exposing only relevant, high-level interfaces to the user (e.g., driver steps on gas pedal without needing to know combustion mechanics). Achieved via Abstract Classes and Interfaces.
3. Inheritance: Mechanism where a child/derived class inherits fields and methods from a parent/base class ("IS-A" relationship), promoting code reuse and hierarchical classification.
4. Polymorphism: "Many forms" - the ability of a single interface or method call to execute different behaviors depending on the runtime instance.`,
    keyConcepts: ['encapsulation', 'abstraction', 'inheritance', 'polymorphism', 'data hiding', 'is-a relationship', 'class', 'object', 'access modifiers'],
    interviewQuestions: [
      'Explain the 4 pillars of OOP with intuitive examples.',
      'How does encapsulation differ from data abstraction?',
      'What are access modifiers and what are their scopes?'
    ]
  },
  {
    id: 'oops-2',
    subject: 'oops',
    topic: 'Polymorphism and Inheritance',
    section: 'Advanced OOP §2.1',
    title: 'Compile-Time vs Runtime Polymorphism & Abstract Classes vs Interfaces',
    content: `Types of Polymorphism:
1. Compile-Time (Static) Polymorphism: Resolved at compilation.
   - Method Overloading: Multiple methods in the same class with identical names but different parameter lists (type, count, order). Return type alone is insufficient.
   - Operator Overloading (e.g., in C++ or Python).
2. Runtime (Dynamic) Polymorphism: Resolved during program execution via dynamic method dispatch (vtable / virtual method table).
   - Method Overriding: A subclass provides its own specific implementation of a method already defined in its parent class with the exact same signature and return type.

Abstract Class vs Interface:
- Abstract Class: Represents core identity ("IS-A"). Can have constructors, state (instance variables), concrete implemented methods, and abstract methods. A class can inherit only one abstract class (single inheritance).
- Interface: Represents capability or contract ("CAN-DO"). Historically all methods were abstract (Java 8 introduced default/static methods). Variables are implicitly public static final. A class can implement multiple interfaces (achieving multiple inheritance of type).`,
    keyConcepts: ['overloading', 'overriding', 'runtime polymorphism', 'compile-time polymorphism', 'abstract class', 'interface', 'vtable', 'dynamic dispatch'],
    interviewQuestions: [
      'What is the difference between method overloading and method overriding?',
      'When would you choose an abstract class over an interface?',
      'Explain how the Virtual Table (vtable) enables dynamic method dispatch.'
    ]
  },
  {
    id: 'oops-3',
    subject: 'oops',
    topic: 'Design Principles',
    section: 'Software Design §3.1',
    title: 'SOLID Design Principles for Clean Architecture',
    content: `SOLID represents 5 architectural design principles for maintainable, decoupled, and scalable object-oriented software:
1. S - Single Responsibility Principle (SRP): A class should have one, and only one, reason to change. It should focus exclusively on a single concern.
2. O - Open/Closed Principle (OCP): Software entities (classes, modules) should be open for extension, but closed for modification (extend behavior via inheritance or strategy patterns without altering existing tested code).
3. L - Liskov Substitution Principle (LSP): Subtypes must be substitutable for their base types without altering program correctness (child classes must fulfill all contracts of parent class without throwing unexpected UnsupportedOperationExceptions).
4. I - Interface Segregation Principle (ISP): Clients should not be forced to depend on interfaces they do not use (prefer small, role-specific interfaces over bloated "fat" interfaces).
5. D - Dependency Inversion Principle (DIP): High-level modules should not depend on low-level modules; both should depend on abstractions (interfaces). Abstractions should not depend on details; details should depend on abstractions (enables Dependency Injection).`,
    keyConcepts: ['solid', 'single responsibility', 'open closed', 'liskov substitution', 'interface segregation', 'dependency inversion', 'clean code', 'design patterns'],
    interviewQuestions: [
      'Walk through each letter in SOLID with a brief violation scenario.',
      'Explain the Liskov Substitution Principle and give a classic violation (e.g., Square inheriting Rectangle).',
      'How does Dependency Inversion facilitate unit testing?'
    ]
  }
];
