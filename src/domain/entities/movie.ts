export interface Movie {
  id: string;
  year: number;
  title: string;
  studios: string;
  producers: string;
  winner: boolean;
}

export type CreateMovieData = Omit<Movie, 'id'>;
export type UpdateMovieData = Partial<CreateMovieData>; 