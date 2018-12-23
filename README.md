# gatsby-source-geo

Plugin for creating `GeoFeature` nodes from geospatial data sources.
Uses the node-gdal for accessing underlying data

Under development and Only lightly tested on GeoJSON files

## Install

`npm install --save gatsby-source-geo`

## How to use

```javascript
// In your gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-geo`,
      options: {
        path: `${__dirname}/data/myfile.geojson`,
      },
    },
  ],
}
```

## Options

path - it's just the location of the spatial file

## How to query

You can query GeoFeature nodes like the following:

```graphql
{
  allGeoFeature {
    edges {
      node {
        id
        geometry {
          type
          coordinates
        }
        featureFields {
          my_first_field
          my_second_field
          etc
        }
      }
    }
  }
}
```

geometry will contain the features geometry in GeoJSON format, and the contents
of featureFields will vary depending upon the schema definition of the data
that you're querying.
