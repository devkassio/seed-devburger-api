import axios from 'axios';
import FormData from 'form-data';
import fs from 'node:fs';
import { config } from './config.js';
import { categories } from './data/categories.js';
import { products } from './data/products.js';

// Preencha as informações no arquivo "./config.js"
const api = axios.create({
  baseURL: config.apiUrl,
  headers: {
    Authorization: `Bearer ${config.userToken}`,
  },
});

// Pra rodar é só dar um "npm start"
async function seed() {
  for (const category of categories) {
    const categoryForm = new FormData();

    categoryForm.append('name', category.name);
    categoryForm.append('file', fs.createReadStream(category.file));

    try {
      const { data: createdCategory } = await api.post('/categories', categoryForm, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      console.log(createdCategory);
    } catch (err) {
      console.log(err);
      process.exit();
    }
  }

  for (const product of products) {
    const productForm = new FormData();

    productForm.append('name', product.name);
    productForm.append('price', product.price);
    productForm.append('category_id', product.category_id);
    productForm.append('offer', String(product.offer));
    productForm.append('file', fs.createReadStream(product.file));


    try {
      const { data: createdProduct } = await api.post('/products', productForm, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      console.log(createdProduct);
    } catch (err) {
      console.log(err);
      process.exit();
    }
  }
}

seed();