import express from 'express';
import path from 'path';
import routes from './routes/index';

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.use(routes);

app.listen(3000, () => console.log('Hello'));

module.expors = app;
