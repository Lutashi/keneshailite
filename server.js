const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const json2csv = require('json2csv').parse;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/keneshai', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Consultation Schema
const consultationSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    location: String,
    major: String,
    ielts: {
        status: String,
        score: Number
    },
    sat: {
        status: String,
        english: Number,
        math: Number
    },
    age: Number,
    extracurriculars: [{
        activity: String,
        description: String
    }],
    honors: [{
        title: String,
        description: String
    }],
    education: String,
    goals: String,
    submissionDate: {
        type: Date,
        default: Date.now
    }
});

const Consultation = mongoose.model('Consultation', consultationSchema);

// Routes
app.post('/api/consultation', async (req, res) => {
    try {
        const consultation = new Consultation(req.body);
        await consultation.save();
        res.status(201).json({ message: 'Consultation submitted successfully' });
    } catch (error) {
        console.error('Error saving consultation:', error);
        res.status(500).json({ error: 'Error submitting consultation' });
    }
});

// Get all submissions
app.get('/api/submissions', async (req, res) => {
    try {
        const submissions = await Consultation.find().sort({ submissionDate: -1 });
        res.json(submissions);
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({ error: 'Error fetching submissions' });
    }
});

// Export to CSV
app.get('/api/export', async (req, res) => {
    try {
        const submissions = await Consultation.find().sort({ submissionDate: -1 });
        
        // Flatten the data for CSV
        const flatData = submissions.map(sub => ({
            name: sub.name,
            email: sub.email,
            phone: sub.phone,
            location: sub.location,
            major: sub.major,
            age: sub.age,
            ielts_status: sub.ielts.status,
            ielts_score: sub.ielts.score,
            sat_status: sub.sat.status,
            sat_english: sub.sat.english,
            sat_math: sub.sat.math,
            extracurriculars: sub.extracurriculars.map(e => `${e.activity}: ${e.description}`).join('; '),
            honors: sub.honors.map(h => `${h.title}: ${h.description}`).join('; '),
            education: sub.education,
            goals: sub.goals,
            submissionDate: sub.submissionDate
        }));

        const csv = json2csv(flatData);
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=consultations.csv');
        res.send(csv);
    } catch (error) {
        console.error('Error exporting data:', error);
        res.status(500).json({ error: 'Error exporting data' });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 