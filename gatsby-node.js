const fetch = require("node-fetch")
const queryString = require("query-string")

exports.sourceNodes = (
  { actions, createNodeId, createContentDigest },
  configOptions
) => {
  const { createNode } = actions

  // Gatsby adds a configOption that's not needed for this plugin, delete it
  delete configOptions.plugins

  const processLayer = (layer) => {
    // Creating a proxy for the layer because the fields property, set by
    // OGR is reserved for use by gatsby
    var proxy_layer = {};
    proxy_layer.id = layer.fid;
    proxy_layer.name = layer.name;
    proxy_layer.srs_wkt = layer.srs.toWKT();
    proxy_layer.srs_proj4 = layer.srs.toProj4();
    proxy_layer.srs_xml = layer.srs.toXML();
    const nodeId = createNodeId(`geo-layer-${layer.name}`);
    const nodeContent = JSON.stringify(proxy_layer);
    const nodeData = Object.assign({}, proxy_layer, {
      id: nodeId,
      parent: null,
      children: [],
      internal: {
        type: `geoLayer`,
				content: nodeContent,
        contentDigest: createContentDigest(proxy_layer),
      },
    });
    return nodeData;
  }

  const processFeature = (feature, layer) => {
    // Creating a proxy for the feature because the fields property, set by
    // OGR is reserved for use by gatsby
    var proxy_feature = {};
    proxy_feature.fid = feature.fid;
    proxy_feature.defn = feature.defn;
    proxy_feature.featureFields = feature.fields.toObject();
    proxy_feature.geometry = feature.getGeometry().toObject();
    var envelope = feature.getGeometry().getEnvelope();
    proxy_feature.geometry.envelope = {
      minX: envelope.minX,
      minY: envelope.minY,
      maxX: envelope.maxX,
      maxY: envelope.maxY,
    };
    proxy_feature.geometry.centroid = {
      x: feature.getGeometry().centroid().x,
      y: feature.getGeometry().centroid().y
    };
    proxy_feature.layer_name = layer.name;

    const nodeId = createNodeId(`geo-${feature.fid}`)
    const nodeContent = JSON.stringify(proxy_feature)
    const nodeData = Object.assign({}, proxy_feature, {
      id: nodeId,
      geometry: proxy_feature.geometry,
      featureFields: proxy_feature.featureFields,
      parent: null,
      children: [],
      internal: {
        type: `geoFeature`,
        content: nodeContent,
        contentDigest: createContentDigest(proxy_feature),
      },
    });
    return nodeData;
  }

  var gdal = require("gdal");

  //@todo - more options, including layer names etc
  var dataset = gdal.open(configOptions.path);
  console.log(configOptions);

  dataset.layers.forEach(function(layer) {
    var include_this_layer = true;
    //quick spin around to see if we should include this layer in the processing
    if (typeof(configOptions.layers) != 'undefined') {
      include_this_layer = false;
      console.log(configOptions.layers);
      configOptions.layers.forEach(function(layer_config) {
        if (layer_config.name == layer.name) {
          include_this_layer = true;
          //apply the layer configuration
          if (layer_config.attribute_filter) {
            console.log("Applying attribute filter '"+layer_config.attribute_filter+"' to layer '" + layer.name + "'");
            layer.setAttributeFilter(layer_config.attribute_filter);
          }
          if (layer_config.spatial_filter) {
            console.log("Applying spatial filter to layer '" + layer.name + "'");
            layer.setSpatialFilter(layer_config.attribute_filter);
          }
        }
      });
    }

    if (!include_this_layer) {
      console.log("Skipping layer " + layer.name);
    }
    else {
      console.log("Including layer " + layer.name);
      console.log("WKT = " + layer.srs.toWKT());
      console.log("Proj4 = " + layer.srs.toProj4());
      const layerNode = processLayer(layer);
      createNode(layerNode);
      layer.features.forEach(function(feature) {
        const featureNode = processFeature(feature, layer);
        createNode(featureNode);
      });
    }
  });

  return;
}
