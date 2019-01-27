# gatsby-source-geo

Plugin for creating nodes from geospatial data sources. Each layer is exposed as a `GeoLayer` node, each geographic feature a `GeoFeature` - each of these nodes can be published, or referenced or whatever in graphql.

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

## Options

path - it's just the location of the geospatial data file (eg /tmp/myfile.geojson)

## How to query

You can query GeoLayer nodes from geospatial data in the following way:

```graphql
{
	allGeoLayer {
		edges {
			node {
				id
				name
				srs_wkt
			}
		}
	}
}
```

You can query GeoFeature nodes from geospatial data in the following way:

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
