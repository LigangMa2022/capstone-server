const knex = require('knex')(require('./../knexfile'))
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userRegister = async (req, res) => {
    const {name, email, password} = req.body;
    if (!name || !email || !password) {
        return res.status(400).send("Please enter all of the required fields.");
    }
    const hashedPassword = bcrypt.hashSync(password);

    const newUser = {
        name,
        email,
        password:hashedPassword
    };

    try {
        await knex('users').insert(newUser);
        res.status(201).send("Registered successfully");
    } catch (error) {
        console.log(error);
        res.status(400).send("Failed registration");
    }
};

const userLogin = async (req, res)=> {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).send("Please enter all of the required fields");
    }

    const user = await knex('users').where("email",email).first();
    if (!user) {
        return res.status(400).send("Invalid email");
    }

    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
        return res.status(400).send("Invalid password");
    }

    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_KEY,
        { expiresIn: "24h" }
    );

    res.json({ token })
};


const userCurrent = async(req, res)=>{
    if (!req.headers.authorization) {
        return res.status(401).send("Please login");
    }

    const authHeader = req.headers.authorization;
    const authToken = authHeader.split(' ')[1];

    // Verify the token
    try {
        const decoded = jwt.verify(authToken, process.env.JWT_KEY);

        // Respond with the appropriate user data
        const user = await knex('users').where({ id: decoded.id }).first();
        delete user.password;
        res.json(user);
    } catch (error) {
        return res.status(401).send("Invalid auth token");
    }
}


module.exports = {
    userRegister,
    userLogin,
    userCurrent
};