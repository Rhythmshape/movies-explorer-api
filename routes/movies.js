const router = require('express').Router();
const {
  getMovies,
  addMovie,
  deleteMovie,
} = require('../controllers/movies');

const {
  validationAddMovie,
  validationMovieId,
} = require('../middlewares/validation');

router.get('/', getMovies);
router.post('/', validationAddMovie, addMovie);
router.delete('/:movieId', validationMovieId, deleteMovie);

module.exports = router;
