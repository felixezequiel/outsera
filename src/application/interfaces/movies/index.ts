import {
  CreateMovieData,
  Movie,
  UpdateMovieData,
} from "../../../domain/entities/movie";
import { ProducerAwardIntervalResult } from "../../../domain/entities/producer-award-interval";
import { Execute } from "../execute";

export type ParamUpdateMovie = { id: string, data: UpdateMovieData };

export interface UpdateMovie extends Execute<ParamUpdateMovie, Movie> {}
export interface CreateMovie extends Execute<CreateMovieData, Movie> {}
export interface DeleteMovie extends Execute<string, void> {}
export interface GetProducerAwardIntervals extends Execute<undefined, ProducerAwardIntervalResult> {}
export interface ImportMovies extends Execute<CreateMovieData[], Movie[]> {}
export interface ListMovies extends Execute<undefined, Movie[]> {}
