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
// app.use((req, res) => {
//   res.send('Hello, world!')
// })

app.use(function validateBearerToken(req, res, next){
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');

  console.log('validate bearer token middleware');

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }
  next();
});

app.get('/movies', (req,res) => {
  let data = [ ...movieData ];
  const { genre, country, avg_vote } = req.query;

  if(genre) {
    if(!['animation', 'drama', 'romantic', 'comedy', 'spy', 'crime', 'thriller', 'adventure', 'documentary', 'horror', 'action', 'western', 'history', 'biography', 'musical', 'fantasy', 'war', 'grotesque'].includes(genre.toLowerCase())) {
      return res.status(400).send('Please senter an appropriate genre');
    }
  }

  if(country) {
    if(!['united states', 'italy', 'germany', 'israel', 'great britain', 'france', 'hungary', 'china', 'canada', 'spain', 'japan'].includes(country.toLowerCase())) {
      return res.status(400).send('Please enter an appropriate country');
    }
  }

  if(avg_vote) {
    if(avg_vote > 10 || avg_vote < 0) {
      return res.status(400).send('Avg vote must be between 0 and 10');
    }
  }

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