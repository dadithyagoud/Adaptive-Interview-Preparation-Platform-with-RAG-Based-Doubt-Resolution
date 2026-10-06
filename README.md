# PrepAI - Adaptive CS Interview Preparation Platform

An enterprise-grade, adaptive Computer Science interview preparation and doubt resolution platform built with **Spring Boot 3**, **PostgreSQL / pgvector**, and **React 19 (Vite)**.

---

## 🌟 Key Features

1. **Enterprise Security & Authentication**:
   - Stateless JWT-based authentication (`/api/auth/register`, `/api/auth/login`) with BCrypt password hashing.
   - Company target profiling (Product / FAANG, FinTech, Cloud Infrastructure, Mass Recruiter).

2. **Adaptive Diagnostic Assessments**:
   - 20-Module Operating Systems assessment bank with 320 curated technical questions.
   - Company-specific evaluation modes with live hiring bar cutoffs:
     - **Product / FAANG Tier** (85% cutoff, heavy concurrency & memory weighting)
     - **FinTech Tier** (80% cutoff, heavy transactions & IPC)
     - **Cloud Systems Tier** (75% cutoff, virtualization & file systems)
     - **Mass Recruiter Tier** (60% cutoff, foundational concepts)

3. **RAG-Grounded Doubt Resolution Engine**:
   - Intelligent technical doubt resolution grounded in verified syllabus chunks.
   - Multi-module weak area breakdown synthesizing sequenced 4-phase revision roadmaps with curated high-yield interview questions.
   - Suppression during active test-taking to guarantee exam integrity, automatically restored on the Results review screen.

4. **Analytics Deep Dive & Mastery Matrix**:
   - 20-Module Mastery Heatmap with real-time score tracking.
   - Placement Benchmark cards comparing performance against Google, Amazon, and Microsoft hiring bars.
   - One-click Active Weak Area Action Center for targeted remediation.

---

## 🛠️ Technology Stack

### Backend
- **Framework**: Java 21, Spring Boot 3.3.4
- **Security**: Spring Security 6, JJWT (JSON Web Token)
- **Persistence**: Spring Data JPA, Hibernate ORM
- **Database**: PostgreSQL 16 with pgvector extension (Docker)
- **Build Tool**: Apache Maven

### Frontend
- **Framework**: React 19, Vite
- **Routing**: React Router v7
- **Styling**: Tailwind CSS v4, Lucide React Icons
- **State & Context**: AuthContext, ProgressContext, ThemeContext

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Java Development Kit (JDK 21+)](https://adoptium.net/)
- [Docker Desktop](https://www.docker.com/) (for PostgreSQL)

---

### 1. Database Setup (Docker)
Run the pgvector PostgreSQL container:
```bash
docker run -d --name prepai-db -p 5432:5432 -e POSTGRES_DB=prepaidb -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres pgvector/pgvector:pg16
```

---

### 2. Backend Setup (Spring Boot)
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Start the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```
   *The backend will automatically start on `http://localhost:8080` and seed all 20 modules and 320 questions into PostgreSQL.*

---

### 3. Frontend Setup (React + Vite)
1. In a new terminal, navigate to the project root:
   ```bash
   npm install
   ```
2. Launch the Vite development server:
   ```bash
   npm run dev
   ```
3. Open your browser at `http://localhost:5173`.

---

## 📂 Project Structure

```
├── backend/
│   ├── src/main/java/com/prepai/platform/
│   │   ├── config/          # JWT & Spring Security Filters
│   │   ├── controller/      # REST API Controllers (Auth, Chat, Assessment)
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── entity/          # JPA Entities (Question, KnowledgeChunk, User)
│   │   ├── repository/      # Spring Data Repositories
│   │   ├── seeder/          # Automated Database Seeder
│   │   ├── service/         # Business Logic & RAG Synthesizer
│   │   └── util/            # JWT Token Helpers
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── data/            # OS Curriculum & 320 Question Bank
│   └── pom.xml
├── src/
│   ├── components/          # Reusable UI & ChatWidget
│   ├── context/             # Auth, Progress, and Theme Contexts
│   ├── mockData/            # Client fallback datasets
│   ├── pages/               # Dashboard, Assessment, StudyPlan, ProgressPage
│   ├── services/            # Axios API & RAG resolution clients
│   └── App.jsx
├── package.json
└── vite.config.js
```
