import { Router } from 'express';
import { ApiVersion } from './api-versions';

export type RouteMap = Record<ApiVersion, Router>;

export const createRouteMap = (v1Router: Router, v2Router: Router): RouteMap => ({
  [ApiVersion.V1]: v1Router,
  [ApiVersion.V2]: v2Router
});