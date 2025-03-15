export interface ProducerAwardInterval {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
}

export interface ProducerAwardIntervalResult {
  min: ProducerAwardInterval[];
  max: ProducerAwardInterval[];
} 