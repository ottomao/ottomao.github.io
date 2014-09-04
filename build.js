var juicer = require("juicer"),
	fs       = require("fs"),
	markdown = require("markdown").markdown,
	path     = require("path");

var list     = require("./list.json"),
	postTpl  = fs.readFileSync("./tpl/post.html",{encoding:"utf8"}),
	indexTpl = fs.readFileSync("./tpl/index.html",{encoding:"utf8"});

//post page
for(var i = 0; i < list.length ; ++i){
	var post     = list[i],
		basename = post.basename,
		html     = markdown.toHTML(fs.readFileSync(post.file,{encoding:"utf8"}));

	if(basename){
	    var pageHTML = juicer(postTpl,{title:post.title + "- Otto's Blog" || "Otto's Blog",content:html});

	    fs.writeFileSync( basename + ".html" ,pageHTML);
	    console.log(basename + ' - done');
		
	}
}

var indexHTML = juicer(indexTpl,{list:list});
fs.writeFileSync("index.html",indexHTML);

console.log("index.html - done");