# Professional Portfolio (Full Stack)

A modern, responsive, and dynamic professional portfolio website designed to showcase skills, projects, and experience. Built with performance and scalability in mind, using **React**, **Vite**, **TypeScript**, and **Supabase**.

## 🚀 Features

- **Dynamic Content:** All content (projects, skills, services, experience) is managed dynamically via a database.
- **Admin Dashboard:** A secure, protected admin panel to manage all portfolio content.
    - **CRUD Operations:** Add, edit, delete projects, skills, and more.
    - **Message Center:** View and manage messages received through the contact form.
- **Real-time Contact Form:** Integrated directly with **Supabase** to store messages instantly.
- **Image Management:** Optimized image handling for fast loading and reliable hosting.
- **Responsive Design:** Fully responsive UI built with **Tailwind CSS**.
- **Performance:** Fast build and load times powered by **Vite**.
- **Deployment Ready:** Configured for seamless deployment on platforms like **Netlify**.

## 🛠 Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS, Framer Motion (for animations)
- **Backend / Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **State Management:** React Context API
- **Icons:** Lucide React

## 📂 Project Structure

```
├── components/      # Reusable UI components and Section layouts
│   ├── Admin/       # Admin dashboard components
│   ├── Layout/      # Global layout (Navbar, Footer)
│   ├── Sections/    # Landing page sections (Hero, Projects, etc.)
│   └── UI/          # Generic UI elements (Buttons, Inputs, Modals)
├── services/        # API service layer (Supabase integration)
├── public/          # Static assets and uploads
└── src/             # Core logic and configuration
```

## ⚡ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/professional-portfolio.git
    cd professional-portfolio
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the root directory and add your Supabase credentials:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

## 🚀 Deployment

This project is configured for easy deployment on **Netlify**.

1.  Push your code to GitHub.
2.  Connect your repository to Netlify.
3.  Add your Environment Variables in the Netlify Dashboard.
4.  Deploy!

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
