import { Router } from 'express';
import { RandomForestRegression } from 'ml-random-forest';
import { kmeans } from 'ml-kmeans';
import * as tf from '@tensorflow/tfjs';
import db from '../db';

const router = Router();

router.get('/predict-rf', (req, res) => {
  const stmt = db.prepare('SELECT date, sales FROM sales ORDER BY date ASC');
  const data = stmt.all() as { date: string; sales: number }[];

  if (data.length < 10) {
    res.status(400).json({ error: 'Not enough data for prediction' });
    return;
  }

  // Convert dates to timestamps for training
  const X = data.map((d, i) => [i]); // Simple time series index
  const y = data.map(d => d.sales);

  const options = {
    seed: 3,
    maxFeatures: 1,
    replacement: false,
    nEstimators: 50
  };

  const regression = new RandomForestRegression(options);
  regression.train(X, y);

  // Predict next 30 days
  const futureX = Array.from({ length: 30 }, (_, i) => [data.length + i]);
  const predictions = regression.predict(futureX);

  const lastDate = new Date(data[data.length - 1].date);
  const results = predictions.map((pred, i) => {
    const nextDate = new Date(lastDate);
    nextDate.setDate(lastDate.getDate() + i + 1);
    return {
      date: nextDate.toISOString().split('T')[0],
      predicted_sales: Math.round(pred)
    };
  });

  res.json(results);
});

router.get('/predict-lstm', async (req, res) => {
  const stmt = db.prepare('SELECT date, sales FROM sales ORDER BY date ASC');
  const data = stmt.all() as { date: string; sales: number }[];

  if (data.length < 20) {
    res.status(400).json({ error: 'Not enough data for LSTM (need at least 20 records)' });
    return;
  }

  const sales = data.map(d => d.sales);
  const maxSale = Math.max(...sales);
  const minSale = Math.min(...sales);
  const normalizedSales = sales.map(s => (s - minSale) / (maxSale - minSale || 1));

  const lookBack = 10;
  const X: number[][][] = [];
  const y: number[] = [];

  for (let i = 0; i < normalizedSales.length - lookBack; i++) {
    X.push(normalizedSales.slice(i, i + lookBack).map(val => [val]));
    y.push(normalizedSales[i + lookBack]);
  }

  const xs = tf.tensor3d(X, [X.length, lookBack, 1]);
  const ys = tf.tensor2d(y, [y.length, 1]);

  const model = tf.sequential();
  model.add(tf.layers.lstm({ units: 50, inputShape: [lookBack, 1] }));
  model.add(tf.layers.dense({ units: 1 }));
  model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

  await model.fit(xs, ys, { epochs: 50, verbose: 0 });

  // Predict next 30 days
  let currentInput = normalizedSales.slice(-lookBack);
  const predictions = [];

  for (let i = 0; i < 30; i++) {
    const inputTensor = tf.tensor3d([currentInput.map(val => [val])], [1, lookBack, 1]);
    const pred = model.predict(inputTensor) as tf.Tensor;
    const predValue = (await pred.data())[0];
    predictions.push(predValue);
    currentInput.push(predValue);
    currentInput.shift();
    inputTensor.dispose();
    pred.dispose();
  }

  const denormalizedPredictions = predictions.map(p => Math.round(p * (maxSale - minSale) + minSale));

  const lastDate = new Date(data[data.length - 1].date);
  const results = denormalizedPredictions.map((pred, i) => {
    const nextDate = new Date(lastDate);
    nextDate.setDate(lastDate.getDate() + i + 1);
    return {
      date: nextDate.toISOString().split('T')[0],
      predicted_sales: pred
    };
  });

  res.json(results);
});

router.get('/cluster', (req, res) => {
  const stmt = db.prepare('SELECT * FROM products');
  const products = stmt.all() as any[];

  if (products.length < 3) {
    res.status(400).json({ error: 'Not enough products for clustering' });
    return;
  }

  const data = products.map(p => [p.quantity, p.threshold]);
  const ans = kmeans(data, 3, { initialization: 'kmeans++' });

  const clusteredProducts = products.map((p, i) => ({
    ...p,
    cluster: ans.clusters[i]
  }));

  res.json(clusteredProducts);
});

export default router;
