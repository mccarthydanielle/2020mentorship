var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
const axios = require('axios');

//whole application should have consistent style (camel case, etc.)
// we can change data type in resolvers 


//inside / outside exclamations
// Construct a schema, using GraphQL schema language

//next step is add an argument with country name 

//https://covid-19.dataflowkit.com/v1


var schema = buildSchema(`
type CovidCase {
    country: String
    totalCases: Int
    newCases: Int
    totalDeaths: Int
    newDeaths: Int
    totalRecovered: Int
    activeCases: Int
}

  type Query {
    hello: String
    covidCases: [CovidCase!]! 
  }
`);

// The root provides a resolver function for each API endpoint
//refactor for error handling eventually

//how to handle if data doesn't have a field? 

const fitToSchema = (info) => {

  return {
    country: info['Country_text'],
    totalCases: Number(info['Total Cases_text'].replace(/[^a-z0-9-]/g, '')),
    newCases: Number(info['New Cases_text'].replace(/[^a-z0-9-]/g, '')) ,
    totalDeaths: Number(info['Total Deaths_text'].replace(/[^a-z0-9-]/g, '')),
    newDeaths: Number(info['New Deaths_text'].replace(/[^a-z0-9-]/g, '')),
    totalRecovered: Number(info['Total Recovered_text'].replace(/[^a-z0-9-]/g, '')),
    activeCases: Number(info['Active Cases_text'].replace(/[^a-z0-9-]/g, '')),
  }
}

var root = {
  hello: () => {
    return 'Hello world!';
  },
  covidCases: async (obj, args, context, info) =>  {

    const response = await axios.get('https://covid-19.dataflowkit.com/v1')

    const final = response.data.map(data => fitToSchema(data))

    return final 

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