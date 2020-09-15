require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const movieData = require('./movie-data.js');

const app = express();


app.use(morgan('dev'));

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
    if(!['Animation', 'Drama', 'Romantic', 'Comedy', 'Spy', 'Crime', 'Thriller', 'Adventure', 'Documentary', 'Horror', 'Action', 'Western', 'History', 'Biography', 'Musical', 'Fantasy', 'War', 'Grotesque'].includes(genre)) {
      return res.status(400).send('Please senter an appropriate genre');
    }
  }

  if(country) {
    if(!['United States', 'Italy', 'Germany', 'Israel', 'Great Britain', 'France', 'Hungary', 'China', 'Canada', 'Spain', 'Japan'].includes(country)) {
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
      return movie.genre.includes(genre);
    })
  }

  if(country) {
    data = data.filter(movie => {
      return movie.country.includes(country);
    })
  }

  if(avg_vote) {
    data = data.filter(movie => {
      return movie.avg_vote >= avg_vote;
    });
  }
  return res.json(data);
})

app.listen(8000, () => {
  console.log('Server listening at http://localhost:8000');
});