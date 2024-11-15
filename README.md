# Project1BackendClassUninorte 🚀

API REST backend project developed for Uninorte class using modern technologies and best practices.

## Technologies Used 🛠️

- Bun.js - Runtime & Package Manager
- TypeScript - Type Safety
- Express.js - Web Framework
- MongoDB - Database
- JWT - Authentication
- Express Validator - Input Validation
- Helmet - Security Headers
- CORS - Cross-Origin Resource Sharing
- Bcrypt - Password Hashing

## Getting Started 🏁

### Prerequisites

- Bun >= 1.0.0
- MongoDB >= 6.0
- Node.js >= 18 (for some development tools)

### Installation

1. Clone the repository
   
   ```bash
   git clone <repository-url>
   cd Project1BackendClassUninorte
   ```

2. Install dependencies
   
   ```bash
   bun install
   ```

3. Create `.env` file
   
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/your_database
   JWT_SECRET=your_secret_key
   ```

### Available Scripts

```bash
# Development with hot reload
bun dev

# Build project
bun build

# Start production server
bun start

# Type checking
bun typecheck
```

## Project Structure 📁

```
src/
├── config/        # App configuration
├── controllers/   # Route controllers
├── middlewares/   # Custom middlewares
├── models/        # Database models
├── routes/        # API routes
├── types/         # TypeScript types
└── index.ts       # App entry point
```

## Author ✏️

- **Aiker** - _Backend Developer_

## License 📄

This project is private - see the LICENSE file for details