/* eslint-disable no-undef */
$(() => {
  $('#stokbarang')
    .DataTable({
      responsive: true,
      // "lengthChange": false,
      autoWidth: false,
      dom:
        "B<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>"
        + "<'row'<'col-sm-12'tr>>"
        + "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
      buttons: [
        // "copy",
        // "csv",
        // "excel",
        // "pdf",
        {
          extend: 'print',
          customize: (win) => {
            $(win.document.body).css('height', 'auto').css('min-height', '0');
          },
          exportOptions: {
            stripHtml: false,
            columns: [0, 1, 2, 3, 4, 5, 6],
          },
        },
        // "colvis"
      ],
      initComplete() {
        $('.buttons-print').html('<i class="fas fa-print"></i> Cetak ');
      },
    })
    .buttons()
    .container()
    .appendTo('#bt');
  $('#barangmasuk')
    .DataTable({
      responsive: true,
      // "lengthChange": false,
      autoWidth: false,
      dom:
        "B<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>"
        + "<'row'<'col-sm-12'tr>>"
        + "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
      buttons: [
        // "copy",
        // "csv",
        // "excel",
        // "pdf",
        {
          extend: 'print',
          customize: (win) => {
            $(win.document.body).css('height', 'auto').css('min-height', '0');
          },
          exportOptions: {
            stripHtml: false,
            columns: [0, 1, 2, 3, 4, 5, 6],
          },
        },
        // "colvis"
      ],
      initComplete() {
        $('.buttons-print').html('<i class="fas fa-print"></i> Cetak ');
      },
    })
    .buttons()
    .container()
    .appendTo('#bt');
  $('#barangkeluar')
    .DataTable({
      responsive: true,
      // "lengthChange": false,
      autoWidth: false,
      dom:
        "B<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>"
        + "<'row'<'col-sm-12'tr>>"
        + "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
      buttons: [
        // "copy",
        // "csv",
        // "excel",
        // "pdf",
        {
          extend: 'print',
          customize: (win) => {
            $(win.document.body).css('height', 'auto').css('min-height', '0');
          },
          exportOptions: {
            stripHtml: false,
            columns: [0, 1, 2, 3, 4, 5, 6],
          },
        },
        // "colvis"
      ],
      initComplete() {
        $('.buttons-print').html('<i class="fas fa-print"></i> Cetak ');
      },
    })
    .buttons()
    .container()
    .appendTo('#bt');
  $('#user').DataTable({
    responsive: true,
    // "lengthChange": false,
    autoWidth: false,
  });
  $('#log').DataTable({
    responsive: true,
    // "lengthChange": false,
    autoWidth: false,
  });
  $('#detailbarangmasuk').DataTable({
    paging: true,
    lengthChange: false,
    searching: false,
    ordering: true,
    info: true,
    autoWidth: false,
    responsive: true,
  });
  $('#detailbarangkeluar').DataTable({
    paging: true,
    lengthChange: false,
    searching: false,
    ordering: true,
    info: true,
    autoWidth: false,
    responsive: true,
  });
});
