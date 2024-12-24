const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const leadRoutes = require("./routes/leadRoutes");
const clientRoutes = require("./routes/clientRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middlewares/errorHandler");
const proppertyRoutes = require("./routes/propertyRoutes");
const linkRoutes = require("./routes/linkRoutes");
const opportunityRoutes = require("./routes/opportunityRoutes");
const taskRoutes = require("./routes/taskRoutes");
const notificationRoutes = require("./routes/notificationRoute");
const cors = require("cors"); 

dotenv.config();
connectDB();

const app = express();
app.use(express.json()); 


app.use(cors());  
app.use("/uploads", express.static("uploads"));


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/users", userRoutes);
app.use("/api/properties", proppertyRoutes);
app.use("/api/link", linkRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api", taskRoutes);

// Error Handler    
app.use(errorHandler);

module.exports = app;
