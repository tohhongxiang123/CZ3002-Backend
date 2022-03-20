import { BusInformation } from '../types'
import client from './supabaseClient'

const getBusInformation = async (busNumber: string, busStopCode: string) => {
    const { data } = await client.from('bus-information')
        .select("*")
        .eq('ServiceNo', busNumber)
        .eq('BusStopCode', busStopCode)

    if (!data) {
        return null
    }

    if (data.length === 0) {
        return null
    }

    return data as BusInformation[]
}

export default getBusInformation