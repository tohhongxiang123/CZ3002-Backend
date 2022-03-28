import fetch from 'node-fetch'
import getAuthToken from './getAuthToken'

jest.mock('node-fetch', () => jest.fn())

describe("Get auth token", () => {
    test("Gets auth token if username and password are correct", async () => {
        const expectedResponse = { access_token: 'TEST' };
        (fetch as jest.MockedFunction<any>).mockImplementation(() => Promise.resolve({ json: () => expectedResponse }))

        const token = await getAuthToken()
        expect(token).toEqual(expectedResponse.access_token)
    })

    test("Throws if username/password is wrong", async () => {
        const expectedResponse = { error: "Username or password is incorrect" };
        (fetch as jest.MockedFunction<any>).mockImplementation(() => Promise.resolve({ json: () => expectedResponse }))
        await expect(getAuthToken).rejects.toThrow(expectedResponse.error)
    })
})

