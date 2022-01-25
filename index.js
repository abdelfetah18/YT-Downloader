//setting our server
var port = process.env.PORT || 3000 ;
var exprss = require('express');
var app = exprss();
var http = require('http');


//use core
var cors = require('cors');
app.use(cors());


//ejs
var ejs = require('ejs');
app.set('view engine', 'ejs');

//yt downloader library
var ytdl = require('ytdl-core');

//set our public file
app.use(exprss.static('./public/'));

//parse data
var formidable = require('formidable');

//we gonna use fs lib for our html files
var fs = require('fs');
const exp = require('constants');

//routes
app.get('/',(req,res)=>{
    //read html file
    fs.readFile(__dirname+"/public/index.html",{encoding:"utf-8"},(err,data)=>{
        if(err){
            throw err;
        }else{
            res.send(data);
        }
    });  
});

app.post('/yt-download',(req,res)=>{
    var form = new formidable.IncomingForm();
    form.parse(req,(err,inputs)=>{
        var url = inputs.url;
        getInfo(url).then((data)=>{
            res.render('output',{data:data});
        });
        
    });
});

http.createServer(app).listen(port,()=>{
        console.log("server running on port "+port);
    }
);

async function getInfo(url){
    try {
        var videoInfo = await ytdl.getInfo(url);
    } catch (err) {
        console.log(err);
    } finally {
        var data = [];
        videoInfo.formats.forEach((item)=>{
            if(item.container == "mp4" && item.hasAudio == true){
                data.push(item);
            }
        });
        return {title:videoInfo.videoDetails.title , videoInfo:data,thumbnails:videoInfo.videoDetails.thumbnails};
    }
}
