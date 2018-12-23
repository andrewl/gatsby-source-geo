# gatsby-source-geo

Plugin for creating `GeoFeature` nodes from geospatial data sources.
Uses the node-gdal for accessing underlying data

Under development and only lightly tested on GeoJSON files

## Install

`npm i gatsby-source-geo gdal`

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

path - it's just the location of the geospatial data file (eg /tmp/myfile.geojson)

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
