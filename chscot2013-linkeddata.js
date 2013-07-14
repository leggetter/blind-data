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

  Template.search.events({
    'click button': function(evt, tmpl) {
      
      var searchStr = tmpl.find( '#searchText' ).value;
      if( searchStr ) {

        var search = { text: searchStr };

        Session.set( 'search-text', search.text );

        if( search.text.toLowerCase() === 'cilla' ) {
          sound.play();
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
            console.log( data );
            Session.set( 'search-results', data );
          },
          fail: function() {
            console.log( arguments );
          }
        } );

      }

      return false;
    },
    'click .icon.expand': function(evt, tmpl) {
      var el = $( evt.srcElement || evt.target );
      el.parents( 'tr.data' ).find( '.json' ).toggle();
      return false;
    }
  });

  Template.search.searchText = function() {
    return Session.get( 'search-text' ) || '';
  };

  Template.search.searchResults = function() {
    return Session.get( 'search-results' );
  }

  Template.activeSearches.searches = function() {
    return Searches.find({}).fetch();
  };

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
