import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { PaginatioDto } from 'src/common/dtos/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {

  private defaultLimit: number;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configSevice: ConfigService
  ) {
    this.defaultLimit = configSevice.get<number>('defaultLimit');
  }


  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleException(error);
    }
  }

  async findAll(paginationDto: PaginatioDto) {
    const {limit: l = this.defaultLimit, offset: o = 0 } = paginationDto;
    return await this.pokemonModel.find().limit(l).skip(o).sort({ nro: 1}).select('-__v');
  }

  async findOne(id: string) {
    let pokemon: Pokemon;
    if (!isNaN(+id)) pokemon = await this.pokemonModel.findOne({ nro: id });
    if (!pokemon && isValidObjectId(id)) pokemon = await this.pokemonModel.findById(id);
    if (!pokemon) pokemon = await this.pokemonModel.findOne({ name: id });
    if (!pokemon) throw new NotFoundException(`Pokemon not found`);
    return pokemon;
  }

  async update(id: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(id);
    try {
      if (updatePokemonDto.name) updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
      await pokemon.updateOne(updatePokemonDto, { new: true });
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleException(error);
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id});
    if(deletedCount == 0) throw new BadRequestException(`Pokemon with id :>> ${id} not found`);
    return `This action removes a #${id} pokemon`;
  }

  private handleException(error: any) {
    if (error.code === 11000) throw new BadRequestException(`Pokemon exists in db ${JSON.stringify(error.keyValue)}`)
    console.log(error);
    throw new InternalServerErrorException(`Can't update pokemon, check server logs`)
  }
}
