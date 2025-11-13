# 🏥 Serverless Appointment System

This repository contains the source code for an asynchronous appointment scheduling and processing service built using Serverless Framework and deployed on AWS Lambda (Node.js/TypeScript).

## Usage

### Deployment

In order to deploy the example, you need to run the following command:

```
serverless deploy
```

After running deploy, you should see output similar to:

```
Deploying "serverless-http-api" to stage "dev" (us-east-1)

✔ Service deployed to stack serverless-http-api-dev (91s)

endpoint: GET - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/
functions:
  hello: serverless-http-api-dev-hello (1.6 kB)
```

_Note_: In current form, after deployment, your API is public and can be invoked by anyone. For production deployments, you might want to configure an authorizer. For details on how to do that, refer to [HTTP API (API Gateway V2) event docs](https://www.serverless.com/framework/docs/providers/aws/events/http-api).

### Invocation

After successful deployment, you can call the created application via HTTP:

```
curl https://xxxxxxx.execute-api.us-east-1.amazonaws.com/
```

Which should result in response similar to:

```json
{ "message": "Go Serverless v4! Your function executed successfully!" }
```

## API Endpoints

All endpoints are managed by the AppointmentServiceLambda.

| Method   | Path                       | Description                                                             |
|----------|----------------------------|-------------------------------------------------------------------------|
| POST     | /appointment               | Submits a new appointment request. Returns 202 Accepted immediately.    |
| GET      | /appointment/{insuredId}   | Retrieves a list of appointments associated with the given insuredId.   |

### Example of POST Request's body

```json
{
    "insuredId": "12345",
    "scheduleId": 101,
    "countryISO": "PE"
}
```