const express = require("express");
const app = express();

const port = process.env.PORT || 3000;

// Set EJS as the view engine (for rendering HTML templates)
app.set("view engine", "ejs");

// Middleware to parse form data from POST requests
app.use(express.urlencoded({ extended: true }));

// Serve CSS file from public folder
app.use(express.static("public"));

// storage for blog posts
let posts = [];

// Home page - display all posts
app.get("/", (req, res) => {
  const category = req.query.category;

  let filteredPosts = posts;

  if (category && category !== "All") {
    filteredPosts = posts.filter(post => post.category === category);
  }

  res.render("index", {
    posts: filteredPosts,
    selectedCategory: category || "All"
  });
});

// Create a new blog post
app.post("/create", (req, res) => {
  const { author, title, category, content } = req.body;

  // Add new post to array with timestamp
  posts.push({
  id: Date.now(),
  author,
  title,
  category,
  content,
  createdAt: new Date().toLocaleString()
});

  res.redirect("/");
});

// Show edit form for a specific post
app.get("/edit/:id", (req, res) => {
  const id = Number(req.params.id);
  const post = posts.find(p => p.id === id);

  if (!post) return res.redirect("/");

  res.render("edit", { post });
});

// Update an existing post
app.post("/edit/:id", (req, res) => {
  const id = Number(req.params.id);

  const post = posts.find(p => p.id === id);

  if (!post) return res.redirect("/");

  post.title = req.body.title;
  post.content = req.body.content;

  res.redirect("/");
});

// Delete a post
app.post("/delete/:id", (req, res) => {
  const id = Number(req.params.id);
  posts = posts.filter(p => p.id !== id);
  res.redirect("/");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});