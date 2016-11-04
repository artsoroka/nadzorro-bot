var parser = require('./workers/parser'); 

parser()
	.then(function(data){
		console.log('DATA', data.length); 
	})
	.catch(function(err){
		console.log('CATCH', err); 
	}); 