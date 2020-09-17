require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const movieData = require('./movie-data.js');

const app = express();


app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next){
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');

  console.log('validate bearer token middleware');

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }
  next();
});

app.get('/movie', (req,res) => {
  let data = [ ...movieData ];
  const { genre, country, avg_vote } = req.query;

  if(genre) {
    data = data.filter(movie => {
      return movie.genre.toLowerCase().includes(genre.toLowerCase());
    });
  }

  if(country) {
    data = data.filter(movie => {
      return movie.country.toLowerCase().includes(country.toLowerCase());
    });
  }

  if(avg_vote) {
    data = data.filter(movie => {
      return movie.avg_vote >= avg_vote;
    });
  }
  return res.json(data);
});

app.listen(8000, () => {
  console.log('Server listening at http://localhost:8000');
});