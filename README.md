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
1. **Node.js** (v14 or later)
2. **Firebase CLI**: Install with `npm install -g firebase-tools`
3. **MongoDB Atlas**: Set up a free MongoDB Atlas cluster and acquire the connection URI.

### Steps
1. **Clone the repository**:
   git clone https://github.com/mormorani/Fabtix-Backend.git
   cd Fabtix-Backend
2. **Install Dependencies**:
    npm install
3. **Environment Variables**:
    Create a .env file in the root directory with:
    MONGODB_URI=your_mongo_connection_string
    JWT_SECRET=your-jwt-secret
4. **Run the project**:
    firebase emulators:start --only functions

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
