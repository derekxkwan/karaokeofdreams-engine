const express = require('express');
const path = require('path');
const app = express();
const  server = require('http').createServer(app);
var io = require('socket.io')(server);
const osc = require('node-osc');
const fs = require('fs');
// const sse = require('./sse');

const readline = require('readline');
var osc_server = new osc.Server(3333, '0.0.0.0');
var osc_client = new osc.Client('0.0.0.0', 3334);


let cnx = {};
let cid = 0;

let cur_lyrics = [];

let titles = ["gravitational wave me, maybe", "ski inn", "day star in your eyes", "desert de beber", "hack the fuck out of it", "cute lover fluffy fur heart pom pom soft candy matte phone case", "seagulls over chatsubo", "so many cats, so little time", "She bid a lot, the bot, stuck the boot out.", "Seaborn", "The desert lives in your hair", "Dust of stars, Surf the universe", "My body is a battleground"]

app.use(express.static(path.join(__dirname, 'build')));
//app.use(sse);
//app.use(bodyParser.json()); // support json encoded bodies
//app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


function osc_send(addr, msg)
{
    osc_client.send(addr, msg,
		    (err) =>
		    {
			if(err)
			{
			    console.error(err);				 
			    osc_client.close();
			};
			
		    });
}



app.get('/ping', function (req, res) {
 return res.send('pong');
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.post('/song', (req, res) =>
	 {
	     console.log("song requested");
	     let curidx = parseInt(req.body.idx);
	     if(curidx >= 0 && curidx < titles.length)
		 {
		     load_file(curidx);
		     osc_send('/song', curidx);
		 }
	     else
		 {
		     osc_send('/stop', 1);
		     client_send("beginsong", 0);
		 };
	     console.log(curidx);
	     res.end();
	     });

//app.listen(process.env.PORT || 8080);

server.listen(8080);

io.sockets.on('connection',
	      (socket) =>
	      {
		  cnx[socket.id] = socket;
		  //client_list.push[socket.id];

		  socket.on("song", (data) =>
			    {

				let curidx = parseInt(data);
				if(curidx >= 0 && curidx < titles.length)
				{
				    load_file(curidx);
				    osc_send('/song', curidx);
				}
				else
				{
				    osc_send('/stop', 1);
				    io.sockets.emit("beginsong", 0);
				};
				console.log(curidx);

			    });
		  socket.on('disconnect',
			    () =>
			    {
				//let cidx = client_list.indexOf(socket.id);
				delete cnx[socket.id];
				/*
				if(cidx > -1)
				    client_list.splice(cidx, 1);
				    */
			    });
			    
	      });

osc_server.on('message',
	      (msg) =>
	      {
		  console.log(msg);
		  let cur_addr = msg.shift();
		  if(cur_addr == "/lyrics")
		  {
		      cur_idx = parseInt(msg[0]);
		      if(cur_idx >= cur_lyrics.length)
		      {
			  //client_send("beginsong", 0);
			  io.sockets.emit('beginsong', 0);
			  osc_send('/stop', 1);

			  console.log("stopping");
		      }
		      else
		      {
			  let cur_line = cur_lyrics[cur_idx];
			  //client_send("lyrics", cur_line);
			  io.sockets.emit('lyrics', cur_line);
		      };
		  };
	      });

async function processLineByLine(curfile) {
    let cur = [];
  const fileStream = fs.createReadStream(curfile);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

    console.log("loading " + curfile);
  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
      let new_line = line.trim();
      if (new_line != "") cur.push(new_line);
      //console.log(`Line from file: ${line}`);
  };
    
  //console.log(cur);
    cur.shift();
    
    cur_lyrics = cur;
    //client_send("beginsong", 1);
    io.sockets.emit('beginsong', 1);
};

function load_file(curidx)
{
    let curfile = "./res/" + titles[curidx] + ".txt"
    processLineByLine(curfile);
}


