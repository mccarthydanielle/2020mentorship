var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
const axios = require('axios');

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

const fitToSchema = (info) => {
  const rx = /[^a-z0-9-]/g;

  return {
    country: info['Country_text'] ? info['Country_text'] : null,
    totalCases: info['Total Cases_text']
      ? Number(info['Total Cases_text'].replace(rx, ''))
      : null,
    newCases: info['New Cases_text']
      ? Number(info['New Cases_text'].replace(rx, ''))
      : null,
    totalDeaths: info['Total Deaths_text']
      ? Number(info['Total Deaths_text'].replace(rx, ''))
      : null,
    newDeaths: info['New Deaths_text']
      ? Number(info['New Deaths_text'].replace(rx, ''))
      : null,
    totalRecovered: info['Total Recovered_text']
      ? Number(info['Total Recovered_text'].replace(rx, ''))
      : null,
    activeCases: info['Active Cases_text']
      ? Number(info['Active Cases_text'].replace(rx, ''))
      : null,
  };
};

var root = {
  hello: () => {
    return 'Hello world!';
  },
  covidCases: async (obj, args, context, info) => {
    const response = await axios.get('https://covid-19.dataflowkit.com/v1');

    const final = response.data.map((data) => fitToSchema(data));

    return final;
  },
};

var app = express();
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');
