export const questions = {
  os: [
    {
      id: 1,
      text: 'What is the main function of an Operating System?',
      options: ['Resource Management', 'Compiling code', 'Web Browsing', 'Database Management'],
      correctIndex: 0
    },
    {
      id: 2,
      text: 'Which scheduling algorithm allocates the CPU first to the process that requests the CPU first?',
      options: ['SJF', 'FCFS', 'Round Robin', 'Priority Scheduling'],
      correctIndex: 1
    },
    {
      id: 3,
      text: 'What is a critical section?',
      options: ['A bug in the OS', 'A hardware failure', 'A part of the program where shared resources are accessed', 'The boot block'],
      correctIndex: 2
    },
    {
      id: 4,
      text: 'Which of the following is not a valid state of a process?',
      options: ['Ready', 'Running', 'Blocked', 'Compiled'],
      correctIndex: 3
    },
    {
      id: 5,
      text: 'What is virtual memory?',
      options: ['Memory on the GPU', 'A technique that allows execution of processes that are not completely in memory', 'Cache memory', 'A type of ROM'],
      correctIndex: 1
    }
  ],
  dbms: [
    { id: 1, text: 'What does SQL stand for?', options: ['Structured Query Language', 'Strong Question Language', 'Structured Query Logic', 'Simple Query Language'], correctIndex: 0 },
    { id: 2, text: 'Which normal form eliminates partial dependency?', options: ['1NF', '2NF', '3NF', 'BCNF'], correctIndex: 1 },
    { id: 3, text: 'What is a primary key?', options: ['A key that unlocks the DB', 'A unique identifier for a record', 'A foreign key', 'A non-unique index'], correctIndex: 1 },
    { id: 4, text: 'Which property ensures transactions are fully completed or not at all?', options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'], correctIndex: 0 },
    { id: 5, text: 'What is the purpose of an index?', options: ['To slow down queries', 'To speed up data retrieval', 'To encrypt data', 'To backup data'], correctIndex: 1 },
  ],
  cn: [
    { id: 1, text: 'How many layers are in the OSI model?', options: ['5', '6', '7', '8'], correctIndex: 2 },
    { id: 2, text: 'Which protocol is used for secure communication over the web?', options: ['HTTP', 'HTTPS', 'FTP', 'SMTP'], correctIndex: 1 },
    { id: 3, text: 'What is a MAC address?', options: ['IP address', 'Physical address of a network interface', 'Email address', 'Web address'], correctIndex: 1 },
    { id: 4, text: 'Which layer is responsible for routing?', options: ['Data Link Layer', 'Network Layer', 'Transport Layer', 'Application Layer'], correctIndex: 1 },
    { id: 5, text: 'TCP is a connection-oriented protocol.', options: ['True', 'False'], correctIndex: 0 },
  ],
  oops: [
    { id: 1, text: 'What is encapsulation?', options: ['Hiding implementation details', 'Inheriting from multiple classes', 'Polymorphism', 'Overloading methods'], correctIndex: 0 },
    { id: 2, text: 'Can a class implement multiple interfaces in Java?', options: ['Yes', 'No'], correctIndex: 0 },
    { id: 3, text: 'Which concept allows a method to behave differently based on the object?', options: ['Encapsulation', 'Abstraction', 'Polymorphism', 'Inheritance'], correctIndex: 2 },
    { id: 4, text: 'What is an abstract class?', options: ['A class that cannot be instantiated', 'A class with no methods', 'A final class', 'A class with only static methods'], correctIndex: 0 },
    { id: 5, text: 'Inheritance models a "HAS-A" relationship.', options: ['True', 'False (It models IS-A)'], correctIndex: 1 },
  ]
};
