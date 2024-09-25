import express from 'express';
import { createClient } from 'redis';
import { promisify } from 'util';

const client = createClient();

const listProducts = [
  {
    id: 1,
    name: 'Suitcase 250',
    price: 50,
    stock: 4,
  },
  {
    id: 2,
    name: 'Suitcase 450',
    price: 100,
    stock: 10,
  },
  {
    id: 3,
    name: 'Suitcase 650',
    price: 350,
    stock: 2,
  },
  {
    id: 4,
    name: 'Suitcase 1050',
    price: 550,
    stock: 5,
  },
];

function getItemById(id) {
  const prdt = listProducts.find((product) => product.id == id);
  return prdt;
}

function reserveStockById(itemId, stock) {
  client.set(itemId, stock);
}

async function getCurrentReservedStockById(itemId) {
  const getAsync = promisify(client.get).bind(client);
  const stock = getAsync(itemId);
  return stock;
}

const app = express();

app.get('/list_products', (req, res) => {
  res.json(listProducts);
});

app.get('/list_products/:itemId', async (req, res) => {
  const { itemId } = req.params;
  const availableStock = await getCurrentReservedStockById(itemId);
  const item = getItemById(itemId);
  if (item) {
    res.json({ ...item, currentQuantity: availableStock });
  } else {
    res.json({ status: 'Product not found' });
  }
});

app.get('/reserve_product/:itemId', async (req, res) => {
  const { itemId } = req.params;
  const item = getItemById(itemId);
  if (!item) {
    res.json({ status: 'Product not found' });
    return;
  }
  const reservedStock = await getCurrentReservedStockById(itemId);
  if (reservedStock < 1) {
    res.json({ status: 'Not enough stock available', itemId });
  } else {
    reserveStockById(itemId, reservedStock - 1);
    res.json({ status: 'reservation confirmed', itemId });
  }
});

app.listen(1245, () => {
  listProducts.forEach((product) => {
    reserveStockById(product.id, product.stock);
  });
});
