// Active searches within the application
Searches = new Meteor.Collection('Searches');

// LinkedData
Links = new Meteor.Collection('Links');

if (Meteor.isClient) {

  Session.setDefault( 'search-text', '' );

  // Links pending save for the user
  Session.setDefault( 'links', [] );

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

        Session.set( 'search-text', searchStr );

        doSearch();
      }

      return false;
    },
    'click .icon.expand': function(evt, tmpl) {
      var el = $( evt.srcElement || evt.target );
      el.parents( 'tr.data' ).find( '.json' ).toggle();
      return false;
    },
    'click .icon.link': function(evt, tmpl) {
      var el = $( evt.srcElement || evt.target );
      el.toggleClass( 'on' );
      var added = el.hasClass( 'on' );

      var links = Session.get( 'links' );
      if( added && findIndex( links, this ) === -1 ) {
        links.push( this );
      }
      else {
        var linkIndex = findIndex( links, this );
        links.splice( linkIndex, 1 );
      }

      Session.set( 'links', links );

      return false;
    }
  });

  function doSearch() {
    Session.set( 'search-results', null );
    
    var search = { text: Session.get( 'search-text' ) };

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

  function findIndex( arr, thing ) {
    var find;
    for( var i = 0, l = arr.length; i < l; ++i ) {
      find = arr[ i ];
      if( _.isEqual(find, thing ) ) {
        return i;
      }
    }
    return -1;
  }

  Template.search.searchText = function() {
    return Session.get( 'search-text' );
  };

  Template.search.searchResults = function() {
    return Session.get( 'search-results' );
  }

  Template.activeSearches.searches = function() {
    return Searches.find({}).fetch();
  };

  Template.activeSearches.events({
    'click .tags a': function( evt, tmpl ) {
      Session.set( 'search-text', this.text );
      doSearch();
    }
  })

  Template.linkCollection.creatingLinks = function() {
    return Session.get( 'links' ).length > 1;
  };

  Template.linkCollection.events({
    'click .button': function( evt, tmpl ) {
      var links = Session.get( 'links' );
      var data = {
        searchText: Session.get( 'search-text' ),
        links: links
      };
      Links.insert( data );

      Session.set( 'links', [] );

      Session.set( 'search-text', '' );
      Session.set( 'search-results', null );
    }
  })

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
