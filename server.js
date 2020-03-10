const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
const osc = require('node-osc');
const fs = require('fs');
const sse = require('./sse');

const readline = require('readline');
var osc_server = new osc.Server(3333, '0.0.0.0');
var osc_client = new osc.Client('0.0.0.0', 3334);


let cnx = {};
let cid = 0;

let cur_lyrics = [];

let titles = ["gravitational wave me, maybe", "desert de beber", "Seaborn", "The desert lives in your hair", "Dust of stars, Surf the universe", "My body is a battleground"]

app.use(express.static(path.join(__dirname, 'build')));
app.use(sse);
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


function client_send(typetag, data)
{
    for(let [key,value] of Object.entries(cnx))
	value.sseSend(typetag, data);
}

app.get('/ping', function (req, res) {
 return res.send('pong');
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/stream', (req, res) =>
	{
	    console.log("establishing stream...");
	    res.sseSetup();

	    ((cid) =>
	     {
		 cnx[cid] = res;
		 req.on("close", () => {delete cnx[cid]});
	     })(++cid);

	    /*
	    for(let [key,value] of Object.entries(cnx))
		value.sseSend("hi!");
	    */

	});

app.post('/song', (req, res) =>
	 {
	     //console.log("song requested");
	     let curidx = parseInt(req.body.idx);
	     load_file(curidx);
	     osc_client.send('/song', curidx,
			     (err) =>
			     {
				 if(err) console.error(err);
				 osc_client.close();
				 });
	     console.log(curidx);
	     });

app.listen(process.env.PORT || 8080);

osc_server.on('message',
	      (msg) =>
	      {
		  let cur_addr = msg.shift();
		  if(cur_addr == "/lyrics")
		  {
		      cur_idx = parseInt(msg[0]);
		      let cur_line = cur_lyrics[cur_idx];
		      console.log(cur_line);
		      client_send("lyrics", cur_line);
		      
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
    client_send("beginsong", 1);
};

function load_file(curidx)
{
    let curfile = "./res/" + titles[curidx] + ".txt"
    processLineByLine(curfile);
}


