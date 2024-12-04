import express from 'express';
import { createClient } from 'redis';
import { promisify } from 'util';

const app = express();
const port = 1245;

const listProducts = [
  { itemId: 1, itemName: 'Suitcase 250', price: 50, initialAvailableQuantity: 4 },
  { itemId: 2, itemName: 'Suitcase 450', price: 100, initialAvailableQuantity: 10 },
  { itemId: 3, itemName: 'Suitcase 650', price: 350, initialAvailableQuantity: 2 },
  { itemId: 4, itemName: 'Suitcase 1050', price: 550, initialAvailableQuantity: 5 },
];

const client = createClient();
const getAsync = promisify(client.get).bind(client);

const getItemById = (id) => listProducts.find((item) => item.itemId === id);

const reserveStockById = (itemId, stock) => {
  client.set(`item.${itemId}`, stock);
};

const getCurrentReservedStockById = async (itemId) => {
  const stock = await getAsync(`item.${itemId}`);
  return stock || 0;
};

app.get('/list_products', (req, res) => {
  res.json(listProducts);
});

app.get('/list_products/:itemId', async (req, res) => {
  const item = getItemById(Number(req.params.itemId));
  if (!item) {
    return res.status(404).json({ status: 'Product not found' });
  }

  const reservedStock = await getCurrentReservedStockById(item.itemId);
  const currentQuantity = item.initialAvailableQuantity - reservedStock;

  res.json({ ...item, currentQuantity });
});

app.get('/reserve_product/:itemId', async (req, res) => {
  const item = getItemById(Number(req.params.itemId));
  if (!item) {
    return res.status(404).json({ status: 'Product not found' });
  }

  const reservedStock = await getCurrentReservedStockById(item.itemId);
  const currentQuantity = item.initialAvailableQuantity - reservedStock;

  if (currentQuantity <= 0) {
    return res.status(400).json({ status: 'Not enough stock available', itemId: item.itemId });
  }

  reserveStockById(item.itemId, Number(reservedStock) + 1);
  res.json({ status: 'Reservation confirmed', itemId: item.itemId });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

