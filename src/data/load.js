vg.data.load = function(uri, callback) {
  if (vg.config.isNode) {
    // in node.js, consult base url and select file or http
    var url = vg_load_hasProtocol(uri) ? uri : vg.config.baseURL + uri,
        get = vg_load_isFile(url) ? vg_load_file : vg_load_http;
    get(url, callback);
  } else {
    // in browser, use xhr
    vg_load_xhr(uri, callback);
  }  
};

vg.data.loadSparql = function(query, endpoint, callback) {
  // build the url using the endpoint and the query
  var url = vg_load_hasProtocol(endpoint) ? endpoint : vg.config.baseURL + endpoint;
  url = url + "?query=" + encodeURIComponent(query);
  url = url + "&format=" + encodeURIComponent("application/sparql-results+json");

  if (vg.config.isNode) {
    vg_load_http(url, callback);
  } else {
    // in browser, use xhr
    vg_load_xhr_mime(url, callback, "application/sparql-results+json");
  }
}

var vg_load_protocolRE = /^[A-Za-z]+\:\/\//;
var vg_load_fileProtocol = "file://";

function vg_load_hasProtocol(url) {
  return vg_load_protocolRE.test(url);
}

function vg_load_isFile(url) {
  return url.indexOf(vg_load_fileProtocol) === 0;
}

function vg_load_xhr(url, callback) {
  vg_load_xhr_mime(url, callback);
}

function vg_load_xhr_mime(url, callback, mime_type) {
  vg.log("LOAD: " + url);
  var cb = function(err, resp) {
    if (resp) resp = resp.responseText;
    callback(err, resp);
  };

  if (mime_type) {
    d3.xhr(url, mime_type, cb);
  } else {
    d3.xhr(url, cb);
  }
}

function vg_load_file(file, callback) {
  vg.log("LOAD FILE: " + file);
  var idx = file.indexOf(vg_load_fileProtocol);
  if (idx >= 0) file = file.slice(vg_load_fileProtocol.length);
  require("fs").readFile(file, callback);
}

function vg_load_http(url, callback) {
  vg.log("LOAD HTTP: " + url);
	var req = require("http").request(url, function(res) {
    var pos=0, data = new Buffer(parseInt(res.headers['content-length'],10));
		res.on("error", function(err) { callback(err, null); });
		res.on("data", function(x) { x.copy(data, pos); pos += x.length; });
		res.on("end", function() { callback(null, data); });
	});
	req.on("error", function(err) { callback(err); });
	req.end();
}