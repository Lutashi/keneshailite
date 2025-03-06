const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const json2csv = require("json2csv").parse;
const app = express();

// CORS configuration
app.use(
  cors({
    origin: ["https://lutashi.github.io", "http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(express.static("public"));

// MongoDB Connection with better error handling
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://ajumashukurov:55551919a@cluster0.re6au.mongodb.net/keneshai?retryWrites=true&w=majority&appName=Cluster0",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
        socketTimeoutMS: 45000, // Increase socket timeout
        connectTimeoutMS: 30000, // Connection timeout
        // keepAlive: true,
        // keepAliveInitialDelay: 300000
      }
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });

    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected");
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    // Don't exit the process, just log the error
    console.error("Retrying connection...");
  }
};

// Initial connection
connectDB();

// Reconnection handling
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected. Attempting to reconnect...");
  setTimeout(connectDB, 5000); // Try to reconnect after 5 seconds
});

// Consultation Schema
const consultationSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  location: String,
  major: String,
  ielts: {
    status: String,
    score: Number,
  },
  sat: {
    status: String,
    english: Number,
    math: Number,
  },
  age: Number,
  extracurriculars: [
    {
      activity: String,
      description: String,
    },
  ],
  honors: [
    {
      title: String,
      description: String,
    },
  ],
  education: String,
  goals: String,
  submissionDate: {
    type: Date,
    default: Date.now,
  },
});

const Consultation = mongoose.model("Consultation", consultationSchema);

// Mentor Application Schema
const mentorSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  university: String,
  major: String,
  year: String,
  experience: String,
  motivation: String,
  availability: Number,
  submissionDate: {
    type: Date,
    default: Date.now,
  },
});

const MentorApplication = mongoose.model("MentorApplication", mentorSchema);

// Routes
app.post("/api/consultation", async (req, res) => {
  try {
    console.log("Received consultation submission:", req.body);

    // Validate required fields
    const requiredFields = [
      "name",
      "email",
      "phone",
      "location",
      "major",
      "age",
      "education",
      "goals",
    ];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    const consultation = new Consultation(req.body);
    await consultation.save();
    console.log("Consultation saved successfully:", consultation);
    res.status(201).json({ message: "Consultation submitted successfully" });
  } catch (error) {
    console.error("Error saving consultation:", error);
    res.status(500).json({
      error: "Error submitting consultation",
      details: error.message,
    });
  }
});

// Get all submissions
app.get("/api/submissions", async (req, res) => {
  try {
    const submissions = await Consultation.find().sort({ submissionDate: -1 });
    res.json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ error: "Error fetching submissions" });
  }
});

// Export to CSV
app.get("/api/export", async (req, res) => {
  try {
    const submissions = await Consultation.find().sort({ submissionDate: -1 });

    // Flatten the data for CSV
    const flatData = submissions.map((sub) => ({
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
      extracurriculars: sub.extracurriculars
        .map((e) => `${e.activity}: ${e.description}`)
        .join("; "),
      honors: sub.honors.map((h) => `${h.title}: ${h.description}`).join("; "),
      education: sub.education,
      goals: sub.goals,
      submissionDate: sub.submissionDate,
    }));

    const csv = json2csv(flatData);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=consultations.csv"
    );
    res.send(csv);
  } catch (error) {
    console.error("Error exporting data:", error);
    res.status(500).json({ error: "Error exporting data" });
  }
});

// Mentor application route
app.post("/api/mentor-application", async (req, res) => {
  try {
    console.log("Received mentor application:", req.body);

    // Validate required fields
    const requiredFields = [
      "name",
      "email",
      "phone",
      "university",
      "major",
      "year",
      "experience",
      "motivation",
      "availability",
    ];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    const application = new MentorApplication(req.body);
    await application.save();
    console.log("Mentor application saved successfully:", application);
    res
      .status(201)
      .json({ message: "Mentor application submitted successfully" });
  } catch (error) {
    console.error("Error saving mentor application:", error);
    res.status(500).json({
      error: "Error submitting mentor application",
      details: error.message,
    });
  }
});

// Get all mentor applications
app.get("/api/mentor-applications", async (req, res) => {
  try {
    const applications = await MentorApplication.find().sort({
      submissionDate: -1,
    });
    res.json(applications);
  } catch (error) {
    console.error("Error fetching mentor applications:", error);
    res.status(500).json({ error: "Error fetching mentor applications" });
  }
});

// Export mentor applications to CSV
app.get("/api/export-mentor-applications", async (req, res) => {
  try {
    const applications = await MentorApplication.find().sort({
      submissionDate: -1,
    });

    const csv = json2csv(applications);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=mentor-applications.csv"
    );
    res.send(csv);
  } catch (error) {
    console.error("Error exporting mentor applications:", error);
    res.status(500).json({ error: "Error exporting mentor applications" });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
