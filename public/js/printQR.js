/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
function checkSizeValue(input) {
  const inputValue = input;
  if (inputValue.value <= inputValue.min) {
    inputValue.value = inputValue.min;
  }
}

function checkQtyValue(input) {
  const inputValue = input;
  if (inputValue.value <= inputValue.min) {
    inputValue.value = inputValue.min;
  }
}

function ImagetoPrint(source, title) {
  return (
    `<html><head><title>${title}</title><script>function step1(){\n`
    + 'setTimeout(\'step2()\', 10);}\n'
    + 'function step2(){window.print();window.close()}\n'
    + `</script></head><body onload='step1()'>\n${
      source
    }</body></html>`
  );
}

function PrintImage(source, id, title) {
  const pagelink = 'about:blank';
  const qty = $(`#qrQty${id}`).val();
  const pixelToCentimeter = 37.7952755906;
  const width = $(`#qrWidth${id}`).val() * pixelToCentimeter;
  const height = $(`#qrHeight${id}`).val() * pixelToCentimeter;
  const pwa = window.open(pagelink, '_new');
  let img = '';
  for (let i = 1; i <= qty; i += 1) {
    img += `<img src='${source}' width='${width}' height='${height}' />`;
  }
  pwa.document.open();
  pwa.document.write(ImagetoPrint(img, title));
  pwa.document.close();
}
