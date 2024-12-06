import { Router, type Request, type Response } from 'express';
import weatherService from '../../service/weatherService.js';
import historyService from '../../service/historyService.js';
const router = Router();

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  try {
    const weather  = await weatherService.getWeatherForCity(req.body.cityName);
    await historyService.addCity(req.body.cityName);
    return res.status(200).json(weather);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
    
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const history = await historyService.getCities();
    return res.status(200).json(history);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

router.delete('/history/:id', async (req: Request, res: Response) => {
  const cityID = req.params.id;
  await historyService.removeCity(cityID);
  res.json('History updated.');
});

export default router;
