import getRoute, { IGetRoute } from "./getRoute"
import getPublicTransportTimingFromRoute from "./getPublicTransportTimingFromRoute"

type GetLastRouteParams = {
    start: [number, number],
    end: [number, number],
}

export const createGetLastRoute = (getRoute: IGetRoute) => async (params: GetLastRouteParams) => {
    // prepare data
    const currentDateAndTime = new Date() // get current datetime
    const date = currentDateAndTime.toISOString().
        replace(/T/, ' ').      // replace T with a space
        replace(/\..+/, '')     // delete the dot and everything after
        .split(' ')[0]
    const time = "12:00:00" // set a default time first, to find a route

    // get route
    const route = await getRoute({ ...params, date, time })

    // get timing information and duration only from each step in the route
    // used to calculate the time to start the journey
    const todaysDay = currentDateAndTime.getDay()
    const information = await getPublicTransportTimingFromRoute(route, todaysDay)

    // get the public transport timing that ends the earliest
    let minTimingIndex = -1
    let minTiming = Infinity
    for (let i = 0; i < information.length; i++) {
        const { lastTiming } = information[i]
        if (!lastTiming) {
            continue
        }

        let parsedLastTiming = parseInt(lastTiming) // convert string to number
        if (parsedLastTiming < 400) {
            parsedLastTiming += 2400 // to make sure that 0000 is later than 2359
        }

        if (parsedLastTiming < minTiming) {
            minTiming = parsedLastTiming
            minTimingIndex = i
        }
    }

    // if you can literally go home anytime you want
    if (minTimingIndex < 0) {
        minTiming = 2400 + 600 // we just set a latest timing of 6am 
    }

    // sums up all durations before minTimingIndex
    const totalDuration = information.slice(0, minTimingIndex).map(info => info.duration).reduce((a, b) => a + b, 0)

    // find the latest time to begin the journey
    let d = new Date()
    d.setHours(Math.floor(minTiming / 100))
    d.setMinutes(minTiming % 100)
    let timeToLeave = (new Date(d.getTime() - totalDuration * 100000 / 60)).getTime()

    // modify all the timings to start from timeToLeave
    for (let i = 0; i < route.length; i++) {
        route[i].startTime = timeToLeave
        route[i].endTime = timeToLeave + route[i].duration * 1000

        timeToLeave += route[i].duration * 1000
    }

    return route
}

/**
 * @param {GetLastRouteParams} params
 * @property {string} start The start point in lat,lng (WGS84) format.
 * @property {string} end The end point in lat,lng (WGS84) format
 */
const getLastRoute = createGetLastRoute(getRoute)
export default getLastRoute
