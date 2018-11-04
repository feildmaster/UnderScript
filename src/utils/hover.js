const hover = (() => {
  let e, x, y;
  function update() {
    if (!e) return;
    e.css({
      // move to left if at the edge of screen
      left: x + e.width() + 15 < $(window).width() ? x + 15 : x - e.width() - 10,
      // Try to lock to the bottom
      top: y + e.height() + 18 > $(window).height() ? $(window).height() - e.height() : y + 18,
    });
  }
  eventManager.on("jQuery", () => {
    $(document).on("mousemove.script", function mouseMove(event) {
      x = event.pageX - window.pageXOffset;
      y = event.pageY - window.pageYOffset;
      update();
    });
  });
  function hide() {
    if (e) {
      // Hide element
      e.remove();
      e = null;
    }
  }
  function show(data, border = null) {
    return function hoverAction(event) {
      hide();
      if (event.type === 'mouseleave') return;
      e = $("<div>");
      e.append(data);
      e.append($(footer).clone());
      e.css({
        border,
        position: "fixed",
        "background-color": "rgba(0,0,0,0.9)",
        padding: '2px',
        'z-index': 1220,
      });
      $("body").append(e);
      update();
    };
  }
  return {
    hide,
    show,
  };
})();
