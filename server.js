const express = require('express');
const graphHTTP = require('express-graphql');
const bodyParser = require('body-parser');
const cors = require('cors');

const schema = require('./schemas');
const routes = require('./routes');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

routes(app);

// cloudinary.uploader.upload(
//   image,
//   (result) => {
//     console.log(result);
//   }, 
//   {
//     crop: 'fill',
//     width: 36,
//     height: 36,
//     quality: 50,
//     gravity: 'face',
//     tags: ['avatar'],
//   }
// );

app.use('/api', graphHTTP({
  schema,
  pretty: true,
  graphiql: true,
}));

const server = app.listen(8080, () => {
  console.log('Helpdesk API running on port', server.address().port);
});
