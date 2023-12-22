import { promises as fs } from 'fs';

// Lee el contenido del archivo de forma síncrona
export async function getDataJson(path: string){
try {
  const datos = await fs.readFile(path, 'utf8');
  const objetoJSON = JSON.parse(datos);
  return objetoJSON

  // Puedes utilizar la variable `objetoJSON` en tu código aquí
} catch (error) {
  console.error('Error al leer o parsear el JSON:', error.message);
  return []
}}