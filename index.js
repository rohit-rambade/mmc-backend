const express = require("express");
const app = express();
const bcrypt = require("bcrypt")
const pool = require("./db");
const PORT = process.env.PORT
const {jwtGenMentor,jwtGenMentee} = require("./jwtGen")
//middlewares
app.use(express.json());


//Routes
app.post("/register", async (req, res) => {
  const {
    username,
    email,
    password,
    role,
    fullName,
    education,
    course,
    passingYear,
    dob,
    mobileNo,
    anyExperience,
  } = req.body;
  try {
    const user = await pool.query(
      "SELECT id FROM users WHERE username = $1 OR email = $2",
      [username, email]
    );
    if (user.rowCount > 0) {
      res.status(409).json({ message: "User already exists." });
      return;
    }


    const saltRounds = 10;
const salt = await bcrypt.genSalt(saltRounds);
const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3,$4) RETURNING id",
      [username, email, hashedPassword, role]
    );
    const userId = newUser.rows[0].id;
    if (role === "mentor") {

      const token = jwtGenMentor(userId)
       await pool.query(
        "INSERT INTO mentors (user_id, full_name, education, dob, mobile_no, email, any_experience) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [userId, fullName, education, dob, mobileNo, email, anyExperience]
      );
      res
      .status(201)
      .json({ message: "Mentor registered successfully.", id: userId,token });
    } else if (role === "mentee") {
      const token = jwtGenMentor(userId)
      await pool.query(
        "INSERT INTO mentees (user_id, full_name, course, passing_year, dob, mobile_no, email, any_experience) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
        [
          userId,
          fullName,
          course,
          passingYear,
          dob,
          mobileNo,
          email,
          anyExperience,
        ]
      );
      res
      .status(201)
      .json({ message: "Mentee registered successfully.", id: userId,token });
    }

  } catch (err) {
    console.error(err.message);
    res.status(500).send("An error occurred while registering.");
  }
});

app.post("/login", async (req, res) => {
 
  const { email, password } = req.headers;

  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json("Invalid Credential");
    }
    console.log(user.rows[0].password);
    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (!validPassword) {
      return res.status(401).json("Invalid Credential");
    }
    const userId = user.rows[0].id;

    // need to put condition to gen tokens
    const jwtToken = jwtGenMentee(userId);
    return res.json({ jwtToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


app.post("/api/test", async (req, res) => {
    try {
        const { firstname, lastname } = req.body;
        const client = await pool.connect();
        const query = `
          INSERT INTO users (firstname, lastname)
          VALUES ($1, $2)
          RETURNING user_id;
        `;
        const values = [firstname, lastname];
        const result = await client.query(query, values);
        const user_id = result.rows[0].user_id;
        client.release();

        res.status(201).json({ message: 'User data submitted successfully', user_id });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'An error occurred' });
    }
});

app.listen(PORT || 5000, () => {
    console.log("Server started");
});
