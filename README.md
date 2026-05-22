<div align="center">
  
# 🛡️ Quantara

**Advanced Graph-Based Financial Crime Detection Engine**

[![Python Version](https://img.shields.io/badge/python-3.9%2B-blue.svg)](https://www.python.org/downloads/)
[![React](https://img.shields.io/badge/React-18%2B-61DAFB.svg?logo=react&logoColor=black)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%7C%20Storage-FFCA28.svg?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

*A sophisticated system designed to detect money muling fraud, smurfing patterns, and suspicious transaction rings from financial transaction data using advanced graph theory algorithms.*

</div>

---

## 🚀 Overview

**Quantara** is an enterprise-grade financial crime detection platform. It processes raw CSV transaction data to build complex network graphs, automatically identifying malicious topologies such as cyclical money flows, layered chains, and pass-through shell accounts.

Built with a focus on **performance, accuracy, and visual intelligence**, Quantara provides fraud analysts with both a powerful API and an intuitive, interactive dashboard to investigate suspicious activities.

## 🏗 Architecture

Quantara is built on a modern, scalable technology stack:

| Component | Technologies Used |
| :--- | :--- |
| **Frontend** | React (Vite), Tailwind CSS, Framer Motion, Cytoscape.js (Network Visualization) |
| **Backend** | Python, FastAPI, NetworkX (Graph Processing), Pandas (Data Engineering) |
| **Infrastructure**| Firebase (Authentication, Storage), Uvicorn |

---

## 🔬 Core Detection Algorithms

Our proprietary detection engine implements **7 advanced graph algorithms** to identify financial crime patterns. Each detected pattern contributes to a holistic risk score.

| Algorithm | Description | Impact |
| :--- | :--- | :--- |
| 🔄 **Cycle Detection** | Identifies circular transaction rings (e.g., A → B → C → A) of lengths 3–5. This is a primary indicator of orchestrated money muling. | **+50 Points** |
| 💸 **Pass-Through Ratio** | Detects shell accounts that forward >98% of received funds within 48 hours (`out_amount / in_amount > 0.98`). | **+30 Points** |
| ⏱️ **Temporal Clustering** | Highlights burst activity (≥10 transactions) within any sliding 72-hour window. | **+20 Points** |
| 📥 **Fan-in (Smurfing)** | Detects structuring or "Smurfing" (many small transfers funneling into a single account from ≥10 distinct senders). | **+10 Points** |
| 📤 **Fan-out (Dispersion)** | Detects rapid dispersion of funds (one account distributing to ≥10 distinct receivers). | **+10 Points** |
| 🔗 **Layered Chains** | Maps long transactional pathways (≥3 hops) typical of layering schemes intended to obscure fund origins. | *Contextual* |
| 🛡️ **Merchant Trap Protection** | Automatically identifies legitimate high-volume entities (High Fan-in, Low Pass-Through, No Cycles) and whitelists them to prevent false positives. | **Score Forced to 0** |

### 🚨 Risk Scoring Model

Accounts are evaluated on a **0 to 100** risk scale:
*   🔴 **Score ≥ 60**: Flagged as **Suspicious** (High Risk)
*   🟢 **Score < 60**: Normal / Low Risk

---

## 💻 Quick Start

### Prerequisites
*   Node.js 18+
*   Python 3.9+
*   Firebase Project (for Authentication & Storage)

### 1. Clone & Setup Environment

```bash
git clone https://github.com/your-username/quantara.git
cd quantara
```

Create environment variables by copying the examples:
```bash
cp .env.example .env
```
*Configure your Firebase credentials and JWT secrets in the `.env` file.*

### 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Run the detection engine API
uvicorn main:app --reload --port 8000
```
*The API will be available at `http://localhost:8000`. API Documentation is auto-generated at `http://localhost:8000/docs`.*

### 3. Frontend Setup

```bash
cd frontend
npm install

# Start the development server
npm run dev
```
*The web dashboard will be available at `http://localhost:5173`.*

---

## 📊 Data Input Specification

Quantara ingests standard CSV formats. Your dataset must include the following headers:

```csv
transaction_id,sender_id,receiver_id,amount,timestamp
TX_0001,ACC_982,ACC_104,25000.00,2026-05-20 09:14:22
TX_0002,ACC_104,ACC_442,24800.00,2026-05-20 11:02:15
```

---

## 🐳 Docker Deployment

For enterprise deployments, containerization is supported out of the box.

**Backend Dockerfile Snippet:**
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY backend/ .
RUN pip install -r requirements.txt
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 🔒 Security Posture

Quantara enforces strict security principles:
- **Stateless API:** No sensitive transaction data is permanently persisted on the API server.
- **Secure Authentication:** Managed entirely via Firebase Auth with JWT validation.
- **Trace Sanitization:** Production errors are logged server-side; clients receive sanitized error responses.
- **Environment Isolation:** Secrets, metrics, and debug configurations are strictly excluded from version control.

---

## 🤝 Contributing
Contributions are welcome! Please read our `CONTRIBUTING.md` for details on our code of conduct and the process for submitting pull requests to us.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
<div align="center">
  <i>Engineered with precision for modern financial security.</i>
</div>
