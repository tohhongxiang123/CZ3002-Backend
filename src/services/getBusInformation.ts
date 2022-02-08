import { BusInformation } from '../types'
import client from './supabaseClient'

const getBusInformation = async (busNumber: string, busStopCode: string) => {
    const { data } = await client.from('bus-information')
        .select("*")
        .eq('ServiceNo', busNumber)
        .eq('BusStopCode', busStopCode)

    if (!data) {
        return data
    }

    return data as BusInformation[]
}

export default getBusInformation