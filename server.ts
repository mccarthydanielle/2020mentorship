import express from 'express';
import graphqlHTTP from 'express-graphql';
import { buildSchema } from 'graphql';
import axios from 'axios';
import { covid19trackerFitSchema, bingDataFitSchema } from './helpers';

// 1 demographic API
// twitter API

//context seems like it works when you're using one data source
//individual field resolvers??? can't figure out how this works for objects, only see how to have resolvers when there is a list of objects
//should we have one query that takes in an argument, it could be all or a specific data source? or separate queries for each data source?

//add in custom date types later (using string for now)
//I don't want seperate types for each source. Could I put [BingData] | [CovidCase]
//maybe rework BingData so we have objects that contain data from each location? Right now it's a big list of all the data.

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

type BingData {
  ID: Int
  Update: String
  Confirmed: Int
  ConfirmedChange: Int
  Deaths: Int
  DeathsChange: Int
  Recovered: Int
  RecoveredChange: Int
  Latitude: Int
  Longitude: Int
  ISO2: String
  ISO3: String
  CountryRegion: String
  AdminRegion1: String
  AdminRegion2: String

}
type DataSource {
  dataSource: String
  covidTrackingInfo: [CovidCase]
}

type BingDataSource {
  dataSource: String
  covidTrackingInfo: [BingData]
}


  type Query {
    hello: String
    covid19trackerData: DataSource
    bingData: BingDataSource
  }
`);

var root = {
  hello: () => {
    return 'Hello world!';
  },
  covid19trackerData: async (obj, args, context, info) => {
    const response = await axios.get('https://covid-19.dataflowkit.com/v1');
    const final = response.data.map((data) => covid19trackerFitSchema(data));
    return {
      dataSource: 'https://www.worldometers.info/coronavirus/',
      covidTrackingInfo: final,
    };
  },
  bingData: async (obj, args, context, info) => {
    const bingData = bingDataFitSchema();
    return {
      dataSource: 'https://bing.com/covid',
      covidTrackingInfo: bingData,
    };
  },
};

const app = express();
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

module.exports = app;
