/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
function select2Search($el, term) {
  $el.select2('open');

  // Get the search box within the dropdown or the selection
  // Dropdown = single, Selection = multiple
  const $search = $el.data('select2').dropdown.$search
    || $el.data('select2').selection.$search;
  // This is undocumented and may change in the future

  $search.val(term);
  $search.trigger('input');
}

function onScanSuccess(decodedText) {
  // handle the scanned code as you like, for example:
  // console.log(`Code matched = ${decodedText}`, decodedResult);
  if (document.getElementById('html5-qrcode-button-camera-stop')) {
    document.getElementById('html5-qrcode-button-camera-stop').click();
  }
  const $select = $($('#barang'));
  select2Search($select, decodedText);
}

function onScanFailure(error) {
  // handle scan failure, usually better to ignore and keep scanning.
  // for example:
  console.warn(`Code scan error = ${error}`);
}

const html5QrcodeScanner = new Html5QrcodeScanner(
  'reader',
  {
    fps: 10,
    qrbox: { width: 250, height: 250 },
    rememberLastUsedCamera: false,
  },
  /* verbose= */ false,
);
html5QrcodeScanner.render(onScanSuccess, onScanFailure);

function stopScan() {
  if (document.getElementById('html5-qrcode-button-camera-stop')) {
    document.getElementById('html5-qrcode-button-camera-stop').click();
  }
}
