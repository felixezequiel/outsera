import { MovieRepository } from '../../../data/interfaces/movie-repository';
import { ProducerAwardInterval, ProducerAwardIntervalResult } from '../../entities/producer-award-interval';
import { Movie } from '../../entities/movie';

export class GetProducerAwardIntervals {
  constructor(private readonly movieRepository: MovieRepository) {}

  async execute(): Promise<ProducerAwardIntervalResult> {
    const winners = await this.movieRepository.findWinners();
    const producerWins = this.mapProducerWinsOrdered(winners);
    return this.calculateMinMaxIntervals(producerWins);
  }

  /**
   * Mapeia os produtores para seus anos de vitória, já mantendo ordenado
   */
  private mapProducerWinsOrdered(winners: Movie[]): Map<string, number[]> {
    const producerWins = new Map<string, number[]>();
    
    // Ordena os filmes por ano uma única vez
    winners.sort((a, b) => a.year - b.year);

    for (const movie of winners) {
      const producers = this.extractProducers(movie.producers);
      
      for (const producer of producers) {
        if (!producerWins.has(producer)) {
          producerWins.set(producer, []);
        }
        
        producerWins.get(producer)?.push(movie.year);
      }
    }

    return producerWins;
  }

  /**
   * Extrai os produtores de uma string
   */
  private extractProducers(producersString: string): string[] {
    // Separa os produtores que estão divididos por vírgula
    const producersSplitByComma = producersString.split(',');

    // Para cada grupo separado por vírgula, divide os que estão conectados por "and"
    const producersSplitByAnd = producersSplitByComma.flatMap(producerGroup => {
      const trimmedGroup = producerGroup.trim();
      return trimmedGroup.split(/\s+and\s+/);
    });

    // Remove espaços em branco extras e filtra valores vazios
    const cleanedProducers = producersSplitByAnd
      .map(producer => producer.trim())
      .filter(Boolean);

    return cleanedProducers;
  }

  /**
   * Calcula os intervalos mínimos e máximos em uma única passagem
   */
  private calculateMinMaxIntervals(producerWins: Map<string, number[]>): ProducerAwardIntervalResult {
    let minInterval = Infinity;
    let maxInterval = -1;
    const minIntervals: ProducerAwardInterval[] = [];
    const maxIntervals: ProducerAwardInterval[] = [];

    for (const [producer, years] of producerWins) {
      // Se o produtor não tem pelo menos 2 vitórias, continua
      if (years.length < 2) continue;

      // Como os anos já estão ordenados, calculamos os intervalos em uma única passagem
      const producerIntervals = this.findProducerMinMaxInterval(producer, years);
      
      if (!producerIntervals) continue;

      const { minProducerInterval, maxProducerInterval } = producerIntervals;

      // Atualiza intervalos mínimos
      if (minProducerInterval.interval < minInterval) {
        minInterval = minProducerInterval.interval;
        minIntervals.length = 0;
        minIntervals.push(minProducerInterval);
      } else if (minProducerInterval.interval === minInterval) {
        minIntervals.push(minProducerInterval);
      }

      // Atualiza intervalos máximos
      if (maxProducerInterval.interval > maxInterval) {
        maxInterval = maxProducerInterval.interval;
        maxIntervals.length = 0;
        maxIntervals.push(maxProducerInterval);
      } else if (maxProducerInterval.interval === maxInterval) {
        maxIntervals.push(maxProducerInterval);
      }
    }

    return { min: minIntervals, max: maxIntervals };
  }

  /**
   * Encontra o menor e maior intervalo de um produtor em uma única passagem
   */
  private findProducerMinMaxInterval(producer: string, years: number[]): { 
    minProducerInterval: ProducerAwardInterval; 
    maxProducerInterval: ProducerAwardInterval; 
  } | null {
    // Se o produtor não tem pelo menos 2 vitórias, retorna null
    if (years.length < 2) return null;

    let minInterval = Infinity;
    let maxInterval = -1;
    let minProducerInterval: ProducerAwardInterval | null = null;
    let maxProducerInterval: ProducerAwardInterval | null = null;

    for (let i = 1; i < years.length; i++) {
      const interval = years[i] - years[i - 1];
      if (interval <= 0) continue;

      const currentInterval = {
        producer,
        interval,
        previousWin: years[i - 1],
        followingWin: years[i]
      };

      if (interval < minInterval) {
        minInterval = interval;
        minProducerInterval = currentInterval;
      }

      if (interval > maxInterval) {
        maxInterval = interval;
        maxProducerInterval = currentInterval;
      }
    }

    if (!minProducerInterval || !maxProducerInterval) return null;

    return { minProducerInterval, maxProducerInterval };
  }
}