Searches = new Meteor.Collection('Searches');

if (Meteor.isClient) {

  var sound;
  soundManager.setup( {
    preferFlash: false,
    onready: function() {

      sound = soundManager.createSound({
        id: 'mySound',
        url: 'assets/media/blind-date.mp3',
        autoLoad: true,
        autoPlay: false,
        onload: function() {
        }
      });
    }
  } );

  Handlebars.registerHelper('userLoggedIn', function () {
    var user = Meteor.user();
    return (!_.isUndefined(user) && !_.isNull(user));
  });

  Handlebars.registerHelper('highlightJS', function ( data ) {
    return Prism.highlight( data, Prism.languages.javascript );
  });

  Template.search.events({
    'click button': function(evt, tmpl) {
      
      var searchStr = tmpl.find( '#searchText' ).value;
      if( searchStr ) {

        var search = { text: searchStr };

        if( search.text.toLowerCase() === 'cilla' ) {
          sound.play();
          return false;
        }

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
            var items = [];
            for( var datasetName in data ) {
              items = normalize( datasetName, data[ datasetName ] );
              items = items.concat( data[ datasetName ] );
            }
            Session.set( 'search-results', items );
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

  Template.search.searchResults = function() {
    return Session.get( 'search-results' );
  }

  Template.activeSearches.searches = function() {
    return Searches.find({}).fetch();
  };

  /**
   * create some common field names to show in the results view
   */
  function normalize( dsName, items ) {
    var item,
        json;
    for( var i = 0, l = items.length; i < l; ++i ) {
      item = items[ i ];
      json = JSON.stringify( item, undefined, 2 );
      item.__json = json;
      item.__dsName = dsName;
    }
    return items;
  }
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
