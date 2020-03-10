module.exports = function (req, res, next) {

  let msgcount = 0;

  res.sseSetup = function() {
    //req.socket.setTimeout(Number.MAX_VALUE);
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    console.log("setting up sse...");  
  }

  res.sseSend = function(evt_type, data) {

      res.write('id: ${msgcount}\n');
      console.log("event: " + evt_type);
      res.write('event: '+ evt_type + '\n');
      console.log("sending: " + data); 
      res.write('data: '+ data + '\n\n');
      msgcount++;
  }

  next()
}
