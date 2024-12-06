    const express = require('express');
    const mongoose = require('mongoose');
    const bodyParser = require('body-parser');
    const cors = require('cors');

    const app = express();
    const PORT = process.env.PORT || 5000;

    // Middleware
    app.use(cors());
    app.use(bodyParser.json());
    app.use(express.json());

    mongoose.connect('mongodb+srv://user2:qwertyuiop@cluster0.dxeww.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.error('Connection error:', err));

    // User Schema
    const userSchema = new mongoose.Schema({
        name: { type: String, required: true },
        attempts: [
            {
                attemptNumber: Number,
                input: [String],
                result: String, // e.g., 'win' or 'lose'
                timestamp: { type: Date, default: Date.now }
            }
        ],
        finalResults: [String] // Array to store final results shared by the user
    });

    const User = mongoose.model('User', userSchema);

    // API Endpoints
    app.post('/api/users', async (req, res) => {
        const { name, attempt, finalResult } = req.body;
        try {
            let user = await User.findOne({ name });
            if (!user) {
                user = new User({ name, attempts: [], finalResults: [] });
            }
            user.attempts.push(attempt);
            if (finalResult) {
                user.finalResults.push(finalResult);
            }
            await user.save();
            res.status(200).json(user);
        } catch (error) {
            console.error('Error saving user data:', error);
            res.status(500).json({ error: 'Error saving user data' });
        }
    });
    
    app.get('/api/users', async (req, res) => {
        try {
            const users = await User.find();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching user data' });
        }
    });

    // Start the server
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });