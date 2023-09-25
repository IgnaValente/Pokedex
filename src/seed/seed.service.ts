import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/result.interface';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';


@Injectable()
export class SeedService {
  constructor(
    private readonly httpAdapter: AxiosAdapter,
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ){}
  
  async execute(){
    await this.pokemonModel.deleteMany();
    const data  = await this.httpAdapter.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');
    const inputPokemon: {name: string, nro:number}[] = [];
    data.results.forEach(({name, url}) => {
      const urlSplit = url.split('/');
      const nro = +urlSplit[urlSplit.length - 2];
      inputPokemon.push({nro,name});
    });
    await this.pokemonModel.insertMany(inputPokemon);
    return `Seed executed`;
  }
}
