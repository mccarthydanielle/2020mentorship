var express = require('express');
const https = require('https');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

//whole application should have consistent style (camel case, etc.)
// we can change data type in resolvers 


//inside / outside exclamations
// Construct a schema, using GraphQL schema language

//next step is add an argument with country name 

var schema = buildSchema(`
type CovidCase {
    country: String
    countryAbbreviation: String
    totalCases: Int
    newCases: Int
    totalDeaths: Int
    newDeaths: Int
    totalRecovered: Int
    activeCases: Int
    seriousCritical: Int
    casesPerMillPop: Float
    flag: String
}

  type Query {
    hello: String
    covidCases: [CovidCase!]! 
  }
`);

// The root provides a resolver function for each API endpoint
//refactor for error handling eventually
//refactor using node-fetch, view it in graphiql 

var root = {
  hello: () => {
    return 'Hello world!';
  },
  covidCases: (obj, args, context, info) => {
    https.get('https://corona-virus-stats.herokuapp.com/api/v1/cases/countries-search', (resp) => {
        let data = '';
      
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
          data += chunk;
        });
      
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          console.log(JSON.parse(data).explanation);
        });
      
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
  },
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');