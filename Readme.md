# 🎼 Fabtix Backend 🎼

The backend for Fabtix handles the core server-side logic, including performance data management, ticketing, review processing, and artist management. It’s built on Firebase Cloud Functions and integrates with MongoDB for data persistence.

## Table of Contents

- [Features](#features)
- [Tech Stack](#-tech-stack)
- [Installation and Setup](#installation-and-setup)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)

## Features

- **Performance Management**: APIs to create, update, and retrieve performance details.
- **Ticket Management**: Process ticket purchases and store purchase records.
- **Review Management**: Accept user reviews for performances, with purchase verification for review access.
- **Artist Management**: Support artist registration, authentication, and performance management. Artists can sign up, log in, and manage their performances.
- **Data Validation**: Server-side validation for data integrity and security.
- **JWT Authentication**: Protects certain routes and ensures only authenticated artists can create or update performances.

## 💻 Tech Stack

- **Backend Framework**: Firebase Cloud Functions (serverless architecture)
- **Database**: MongoDB (for performance, artist, ticket, and review data)
- **Deployment**: Firebase
- **JWT Authentication**: JWT for route protection on performance and artist-related endpoints.

## Installation and Setup

### Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v14 or later) - [Install Node.js](https://nodejs.org/)
2. **Firebase CLI**: Install with the following command:
   ```bash
   npm install -g firebase-tools
   ```
3. **MongoDB Database**: Set up a free MongoDB database. You can use MongoDB Atlas to create a free cloud database, or set up a local MongoDB instance. [Sign up for MongoDB Atlas](https://www.mongodb.com/cloud/atlas) if you prefer a cloud solution.

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/mormorani/Fabtix-Backend.git
   cd Fabtix-Backend
   ```
2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the root directory with the following variables:

- `DATABASE_URL`: Your MongoDB connection string. It should include the name of the database you're using, whether it's hosted locally or on MongoDB Atlas. Example for a local MongoDB instance:
  ```bash
  DATABASE_URL=mongodb://localhost:27017/your-database-name
  ```
  Example for MongoDB Atlas:
  ```bash
  DATABASE_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<your-database-name>?retryWrites=true&w=majority
  ```
  JWT_SECRET: A secret key used for signing JWT tokens.

```bash
JWT_SECRET=your-secret-key
```

4. **Run the Project Locally**:
   ```bash
   npm start
   ```
   This will start the server, and you should be able to access your APIs on your local machine.

### Deployment

The project is deployed to Firebase Cloud Function. here: https://us-central1-fabtixapp.cloudfunctions.net/api.

## API Endpoints

### Artist Routes

- **GET /api/artists**: Retrieves a list of all registered artists.
- **GET /api/artists/:name**: Fetch an artist by their name (requires artist name in URL parameter).
- **GET /api/artists/email**: Fetch an artist by email (requires email in request body).

### Performance Routes

- **GET /api/performances**: Retrieve a list of all performances with artist details.
- **POST /api/performances/create**: Create a new performance (requires JWT authentication).
- **PUT /api/performances/:id**: Update a performance by ID (requires JWT authentication).
- **GET /api/performances/performances**: Retrieve all performances for the logged-in artist (requires JWT authentication).
- **GET /api/performances/:artistName**: Retrieve performances by a specific artist’s name.

### Purchase Routes

- **POST /api/purchases**: Create a purchase record for a performance.

### Review Routes

- **POST /api/reviews**: Create a review for a performance (requires valid purchase).
- **GET /api/reviews/:performanceId**: Retrieve all reviews for a specific performance.
- **GET /api/reviews**: Retrieve all reviews across all performances.

### Authentication Routes

- **POST /signup**: Register a new artist (requires name, email, password, genre, image, and YouTube link in request body).
- **POST /login**: Authenticate an artist and return a JWT (requires email and password).
- **GET /artist**: Retrieve authenticated artist’s information (requires valid JWT in Authorization header).
