# Comitly - Centralized Version Control System 🚀

![React](https://img.shields.io/badge/React-20232a?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![AWS S3](https://img.shields.io/badge/AWS_S3-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)

**Comitly** is a hybrid Version Control System (VCS) and social coding platform designed to bridge the gap between local development and cloud collaboration. It features a custom **CLI (Command Line Interface)** for version tracking and a **Web Dashboard** for code visualization, mimicking the core functionality of GitHub.

🔗 **Live Demo:** [https://commitly-orpin.vercel.app/](https://commitly-orpin.vercel.app/)

---

## 🌟 Key Features

### 🖥️ Command Line Interface (CLI)
- **`init`**: Initialize a repository and link it to the cloud.
- **`add`**: Recursively stage files and folders for upload.
- **`commit`**: Create a snapshot of the project with a unique ID.
- **`push`**: Dual-upload system — sends metadata to **MongoDB** and file blobs to **AWS S3**.
- **`pull`**: Fetch the latest code from the cloud to your local machine.
- **`revert`**: Rollback your project to any previous commit state.

### 🌐 Web Dashboard
- **Code Visualization**: View code with **Syntax Highlighting** (Dracula theme).
- **Markdown Rendering**: Automatically parses `README.md` files into rich HTML.
- **Repo Management**: Create, delete, and manage repository settings.
- **Global Search**: Search for repositories across the platform.

### 🤝 Collaboration & Social
- **Issue Tracking**: Report bugs and discuss features via threaded comments.
- **Forking**: Clone other users' repositories to your account.
- **Starring**: Bookmark favorite projects.
- **Heatmap**: Visualize contribution activity on the user profile.

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React.js, Vite, Primer React (GitHub UI), Axios, React Router |
| **Backend** | Node.js, Express.js, Yargs (CLI Framework) |
| **Database** | MongoDB Atlas (Metadata Store), Mongoose ODM |
| **Storage** | AWS S3 (Blob Store for file content) |
| **Real-time** | Socket.io (for future collaboration updates) |
| **Auth** | JWT (JSON Web Tokens), Bcrypt.js |

---

## ⚙️ Architecture

Comitly uses a **Hybrid Storage Architecture**:
1.  **Metadata (MongoDB):** Stores user profiles, repo details, commit logs, and issue threads. This ensures fast querying and searching.
2.  **Blob Data (AWS S3):** Stores the actual binary content of the files. This allows the system to scale infinitely without bogging down the primary database.

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js installed
- MongoDB Atlas Account (Connection String)
- AWS Account (S3 Bucket, Access Key, Secret Key)

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/Comitly.git](https://github.com/your-username/Comitly.git)
cd Comitly
