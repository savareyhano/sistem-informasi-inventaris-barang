function checkSizeValue(input) {
  // if (input.value > 9) {
  //   input.value = 9;
  // } else 
  if (input.value <= 0) {
    input.value = input.min;
  }
}

function checkQtyValue(input) {
  // if (input.value > 9999) {
  //   input.value = 9999;
  // } else 
  if (input.value <= 0) {
    input.value = input.min;
  }
}

function ImagetoPrint(source, title) {
  return (
    "<html><head><title>" + title + "</title><script>function step1(){\n" +
    "setTimeout('step2()', 10);}\n" +
    "function step2(){window.print();window.close()}\n" +
    "</script></head><body onload='step1()'>\n" +
    source +
    "</body></html>"
  );
}

function PrintImage(source, id, title) {
  Pagelink = "about:blank";
  var qty = $("#qrQty" + id).val();
  var width = $("#qrWidth" + id).val() * 37.7952755906;
  var height = $("#qrHeight" + id).val() * 37.7952755906;
  var pwa = window.open(Pagelink, "_new");
  var img = "";
  for (var i = 1; i <= qty; i++) {
    var img = img + "<img src='" + source + "' width='" + width + "' height='" + height + "' />";
  }
  pwa.document.open();
  pwa.document.write(ImagetoPrint(img, title));
  pwa.document.close();
}
