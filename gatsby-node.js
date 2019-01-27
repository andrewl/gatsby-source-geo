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
        parent: null,
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
        parent: null,
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

  dataset.layers.forEach(function(layer) {
    const layerNode = processLayer(layer);
    createNode(layerNode);
    layer.features.forEach(function(feature) {
      const featureNode = processFeature(feature, layer);
      createNode(featureNode);
    });
  });

  return;
}
