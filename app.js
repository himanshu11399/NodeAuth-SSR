import cookieParser from 'cookie-parser';
import express from 'express'
import path from 'path';
import { fileURLToPath } from 'url';
import User from './models/User.js';
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"


const app = express()

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());


app.get('/', (req, res) => {
    res.render("index");
})

app.post("/create", async (req, res) => {
    try {
        let { username, email, password, age } = req.body;
        //Encrypt the Password
        let existuser = await User.findOne({ email });
        if (existuser) {
            return res.status(400).send("User already exists");
        }
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, async (err, hash) => {
                const createedUser = await User.create({
                    username,
                    email,
                    password: hash,
                    age
                })
                let token = jwt.sign({ email }, "shhhhhhhhhhh256");
                res.cookie("tokensign", token);
                // console.log(token)
                res.send(createedUser);
            })
        });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
})

app.get('/logout', (req, res) => {
    res.cookie("tokensign", "");
    res.redirect("/")
})

app.get("/login", (req, res) => {
    res.render("login");
})

app.post('/login', async (req, res) => {
    let { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.send("Something Went Wrong");
        }

        bcrypt.compare(password, user.password, (err, result) => {
            if (!result) {
                return res.send("You are not log in :!!!!")
            }
            let token = jwt.sign({ email }, "shhhhhhhhhhh256");
            res.cookie("tokensign", token);
            res.send("Welcome :", user.username);
        })


    } catch (err) {
        res.status(500).send({ error: err.message });
    }
})
// Start server
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});