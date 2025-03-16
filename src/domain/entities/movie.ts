export interface Movie {
  id: string;
  title: string;
  year: number;
  studios: string;
  producers: string;
  winner: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateMovieData = Omit<Movie, 'id'>;
export type UpdateMovieData = Partial<CreateMovieData>; 