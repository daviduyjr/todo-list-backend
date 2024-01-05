import express from 'express';
import createTodo from './endpoints/create-todo';
// import getHealth from './endpoints/get-health';
import getTodos from './endpoints/get-todos';
import updateTodo from './endpoints/update-todo';
import deleteTodo from './endpoints/delete-todo';

const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Change * to specific origin in production
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

app.use(express.json());

app.get('/', getTodos);

app.post('/create-todo', createTodo);

app.put('/update-todo/:id', updateTodo);

app.delete('/delete-todo/:id', deleteTodo);

export default app;
