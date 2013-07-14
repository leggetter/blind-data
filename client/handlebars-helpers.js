Handlebars.registerHelper('userLoggedIn', function () {
  var user = Meteor.user();
  return (!_.isUndefined(user) && !_.isNull(user));
});

Handlebars.registerHelper('highlightJS', function () {
  return Prism.highlight( JSON.stringify( this, undefined, 2 ), Prism.languages.javascript );
});