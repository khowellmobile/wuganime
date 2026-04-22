# Django-React Web App Template

A streamlined boilerplate designed to accelerate the transition from idea to production. This template integrates a **Vite-powered React** frontend with a **Django** backend, pre-configured with essential utilities and authentication.

---

### 🚀 Overview
The goal of this repository is to eliminate repetitive setup tasks. Instead of configuring Vite and Django from scratch, this template provides a cohesive, "batteries-included" starting point.

**Key Features:**
* **Full-Stack Integration:** Seamlessly connected React (Vite) and Django environments.
* **Authentication Ready:** Pre-built login system and splash page.
* **Database Foundation:** Default tables and models ready for migration.
* **Developer Utilities:** Integrated tools to speed up common development patterns.

---

### 🛠️ Quick Start

#### 1. Backend Setup
```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### 2. Backend Setup
```bash
# Install packages
npm install

# Start development server
npm run dev
```

#### 3. Environment Setup
Create a .env file in the /frontend directory and add your backend API URL:

Code snippet
```bash
VITE_BASE_URL="http://localhost:8000"
```
Using an environment file allows the frontend to easily switch between local development and production API endpoints.

### 📈 Project Status
This template is currently a **Work in Progress**. It is being optimized to serve as the definitive starting point for React-Django web applications.
