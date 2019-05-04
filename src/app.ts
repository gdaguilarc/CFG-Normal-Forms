// lib/app.ts
import express from 'express';
import path from 'path';
import routes from './routes/index';

// Create a new express application instance
const app: express.Application = express();

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.use(routes);

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});
