var Utils = {
	
	formatNumeric : function(string)
	{
		s = (string + '').split('.');
		a = s[0];
		b = s.length > 1 ? '.' + s[1] : '';
		
		var r = /(\d+)(\d{3})/;
		
		while (r.test(a))
			a = a.replace(r, '$1' + ',' + '$2');
		
		return a + b;
	},
	
	getParam : function(key)
	{
		var regex  = new RegExp("[\\?&]" + key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]") + "=([^&]*)", "i"),
				values = regex.exec(unescape(window.location.href));
		
    return (values == null) ? "" : values[1];
  }
};

var ShareCounterApp = function(){
	var GRAPH_URL = "http://graph.facebook.com/http://",
			form,
			control,
			result,
			loader;
	
	
	function sanitizeUrl(url)
	{
		return escape(url.replace("http://", ""));
	}
	
	
	function constructUrl(value)
	{
		return [GRAPH_URL, sanitizeUrl(value), "?callback=?"].join("");
	}
	
	
	function createPermalink(data)
	{
		var url = [window.location.protocol, "//", window.location.hostname, "?u=", sanitizeUrl(data["id"])].join(""),
				link = $('<a>Permalink</a>');
		
		link.attr("href", url);
		
		return link;
	}
	
	
	function performRequest(event)
	{
		event.preventDefault();
		
		result.hide();
		permalink.empty();
		loader.show();
		
		$.getJSON(constructUrl(control.val()), requestCallback);
	}
	
	
	function requestCallback(data)
	{
		if(data["error"]){
			logFailure("Bad URL");
		}
		else if(!data["shares"]){
			logFailure("No results");
		}
		else {
			var shares = Utils.formatNumeric(data["shares"]);
			
			if(data["comments"])
				shares += " (and " + data["comments"] + " comments)";
			
			logSuccess(shares, createPermalink(data));
		}
	}
	
	
	function log(text, callback)
	{
		loader.hide();
		result.removeClass();
		result.html(text).show();
		
		if(callback)
			callback();
	}
	
	
	function logFailure(text)
	{
		log(text, function(){
			result.addClass('failure')
		});
	}
	
	
	function logSuccess(text, link)
	{
		log(text, function(){
			permalink.html(link);
			result.addClass('success')
		});
	}
	
	
	function preloadQuery(u)
	{
		if(!u)
			return;
		
		control.val(u)
		form.submit();
	}
	
	
	return {
		
		init : function(){
			control   = $("#query");
			form      = $("#query_form");
			result    = $("#results span");
			loader    = $("#loader");
			permalink = $("#permalink");
			
			loader.hide();
			control.focus();
			form.submit(performRequest)
			
			preloadQuery(Utils.getParam("u"));
		}
	}
}();

$(ShareCounterApp.init);
