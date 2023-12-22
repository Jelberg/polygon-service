import express, { Request, Response, response } from 'express';
import axios from 'axios';
import { wl } from '../../data/watchlist';
import { env_polygon } from '../../enviroments';

const router = express.Router();
const apiKey = env_polygon.key

router.get("/", (req, res) =>{
    res.send("It's OK!");
  });

  router.get('/stock', async (req: Request, res: Response) => {
    try {
      console.log(wl.length);
  
      if (wl.length === 0) {
        console.error('El arreglo está vacío. No se realizarán solicitudes.');
        return res.status(400).json({ error: 'El arreglo está vacío.' });
      }
  
      const date = new Date();
      const currentDate = new Date();
      date.setDate(currentDate.getDate() - 1);
      const formatDate = date.toISOString().split('T')[0];
      let value = 0;
      let variation = 0;
      let summary = '';
      let signal = '';
      let response = [];
  
      // Utilizar Promise.all para esperar a que todas las promesas se resuelvan
      await Promise.all(
        wl.map(async (element) => {
          try {
            let quote: any;
  
            quote = await axios.get(`https://api.polygon.io/v2/aggs/ticker/${element.ticket.toUpperCase()}/range/1/minute/${formatDate}/${formatDate}?adjusted=true&sort=desc&limit=2&apiKey=${apiKey}`);
  
            const results = quote.data.results;
  
            if (results.length >= 2) {
              const first = results[0];
              const last = results[results.length - 1];
  
              variation = last.c - first.c;
              value = first.c.toFixed(2);
  
              const fluctuation = (variation / first.c) * 100;
  
              variation >= 0 ? (signal = '+') : (signal = '-');
              summary = `${variation.toFixed(2)}$ (${fluctuation.toFixed(2)}%)`;
            } else {
              console.error('No hay suficientes datos para calcular la variación.');
            }
  
            response.push({
              company: wl.filter((t) => t.ticket.toUpperCase() === element.ticket.toUpperCase()),
              quote: quote.data,
              signal: signal,
              value: value,
              summary: summary,
            });
  
            await wait(20000); // 20000 milisegundos
          } catch (error) {
            console.error('Error en la solicitud:', error.message);
            throw error; // Relanzar el error para que se maneje en el catch externo
          }
        })
      );
  
      console.log(response);
      res.json(response);
    } catch (error) {
      if (error.isAxiosError && error.response.status === 429) {
        console.error('Error: Has excedido la cantidad máxima de solicitudes por minuto.');
        console.error('Esperando 1 minuto antes de volver a intentar...');
        await wait(60000); // 60000 milisegundos = 1 minuto
        
      } else {
        console.error('Error en la función principal:', error.message);
        res.status(500).json({ error: 'Error to get data' });
      }
    }
  });

  // Función para esperar un período de tiempo
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Endpoint para obtener detalles de una acción
router.get('/stock/:ticker/company', async (req: Request, res: Response) => {
  try {
    const { ticker } = req.params;
    const response = await axios.get(`https://api.polygon.io/v1/meta/symbols/${ticker.toUpperCase()}/company?apiKey=${apiKey}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener detalles de la acción.' });
  }
});

// Endpoint para obtener cotizaciones en tiempo real
router.get('/stock/:ticker/quote', async (req: Request, res: Response) => {
  try {
    const { ticker } = req.params;
    const date = new Date()
    const currentDate = new Date()
    date.setDate(currentDate.getDate()-1)
    const formatDate = date.toISOString().split('T')[0];

    console.log(formatDate);
    const response = await axios.get(`https://api.polygon.io/v2/aggs/ticker/${ticker.toUpperCase()}/range/1/minute/${formatDate}/${formatDate}?adjusted=true&sort=desc&limit=${env_polygon.limit}&apiKey=${apiKey}`);

    res.json(response.data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al obtener cotizaciones en tiempo real.' });
  }
});

router.get('/stock/:ticker', async (req: Request, res: Response) => {
  try {
    const { ticker } = req.params;
    const date = new Date()
    const currentDate = new Date()
    date.setDate(currentDate.getDate()-1)
    const formatDate = date.toISOString().split('T')[0];
    let value = 0
    let variation = 0;
    let summary = ''
    let signal = ''

    const quote = await axios.get(`https://api.polygon.io/v2/aggs/ticker/${ticker.toUpperCase()}/range/1/minute/${formatDate}/${formatDate}?adjusted=true&sort=desc&limit=${env_polygon.limit}&apiKey=${apiKey}`);

    const company = await axios.get(`https://api.polygon.io/v1/meta/symbols/${ticker.toUpperCase()}/company?apiKey=${apiKey}`);

    const results = quote.data.results;

    if (results.length >= 2) {
      const first = results[0];
      const last = results[results.length - 1];

      // Calcular variación absoluta
      variation = last.c - first.c;
      value = first.c.toFixed(2)

      // Calcular porcentaje de cambio
      const fluctuation = (variation / first.c) * 100;

      variation >= 0 ? signal='+' : signal='-' ;
      console.log(`Price: ${first.c.toFixed(2)}`)
      console.log(`Variation: ${variation.toFixed(2)} USD`);
      console.log(`Percent: ${fluctuation.toFixed(2)}%`);
      summary = `${variation.toFixed(2)}$ (${fluctuation.toFixed(2)}%)`;
    } else {
      console.error("No hay suficientes datos para calcular la variación.");
    }

    let response  = {
      company: company.data,
      quote: quote.data,
      signal: signal,
      value: value,
      summary: summary
    };

    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error to get data' });
  }
});


  
export default router