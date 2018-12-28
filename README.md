# gatsby-source-geo

Plugin for creating `GeoFeature` nodes from geospatial data sources. Each feature in the geospatial data source becomes a node that can be published, or referenced or whatever in graphql.

Uses the node-gdal module for accessing underlying geospatial data sources.

Under development and only lightly tested on GeoJSON files

## Install

You'll need to install both this module and the gdal module.

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

//@todo - add support for specific layers, defaulting to the first layer
in a feature

## Options

path - it's just the location of the geospatial data file (eg /tmp/myfile.geojson)

## How to query

You can query GeoFeature nodes from geospatial featues in the following way:

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

geometry will contain the features' geometry in GeoJSON format, and the contents of featureFields will vary depending upon the schema definition of the data that you're querying.
