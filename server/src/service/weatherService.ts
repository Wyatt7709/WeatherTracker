import dotenv from 'dotenv';
dotenv.config();

interface Coordinates {
  lat: number;
  lon: number;
}

class Weather {
 temp: string;
 wind: string;
 humidity: string;
 city: string;
 date: string;
 icon: string;
 iconDesc: string;

  constructor(temp: string, 
    wind: string, 
    humidity: string,
    city: string, date: 
    string, icon: 
    string, iconDesc: 
    string
  ) {
    this.temp = temp;
    this.wind = wind;
    this.humidity = humidity;
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDesc = iconDesc;
  }
}


class WeatherService {
  baseURL: string;
  APIkey: string;
  cityName: string;
  
  constructor(
    baseURL: string, 
    APIkey: string,
    cityName: string
  ){
    this.baseURL = baseURL;
    this.APIkey = APIkey;
    this.cityName = cityName;
  }
private async fetchLocationData(query: string)  {
  const getCoordinates = await this.buildGeocodeQuery(query);
  const location = await fetch(getCoordinates);
  return location.json(); 
}
private destructureLocationData(locationData: Coordinates[]): Coordinates { 
  const { lat, lon } = locationData[0];
  return { lat, lon };
}

  private buildGeocodeQuery(query: string): string { 
    const geoQuery = `${this.baseURL}/geo/1.0/direct?q=${query}&limit=5&appid=${this.APIkey}`;
    return geoQuery;
  }

  private buildWeatherQuery(coordinates: Coordinates): string {
    const weatherQuery = `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.APIkey}&units=imperial`;
    return weatherQuery;
  }

  private async fetchAndDestructureLocationData(){
  const locationData = await this.fetchLocationData(this.cityName);
  return this.destructureLocationData(locationData);
}
 
  
  private async fetchWeatherData(coordinates: Coordinates) {
    const weatherData = await fetch(this.buildWeatherQuery(coordinates));
    return weatherData.json();
  }

  private buildForestArray(weatherData: any[]){
    const forecast= [];
    for (let i = 0; i < weatherData.length; i+=8) {
      const temp = weatherData[i].main.temp;
      const wind = weatherData[i].wind.speed;
      const humidity = weatherData[i].main.humidity;
      const city = this.cityName;
      const icon = weatherData[i].weather[0].icon;
      const iconDesc = weatherData[i].weather[0].description;
      const date = new Date(weatherData[i].dt * 1000).toLocaleDateString();
      forecast.push({temp, wind, humidity, city, date, icon, iconDesc});
    }
    return forecast;
  }

  async getWeatherForCity(city: string): Promise<Weather[]> {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    if (!coordinates) {
      throw new Error('Failed to fetch location data');
    }

    const weatherData = await this.fetchWeatherData(coordinates);
    if (!weatherData) {
      throw new Error('Failed to fetch weather data');
    }
    console.log(weatherData);

    const cityForest = this.buildForestArray(weatherData.list);


    return cityForest;
  }
}
export default new WeatherService(`${process.env.API_BASE_URL}`, `${process.env.API_KEY}`, '');