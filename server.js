const http = require("http");

const dotenv = require("dotenv");
const mongoose = require("mongoose");

const Post = require("./models/post");
const onSuccess = require("./handlers/onSuccess");
const onError = require("./handlers/onError");
const corsHeaders = require("./corsHeaders");

// Connect Database
dotenv.config({ path: "./config.env" });
const db = process.env.DATABASE.replace(
    "<password>",
    process.env.DATABASE_PASSWORD
);
try {
    mongoose.connect(db);
    console.log("DB Connected!");
} catch (err) {
    console.log(err);
}

const requestListener = async (req, res) => {
    let body = "";
    req.on("data", (chunk) => {
        body += chunk;
    });

    if (req.url == "/posts" && req.method == "GET") {
        // GET all posts
        const posts = await Post.find();
        onSuccess(res, posts);
    } else if (req.url == "/posts" && req.method == "POST") {
        // Create a new post
        req.on("end", async () => {
            try {
                const data = JSON.parse(body);
                if (data.content !== undefined) {
                    const newPost = await Post.create({
                        name: data.name,
                        content: data.content,
                    });
                    onSuccess(res, newPost);
                } else {
                    onError(res);
                }
            } catch (err) {
                onError(res, err);
            }
        });
    } else if (req.url == "/posts" && req.method == "DELETE") {
        // Delete all posts
        await Post.deleteMany();
        onSuccess(res, null);
    } else if (req.url.startsWith("/posts/") && req.method == "PATCH") {
        // Update a post
        const id = req.url.split("/").pop();
        req.on("end", async () => {
            try {
                const data = JSON.parse(body);
                if (data.content !== undefined) {
                    const updatedPost = await Post.findByIdAndUpdate(
                        id,
                        {
                            name: data.name,
                            content: data.content,
                        },
                        {
                            new: true,
                            runValidators: true,
                        }
                    ).orFail();
                    onSuccess(res, updatedPost);
                } else {
                    onError(res);
                }
            } catch (err) {
                onError(res, err);
            }
        });
    } else if (req.url.startsWith("/posts/") && req.method == "DELETE") {
        // Delete a post
        const id = req.url.split("/").pop();
        try {
            await Post.findByIdAndDelete(id).orFail();
            onSuccess(res, null);
        } catch (err) {
            onError(res, err);
        }
    } else if (req.method == "OPTIONS") {
        onSuccess(res);
    } else {
        res.writeHead(404, corsHeaders);
        res.write(
            JSON.stringify({
                status: "failed",
                message: "Route not found",
            })
        );
        res.end();
    }
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3005);
