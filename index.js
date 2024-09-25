import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
// import morgan from "morgan";

const app = express();
const port = 3000;
const data = {
    "title": "Darin Livdahl's Blog",
    "heading": "Welcome to my blog!"
}

let activeNav = "home";
let loggedIn = false;
let credentials = [];
let blogPosts = [];

function generateRandomId() {
    let id = "";
    for (let i = 0; i < 6; i++) {
        id += Math.floor(Math.random() * 10); // Generates a random digit (0-9)
    }
    return id;
}

// function handleDelete(e) {
//     console.log('run handleDelete');
//     e.preventDefault();
//     return confirm('Are you sure?');
// }

// app.use(morgan("combined"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    activeNav = "home";
    res.render("index.ejs", { data, activeNav, loggedIn, blogPosts });
});

app.get("/login", (req, res) => {
    activeNav = "login";
    res.render("login.ejs", { data, activeNav, loggedIn });
});

app.get("/register", (req, res) => {
    activeNav = "register";
    res.render("register.ejs", { data, activeNav, loggedIn });
});

app.get("/post", (req, res) => {
    activeNav = "post";
    res.render("post.ejs", { data, activeNav, loggedIn });
});

app.get("/signout", (req, res) => {
    activeNav = "home";
    loggedIn = false;
    res.render("index.ejs", { data, activeNav, loggedIn, blogPosts });
});

app.post("/registerUser", (req, res) => {
    activeNav = "register";
    const firstName = req.body["firstName"];
    const lastName = req.body["lastName"];
    const emailAddress = req.body["emailAddress"];
    const password = req.body["password"];

    let creds = {
        first: firstName,
        last: lastName,
        email: emailAddress,
        pass: password
    }
    credentials.push(creds);

    res.render("registered.ejs", { data, activeNav, loggedIn });
});

app.post("/loginUser", (req, res) => {
    /* check submitted username and password with credentials array */
    let match = false;
    credentials.every(cred => {
        if (cred.email === req.body["userName"] && cred.pass === req.body["password"]) {
            match = true;
            return false;
        }
    });
    if (match) {
        loggedIn = true;
        res.render("index.ejs", { data, activeNav, loggedIn, blogPosts });
    } else {
        loggedIn = false;
        res.render("error.ejs", { data, activeNav, loggedIn });
    }
});

app.post("/createPost", (req, res) => {
    activeNav = "home";

    const id = generateRandomId(); /* TODO: make sure it's random */
    const date = new Date();
    const title = req.body["titleInput"];
    const body = req.body["bodyInput"];

    let post = {
        id: id,
        date: date,
        title: title,
        body: body
    }
    blogPosts.push(post);

    res.render("index.ejs", { data, activeNav, loggedIn, blogPosts });
});

app.post("/editPost", (req, res) => {
    activeNav = "home";
    const postId = req.body["postId"];
    const postTitle = req.body["titleInput"];
    const postBody = req.body["bodyInput"];
    let matchedIndex = null;

    // loop through existing blog posts to match and get index
    blogPosts.forEach((post, index) => {
        if (post.id === postId) {
            matchedIndex = index;
            return false;
        }
    });

    if (matchedIndex !== null) {
        blogPosts[matchedIndex].title = postTitle;
        blogPosts[matchedIndex].body = postBody;
    }
    res.render("index.ejs", { data, activeNav, loggedIn, blogPosts });
});

app.get("/delete/:postId", (req, res) => {
    activeNav = "home";
    let matchedIndex = null;

    // loop through existing blog posts to match and get index
    blogPosts.forEach((post, index) => {
        if (post.id === req.params.postId) {
            matchedIndex = index;
            return false;
        }
    });

    // remove matched index from array to delete blog post
    if (matchedIndex !== null) {
        blogPosts.splice(matchedIndex, 1);
    }
    res.render("index.ejs", { data, activeNav, loggedIn, blogPosts });
});

app.get("/edit/:postId", (req, res) => {

    let matchedIndex = null;
    let postData;

    // loop through existing blog posts to match and get index
    blogPosts.forEach((post, index) => {
        if (post.id === req.params.postId) {
            matchedIndex = index;
            return false;
        }
    });

    // remove matched index from array to delete blog post
    if (matchedIndex !== null) {
        postData = {
            id: blogPosts[matchedIndex].id,
            title: blogPosts[matchedIndex].title,
            body: blogPosts[matchedIndex].body
        };
    }

    res.render("edit.ejs", { data, activeNav, loggedIn, postData });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
});