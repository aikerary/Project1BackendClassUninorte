import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/db.js';

// Route imports
import userRoutes from './routes/users/user.routes.js';
import bookRoutes from './routes/books/book.routes.js';
import reservationRoutes from './routes/reservations/reservation.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/reservations', reservationRoutes);

// Base route
app.get('/', (req, res) => {
    res.send('Biblioteca API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});