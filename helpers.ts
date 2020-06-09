import axios from 'axios';
import fs from 'fs';
import census from 'citysdk';

export const bingData = async () => {
  const url =
    'https://raw.githubusercontent.com/microsoft/Bing-COVID-19-Data/master/data/Bing-COVID19-Data.csv';
  const writer = fs.createWriteStream('./data.csv');

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};

export const covid19trackerFitSchema = (info) => {
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

// '7098114,04/28/2020,3083467,81164,213824,5693,915988,37175,,,,,Worldwide,,';
export const bingDataFitSchema = () => {
  const text = fs.readFileSync('data.csv', 'utf8');

  let dataArray = text.split(/\r?\n/);

  let final = dataArray.map((data) => {
    let splitData = data.split(',');
    return {
      ID: splitData[0],
      Update: splitData[1],
      Confirmed: splitData[2],
      ConfirmedChange: splitData[3],
      Deaths: splitData[4],
      DeathsChange: splitData[5],
      Recovered: splitData[6],
      RecoveredChange: splitData[7],
      Latitude: splitData[8],
      Longitude: splitData[9],
      ISO2: splitData[10],
      ISO3: splitData[11],
      CountryRegion: splitData[12],
      AdminRegion1: splitData[13],
      AdminRegion2: splitData[14],
    };
  });

  return final;
};

census(
  {
    vintage: 2015, // required
    geoHierarchy: {
      // required
      county: {
        lat: 28.2639,
        lng: -80.7214,
      },
    },
    sourcePath: ['cbp'], // required
    values: ['ESTAB'], // required
  },
  (err, res) => console.log(res)
);
