import { createGetLastRoute } from "./getLastRoute"
import fs from 'fs'

describe("Testing get last route", () => {
  test('Throw if no route is found', async () => {
    const getRoute = () => {
      throw new Error("No route found")
    }

    const getLastRoute = createGetLastRoute(getRoute)
    await expect(getLastRoute({ start: [1, 2], end: [3, 4] })).rejects.toThrow()
  })

  test('No throw if a route is found', async () => {
    const getRoute = () => {
      const res = JSON.parse(fs.readFileSync('sample_responses/onemap_routing/test3.json', 'utf8'));
      return res.data
    }

    const getLastRoute = createGetLastRoute(getRoute)
    await expect(getLastRoute({ start: [1, 2], end: [3, 4] })).resolves.not.toThrow()
  })
})

