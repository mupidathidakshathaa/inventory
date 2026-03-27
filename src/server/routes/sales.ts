import { Router } from 'express';
import multer from 'multer';
import { parse } from 'csv-parse';
import fs from 'fs';
import path from 'path';
import db from '../db';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', (req, res) => {
  const stmt = db.prepare('SELECT * FROM sales ORDER BY date ASC');
  const sales = stmt.all();
  res.json(sales);
});

router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }

  const results: any[] = [];
  const parser = parse({ columns: true, trim: true, skip_empty_lines: true, bom: true });

  fs.createReadStream(req.file.path)
    .pipe(parser)
    .on('data', (data) => {
      // Handle different case variations of 'Date' and 'Sales'
      const dateVal = data.Date || data.date || data.DATE;
      const salesVal = data.Sales || data.sales || data.SALES;
      const productVal = data.ProductID || data.product_id || data.productid;

      if (dateVal && salesVal) {
        results.push({
          date: dateVal,
          sales: parseFloat(salesVal) || 0,
          product_id: productVal ? parseInt(productVal, 10) : null
        });
      }
    })
    .on('end', () => {
      const insert = db.prepare('INSERT INTO sales (date, sales, product_id) VALUES (?, ?, ?)');
      const insertMany = db.transaction((sales: any[]) => {
        db.prepare('DELETE FROM sales').run(); // Clear old sales data
        for (const sale of sales) {
          insert.run(sale.date, sale.sales, sale.product_id);
        }
      });

      try {
        insertMany(results);
        res.json({ message: 'Sales data uploaded successfully', count: results.length });
      } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Error saving to database' });
      } finally {
        if (req.file) {
          try { fs.unlinkSync(req.file.path); } catch (e) {}
        }
      }
    })
    .on('error', (err) => {
      console.error('CSV Parse Error:', err);
      if (req.file) {
        try { fs.unlinkSync(req.file.path); } catch (e) {}
      }
      res.status(400).json({ error: 'Error parsing CSV file. Please check the format.' });
    });
});

export default router;
