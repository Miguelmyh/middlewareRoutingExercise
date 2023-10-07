process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
let items = require("../fakeDb");

beforeEach(function () {
  items.push(
    { name: "popsicle", price: 1.45 },
    { name: "cheerios", price: 3.4 }
  );
});

afterEach(function () {
  items.length = 0;
});

describe("/get items", function () {
  test("should get all items", async function () {
    const resp = await request(app).get(`/items`);
    expect(resp.body).toEqual({
      items: [
        { name: "popsicle", price: 1.45 },
        { name: "cheerios", price: 3.4 },
      ],
    });
  });
});

describe("/post items", function () {
  test("should add item(s) to items list", async function () {
    const resp = await request(app).post(`/items`).send({
      name: "cheetos",
      price: 2.0,
    });
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({
      added: {
        name: "cheetos",
        price: 2.0,
      },
    });
  });

  test("should throw an error when not information", async function () {
    const resp = await request(app).post(`/items`).send({});
    expect(resp.statusCode).toBe(402);
  });
});

describe("/get :name", function () {
  test("get item", async function () {
    const resp = await request(app).get(`/items/${items[0].name}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({
      name: items[0].name,
      price: items[0].price,
    });
  });

  test("should throw an error when no such item is found", async function () {
    const resp = await request(app).get(`/items/falseName`);
    expect(resp.statusCode).toBe(404);
  });
});

describe("/patch :item", function () {
  test("should update item", async function () {
    const resp = await request(app)
      .patch(`/items/${items[0].name}`)
      .send({ name: "test", price: 1.0 });
    expect(resp.statusCode).toBe(201);
    expect(resp.body).toEqual({
      updated: {
        name: "test",
        price: 1,
      },
    });
  });

  test("should throw an error when no item is found", async function () {
    const resp = await request(app)
      .patch(`/items/newItem`)
      .send({ name: "test", price: 1.0 });
    expect(resp.statusCode).toBe(404);
  });

  test("should throw an error when data is missing", async function () {
    // made both price and name as requirements
    const resp = await request(app)
      .patch(`/items/${items[0].name}`)
      .send({ name: "test" });
    expect(resp.statusCode).toBe(402);
  });
});

describe("/delete :name", function () {
  test("should delete element", async function () {
    const resp = await request(app).delete(`/items/${items[0].name}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ message: "Deleted" });
  });
  test("should throw an error", async function () {
    const resp = await request(app).delete(`/items/noName`);
    expect(resp.statusCode).toBe(404);
  });
});
