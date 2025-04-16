export interface IGenre {
  genre: string;
  id: string;
}

export interface IGetGenres {
  message: string;
  genres: IGenre[];
}
