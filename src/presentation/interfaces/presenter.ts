import { HttpResponse } from './http';

export interface Presenter {
  success(data: any): HttpResponse;
  created(data: any): HttpResponse;
  noContent(): HttpResponse;
  forbidden(message?: string): HttpResponse;
  conflict(message: string): HttpResponse;
  unprocessableEntity(message: string): HttpResponse;
  error(error: Error): HttpResponse;
} 