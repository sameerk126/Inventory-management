$(document).ready(function() {
    var purchaseData = $('#purchaseList').DataTable({
        "lengthChange": false,
        "processing": true,
        "serverSide": true,
        "order": [],
        "ajax": {
            url: "action.php",
            type: "POST",
            data: { action: 'listPurchase' },
            dataType: "json"
        },
        "pageLength": 10,
        "columnDefs": [{
            "target": [0, 4],
            "orderable": false
        }],
        'rowCallback': function(row, data, index) {
            $(row).find('td').addClass('align-middle')
            $(row).find('td:eq(0), td:eq(4)').addClass('text-center')
        },
    });

    $('#addPurchase').click(function() {
        $('#purchaseModal').modal('show');
        $('#purchaseForm')[0].reset();
        $('.modal-title').html("<i class='fa fa-plus'></i> Add Purchase");
        $('#action').val("Add");
        $('#btn_action').val("addPurchase");
    });


    $(document).on('submit', '#purchaseForm', function(event) {
        event.preventDefault();
        $('#action').attr('disabled', 'disabled');
        var formData = $(this).serialize();
        $.ajax({
            url: "action.php",
            method: "POST",
            data: formData,
            success: function(data) {
                $('#purchaseForm')[0].reset();
                $('#purchaseModal').modal('hide');
                $('#action').attr('disabled', false);
                purchaseData.ajax.reload();
            }
        })
    });

    $(document).on('click', '.update', function() {
        var purchase_id = $(this).attr("id");
        var btn_action = 'getPurchaseDetails';
        $.ajax({
            url: "action.php",
            method: "POST",
            data: { purchase_id: purchase_id, btn_action: btn_action },
            dataType: "json",
            success: function(data) {
                $('#purchaseModal').modal('show');
                $('#product').val(data.product_id);
                $('#quantity').val(data.quantity);
                $('#supplierid').val(data.supplier_id);
                $('.modal-title').html("<i class='fa fa-edit'></i> Edit Product");
                $('#purchase_id').val(purchase_id);
                $('#action').val("Edit");
                $('#btn_action').val("updatePurchase");
            }
        })
    });

    $(document).on('click', '.delete', function() {
        var purchase_id = $(this).attr("id");
        var btn_action = 'deletePurchase';
        if (confirm("Are you sure you want to delete this purchase?")) {
            $.ajax({
                url: "action.php",
                method: "POST",
                data: { purchase_id: purchase_id, btn_action: btn_action },
                success: function(data) {
                    purchaseData.ajax.reload();
                }
            });
        } else {
            return false;
        }
    });

});