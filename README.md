# NeoGurukul

A submission for Pragati AI Hackathon.

## Project Overview

NeoGurukul is a full-stack application consisting of two main components:
1. **Node.js Backend**: A server-side application that provides APIs and handles business logic.
2. **React Native Mobile App**: A cross-platform mobile application built using Expo, located in the `mobile` folder.

---

## Table of Contents

- [Node.js Backend](#nodejs-backend)
  - [Setup and Installation](#setup-and-installation)
  - [Running the Server](#running-the-server)
- [React Native Mobile App](#react-native-mobile-app)
  - [Setup and Installation](#setup-and-installation-1)
  - [Running the Mobile App](#running-the-mobile-app)
- [Technologies Used](#technologies-used)
- [License](#license)


---

## Node.js Backend

The backend is built using Node.js and provides RESTful APIs for the mobile app.

### Setup and Installation

1. Navigate to the root directory of the project.
2. Install dependencies:
   ```bash
   npm install
    ```

3. Create a `.env` file in the root directory and add the following environment variables:

Running the Server

Start the server:

The server will run on http://localhost:8000 by default (or the port specified in your environment variables).

Access Swagger-Stats (if configured) at:

http://localhost:8000/swagger-stats

## React Native Mobile App

The mobile app is built using React Native and Expo.

### Setup and Installation

1. Navigate to the `mobile` directory:
   ```bash
   cd mobile
   ```
2. Install dependencies:
   ```bash
    npm install
    ```
3. Start the Expo development server:

    ```bash
    expo start
    ```
4. Open the Expo Go app on your mobile device or use an emulator to scan the QR code displayed in the terminal.

#### Technologies Used

Backend: Node.js, Express.js
Mobile App: React Native, Expo
Other Tools: Swagger-Stats for API monitoring

#### License
This project is licensed under the MIT License. See the LICENSE file for details.