const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// GET route para obtener todos los registros
router.get('/posts', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM posts');
    const posts = result.rows;
    client.release();
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los posts' });
  }
});

// POST route para almacenar un nuevo registro
router.post('/posts', async (req, res) => {
  const { title, content, likes } = req.body;

  if (!title || !content || likes === undefined) {
    return res.status(400).json({ error: 'Faltan datos en el cuerpo de la solicitud' });
  }

  try {
    const client = await pool.connect();
    const result = await client.query('INSERT INTO posts (title, content, likes) VALUES ($1, $2, $3) RETURNING *', [title, content, likes]);
    const newPost = result.rows[0];
    client.release();
    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear un nuevo post' });
  }
});

// PUT route para modificar un registro existente
router.put('/posts/:id', async (req, res) => {
  const { id } = req.params;
  const { likes } = req.body;

  if (!id || likes === undefined || isNaN(likes)) {
    return res.status(400).json({ error: 'Se requiere el ID del post y la cantidad válida de likes' });
  }

  try {
    const client = await pool.connect();
    const result = await client.query('UPDATE posts SET likes = likes + $1 WHERE id = $2 RETURNING *', [likes, id]);
    const updatedPost = result.rows[0];
    client.release();

    if (!updatedPost) {
      return res.status(404).json({ error: 'No se encontró el post a modificar' });
    }

    res.json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al modificar el post' });
  }
});

// DELETE route para eliminar un registro existente
router.delete('/posts/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Se requiere el ID del post' });
  }

  try {
    const client = await pool.connect();
    const result = await client.query('DELETE FROM posts WHERE id = $1 RETURNING *', [id]);
    const deletedPost = result.rows[0];
    client.release();

    if (!deletedPost) {
      return res.status(404).json({ error: 'No se encontró el post a eliminar' });
    }

    res.json({ message: 'Post eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el post' });
  }
});

module.exports = router;
