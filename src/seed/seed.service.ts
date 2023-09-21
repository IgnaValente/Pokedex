import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/result.interface';


@Injectable()
export class SeedService {

  private readonly axios: AxiosInstance = axios;
  
  async execute(){
    const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10');
    data.results.forEach(({name, url}) => {
      const urlSplit = url.split('/');
      const nro = +urlSplit[urlSplit.length - 2];

    });
    return data.results;
  }
}
