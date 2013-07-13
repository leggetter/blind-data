Searches = new Meteor.Collection('Searches');

if (Meteor.isClient) {

  Handlebars.registerHelper('userLoggedIn', function () {
    var user = Meteor.user();
    return (!_.isUndefined(user) && !_.isNull(user));
  });

  Template.search.events({
    'click button': function(evt, tmpl) {
      
      var searchStr = tmpl.find( '#searchText' ).value;
      if( searchStr ) {

        var search = { text: searchStr };
        var exists = Searches.findOne( search );
        if( !exists ) {
          search.count = 1;
          search.lastUpdated = new Date();
          Searches.insert( search );
        }
        else {
          Searches.update( exists._id,
            {
              $inc: {  count: 1 },
              $set: { lastUpdated: new Date() }
            }
          );
        }
        
        var searchService = new ChScotSearch();
        searchService.search( search.text, {
          done: function( data ) {
            console.log( 'done', data );
          },
          fail: function() {
            console.log( arguments );
          }
        } );

      }

      Template.activeSearches();

      return false;
    }
  });

  Template.activeSearches.searches = function() {
    return Searches.find({}).fetch();
  };
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
