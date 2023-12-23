import dotenv from 'dotenv';

dotenv.config();

export const env ={
   port : process.env.PORT || 5555
}

export const env_polygon ={
   key: process.env.POLYGON_KEY,
   limit: process.env.POLYGON_LIMIT_RESULTS || 10
}