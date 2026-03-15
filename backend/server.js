require('dotenv').config()

const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { sql, config } = require('./db')
const authMiddleware = require('./middleware/authMiddleware')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', async (_req, res) => {
    try {
        const pool = await sql.connect(config)
        const result = await pool.request().query('SELECT GETDATE() AS now')
        res.json({ ok: true, dbTime: result.recordset[0].now })
    } catch (error) {
        console.error('Health check error:', error)
        res.status(500).json({ ok: false, message: 'Database connection failed' })
    }
})

app.post('/api/auth/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        const pool = await sql.connect(config)

        const existingUser = await pool
            .request()
            .input('email', sql.NVarChar, email)
            .input('username', sql.NVarChar, username)
            .query(`
        SELECT Id
        FROM Users
        WHERE Email = @email OR Username = @username
      `)

        if (existingUser.recordset.length > 0) {
            return res.status(409).json({ message: 'User already exists' })
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const result = await pool
            .request()
            .input('username', sql.NVarChar, username)
            .input('email', sql.NVarChar, email)
            .input('passwordHash', sql.NVarChar, passwordHash)
            .query(`
        INSERT INTO Users (Username, Email, PasswordHash)
        OUTPUT INSERTED.Id, INSERTED.Username, INSERTED.Email
        VALUES (@username, @email, @passwordHash)
      `)

        const user = result.recordset[0]

        res.status(201).json({
            message: 'User created successfully',
            user,
        })
    } catch (error) {
        console.error('Signup error:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' })
        }

        const pool = await sql.connect(config)

        const result = await pool
            .request()
            .input('email', sql.NVarChar, email)
            .query(`
        SELECT Id, Username, Email, PasswordHash
        FROM Users
        WHERE Email = @email
      `)

        const user = result.recordset[0]

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        const isPasswordValid = await bcrypt.compare(password, user.PasswordHash)

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        const token = jwt.sign(
            {
                userId: user.Id,
                email: user.Email,
                username: user.Username,
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.Id,
                username: user.Username,
                email: user.Email,
            },
        })
    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

app.get('/api/profile', authMiddleware, async (req, res) => {
    res.json({
        message: 'Protected route works',
        user: req.user,
    })
})

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
})