# Backend for CZ3002 Project: Last Train Home

# Setup

- Register for a free onemap account [here](https://www.onemap.gov.sg/docs/#register-free-account)
- Create a `.env` file, and copy the contents from the `.env.example` file into `.env`
- Fill up the required variables for the `.env` file
- Run the following commands

```
npm install
npm run dev
```

- A server will be listening on `http://localhost:5000`
- You can use [hoppscotch](https://hoppscotch.io/) which is a free web app to make API calls

Files to develop on are usually under `src`. Everything outside `src` are scripts and config files

# Testing

To run tests, run the following command

```
npm run test
```

# Current Stack

- NodeJS
- Typescript
- Express
- Onemap API
- Supabase to store data

# API Documentation

## GET `/routes`

Gets the last available route for the day between a start and end

- Params:
    - `start`: Start coordinates of route
    - `end`: End coordinates of route
- E.g. `http://localhost:8000/routes?start=1.3560476964747572,103.98794615682894&end=1.343029314255734,103.95363507401602`
- Returns:
    - On success, `{ data: RouteStep[] }`
    - On failure, `{ data: null, error: true, message: string }`

## GET `/bus-timings`

Gets the bus timings for a specific bus number, at a specific bus stop
- Check `types/BusInformation.d.ts` for the received format

## GET `/train-timings`

Gets the train timings at a specific train station
- Check `types/TrainInformation.d.ts` for the received format

# Resources

- https://www.onemap.gov.sg/docs/#introduction
- https://supabase.com/docs/reference/javascript/supabase-client