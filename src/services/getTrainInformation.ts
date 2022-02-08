import { TrainInformation } from '../types'
import client from './supabaseClient'

const getTrainInformation = async (trainStationStopCode: string) => {
    const { data } = await client.from('train-information')
    .select("*")
    .textSearch('code', trainStationStopCode)

    // nothing was found
    if (!data) {
        return data
    }
    
    // for each piece of data
    const result = data.map((trainInformation: { [key: string]: string }) => {
        let parsedResult = {} as any

        // parse each string into its corresponding JSON if required
        for (const [key, value] of Object.entries(trainInformation)) {
            parsedResult[key] = convertStringToJSONIfNecessary(value)
        }

        return parsedResult
    })

    return result[0] as TrainInformation
}

export default getTrainInformation

/**
 * 
 * @param s String to convert to JSON if necessary
 * @returns if s is a normal string, return it. If s is stringified JSON, return JSON
 */
function convertStringToJSONIfNecessary(s: string) {
    if (s.match(/[\{\[\(]/i)) {
        return JSON.parse(s.replaceAll(`'`, `"`).replaceAll("None", "null"))
    }

    return s
}