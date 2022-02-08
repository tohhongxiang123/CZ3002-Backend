import express from 'express'
import "dotenv/config"
import cors from "cors"
import getAuthToken from './services/getAuthToken'
import getBusTiming from './services/getBusInformation'
import getTrainInformation from './services/getTrainInformation'
import getLastRoute from './services/getLastRoute'

const app = express()
const PORT = process.env.PORT || 8000

// middleware
app.use(cors())

// routes
app.get('/', (req, res) => {
    return res.send("Hello world")
})

/**
 * http://localhost:8000/routes?start=1.3560476964747572,103.98794615682894&end=1.343029314255734,103.95363507401602 // changi airport to simei
 * http://localhost:8000/routes?start=1.3405076206322075,103.63678327032335&end=1.373285911079179,103.94943765665009 // tuas link to pasir ris
 * http://localhost:8000/routes?start=1.281483365210431,103.85888088197149&end=1.3183644929730256,103.89307922430106 // bayfront to paya lebar
 */
app.get('/routes', async (req, res) => {
    // start and end comes in as strings ""
    const start = (req.query.start as string).split(',').map(coord => parseFloat(coord)) as [number, number]
    const end = (req.query.end as string).split(',').map(coord => parseFloat(coord)) as [number, number]

    try {
        return res.json({ data: await getLastRoute({ start, end }) })
    } catch (e) {
        if (e instanceof Error) {
            return res.status(500).json({ error: true, data: null, message: e.message })
        }

        return res.status(500).json({ error: true, data: null, message: "Something went wrong. Please try again" })
    }
})

/**
 * http://localhost:8000/bus-timings?busStopCode=58259&busNumber=980
 * Returns the bus timings for a specific bus number and stop code
 */
app.get('/bus-timings', async (req, res) => {
    const busNumber = req.query.busNumber as string
    const busStopCode = req.query.busStopCode as string

    return res.json({ data: await getBusTiming(busNumber, busStopCode) })
})

/**
 * http://localhost:8000/train-timings?code=EW8
 * Returns specific timings for a train station
 */
app.get('/train-timings', async (req, res) => {
    const trainStationCode = req.query.code as string

    return res.json({ data: await getTrainInformation(trainStationCode) })
})

app.post('/auth', async (req, res) => {
    return res.json({ data: await getAuthToken() })
})

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});