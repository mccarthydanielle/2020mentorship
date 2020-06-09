# General Notes & Todos

## Data sources

https://covid-19.dataflowkit.com/v1

## Todo

[] Create individual field resolvers

[x] Create more schema and retrieve more data sources

[] Clean up Regex stuff, make everything more consistent

[] look at how to work with context (in resolvers for queries and fields)

## General Notes

**6/5/2020**

**5/28/2020**

- how to handle if data doesn't have a field? - empty string or null, personal preference
- make the queries more dynamic with union types

**5/20/2020**

- The root provides a resolver function for each API endpoint
  refactor for error handling eventually
- whole application should have consistent style (camel case, etc.)
- we can change data type in resolvers as well as field names. Mold data how we want to.
- inside / outside exclamations. A trailing exclamation mark is used to denote a field that use a non-null type i.e. name: String! An exclamation point after a type specifically designates that type as non-nullable

corona virus graphql server example https://github.com/rlindskog/covid19-graphql/blob/master/server.ts
