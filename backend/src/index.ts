import 'dotenv/config';
import express from 'express';
import MongoAccess from "./lib/mongoConnection";
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import {swaggerOptions} from './config/commonConfig/swagger';
import { router } from './routes/router';
import { CONFIG } from './config/vars';
const app = express();

const port = CONFIG?.PORT || 2718;

// Middleware to parse incoming JSON requests
app.use(express.json());

const swaggerSpec = swaggerJSDoc(swaggerOptions);
  
app.use('/',router);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

MongoAccess.connect().then();

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
    console.log(`Documentation running at http://localhost:${port}/api-docs`);
});