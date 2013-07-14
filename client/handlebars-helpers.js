Handlebars.registerHelper('userLoggedIn', function () {
  var user = Meteor.user();
  return (!_.isUndefined(user) && !_.isNull(user));
});

Handlebars.registerHelper('highlightJS', function () {
  return Prism.highlight( JSON.stringify( this, undefined, 2 ), Prism.languages.javascript );
});

Handlebars.registerHelper('highlightSearchMatch', function (text) {
	var searchText = Session.get( 'search-text');
	var match = RegExp( searchText );
	text = text.replace( match , '<strong>' + searchText + '</strong>' );
  return text;
});