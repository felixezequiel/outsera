import { Router } from 'express';
import { makeMovieListController } from '../../factories/movies/movie-list-controller-factory';
import { makeCreateMovieController } from '../../factories/movies/create-movie-controller-factory';
import { makeImportMoviesController } from '../../factories/movies/import-movies-controller-factory';
import { makeProducerAwardIntervalsController } from '../../factories/movies/producer-award-intervals-controller-factory';
import { adaptRoute } from '../../adapters/express-controller-adapter';
import upload from '../../middlewares/upload';

export default (router: Router): void => {
  /**
   * @swagger
   * /api/v1/movies:
   *   get:
   *     summary: Lista todos os filmes
   *     tags: [Movies]
   *     parameters:
   *       - name: year
   *         in: query
   *         schema:
   *           type: integer
   *         description: Filtra filmes por ano
   *       - name: winner
   *         in: query
   *         schema:
   *           type: boolean
   *         description: Filtra filmes vencedores
   *     responses:
   *       200:
   *         description: Lista de filmes
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: string
   *                     format: uuid
   *                   title:
   *                     type: string
   *                   year:
   *                     type: integer
   *                   studios:
   *                     type: string
   *                   producers:
   *                     type: string
   *                   winner:
   *                     type: boolean
   *                     default: false
   */
  router.get('/movies', adaptRoute(makeMovieListController()));

  /**
   * @swagger
   * /api/v1/movies:
   *   post:
   *     summary: Cria um novo filme
   *     tags: [Movies]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [title, year, studios, producers]
   *             properties:
   *               title:
   *                 type: string
   *               year:
   *                 type: integer
   *               studios:
   *                 type: string
   *               producers:
   *                 type: string
   *               winner:
   *                 type: boolean
   *                 default: false
   *     responses:
   *       201:
   *         description: Filme criado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   format: uuid
   *                 title:
   *                   type: string
   *                 year:
   *                   type: integer
   *                 studios:
   *                   type: string
   *                 producers:
   *                   type: string
   *                 winner:
   *                   type: boolean
   */
  router.post('/movies', adaptRoute(makeCreateMovieController()));

  /**
   * @swagger
   * /api/v1/movies/import:
   *   post:
   *     summary: Importa filmes via CSV
   *     tags: [Movies]
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               file:
   *                 type: string
   *                 format: binary
   *                 description: Arquivo CSV com os filmes
   *     responses:
   *       200:
   *         description: Filmes importados com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   */
  router.post('/movies/import', 
    upload.single('file'),
    adaptRoute(makeImportMoviesController())
  );

  /**
   * @swagger
   * /api/v1/movies/producer-award-intervals:
   *   get:
   *     summary: Retorna os intervalos entre prêmios dos produtores
   *     tags: [Movies]
   *     responses:
   *       200:
   *         description: Intervalos calculados com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 min:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       producer:
   *                         type: string
   *                       interval:
   *                         type: integer
   *                       previousWin:
   *                         type: integer
   *                       followingWin:
   *                         type: integer
   *                 max:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       producer:
   *                         type: string
   *                       interval:
   *                         type: integer
   *                       previousWin:
   *                         type: integer
   *                       followingWin:
   *                         type: integer
   */
  router.get('/movies/producer-award-intervals', 
    adaptRoute(makeProducerAwardIntervalsController())
  );
};