# Cook Book App

A full-stack web application that streamlines the process of digitizing, organizing, and sharing recipes. By integrating AI, it goes beyond traditional recipe apps to provide smarter, more intuitive recipe management.

## About The Project

The Cook Book App was born from a love of cooking and a frustration with managing scattered recipes, from handwritten cards to screenshots and PDFs. This application provides a central, beautiful, and easy-to-navigate digital cookbook.

The standout feature is the **AI-powered Recipe Extractor**. Simply upload a photo or PDF of a recipe, and the application uses Optical Character Recognition (OCR) to read the text, then leverages a Large Language Model (LLM) to intelligently parse and format it into a structured, ready-to-use recipe. This demonstrates a practical application of modern AI technologies to solve a common real-world problem.

This project is built with a modern, robust, and scalable tech stack, showcasing best practices in full-stack development.

## Key Features

- **AI Recipe Extraction:** Upload an image or PDF, and let the AI do the work. It uses Tesseract.js for OCR and integrates with LLMs (supporting both Ollama for local use and OpenAI) to automatically structure the recipe data.
- **Full CRUD Functionality:** Create, read, update, and delete your personal recipes and cookbooks.
- **User Authentication:** Secure user accounts with JWT-based authentication to keep your cookbooks private.
- **Dynamic & Responsive Frontend:** A polished and intuitive user interface built with React and TypeScript, styled with Tailwind CSS.
- **RESTful API:** A well-structured backend powered by Node.js and Express, providing a clear and efficient API.
- **Community Browsing:** Discover new recipes and cookbooks shared by other users.
- **Efficient Pagination:** Implemented on browse pages and within profile carousels to ensure smooth handling of large datasets and an enhanced user experience.

## Tech Stack

This project is a monorepo containing the `client` and `server` applications.

### Frontend

- **Framework:** React (with Vite)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Client-side OCR:** Tesseract.js
- **State Management:** React Context
- **Data Fetching:** React Query

### Backend

- **Runtime:** Node.js
- **Execution:** ts-node (for development)
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose
- **Authentication:** JSON Web Tokens (JWT)
- **AI Integration:** Ollama, OpenAI

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v24.2.0 or later recommended)
- npm
- MongoDB (local instance or a cloud service like MongoDB Atlas)

### Installation

1.  **Clone the repo**

    ```sh
    git clone https://github.com/mcohen2000/cook-book-app.git
    cd cook-book-app
    ```

2.  **Set up the Backend**

    ```sh
    cd server
    npm install
    ```

    Create a `.env` file in the `/server` directory and add the necessary environment variables:

    ```env
    PORT=3001
    MONGO_URI='your_mongodb_connection_string'
    SALT_ROUND=10
    COOKIE_NAME='auth-cookie-name'
    COOKIE_URL='localhost'
    SECURE_COOKIES='false'
    JWT_SECRET='your_jwt_secret'
    FRONTEND_URL='http://localhost:5173'
    # Optional: For Ollama/OpenAI integration
    LLM_URL='url_of_ollama_server'
    OPENAI_API_KEY='your_openai_api_key'
    ```

    Start the server:

    ```sh
    npm run dev
    ```

3.  **Set up the Frontend**

    ```sh
    cd ../client
    npm install
    ```

    Create a `.env` file in the `/client` directory and add the following environment variable:

    ```env
    VITE_REACT_APP_API_URL='http://localhost:3001'
    ```

    This URL must match the address of your running backend server.

    Start the client:

    ```sh
    npm run dev
    ```

    Open [http://localhost:5173](http://localhost:5173) (or whatever port Vite assigns) in your browser.

## Project Structure

The repository is organized as a monorepo with two main packages:

- `/client`: Contains the React frontend application.
  - `src/components`: Reusable UI components.
  - `src/pages`: Top-level page components corresponding to routes.
  - `src/queries`: React Query hooks for data fetching and mutations.
  - `src/services`: Functions for making API calls to the backend.
  - `src/context`: Application-wide state management (e.g., Auth, Modals).
- `/server`: Contains the Node.js/Express backend API.
  - `src/models`: Mongoose schemas for the database models (User, Recipe, Book).
  - `src/routes`: API route definitions.
  - `src/middleware`: Custom middleware (e.g., for authentication).
  - `src/services`: Business logic for services like LLM interaction.
