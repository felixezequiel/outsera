import { MovieRepository } from '../../../data/interfaces/movie-repository';
import { ProducerAwardInterval, ProducerAwardIntervalResult } from '../../entities/producer-award-interval';
import { Movie } from '../../entities/movie';

export class GetProducerAwardIntervals {
  constructor(private readonly movieRepository: MovieRepository) {}

  async execute(): Promise<ProducerAwardIntervalResult> {
    const winners = await this.movieRepository.findWinners();
    const producerWins = this.mapProducerWins(winners);
    const intervals = this.calculateIntervals(producerWins);

    if (intervals.length === 0) {
      return { min: [], max: [] };
    }

    return this.getMinMaxIntervals(intervals);
  }

  private mapProducerWins(winners: Movie[]): Map<string, number[]> {
    const producerWins = new Map<string, number[]>();
    
    winners.forEach(movie => {
      const producers = this.extractProducers(movie.producers);
      producers.forEach(producer => {
        if (!producerWins.has(producer)) {
          producerWins.set(producer, []);
        }
        const years = producerWins.get(producer);
        // Evita adicionar o mesmo ano mais de uma vez
        if (years && !years.includes(movie.year)) {
          years.push(movie.year);
        }
      });
    });

    return producerWins;
  }

  private extractProducers(producersString: string): string[] {
    return producersString
      .split(/\s*[,e]\s*/) // Separa por vírgula ou 'e'
      .map(producer => producer.trim())
      .filter(producer => producer.length > 0);
  }

  private calculateIntervals(producerWins: Map<string, number[]>): ProducerAwardInterval[] {
    const intervals: ProducerAwardInterval[] = [];

    producerWins.forEach((wins, producer) => {
      if (wins.length < 2) return;
      
      const sortedWins = [...wins].sort((a, b) => a - b);
      const producerIntervals = this.calculateProducerIntervals(producer, sortedWins);
      
      // Filtra intervalos maiores que zero
      const validIntervals = producerIntervals.filter(interval => interval.interval > 0);
      if (validIntervals.length > 0) {
        intervals.push(...validIntervals);
      }
    });

    return intervals;
  }

  private calculateProducerIntervals(producer: string, wins: number[]): ProducerAwardInterval[] {
    const intervals: ProducerAwardInterval[] = [];

    for (let i = 1; i < wins.length; i++) {
      const interval = wins[i] - wins[i - 1];
      // Só adiciona se o intervalo for maior que zero
      if (interval > 0) {
        intervals.push({
          producer,
          interval,
          previousWin: wins[i - 1],
          followingWin: wins[i]
        });
      }
    }

    return intervals;
  }

  private getMinMaxIntervals(intervals: ProducerAwardInterval[]): ProducerAwardIntervalResult {
    // Ordena por intervalo e depois por ano anterior em caso de empate
    intervals.sort((a, b) => {
      if (a.interval !== b.interval) {
        return a.interval - b.interval;
      }
      return a.previousWin - b.previousWin;
    });

    // Encontra o menor intervalo válido (maior que zero)
    const minInterval = intervals[0].interval;
    
    // Encontra o maior intervalo
    const maxInterval = intervals[intervals.length - 1].interval;

    // Pega os 2 produtores com menor intervalo
    const minIntervals = intervals
      .filter(i => i.interval === minInterval)
      .slice(0, 2);

    // Pega os 2 produtores com maior intervalo
    const maxIntervals = intervals
      .filter(i => i.interval === maxInterval)
      .slice(0, 2);

    return {
      min: minIntervals,
      max: maxIntervals
    };
  }
}