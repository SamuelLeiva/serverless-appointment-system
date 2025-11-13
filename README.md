# 🏥 Serverless Appointment System

Este repositorio contiene el código fuente de un servicio asincrónico de programación y procesamiento de citas, desarrollado con Serverless Framework y desplegado en AWS Lambda (Node.js/TypeScript) junto con otros servicios de Amazon (SQS, SNS, DynamoDB).

## Uso

### Despliegue

Para desplegar el proyecto, ejecuta el siguiente comando:

```bash
npm run deploy
```

Después de ejecutar el comando de despliegue, deberías ver una salida similar a la siguiente:

```bash
Deploying "serverless-http-api" to stage "dev" (us-east-1)

✔ Service deployed to stack serverless-http-api-dev (91s)

endpoint: GET - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/
functions:
  hello: serverless-http-api-dev-hello (1.6 kB)
```

## API Endpoints

Todos los endpoints son gestionados por AppointmentServiceLambda.

| Method   | Path                       | Description                                                             |
|----------|----------------------------|-------------------------------------------------------------------------|
| POST     | /appointment               | Envía una nueva solicitud de cita. Retorna 202 Accepted inmediatamente. |
| GET      | /appointment/{insuredId}   | Obtiene una lista de citas asociadas al insuredId proporcionado.        |

### Ejemplo del cuerpo (body) de la solicitud POST

```json
{
    "insuredId": "12345",
    "scheduleId": 101,
    "countryISO": "PE"
}
```
