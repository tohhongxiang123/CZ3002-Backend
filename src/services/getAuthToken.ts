import { API_URL } from "../constants"
import fetch from 'node-fetch'


/**
 * https://www.onemap.gov.sg/docs/#authentication-service-post
 * @returns Access token for onemap api
 */
const getAuthToken = async () => {
    const data = await fetch(`${API_URL}/auth/post/getToken`, {
        method: 'post',
        body: JSON.stringify({
            "email": process.env.ONEMAP_EMAIL,
            "password": process.env.ONEMAP_PASSWORD
        }),
        headers: {"Content-Type": "application/json"}
    }).then(response => response.json()) as { [key: string]: string }

    return data['access_token']
}

export default getAuthToken