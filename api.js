import pkg from 'pg';
import express from 'express';


const { Pool } = pkg;

const pool = new Pool({
  host: 'tododb.cyitak0a1uke.ap-south-1.rds.amazonaws.com',
  port: 5432,
  database: 'postgres',
  user: 'Satheesh',
  password: 'Satheesh123',
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();
app.use(express.json());

// Fetch all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM tasks ORDER BY created_at DESC');
    res.json(result.rows);
    client.release();
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Create a new task
app.post('/api/tasks', async (req, res) => {
  const { title, description } = req.body;
  try {
    const client = await pool.connect();
    await client.query('INSERT INTO tasks (title, description) VALUES ($1, $2)', [title, description]);
    res.status(201).json({ message: 'Task created' });
    client.release();
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update task status
app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { is_complete } = req.body;
  try {
    const client = await pool.connect();
    await client.query('UPDATE tasks SET is_complete = $1 WHERE id = $2', [is_complete, id]);
    res.json({ message: 'Task updated' });
    client.release();
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const client = await pool.connect();
    await client.query('DELETE FROM tasks WHERE id = $1', [id]);
    res.json({ message: 'Task deleted' });
    client.release();
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// // Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

