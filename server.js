const express = require("express");
const app = express();
const { createClient } = require("redis");

const client = createClient();

const port = 3000;

const getAllProducts = async () => {
  const time = Math.random() * 10000;

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(["Produto 1", "Produto 2"]);
    }, time);
  });
};

app.get("/", async (req, res) => {
    const productsFromCache = await client.get('getAllProducts')
    if(productsFromCache){
        return res.send(JSON.parse(productsFromCache));
    }
//   await client.set("key", "value");
//   const value = await client.get("key");
  const products = await getAllProducts();
  await client.set('getAllProducts', JSON.stringify(products), {EX: 10})
  res.send(products);
});

app.get('/saved', async(req, res) => {
    await client.del('getAllProducts');
    res.send({ok: true})
})

const startup = async () => {
  await client.connect();
  app.listen(port, () => {
    console.log(`Server running in port ${port}`);
  });
};
startup();
