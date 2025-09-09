
# Diary Documentation Web Application  

## 📖 Overview  
A full-stack diary web application that allows users to securely write, save, and manage personal diary entries with a clean and intuitive interface.  
The app provides rich text editing features, customizable styles, and cloud storage, making it a reliable digital diary for everyday use.  

---

## ✨ Features  
- 🔐 **Authentication** – Secure user login and registration using JWT
- 📝 **Rich Text Editor** – Bold, italic, font size, and color options  
- 🎨 **Customization** – Change fonts, text colors, and formatting  
- 📅 **Diary Management** – Create, edit, and delete diary entries  
- ☁️ **Cloud Storage** – Securely save entries in a PostgreSQL database  
- 📊 **Dashboard** – Manage and view past entries with ease  

---

## 🛠️ Tech Stack  

- **Frontend:** React, Tailwind CSS, TypeScript  
- **Backend:** Node.js, Express  
- **Database:** PostgreSQL, Cloudinary Storage  
- **Deployment:** AWS EC2 (tentative)  
- **Other Tools:** DBeaver, Puppeteer API, Nodemailer, JWT, CryptoJS, Selection & Range API, Canvas API

---

## 🚀 Getting Started  

### Prerequisites  
Make sure you have the following installed:  
- [Node.js](https://nodejs.org/) 
- [PostgreSQL](https://www.postgresql.org/)

### Installation  

```bash
# Clone the repository
git clone https://github.com/your-username/diary-app.git
cd diary-app

# Install dependencies
cd frontend && npm install
cd ../backend && npm install

# Start backend
cd backend
npm run dev

# Start frontend (in a new terminal)
cd frontend
npm run dev



