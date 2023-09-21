function ImagetoPrint(source) {
    return "<html><head><script>function step1(){\n" +
            "setTimeout('step2()', 10);}\n" +
            "function step2(){window.print();window.close()}\n" +
            "</scri" + "pt></head><body onload='step1()'>\n" +
            source + "</body></html>";
}
function PrintImage(source, id) {
    Pagelink = "about:blank";
    var qty = $("#qrQty"+id).val();
    var pwa = window.open(Pagelink, "_new");
    var img = "";
    for (var i = 1; i <= qty; i++) {
        var img = img + "<img src='" + source + "' />";
    }
    pwa.document.open();
    pwa.document.write(ImagetoPrint(img));
    pwa.document.close();
}