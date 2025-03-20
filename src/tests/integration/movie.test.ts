import request from "supertest";
import { appPromise } from "../../index";
import { prisma } from "../../infra/db/database";

describe("Movie Integration Tests", () => {
  let app: any;

  beforeAll(async () => {
    app = await appPromise;
    
    await prisma.$connect();
  });

  afterAll(async () => {
    // Limpa o banco e fecha a conexão
    await prisma.$transaction([prisma.movie.deleteMany()]);
    await prisma.$disconnect();
  });

  describe("POST /api/v1/movies", () => {
    it("deve criar um filme com sucesso", async () => {
      const movieData = {
        title: "Test Movie",
        year: 2020,
        studios: "Test Studios",
        producers: "Test Producer",
        winner: false,
      };

      const response = await request(app)
        .post("/api/v1/movies")
        .send(movieData)
        .expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body.title).toBe(movieData.title);
      expect(response.body.year).toBe(movieData.year);
      expect(response.body.studios).toBe(movieData.studios);
      expect(response.body.producers).toBe(movieData.producers);
      expect(response.body.winner).toBe(movieData.winner);

      await request(app).delete(`/api/v1/movies/${response.body.id}`).expect(200);
    });

    it("não deve criar um filme com título duplicado", async () => {
      const movieData = {
        title: "Duplicate Movie",
        year: 2020,
        studios: "Test Studios",
        producers: "Test Producer",
        winner: false,
      };

      const inserted = await request(app).post("/api/v1/movies").send(movieData).expect(201);

      const response = await request(app)
        .post("/api/v1/movies")
        .send(movieData)
        .expect(409);

      expect(response.body.error).toBe(
        "Já existe um filme cadastrado com este título"
      );

      await request(app).delete(`/api/v1/movies/${inserted.body.id}`).expect(200);
    });
  });

  describe("POST /api/v1/movies/import", () => {
    it("deve rejeitar arquivo não-CSV", async () => {
      const response = await request(app)
        .post("/api/v1/movies/import")
        .attach("file", Buffer.from("invalid"), "invalid.txt")
        .expect(400);

      expect(response.body.error).toBe("Apenas arquivos CSV são permitidos");
    });
  });

  describe("GET /api/v1/movies", () => {
    it("deve buscar filmes por ano", async () => {
      const response = await request(app)
        .get("/api/v1/movies")
        .query({ year: 1980 })
        .expect(200);

      expect(response.body).toHaveLength(206);
    });
  });

  describe("GET /api/v1/movies/producer-award-intervals", () => {
    it("deve retornar os intervalos de prêmios dos produtores corretamente após importar CSV", async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = await request(app)
        .get("/api/v1/movies/producer-award-intervals")
        .expect(200);

      expect(response.body).toHaveProperty("min");
      expect(response.body).toHaveProperty("max");
      expect(Array.isArray(response.body.min)).toBe(true);
      expect(Array.isArray(response.body.max)).toBe(true);

      console.log({ data: JSON.stringify(response.body, null, 2) });
      // Verifica o resultado máximo específico
      expect(response.body.max).toHaveLength(1);
      expect(response.body.max[0]).toEqual({
        producer: "Matthew Vaughn",
        interval: 13,
        previousWin: 2002,
        followingWin: 2015,
      });

      expect(response.body.min).toHaveLength(1);
      expect(response.body.min[0]).toEqual({
        producer: "Joel Silver",
        interval: 1,
        previousWin: 1990,
        followingWin: 1991,
      });
    });
  });

  describe("PUT /api/v1/movies/:id", () => {
    it("deve atualizar um filme com sucesso", async () => {
      const movieData = {
        title: "Test Movie Update",
        year: 2020,
        studios: "Test Studios",
        producers: "Test Producer",
        winner: false,
      };

      const createResponse = await request(app)
        .post("/api/v1/movies")
        .send(movieData);

      const updateData = {
        title: "Updated Movie",
        year: 2021,
        studios: "Updated Studios",
        producers: "Updated Producer",
        winner: true,
      };

      await request(app)
        .put(`/api/v1/movies/${createResponse.body.id}`)
        .send(updateData)
        .expect(200);

      const findMovie = await prisma.movie.findUnique({
        where: { id: createResponse.body.id },
      });

      expect(findMovie).not.toBeNull();
      expect(findMovie?.title).toBe(updateData.title);
      expect(findMovie?.year).toBe(updateData.year);
      
      // Limpa o filme criado no teste
      await request(app).delete(`/api/v1/movies/${createResponse.body.id}`).expect(200);
    });
  });

  describe("DELETE /api/v1/movies/:id", () => {
    it("deve deletar um filme com sucesso", async () => {
      const movieData = {
        title: "Test Movie Delete",
        year: 2020,
        studios: "Test Studios",
        producers: "Test Producer",
        winner: false,
      };

      const createResponse = await request(app)
        .post("/api/v1/movies")
        .send(movieData);

      await request(app)
        .delete(`/api/v1/movies/${createResponse.body.id}`)
        .expect(200);

      const findMovie = await prisma.movie.findUnique({
        where: { id: createResponse.body.id },
      });

      expect(findMovie).toBeNull();
    });
  });

  it("deve apresentar dois resultados min com intervalo 1 e dois max com intervalo 22 após adicionar dados específicos", async () => {
    // Adicionando os filmes para Matthew Vaughn como especificado
    const response1 = await request(app)
      .post("/api/v1/movies")
      .send({
        title: "Test 1",
        year: 1980,
        studios: "Test 1",
        producers: "Matthew Vaughn",
        winner: true
      });

    const response2 = await request(app)
      .post("/api/v1/movies")
      .send({
        title: "Test 2",
        year: 2003,
        studios: "Test 2",
        producers: "Matthew Vaughn",
        winner: true
      });

    const response3 = await request(app)
      .post("/api/v1/movies")
      .send({
        title: "Test 3",
        year: 2037,
        studios: "Test 3",
        producers: "Matthew Vaughn", 
        winner: true
      });

    // Fazendo a requisição para obter os intervalos
    const response = await request(app)
      .get("/api/v1/movies/producer-award-intervals")
      .expect(200);

    console.log({ data: JSON.stringify(response.body, null, 2) });
    // Verificando se temos dois resultados min com intervalo 1
    expect(response.body.min).toHaveLength(2);
    expect(response.body.min.every((item: any) => item.interval === 1)).toBe(true);
    
    // Verificando se temos dois resultados max com intervalo 22
    expect(response.body.max).toHaveLength(2);
    expect(response.body.max.every((item: any) => item.interval === 22)).toBe(true);
        
    // Limpar o banco após o teste
    await request(app).delete(`/api/v1/movies/${response1.body.id}`).expect(200);
    await request(app).delete(`/api/v1/movies/${response2.body.id}`).expect(200);
    await request(app).delete(`/api/v1/movies/${response3.body.id}`).expect(200);
  });
});
