
const mongoose = require('mongoose');
const app = require('./app');

mongoose.connect("mongodb+srv://stanislasmakengo1:0826016607makengo@cluster0.h1xmw9a.mongodb.net/?retryWrites=true&w=majority"
  ,
  {
    useNewUrlParser: true,
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log('Express server démarré sur le port ' + port);
});
