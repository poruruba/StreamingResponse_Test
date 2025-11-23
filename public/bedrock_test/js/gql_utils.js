'use strict';

function gql_isString(obj) {
  return typeof (obj) == "string" || obj instanceof String;
};

function gql_templ(strings, ...keys) {
  return (function(...values) {
    var result = [strings[0]];
    keys.forEach(function(key, i) {
      var value = values[key];
      if( gql_isString(value) )
        value = gql_escape(value);
      result.push(value, strings[i + 1]);
    });
    return result.join('');
  });
}

function gql_escape(str){
  var t = JSON.stringify({ p: str });
  return t.slice(5, -1);
}

// input: url, headers, qs, exp, variables, token, api_key
async function do_gql_query(input){
  var body;  
  if( input.exps instanceof Function ){
    const args = Array.isArray(input.variables) ? input.variables : [];
    body = {
      query: input.exps(...args)
    };
  }else{
    body = {
      query: input.exps,
      variables: input.variables
    };
  }
  var gql_input = {
    url: input.url,
    qs: input.qs,
    body: body,
    token: input.token,
    api_key: input.api_key
  };
  var json = await do_http(gql_input);
  if( json.errors )
    throw json.errors;
  return json.data;
}
