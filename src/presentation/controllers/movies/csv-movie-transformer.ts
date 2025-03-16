import { Transform } from 'stream';
import { parse } from 'csv-parse';
import { CreateMovieData } from '../../../domain/entities/movie';

export class CsvMovieTransformer {
  private static readonly CSV_DELIMITER = ';';
  private static readonly WINNER_VALUE = 'yes';

  public static createParser() {
    return parse({
      delimiter: this.CSV_DELIMITER,
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
  }

  public static createTransformer(): Transform {
    return new Transform({
      objectMode: true,
      transform(record, encoding, callback) {
        const movie: CreateMovieData = {
          title: record.title,
          year: parseInt(record.year),
          studios: record.studios,
          producers: record.producers,
          winner: record.winner.toLowerCase() === CsvMovieTransformer.WINNER_VALUE,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        callback(null, movie);
      }
    });
  }
} 