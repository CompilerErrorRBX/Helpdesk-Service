const app = require('express')();
const graphHTTP = require('express-graphql');
const bodyParser = require('body-parser');
const cors = require('cors');

const schema = require('./schemas');
const routes = require('./routes');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

routes(app);

app.use('/api', graphHTTP({
  schema,
  pretty: true,
  graphiql: true,
}));

const server = app.listen(8080, () => {
  console.log('Helpdesk API running on port', server.address().port);
});
