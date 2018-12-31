eventManager.on("getWaitingQueue", function lowerVolume() {
  // Lower the volume, the music changing is enough as is
  audioQueue.volume = 0.3;
});
