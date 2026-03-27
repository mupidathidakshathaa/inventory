import { Router } from 'express';
import db from '../db';

const router = Router();

router.get('/', (req, res) => {
  const stmt = db.prepare('SELECT * FROM products');
  const products = stmt.all();
  res.json(products);
});

router.post('/', (req, res) => {
  const { name, quantity, threshold } = req.body;
  if (!name || quantity === undefined) {
    res.status(400).json({ error: 'Name and quantity are required' });
    return;
  }

  const stmt = db.prepare('INSERT INTO products (name, quantity, threshold) VALUES (?, ?, ?)');
  const result = stmt.run(name, quantity, threshold || 20);
  res.status(201).json({ id: result.lastInsertRowid, name, quantity, threshold: threshold || 20 });
});

router.put('/:id', (req, res) => {
  const { name, quantity, threshold } = req.body;
  const { id } = req.params;

  const stmt = db.prepare('UPDATE products SET name = ?, quantity = ?, threshold = ? WHERE id = ?');
  const result = stmt.run(name, quantity, threshold || 20, id);

  if (result.changes === 0) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }

  res.json({ id, name, quantity, threshold: threshold || 20 });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare('DELETE FROM products WHERE id = ?');
  const result = stmt.run(id);

  if (result.changes === 0) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }

  res.json({ message: 'Product deleted' });
});

export default router;
