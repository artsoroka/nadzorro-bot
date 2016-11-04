var fs      = require('fs'); 
var Iconv   = require('iconv').Iconv;
var request = require('request'); 
var parse   = require('csv-parse'); 
var Promise = require('bluebird'); 
var config  = require('../../config'); 

var toUtf8 = function(string){
	var body = new Buffer(string, 'binary');
	var conv = new Iconv(config.ZI_CHARSET, 'utf8');
	
	return conv.convert(body).toString();
};

var removeFirstLine = function(string){
	var data = string.split("\n"); 
	data.shift(); 
	return data.join("\n"); 
}; 

module.exports = function(){
	return new Promise(function(resolve, reject){
		request.get(config.ZI_GITHUB_URL, function(err, response, file){
			
			if( err ){
				console.log('An error occured while downloading a file', err); 
				return reject(err); 
			} 

			if( response.statusCode != 200){
				console.log('Response status code is not 200, got ', response.statusCode); 	
				return reject(Error('Response code is not 200')); 
			}

			var text = toUtf8(file); 
			var data = removeFirstLine(text); 

			parse(data, config.parser, function(err, data){
				if( err ){
					console.log('While parsing file an error occured', err);
					return reject(err);   
				} 

				resolve(data);  
			}); 

		});		
	
	});
}; 