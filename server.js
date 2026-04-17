const express = require("express");
// const { connection } = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const blogsRoutes = require("./routes/blogsRoutes");
const categoryRoutes = require("./routes/categoriesRoutes");
const likesRoutes = require("./routes/likesRoutes");
const commentsRoutes=require("./routes/commentsRoutes");
const path = require("path");
const cors = require('cors');

const db = require("./models");
const app = express();
// const path = require('path');

app.use(cors());
app.use(express.json()); // parse JSON body
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(userRoutes);
app.use(blogsRoutes);
app.use(categoryRoutes);
app.use(likesRoutes);
app.use(commentsRoutes)

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


async function startServer() {
  try {
    await db.sequelize.authenticate(); // check connection
    console.log("Database connected!");
  } catch (error) {
    console.error(error);
  }
}

startServer();
