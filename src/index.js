import axios from 'axios';
import FormData from 'form-data';
import fs from 'node:fs';
import { config } from './config.js';
// import { categories } from './data/categories.js';  // Comentei, não precisa mais
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
  // Não limpa nada, só adiciona produtos (assumindo categoria já existe com ID 5)

  console.log('🚀 Iniciando adição dos 9 produtos...');

  for (const product of products) {
    const productForm = new FormData();

    productForm.append('name', product.name);
    productForm.append('price', product.price);
    productForm.append('category_id', product.category_id);  // Usa o 5 fixo do seu data
    productForm.append('offer', String(product.offer));
    productForm.append('file', fs.createReadStream(product.file));

    try {
      const { data: createdProduct } = await api.post('/products', productForm, {
        headers: {
          ...productForm.getHeaders(),  // Headers automáticos pro FormData
        }
      });

      console.log('✅ Produto criado:', createdProduct.name, '(ID:', createdProduct.id, ')');
    } catch (err) {
      console.error('❌ Erro no produto', product.name, ':', err.response?.data || err.message);
      // Não para o script aqui, continua pros próximos (pra não perder os outros)
    }
  }

  console.log('🎉 Adição dos 9 produtos concluída! Verifique no banco.');
}

seed();