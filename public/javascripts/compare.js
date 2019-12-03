
    Handlebars.registerHelper('compare', function(lvalue, rvalue, options) {

    if (arguments.length < 3)
        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");

    operator = options.hash.operator || "==";

    var operators = {
        '==':       function(l,r) { return l == r; },
        '===':      function(l,r) { return l === r; },
        '!=':       function(l,r) { return l != r; },
        '<':        function(l,r) { return l < r; },
        '>':        function(l,r) { return l > r; },
        '<=':       function(l,r) { return l <= r; },
        '>=':       function(l,r) { return l >= r; },
        'typeof':   function(l,r) { return typeof l == r; }
    };

    if (!operators[operator])
        throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);

    var result = false;

    if (rvalue.indexOf("|") != -1) {
      var values = rvalue.split('|');
      var matches = 0;
      for (var i = 0, j = values.length; i < j; i++) {
        if(operators[operator](lvalue,values[i])){ matches++; }
      }
      result = (matches > 0);
    } else {
      result = operators[operator](lvalue,rvalue);
    }

    if( result ) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }

});

