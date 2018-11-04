const log = {
  init: function () {
    const hi = $("<div id='history'></div>"),
      ha = $("<div class='handle'>History</div>"),
      lo = $("<div id='log'></div>");
    // Positional math
    const pos = parseInt($("div.mainContent").css("width")) + parseInt($("div.mainContent").css("margin-left"));
    hi.css({
      width: `${window.innerWidth - pos - 20}px`,
      border: "2px solid white",
      "background-color": "rgba(0,0,0,0.9)",
      position: "absolute",
      right: 10,
      top: 10,
      'z-index': 20,
    });
    ha.css({
      "border-bottom": "1px solid white",
      "text-align": "center",
    });
    lo.css({
      display: 'flex',
      'flex-direction': 'column-reverse',
      'align-items': 'flex-start',
      "overflow-y": "auto",
      "max-height": "600px",
    });
    hi.append(ha);
    hi.append(lo);
    $("body").append(hi);
  },
  add: function (...args) {
    const div = $('<div>');
    args.forEach((a) => {
      div.append(a);
    });
    if (!div.html()) return;
    $("div#history div#log").prepend(div);
  },
};
