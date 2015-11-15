﻿$(document).ready(function () {
    $('#EccedenzeTableContainer').jtable({
        title: 'Gestione Eccedenze',
        paging: true, // Enable paging
        pageSize: 15, // Set page size (default: 10)
        sorting: false, // Enable sorting
        selecting: true, // Enable selecting
        multiselect: false, // Allow multiple selecting
        selectingCheckboxes: true, // Show checkboxes on first column
        selectOnRowClick: false, // Enable this to only select using
									// checkboxes
        pageSizeChangeArea: false,
        openChildAsAccordion: true,
        actions: {
            listAction: 'listOwnEccedenzeAction',
            createAction: 'createEccedenzeAction',
            updateAction: 'updateEccedenzeAction',
            deleteAction: 'deleteEccedenzeAction'
        },
        fields: {
            id: {
                key: true,
                list: false,
            },
            // CHILD TABLE DEFINITION FOR "IMPEGNI"
            impegni: {
                title: '',
                width: '1%',
                sorting: false,
                edit: false,
                create: false,
                display: function (userData) {
                	if (userData.record.qta == userData.record.qta_residua) {return '<center><b>-</b></center>';}
                    // Create an image that will be used to open child table
                    var $img = $('<span align="CENTER"><img src="icons/Delivery.png" width="16" height="16" title="Ritiri prenotati"/></span>');
                    // Open child table when user clicks the image
                    $img.click(function () {
                        $('#EccedenzeTableContainer').jtable('openChildTable',$img.closest('tr'),
                        {
                        	title: 'Prenotazioni per il ritiro di ' + userData.record.prodotto,
                            paging: true, // Enable paging
                            pageSize: 5, // Set page size (default: 10)
                            pageSizeChangeArea: false,
                            actions: {
                                listAction: 'listByEccedenzaImpegniAction?id_eccedenza=' + userData.record.id,
                                updateAction: 'updateRitiroImpegniAction?id_eccedenza=' + userData.record.id
                            },                                    
                            fields: {
                                id: {
                                	title: 'Identificativo',
                                	key: true,
                                    list: false
                                },
                                ente_richiedente: {
                                	title: 'Ente',
									options: 'Choose_Enti',
                                    edit: false,
                                    input: function (data) {
                                    	return '<span>' + data.record.qta_prenotata + '</span>';
                                    }
                                },
                                qta_prenotata: {
                                	title: 'Quantità',
                                    list: true,
									edit: false
                                },
                                data_ritiro: {
                                	title: 'Ritiro previsto',
                					type: 'date',
                					displayFormat: 'dd/mm/yy',
                                    list: true,
                                    edit: true,
                                    input: function (data) {
                                    	return '<span>' + data.record.data_ritiro + '</span>';
                                    }
                                },
                                ora_ritiro: {
                                	title: 'Orario Ritiro',
                                    list: true,
                                    edit: false
                                },
                                ritiro_effettuato: {
                                	title: 'Ritiro effettuato',
                					type: 'checkbox',
                					defaultValue: false,
                					values:  {false : 'No' ,true : 'Sì'},
                                    list: true,
                                    edit: true
                                }
                            }
                        },
                        function (data) { // opened handler
                        	data.childTable.jtable('load');
                        }
                        );
                    });
                    return $img;
                }
            },
            id: {
            	key: true,
            	list: false
            },
            ente_cedente: {
                title: 'Ente Cedente',
                width: '20%',
                list: false,
                edit: false,
                create: false
            },
            prodotto: {
                title: 'Prodotto',
                inputTitle: 'Prodotto' + ' <span style="color:red">*</span>',
                inputClass: 'validate[required]',
                list: true,
                edit: true,
                create: true
            },
            udm: {
                title: 'UDM',
                inputTitle: 'Unità di misura' + ' <span style="color:red">*</span>',
                options: 'Choose_UDM',
                width: '30%',
                list: true,
                edit: true,
                create: true
            },
            qta: {
                title: 'Quantità',
                inputTitle: 'Quantità' + ' <span style="color:red">*</span>',
                inputClass: 'validate[required]',
                width: '30%',
                list: true,
                edit: true,
                create: true
            },
            qta_residua: {
                title: 'Quantità Disp.',
                inputTitle: 'Quantità Disponibile' + ' <span style="color:red">*</span>',
                inputClass: 'validate[required]',
                width: '30%',
                list: true,
                edit: false,
                create: false
            },
            scadenza: {
                title: 'Scadenza',
                inputTitle: 'Scadenza' + ' <span style="color:red">*</span>',
                type: 'date',
				displayFormat: 'dd/mm/yy',
                inputClass: 'validate[required]',
                width: '10%',
                edit: true,
                create: true
            }
        },
        rowInserted: function(event, data){
        	if (data.record.qta != data.record.qta_residua) {
              data.row.find('.jtable-edit-command-button').hide();
              data.row.find('.jtable-delete-command-button').hide();
            }
        },
        // Initialize validation logic when a form is created
        formCreated: function (event, data) {
            data.form.find('input[name=prodotto]').css('width', '200px');
            // data.form.parent().css('width', '400px');
            data.form.parent().css('height','200px');
            $(".jtable-input-field-container").slice(1,2).wrapAll("");
            // Slice Parameters are Start Stop
            $(".jtable-input-field-container").slice(2,5).wrapAll("");
            data.form.validationEngine();
        },
        // Validate form when it is being submitted
        formSubmitting: function (event, data) {
            return data.form.validationEngine('validate');
        },
        // Dispose validation logic when form is closed
        formClosed: function (event, data) {
            data.form.validationEngine('hide');
            data.form.validationEngine('detach');
        }
    });
    $('#EccedenzeTableContainer').jtable('load');
});