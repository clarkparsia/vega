vg.data.sparql = (function() {
  var parser = {
    parse: parseSparql
  };

  function parseSparql(data) {
    var tabular_data = [];

    // Get the variables used in the query
    var vars = data.head.vars;

    if (data.results && data.results.bindings 
      && data.results.bindings.length > 0) {

      // the data has results
      // every binding is a row in the results
      for (var iB = 0; iB < data.results.bindings.length; iB++) {
        var aBinding = data.results.bindings[iB];
        var anEntry = {};

        for (var iVar = 0; iVar < vars.length; iVar++) {
          var checkVar = vars[iVar];
          if (aBinding[checkVar]) {
            anEntry[checkVar] = aBinding[checkVar].value;
          }
        }

        tabular_data.push(anEntry);
      }

    }

    return tabular_data;
  }
  
  return parser;
})();

