export const companies = [
  {
    id: 'product',
    name: 'Product-Based (FAANG / Tier-1)',
    badge: 'Tier 1 Focus',
    examples: ['Google', 'Microsoft', 'Amazon', 'Uber', 'Atlassian'],
    description: 'Deep dive into Concurrency, Low-Level System Design, OS Internals, and SOLID OOP Architecture.',
    emphasis: { oops: 'High', os: 'High', dbms: 'Medium', cn: 'Low' },
    priorityTopicIds: ['os-i2', 'os-i3', 'os-a1', 'os-a2', 'db-i3', 'db-a2', 'db-a3', 'oop-i3', 'oop-a1', 'oop-a3'],
    targetRoleTips: 'Expect rigorous questions on multithreading race conditions, memory leaks, and scalable object-oriented design patterns.'
  },
  {
    id: 'service',
    name: 'Service-Based / Mass Recruiters',
    badge: 'Campus Drives',
    examples: ['TCS Digital/Ninja', 'Infosys DSE', 'Wipro', 'Cognizant', 'Accenture'],
    description: 'Focuses on foundational core CS fundamentals, SQL querying, basic OOP principles, and networking basics.',
    emphasis: { oops: 'Medium', dbms: 'Medium', os: 'Medium', cn: 'Medium' },
    priorityTopicIds: ['os-b1', 'os-b2', 'os-b3', 'db-b1', 'db-b3', 'cn-b1', 'cn-b3', 'oop-b1', 'oop-b2', 'oop-i1'],
    targetRoleTips: 'Focus on clear definitions, standard SQL queries (Joins, Aggregates), and fundamental OSI model layers.'
  },
  {
    id: 'data',
    name: 'Data & Backend / Fintech',
    badge: 'Data Heavy',
    examples: ['Snowflake', 'Oracle', 'Goldman Sachs', 'Morgan Stanley', 'Databricks'],
    description: 'Heavy emphasis on Database Normalization, Indexing internals (B+ Trees), Transactions (ACID, WAL), and Concurrency.',
    emphasis: { dbms: 'High', os: 'Medium', oops: 'Medium', cn: 'Low' },
    priorityTopicIds: ['db-b3', 'db-i2', 'db-i3', 'db-a1', 'db-a2', 'db-a3', 'os-i2', 'os-i3', 'oop-a3'],
    targetRoleTips: 'Be prepared to write complex subqueries, design normalized schemas, and explain transaction isolation levels.'
  },
  {
    id: 'cloud',
    name: 'Networking, Cloud & DevOps',
    badge: 'Infra & Cloud',
    examples: ['Cisco', 'Arista', 'Cloudflare', 'AWS', 'Akamai'],
    description: 'Demands deep mastery of Computer Networks (TCP/IP stack, routing, DNS), Socket Programming, and OS System Calls.',
    emphasis: { cn: 'High', os: 'High', dbms: 'Low', oops: 'Low' },
    priorityTopicIds: ['cn-b3', 'cn-i3', 'cn-a1', 'cn-a2', 'cn-a3', 'os-b2', 'os-b3', 'os-i1', 'os-i2', 'os-a1'],
    targetRoleTips: 'Expect in-depth questions on the TCP 3-way handshake, socket states, packet routing algorithms, and OS kernel modes.'
  }
];
