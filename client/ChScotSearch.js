function ChScotSearch() {
	this.baseUrl = "http://chscot2013uniformapi.herokuapp.com/data/";
	this.version = "0.0.1";
}

ChScotSearch.prototype.search = function( query , cb) {
	var url = this.baseUrl + this.version + "/q/" + encodeURIComponent( query );
	var jqxhr = $.getJSON( url )
		.done(cb.done)
		.fail(cb.fail);
};

this.ChScotSearch = ChScotSearch;