import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class WeatherService {
  private readonly API_KEY = process.env.WEATHER_API_KEY;
  private readonly BASE_URL = 'https://api.openweathermap.org/data/2.5';

  constructor(private readonly httpService: HttpService) {}

  async getCurrentWeather(lat: number, lon: number) {
    const url = `${this.BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=metric&lang=kr`;
    const { data } = await this.httpService.axiosRef.get(url);
    console.log(data);
    return {
      temperature: data.main.temp,
      weather: data.weather[0].main,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      id: data.weather[0].id,
      city: data.name,
    };
  }
}
