const fetch = require("node-fetch")
const queryString = require("query-string")

exports.sourceNodes = (
	{ actions, createNodeId, createContentDigest },
	configOptions
) => {
	const { createNode } = actions

	// Gatsby adds a configOption that's not needed for this plugin, delete it
	delete configOptions.plugins

	const processFeature = feature => {

    // Creating a proxy for the feature because the fields property, set by
    // OGR is reserved for use by gatsby
    var proxy_feature = {};
    proxy_feature.fid = feature.fid;
    proxy_feature.defn = feature.defn;
    proxy_feature.featureFields = feature.fields.toObject();

		const nodeId = createNodeId(`geo-${feature.fid}`)
		const nodeContent = JSON.stringify(proxy_feature)
		const nodeData = Object.assign({}, proxy_feature, {
			id: nodeId,
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

  dataset.layers.get(0).features.forEach(function(feature) {
    const nodeData = processFeature(feature);
    createNode(nodeData);
  })

  return;
}
