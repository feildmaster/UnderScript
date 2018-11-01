onPage('GamesList', function keepAlive() {
  setInterval(() => {
    socket.send(JSON.stringify({ping: "pong"}));
  }, 10000);
});
