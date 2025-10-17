# Rascunho Front‑End

Your thoughts deserve more than just a WhatsApp message!

This is the front-end repository for [Rascunho](https://rascunho-front-end-production.up.railway.app), a web application designed to help you organize and manage your ideas effectively.

For the back-end, visit the [Rascunho Back‑End repository](https://github.com/Equiel-1703/rascunho).

<img width="1919" height="890" alt="image" src="https://github.com/user-attachments/assets/ce931e3d-a1f9-48c1-bf28-83464d0e290a" />


<p align="center">
  <a href="LICENSE"><img alt="License" src="https://img.shields.io/badge/License-MIT-green.svg"></a>
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white">
  <img alt="ESLint" src="https://img.shields.io/badge/ESLint-9-4B32C3?logo=eslint&logoColor=white">
</p>

## Overview
I built this front-end application using React and Vite for Rascunho. This was part of my first full-stack experience, where I developed both the front-end and back-end components for the project!

## Tools I used
- Front-end: React + Vite, React DOM, React Router
- Networking: Axios
- Utilities: http-status-codes, jwt-decode

## Languages
- JavaScript: 77.2%
- CSS: 22.2%
- HTML: 0.6%

## Getting Started

### Prerequisites
- Node.js 18+ and npm 9+ (recommended)

### Installation
```bash
# Clone the repo
git clone https://github.com/Equiel-1703/rascunho-front-end.git
cd rascunho-front-end

# Install dependencies
npm install
```

### Run in development
```bash
npm run dev
```
The dev server URL will be shown in your terminal (typically https://localhost:5173). I configured https in vite with the basic-ssl plugin for local development, so you may need to accept a self-signed certificate in your browser.

## Environment Variables
You will need a `.env.local` file in the project root for local development:

```bash
# Example variables (adjust names/values to match your app)
VITE_API_BASE_URL=https://api.example.com
VITE_DEBUG=false
```

I used these variables to configure the API base URL and enable/disable debug logging in the BackEnd.js utility service I made. They are prefixed with `VITE_` so Vite will expose them to the client-side code.

## Contributing
Contributions, suggestions, and bug reports are welcome!
- Fork the repo and create a feature branch
- Make your changes with clear commit messages
- Open a pull request describing your changes and reasoning

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
