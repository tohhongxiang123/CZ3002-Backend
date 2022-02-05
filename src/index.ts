import express from 'express'
import "dotenv/config"
import cors from "cors"
import getAuthToken from './services/getAuthToken'

const app = express()
const PORT = process.env.PORT || 5000

// middleware
app.use(cors())

// routes
app.get('/', (req, res) => {
    return res.send("Hello world")
})

app.post('/auth', async (req, res) => {
    return res.json({ token: await getAuthToken() })
})

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});