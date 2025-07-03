🚀 Trackie — Your All-in-One Student Companion

Live Demo • Frontend Repo

Trackie is a full-stack web app built for students, especially engineering students, with a soft spot for the EEs ⚡. It's your digital companion to help stay on top of classes, assignments, finances, meals, and even circuit simulations — all in one place.
🎯 Features
🎓 Student Life Tools

    📅 Class Scheduler – Organize your academic schedule.

    📚 Assignment Tracker – Stay on top of deadlines.

    💸 Expense Tracker – Visualize and manage your budget.

    🥗 Meal & Water Tracker – Balance books and your hydration.

    👩‍🍳 Let’s Cook Together – Input ingredients → get meal suggestions + cooking steps. Perfect for broke student chefs.

⚡ Electrical Engineering Tools

    Circuit Simulator (Wokwi) – Build and simulate circuits online.

    Built-in Calculators:

        Ohm’s Law

        Op-Amp Gain

        RC Time Constant

        And more!

☁️ Live Info Cards

    🌤️ Real-time Weather

    📡 Tech News & Events Feed – Includes GITEX, CTFs, Hackathons, etc.

    🤖 Trackie AI – Study companion powered by a simple AI interface.

🔐 Authentication

    Secure login and session-based persistence — your data syncs across devices.

🛠️ Tech Stack
Frontend

    React.js

    Responsive UI with modern design

    Hosted on Vercel

Backend

    Node.js + Express

    REST API powering the app

    Hosted on Render

Database

    MongoDB Atlas for cloud-based data storage

🧑‍💻 Getting Started
1. Clone the Repository

git clone https://github.com/tsegaeph/trackie.git
cd trackie

2. Set Up Environment Variables

Create .env files for both frontend and backend. Example variables:
.env (backend)

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

.env (frontend)

REACT_APP_API_BASE_URL=http://localhost:5000

3. Run the App Locally
Backend

cd backend
npm install
npm run dev

Frontend

cd frontend
npm install
npm start

🌐 Deployment

    Frontend: Vercel

    Backend: Render

    Database: MongoDB Atlas

📣 Contributing

Pull requests are welcome! If you have feature suggestions or bug fixes, feel free to fork the repo and open a PR.
📬 Feedback & Connect

If you’ve got ideas, want to collaborate, or just enjoyed the project, feel free to:

    Open an issue

    Reach out on LinkedIn
