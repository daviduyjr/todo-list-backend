import express from 'express';
import login from './endpoints/login';
import createTodo from './endpoints/create-todo';
// import getHealth from './endpoints/get-health';
import getTodos from './endpoints/get-todos';
import updateTodo from './endpoints/update-todo';
import deleteTodo from './endpoints/delete-todo';
import authenticateToken from './endpoints/authenticate-token';

const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Change * to specific origin in production
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

app.use(express.json());

app.post('/login', login)

app.get('/', authenticateToken, getTodos);

app.post('/create-todo', authenticateToken, createTodo);

app.put('/update-todo/:id', authenticateToken, updateTodo);

app.delete('/delete-todo/:id', authenticateToken, deleteTodo);

export default app;
