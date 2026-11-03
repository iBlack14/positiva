
function GrabaMensajeErrorVista(_modulo, _metodo, _mensajeError) {
    try {
        var urlAux = 'Ventas/GrabaMensajeErrorVista';
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { urlAux = 'GrabaMensajeErrorVista'; }
        $.ajax({
            url: urlAux,
            type: 'Get',
            async: true,
            cache: true,
            data: {
                modulo: _modulo,
                metodo: _metodo,
                mensajeError: _mensajeError,
            },
            success: function (data) {
                alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
            },
            error: function (data) {
                alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk.");
            }
        });
    }
    catch (e) { }
}

function InsertarHistorialVenta(_idClaseVehiculo, _nomClaseVehiculo, _idUso, _nomUso, _idMarca, _descMarca, _idModelo, _descModelo, _idVersion, _descVersion, _zonaCirculacion) {
    try {
        var urlAux = 'Ventas/InsertarHistorialVenta';
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { urlAux = 'InsertarHistorialVenta'; }
        $.ajax({
            url: urlAux,
            type: 'Get',
            async: true,
            cache: true,
            data: {
                idClaseVehiculo: _idClaseVehiculo,
                nomClaseVehiculo: _nomClaseVehiculo,
                idUso: _idUso,
                nomUso: _nomUso,
                idMarca: _idMarca,
                descMarca: _descMarca,
                idModelo: _idModelo,
                descModelo: _descModelo,
                idVersion: _idVersion,
                descVersion: _descVersion,
                zonaCirculacion: _zonaCirculacion,
            },
            success: function (data) {

            },
            error: function (data) {
                alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk.");
            }
        });
    }
    catch (e) { }
}
function alertValida(mensaje) {
    var $textAndPic = $('<div></div>');
    $textAndPic.append(' <i class="icono_alerta_modal"><img src="../Images/iconos/color/icon-warning.png" alt=""></i> ');
    $textAndPic.append('<div class="content_texto_modal"><span class="error-msg">' + mensaje + '</span></div>');

    BootstrapDialog.show({
        title: 'Alerta',
        type: BootstrapDialog.TYPE_WARNING,
        message: $textAndPic,
        closable: true,
        buttons: [{
            cssClass: 'btn-principal',
            label: ' Ok',
            icon: 'icono_check',
            action: function (dialogRef) {
                dialogRef.close();
            }
        }],
    });
}

function alertLocked(mensaje) {
    var $textAndPic = $('<div></div>');
    $textAndPic.append(' <i class="icono_alerta_modal"><img src="../Images/iconos/color/icon-warning.png" alt=""></i> ');
    $textAndPic.append('<div class="content_texto_modal"><span class="error-msg">' + mensaje + '</span></div>');

    BootstrapDialog.show({
        title: 'Alerta',
        type: BootstrapDialog.TYPE_WARNING,
        message: $textAndPic,
        closable: true,
        buttons: [{
            cssClass: 'btn-principal',
            label: ' Ok',
            icon: 'icono_check',
            action: function (dialogRef) {
                dialogRef.close();
                document.location.href = "Home/Index";
            }
        }],
    });
}

$(function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        jQuery.validator.unobtrusive.parse();
        jQuery.validator.unobtrusive.parse("#frmPoliza");
        var idRol = $("#myDivTwo").data('value');
        if (idRol == 'P1' || idRol == 'P2') {
            $("#Cod_FormaPagoID").val($.trim(1));
            document.getElementById("Cod_FormaPagoID").disabled = true;
        }
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 0) {
            $('#trEndosoVenta').hide();
            $('#lnkContinuar').show();
            $('#lnkEndosar').hide();
            $('#trModalidadVenta').show();
        } else {
            $('#trEndosoVenta').show();
            $('#lnkContinuar').hide();
            $('#lnkEndosar').show();
            $('#trModalidadVenta').hide();
            $("#idEndosoPoliza").focus();
        }
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / function", e);
        return;
    }
});

$("#buscarNumeroFormulario").dialog({
    dialogClass: 'DynamicDialogStyle',
    autoOpen: false,
    modal: true,
    width: 530,
    title: "Seleccíon de Formulario"
});

$("#FechaInicioVigencia").datepicker({
    changeMonth: true,
    minDate: new Date($("#VigMin").val().substr(6, 4), $("#VigMin").val().substr(3, 2) - 1, $("#VigMin").val().substr(0, 2)),
    maxDate: new Date($("#VigMax").val().substr(6, 4), $("#VigMax").val().substr(3, 2) - 1, $("#VigMax").val().substr(0, 2)),
    stepMonths: 12,
    changeYear: true,
    changeDay: true,
    dateFormat: 'dd/mm/yy',
    showButtonPanel: true,
    onSelect: function (selectedDate) {
        var fechaform = selectedDate;
        var fdataSplit = fechaform.split('/');
        var f_fechaIni = new Date(fdataSplit[2], fdataSplit[1] - 1, fdataSplit[0]);
        var fin_fecha = agregarMeses(f_fechaIni, 12);
        $("#FechaFinVigencia").val(getFormattedDate(fin_fecha));
        $("#FechaFinVigencia2").val(getFormattedDate(fin_fecha));
    }
});

$(".solo-numero").keypress(function (event) {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        var regex = new RegExp("^[0-9]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
            event.preventDefault();
            return false;
        }
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / solo-numero", e);
        return;
    }
});
$(".solo-numeroquion").keypress(function (event) {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        var regex = new RegExp("^[0-9]+$"); //
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key) && event.charCode != 45) {
            event.preventDefault();
            return false;
        }
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / solo-numeroquion", e);
        return;
    }
});

$(".formatPlaca").keypress(function (event) {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso === 1) { modulo = 'ENDOSO'; }
        var regex = new RegExp("^[0-9a-zA-Z ]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key) && event.charCode !== 45 && event.charCode !== 46) {
            event.preventDefault();
            return false;
        }
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / formatPlaca", e);
        return;
    }
});

$("#AseguradoFechaNacimiento").keypress(function (event) {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        var regex = new RegExp("^[0-9]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key) && event.charCode != 47) {
            event.preventDefault();
            return false;
        }
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / AseguradoFechaNacimiento", e);
        return;
    }
});
$(".sololetraespacio").keypress(function (key) {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }

        var regex = new RegExp($("#hdnCaracteresP").val().trim());
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
            event.preventDefault();
            return false;
        }
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / sololetraespacio", e);
        return;
    }
});

$("#ContratanteFechaNacimiento").keypress(function (event) {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        var regex = new RegExp("^[0-9]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);

        if (!regex.test(key) && event.charCode != 47) {
            event.preventDefault();
            return false;
        }
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / ContratanteFechaNacimiento", e);
        return;
    }
});
$("#AsegNumeroDocumento").keypress(function (event) {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }

        if (event.which == 13) {
            event.preventDefault();
            $("#lnkBusqAsegurado").click();
        }
        VerificarValorDoc(1, event);
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / AsegNumeroDocumento", e);
        return;
    }
});
$("#ContraNumeroDocumento").keypress(function (event) {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        if (event.which == 13) {
            event.preventDefault();
            $("#lnkBusqContratante").click();
        }
        VerificarValorDoc(2, event);
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / ContraNumeroDocumento", e);
        return;
    }
});
$("#NumeroPlaca").keypress(function (event) {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {

        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        if (event.which == 13) {
            event.preventDefault();
            $("#lnkBusqPlaca").click();
        }
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / NumeroPlaca", e);
        return;
    }
});
$("#NumeroTarjeta2").keypress(function (event) {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        if (event.which == 13) {
            event.preventDefault();
            $("#lnkObtenerTarjetaFormaPago").click();
        }
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / NumeroTarjeta2", e);
        return;
    }
});
$("#NumeroTarjeta").keypress(function (event) {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        if (event.which == 13) {
            event.preventDefault();
            $("#lnkObtenerTarjetaFormaPagoVirtual").click();
        }
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / NumeroTarjeta", e);
        return;
    }
});

$("#ddlZonaCirculacion").change(function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        $("#TarifMontoTarifa").val('');
        $("#TarifaId").val('');
        $("#TarifMontoTarifaLabel").val('');
        $("#TarifMonedaDescLabel").val('');
        $("#TarifMonedaDesc").val('');
        $("#TarifDescripcionTarifa").val('');
        $("#TarifTipoCambio").val('');
        $("#CodigoFormulario").val('');
        let idZonaCirculacion;
        if ($("#hdnZonaCliente").val() !== "1") {
            idZonaCirculacion = $("#ddlZonaCirculacion option:selected").val();
        }

        $("#CalcMonto").val('');
        InsertarHistorialVenta(0, '', 0, "", 0, '', 0, '', 0, '', idZonaCirculacion);
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / ddlZonaCirculacion", e);
        return;
    }
});
$("#Cod_FormaPagoID").change(function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        var idFormaPago = $("#Cod_FormaPagoID option:selected").val();
        if (idFormaPago == '5') {
            $(".clsdebitoautomatico").show();
        } else {
            $(".clsdebitoautomatico").hide();
            $(".clspagoivr").hide();
            $("#NumeroTarjeta").val("");
            $("#NumeroOperacion").val("");
            $("#NumeroCargo").val("");
            $('#TipoTarjetaID option').eq(0).prop('selected', true);
            $('#idBancoPagoVirtual option').eq(0).prop('selected', true);
            $('#Cod_TipoPago option').eq(0).prop('selected', true);
            $('#idTipoPos option').eq(0).prop('selected', true);
            $('#ddlIdTipoPos option').eq(0).prop('selected', true);
        }
        $('#hdnTipoPagoDigital').val(idFormaPago);
        LeyendaMedioPago(); //RQ2020-569
        SeleccionarNotificacionPagoDigital();

        if ($("#hdnCotizacionActiva").val() > 0 && $("#hdnRenovacionActiva").val() === '1') {
            if ($("#hdnExisteCotizacion").val() === '1' && $('#hdnTipoPagoDigital').val() === '9') {
                $("#grpComandos").hide();
                $("#grpActualizarCotizacionPagoDigital").show();
            }
            else {
                $("#grpComandos").show();
                $("#grpActualizarCotizacionPagoDigital").hide();
            }
        }
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / Cod_FormaPagoID", e);
        return;
    }
});
$("#ddlIdTipoPos").change(function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        $("#NumeroTarjeta").val("");
        $("#NumeroOperacion").val("");
        $("#NumeroCargo").val("");
        $('#TipoTarjetaID option').eq(0).prop('selected', true);
        $('#idBancoPagoVirtual option').eq(0).prop('selected', true);
        var idFormaPago = $("#ddlIdTipoPos option:selected").val();
        if (idFormaPago == '3') {
            $(".clspagoivr").show();
            $(".clsfisvir").hide();
            $('#rbtnSiDebitoAutomatico').prop("disabled", true);
            $('#rbtnNoDebitoAutomatico').prop("disabled", true);
            $(".clsafiliacion").hide();
            document.getElementById('rbtnSiDebitoAutomatico').checked = false;
            document.getElementById('rbtnNoDebitoAutomatico').checked = true;
        } else {
            $(".clspagoivr").hide();
            $(".clsfisvir").show();
            $('#rbtnSiDebitoAutomatico').prop("disabled", false);
            $('#rbtnNoDebitoAutomatico').prop("disabled", false);
        }
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / ddlIdTipoPos", e);
        return;
    }
});
$("#TipoTarjetaID").change(function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        $("#NumeroTarjeta").val("");
        $("#NumeroOperacion").val("");
        $('#idBancoPagoVirtual option').eq(0).prop('selected', true);
        $('#Cod_TipoPago option').eq(0).prop('selected', true);
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / TipoTarjetaID", e);
        return;
    }
});
$("#TipoTarjetaID2").change(function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        $('#idBancoPagoVirtual2 option').eq(0).prop('selected', true);
        $('#Cod_FormaPagoID2 option').eq(0).prop('selected', true);
        $('#ddlMesTarjeta2 option').eq(0).prop('selected', true);
        $('#ddlAnioTarjeta2 option').eq(0).prop('selected', true);
        $('#idDiaCargo option').eq(0).prop('selected', true);
        $("#MontoCargo").val("");
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / TipoTarjetaID2", e);
        return;
    }
});
$("#rbtnNoTitularVehiculo").change(function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        document.getElementById('rbtnSiTitularVehiculo').checked = false;
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / rbtnNoTitularVehiculo", e);
        return;
    }
});
$("#rbtnSiTitularVehiculo").change(function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        document.getElementById('rbtnNoTitularVehiculo').checked = false;

        //INI RQ2024-664
        if ($("#AsegNumeroDocumento").val().length > 0) {
            CambioTipoComprobanteAsegurado();
        }
        //FIN RQ2024-664
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / rbtnSiTitularVehiculo", e);
        return;
    }
});
$("#rbtnNoDebitoAutomatico").change(function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        document.getElementById('rbtnSiDebitoAutomatico').checked = false;
        $("#hdnRenovacion").val('0');
        $("#seccionTarjeta").hide();
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / rbtnNoDebitoAutomatico", e);
        return;
    }
});
$("#rbtnSiDebitoAutomatico").change(function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        document.getElementById('rbtnNoDebitoAutomatico').checked = false;
        $("#hdnRenovacion").val('1');

        document.getElementById('rbtnTradicional').checked = true;
        document.getElementById('rbtnDigital').checked = false;
        $('#TipoTarjetaID2 option')[0].selected = true;
        $('#NumeroTarjeta2').val('');
        $('#idBancoPagoVirtual2 option')[0].selected = true;
        $('#Cod_FormaPagoID2 option')[0].selected = true;
        $('#ddlMesTarjeta2 option')[0].selected = true;
        $('#ddlAnioTarjeta2 option')[0].selected = true;
        $('#idDiaCargo option')[0].selected = true;
        $('#MontoCargo').val('');
        if ($('#Cod_FormaPagoID').val() == '5') {
            var copiarok = true;
            if ($('#TipoTarjetaID').val() == '') copiarok = false;
            if ($('#idBancoPagoVirtual').val() == '') copiarok = false;
            if ($('#Cod_TipoPago').val() == '') copiarok = false;
            var _tarjeta = $('#NumeroTarjeta').val();
            if ($('#TipoTarjetaID').val() == '10') {
                if (!_tarjeta.match(/^4\d{3}-?\d{4}-?\d{4}-?\d{4}$/)) {
                    copiarok = false;
                }
            }
            if ($('#TipoTarjetaID').val() == '12') {
                if (!_tarjeta.match(/^5[1-5]\d{2}-?\d{4}-?\d{4}-?\d{4}$/)) {
                    copiarok = false;
                }
            }
            if ($('#TipoTarjetaID').val() == '14') {
                if (!_tarjeta.match(/^(?:3[47][0-9]{13})$/)) {
                    copiarok = false;
                }
            }
            if ($('#TipoTarjetaID').val() == '15') {
                if (!_tarjeta.match(/^(?:3(?:0[0-5]|[68][0-9])[0-9]{11})$/)) {
                    copiarok = false;
                }
            }
            if (copiarok == true) {
                bootstrapConfirm('¿Desea replicar los datos ingresados en la sección forma de pago?', 'CopiardatosTarjeta');
            }
        }
        else if ($('#Cod_FormaPagoID').val() == '9') {
            alertValida("La renovación del certificado SOAT será en formato digital.");//RQ2022-1037
        }
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / rbtnSiDebitoAutomatico", e);
        return;
    }
});
$("#rbtnSiRecibirInformacion").change(function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        document.getElementById('rbtnNoRecibirInformacion').checked = false;
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / rbtnSiRecibirInformacion", e);
        return;
    }
});
$("#rbtnNoRecibirInformacion").change(function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        document.getElementById('rbtnSiRecibirInformacion').checked = false;
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / rbtnNoRecibirInformacion", e);
        return;
    }
});
$("#ContraProvinciaId").change(function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        ConsultaDistritosPorFiltro("ContraDistritoId", $("#ContraDepartamentoId").val(), $("#ContraProvinciaId").val());
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / ContraProvinciaId", e);
        return;
    }
});
$("#AsegDepartamentoId").change(function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        ConsultaProvinciasPorFiltro("AsegProvinciaId", $("#AsegDepartamentoId").val());
        ConsultaDistritosPorFiltro("AsegDistritoId", $("#AsegDepartamentoId").val(), $("#AsegProvinciaId").val());//RQ2022-598
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / AsegDepartamentoId", e);
        return;
    }
});
$("#ContraDepartamentoId").change(function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        ConsultaProvinciasPorFiltro("ContraProvinciaId", $("#ContraDepartamentoId").val());
        ConsultaDistritosPorFiltro("ContraDistritoId", $("#ContraDepartamentoId").val(), $("#ContraProvinciaId").val());//RQ2022-598
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / ContraDepartamentoId", e);
        return;
    }
});
$("#AsegProvinciaId").change(function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        ConsultaDistritosPorFiltro("AsegDistritoId", $("#AsegDepartamentoId").val(), $("#AsegProvinciaId").val());
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / AsegProvinciaId", e);
        return;
    }
});
$("#MarcaId").change(function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        LimpiarDatosCertificado();
        LimpiarDatosVehiAlSelMarca();
        ConsultaModelosPorFiltro($("#ClaseId").val(), $("#MarcaId").val(), $("#FechaInicioVigencia").val(), 0, true);
        InsertarHistorialVenta(0, '', 0, '', $("#MarcaId").val(), document.getElementById("MarcaId").options[document.getElementById("MarcaId").selectedIndex].text, 0, '', 0, '', '');
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / MarcaId", e);
        return;
    }
});
$("#ModeloId").change(function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        LimpiarDatosCertificado();
        LimpiarDatosVehiAlSelModelo();
        ConsultaVersionesPorFiltro($("#ClaseId").val(), $("#MarcaId").val(), $("#ModeloId").val(), $("#FechaInicioVigencia").val(), 0);
        InsertarHistorialVenta(0, '', 0, '', 0, '', $("#ModeloId").val(), document.getElementById("ModeloId").options[document.getElementById("ModeloId").selectedIndex].text, 0, '', '')
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / ModeloId", e);
        return;
    }
});
$("#UsoId").change(function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        LimpiarDatosCertificado();
        InsertarHistorialVenta(0, '', $("#UsoId").val(), document.getElementById("UsoId").options[document.getElementById("UsoId").selectedIndex].text, 0, '', 0, '', 0, '', '');
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / UsoId", e);
        return;
    }
});
$("#ClaseId").change(function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        LimpiarDatosCertificado();
        LimpiarDatosVehiAlSelClase();
        var sIntermediario = "";
        var sRol = "";
        if ($('#trDatosAgenciamiento').is(':visible')) {
            var oficina = $("#IdOficina").val();
            var rol = $("#idRol").val();
            var intermediario = $("#idIntermediario").val();
            var tipoIntermediario = $("#idTipoIntermediario").val();
            if (oficina == "" || oficina == "0") {
                alertValida("Favor de seleccionar una oficina.");
                $("#IdOficina").focus();
                return false;
            }
            if (tipoIntermediario == 0) {
                if (intermediario == "" || intermediario == "0") {
                    alertValida("Favor de seleccionar un Broker.");
                    $("#idIntermediario").focus();
                    return false;
                }
            } else {
                if (rol == "" || rol == "0") {
                    alertValida("Favor de seleccionar un Rol.");
                    $("#idRol").focus();
                    return false;
                }
            }
            sIntermediario = intermediario;
            sRol = rol;
        }
        ConsultaCatsPorFiltro($("#ClaseId").val(), 0);
        ConsultaUsosPorFiltro($("#ClaseId").val(), $("#ComercializadorIntermediarioId").val(), sIntermediario, sRol, 0);
        ConsultaMarcasPorFiltro($("#ClaseId").val(), $("#FechaInicioVigencia").val(), 0, true);
        var ddlModelo = document.getElementById("ModeloId");
        ddlModelo.options.length = 0;
        ddlModelo.options[0] = new Option("--Seleccione--", "");
        ddlModelo.selectedIndex = 0;
        ddlModelo.disabled = true;
        var ddlVersion = document.getElementById("VersionId");
        ddlVersion.options.length = 0;
        ddlVersion.options[0] = new Option("--Seleccione--", "");
        ddlVersion.selectedIndex = 0;
        ddlVersion.disabled = true;
        InsertarHistorialVenta($("#ClaseId").val(), document.getElementById("ClaseId").options[document.getElementById("ClaseId").selectedIndex].text, 0, '', 0, '', 0, '', 0, '', '');
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / ClaseId", e);
        return;
    }
});
$("#VersionId").change(function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        InsertarHistorialVenta(0, '', 0, '', 0, '', 0, '', $("#VersionId").val(), document.getElementById("VersionId").options[document.getElementById("VersionId").selectedIndex].text, '');
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / VersionId", e);
        return;
    }
});
$("#AsegTipoDocumentoId").change(function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        HideShowPagoDigital();//BUGFIX RQ2022-1037
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        var Id = $('#AsegTipoDocumentoId').val();
        return VerificarLongitudDoc(Id, $('#AsegNumeroDocumento'));
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / AsegTipoDocumentoId", e);
        return;
    }
});
$("#ContraTipoDocumentoId").change(function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        var Id = $('#ContraTipoDocumentoId').val();
        return VerificarLongitudDoc(Id, $('#ContraNumeroDocumento'));
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / ContraTipoDocumentoId", e);
        return;
    }
});
$("#AsegTipoPersonaId").change(function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        setTimeout(function () { ConsultaTiposDocumentoAseguradoPorFiltro($("#AsegTipoPersonaId :selected").val()) }, 20);
        setTimeout(function () { SeleccionarDocumentoDefault(); }, 300);
        if (idFlagEndoso != 1) { LimpiarDatosCertificado(); }
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / AsegTipoPersonaId", e);
        return;
    }
});
$("#ContraTipoPersonaId").change(function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        setTimeout(function () { ConsultaTiposDocumentoContratantePorFiltro($("#ContraTipoPersonaId :selected").val()); }, 20);
        setTimeout(function () { SeleccionarDocumentoDefaultContratante(); }, 300);
        if (idFlagEndoso != 1) { LimpiarDatosCertificado(); }
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / ContraTipoPersonaId", e);
        return;
    }
});
$("#IdOficina").change(function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    var numCoti = document.getElementById("NumeroCotizacion");
    try {
        if (numCoti == null || !numCoti.readOnly) {
            var idFlagEndoso = $("#divEndoso").data('value');
            if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
            LimpiarDatosCertificado();
            $("#findSection1").val('0');
            $("#CodInsunixPla").val('');
            ControlesCambiarPlaca();
            LimpiarControlesAsegurado();
            LimpiarControlesContratante();
            $("#findSection2").val('0');
            $("#grpDatosCertificado").hide();
        }
        var idOficina = $("#IdOficina").val();
        var idTipoIntermediario = $("#idTipoIntermediario").val();
        var ddlIntermediario = document.getElementById("idIntermediario");
        ListarIntermediarios(idOficina, 0, '', '');
        if (idTipoIntermediario != 0) {
            ListarRoles(idOficina, idTipoIntermediario, "");
            ddlIntermediario.disabled = true;
        }
        else {
            ddlIntermediario.disabled = false;
        }
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / IdOficina", e);
        return;
    }
});
$("#idRol").change(function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        LimpiarDatosCertificado();
        $("#findSection1").val('0');
        $("#CodInsunixPla").val('');
        ControlesCambiarPlaca();
        LimpiarControlesAsegurado();
        LimpiarControlesContratante();
        $("#findSection2").val('0');
        $("#grpDatosCertificado").hide();
        var idOficina = $("#IdOficina").val();
        var idRol = $("#idRol").val();
        var ddlIntermediario = document.getElementById("idIntermediario");
        var idTipoIntermediario = $("#idTipoIntermediario").val();
        var datalenght = 0;
        ddlIntermediario.options.length = 0;
        var urlAux = 'Ventas/ObtenerIntermediarios2';
        if (idFlagEndoso == 1) { urlAux = 'ObtenerIntermediarios2'; }

        if (idRol == 0) {
            ListarIntermediarios(idOficina, idRol, "", "");
        } else {
            $.getJSON(
                urlAux,
                {
                    idOficina: idOficina,
                    idIntermediarioRelacionado: idRol,
                    idTipoIntermediario: idTipoIntermediario,
                },
                function (data) {
                    datalenght = data.length;
                    $.each(data, function (i, row) {
                        ddlIntermediario.options[i] = new Option(row.DescIntermediario, row.IdIntermediario);
                    });
                    if (datalenght == 1) {
                        ddlIntermediario.selectedIndex = 0;
                    }
                });
        }
        ddlIntermediario.disabled = true;
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / idRol", e);
        return;
    }
});
$("#idIntermediario").change(function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    var numCoti = document.getElementById("NumeroCotizacion");
    try {
        if (numCoti == null || !numCoti.readOnly) {
            var idFlagEndoso = $("#divEndoso").data('value');
            if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
            LimpiarDatosCertificado();
            $("#findSection1").val('0');
            $("#CodInsunixPla").val('');
            ControlesCambiarPlaca();
            LimpiarControlesAsegurado();
            LimpiarControlesContratante();
            $("#findSection2").val('0');
            $("#grpDatosCertificado").hide();
        }

    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / idIntermediario", e);
        return;
    }
});
$("#idTipoIntermediario").change(function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        LimpiarDatosCertificado();
        $("#findSection1").val('0');
        $("#CodInsunixPla").val('');
        ControlesCambiarPlaca();
        LimpiarControlesAsegurado();
        LimpiarControlesContratante();
        $("#findSection2").val('0');
        $("#grpDatosCertificado").hide();
        var idOficina = $("#IdOficina").val();
        if (idOficina == "") {
            idOficina = 0;
        }
        var TipoIntermediario = $("#idTipoIntermediario").val();
        ListarRoles(idOficina, TipoIntermediario, "");
        var ddlIntermediario = document.getElementById("idIntermediario");
        var ddlRol = document.getElementById("idRol");
        ddlIntermediario.options.length = 0;
        ddlIntermediario.options[0] = new Option("--Seleccione--", "0");
        ddlIntermediario.selectedIndex = 0;
        ddlIntermediario.disabled = false;
        if (TipoIntermediario != 0) {
            ddlIntermediario.selectedIndex = 0;
            ddlIntermediario.disabled = true;
        }
        else {
            ListarIntermediarios(idOficina, "", "", "");
            ddlRol.disabled = true;
            ddlIntermediario.disabled = false;
        }
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / idTipoIntermediario", e);
        return;
    }
});
$("#rbtnTradicional").change(function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        document.getElementById('rbtnDigital').checked = false;
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / rbtnTradicional", e);
        return;
    }
});
$("#rbtnDigital").change(function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        document.getElementById('rbtnTradicional').checked = false;
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / rbtnDigital", e);
        return;
    }
});

$("#lnkContinuar").click(function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        if ($("#findSection1").val() == '0') {
            alertValida("VEHICULO: Por favor realice una búsqueda de placa.");
            return false;
        }
        if (validarSeccionVeh() == false) {
            return false;
        }
        if ($("#findSection2").val() == '0') {
            alertValida("CONTRATANTE: Por favor realice una búsqueda de CONTRATANTE.");
            return false;
        }
        if (ValidarSeccionAse() == false) {
            return false;
        }
        if (ValidarSeccionCer() == false) {
            return false;
        }
        //INI RQ2023-64
        if ($('#hdnEmisionRUC20Activa').val() === '1') {
            if (!ValidaPersonaJuricaUso()) {
                return false;
            }
        }
        //FIN RQ2023-64
        SeleccionarZonaCirculacionDefaul();
        if (document.getElementById('rbtnNoTitularVehiculo').checked == true) {
            if ($('#ContraNumeroDocumento').val().trim() == $('#AsegNumeroDocumento').val().trim()) {
                alertValida('CERTIFICADO: El número de documento del CONTRATANTE deben de ser diferentes al número de documento del ASEGURADO.');
                $('#ContraNumeroDocumento').focus();
                return false;
            }
        }
        if ($('#CodigoFormulario').val().trim() === '' && $("#ModalidadVentaId").val() === '1') {
            alertValida('CERTIFICADO: Debe seleccionar un número de formulario.');
            $('#CodigoFormulario').focus();
            return false;
        }
        if (ValidacionUsoAsegurado() == false) {
            alertValida('CERTIFICADO: La placa ingresada tiene una póliza vigente para la fecha, uso y cliente ingresado.');
            return false;
        }
        if (ValidarSeccionPago() == false) {
            return false;
        }
        var regex = /^[0-9A-Za-zñáéíóúÑÁÉÍÓÚüÜ;\.\s\-]+$/;
        if ($('#AsegDireccion').val().trim() != '') {
            if (!regex.test($('#AsegDireccion').val().trim())) {
                alertValida('CONTRATANTE: La dirección ingresada contiene caracteres invalidos.');
                $('#AsegDireccion').focus();
                return false;
            }
        }
        if ($('#ContraDireccion').val().trim() != '') {
            if (!regex.test($('#ContraDireccion').val().trim())) {
                alertValida('RESPONSABLE DE PAGO: La dirección ingresada contiene caracteres invalidos.');
                $('#ContraDireccion').focus();
                return false;
            }
        }

        if ($('#AsegReferencia').val().trim() != '') {
            if (!regex.test($('#AsegReferencia').val().trim())) {
                alertValida('CONTRATANTE: La referencia ingresada contiene caracteres invalidos.');
                $('#AsegReferencia').focus();
                return false;
            }
        }
        if ($('#ContraReferencia').val().trim() != '') {
            if (!regex.test($('#ContraReferencia').val().trim())) {
                alertValida('RESPONSABLE DE PAGO: La referencia ingresada contiene caracteres invalidos.');
                $('#ContraReferencia').focus();
                return false;
            }
        }

        var regex1 = new RegExp($("#hdnCaracteresP").val().trim());
        //RQ2022-1108
        if ($('#AsegApellidoPaterno').val().trim() != '') {
            if (!regex1.test($('#AsegApellidoPaterno').val().trim())) {
                alertValida('CONTRATANTE: El Apellido Paterno ingresado contiene caracteres inválidos.');
                $('#AsegApellidoPaterno').focus();
                return false;
            }
        }
        if ($('#AsegApellidoMaterno').val().trim() != '') {
            if (!regex1.test($('#AsegApellidoMaterno').val().trim())) {
                alertValida('CONTRATANTE: El Apellido Materno ingresado contiene caracteres inválidos.');
                $('#AsegApellidoMaterno').focus();
                return false;
            }
        }
        if ($('#AsegNombre').val().trim() != '') {
            if (!regex1.test($('#AsegNombre').val().trim())) {
                alertValida('CONTRATANTE: El Nombre ingresado contiene caracteres inválidos.');
                $('#AsegNombre').focus();
                return false;
            }
        }
        if ($('#ContraApellidoPaterno').val().trim() != '') {
            if (!regex1.test($('#ContraApellidoPaterno').val().trim())) {
                alertValida('RESPONSABLE DE PAGO: El Apellido Paterno ingresado contiene caracteres inválidos.');
                $('#ContraApellidoPaterno').focus();
                return false;
            }
        }
        if ($('#ContraApellidoMaterno').val().trim() != '') {
            if (!regex1.test($('#ContraApellidoMaterno').val().trim())) {
                alertValida('RESPONSABLE DE PAGO: El Apellido Materno ingresado contiene caracteres inválidos.');
                $('#ContraApellidoMaterno').focus();
                return false;
            }
        }
        if ($('#ContraNombre').val().trim() != '') {
            if (!regex1.test($('#ContraNombre').val().trim())) {
                alertValida('RESPONSABLE DE PAGO: El Nombre ingresado contiene caracteres inválidos.');
                $('#ContraNombre').focus();
                return false;
            }
        }
        //RQ2022-1108
        if ($('#TarifDescripcionTarifa').val().trim() == '') {
            alertValida('TARIFA: Debe ingresar una Tarifa.');
            $('#lnkBusqPlanTarifa').focus();
            return false;
        }
        ValidaFraude('', 0, 2);
        return false;
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / lnkContinuar", e);
        return;
    }
});
$("#lnkEndosar").click(function () {
    try {
        console.log("boton endosar");
        if ($("#findSection1").val() == '0') {
            alertValida("VEHICULO: Por favor realice una búsqueda de placa.");
            return false;
        }
        if (validarSeccionVeh() == false) {
            return false;
        }
        if ($("#findSection2").val() == '0') {
            alertValida("CONTRATANTE: Por favor realice una búsqueda de CONTRATANTE.");
            return false;
        }
        if (ValidarSeccionAse() == false) {
            return false;
        }
        if (ValidarSeccionCerEndoso() == false) {
            return false;
        }
        //INI RQ2023-64
        if ($('#hdnEmisionRUC20Activa').val() === '1') {
            if (!ValidaPersonaJuricaUsoEndoso()) {
                validaTarifa = false;
                $('input[name="next"]').prop("disabled", false);
                return false;
            }
        }
        //FIN RQ2023-64
        if ($('#CodigoFormulario').val().trim() === '' && $("#ModalidadVentaId").val() === '1') {
            alertValida('CERTIFICADO: Debe seleccionar un número de formulario.');
            $('#CodigoFormulario').focus();
            return false;
        }

        //INI GP2026-81
        var regex = /^[0-9A-Za-zñáéíóúÑÁÉÍÓÚüÜ;\.\s\-]+$/;
        if ($('#AsegDireccion').val().trim() != '') {
            if (!regex.test($('#AsegDireccion').val().trim())) {
                alertValida('CONTRATANTE: La dirección ingresada contiene caracteres invalidos.');
                $('#AsegDireccion').focus();
                return false;
            }
        }
        if ($('#ContraDireccion').val().trim() != '') {
            if (!regex.test($('#ContraDireccion').val().trim())) {
                alertValida('RESPONSABLE DE PAGO: La dirección ingresada contiene caracteres invalidos.');
                $('#ContraDireccion').focus();
                return false;
            }
        }

        if ($('#AsegReferencia').val().trim() != '') {
            if (!regex.test($('#AsegReferencia').val().trim())) {
                alertValida('CONTRATANTE: La referencia ingresada contiene caracteres invalidos.');
                $('#AsegReferencia').focus();
                return false;
            }
        }
        if ($('#ContraReferencia').val().trim() != '') {
            if (!regex.test($('#ContraReferencia').val().trim())) {
                alertValida('RESPONSABLE DE PAGO: La referencia ingresada contiene caracteres invalidos.');
                $('#ContraReferencia').focus();
                return false;
            }
        }

        var regex1 = new RegExp($("#hdnCaracteresP").val().trim());
        if ($('#AsegApellidoPaterno').val().trim() != '') {
            if (!regex1.test($('#AsegApellidoPaterno').val().trim())) {
                alertValida('CONTRATANTE: El Apellido Paterno ingresado contiene caracteres inválidos.');
                $('#AsegApellidoPaterno').focus();
                return false;
            }
        }
        if ($('#AsegApellidoMaterno').val().trim() != '') {
            if (!regex1.test($('#AsegApellidoMaterno').val().trim())) {
                alertValida('CONTRATANTE: El Apellido Materno ingresado contiene caracteres inválidos.');
                $('#AsegApellidoMaterno').focus();
                return false;
            }
        }
        if ($('#AsegNombre').val().trim() != '') {
            if (!regex1.test($('#AsegNombre').val().trim())) {
                alertValida('CONTRATANTE: El Nombre ingresado contiene caracteres inválidos.');
                $('#AsegNombre').focus();
                return false;
            }
        }
        if ($('#ContraApellidoPaterno').val().trim() != '') {
            if (!regex1.test($('#ContraApellidoPaterno').val().trim())) {
                alertValida('RESPONSABLE DE PAGO: El Apellido Paterno ingresado contiene caracteres inválidos.');
                $('#ContraApellidoPaterno').focus();
                return false;
            }
        }
        if ($('#ContraApellidoMaterno').val().trim() != '') {
            if (!regex1.test($('#ContraApellidoMaterno').val().trim())) {
                alertValida('RESPONSABLE DE PAGO: El Apellido Materno ingresado contiene caracteres inválidos.');
                $('#ContraApellidoMaterno').focus();
                return false;
            }
        }
        if ($('#ContraNombre').val().trim() != '') {
            if (!regex1.test($('#ContraNombre').val().trim())) {
                alertValida('RESPONSABLE DE PAGO: El Nombre ingresado contiene caracteres inválidos.');
                $('#ContraNombre').focus();
                return false;
            }
        }
        //FIN GP2026-81

        if ($("#TarifDescripcionTarifa").val() == "") {
            $.ajax({
                url: "ValidarTarifaEndoso",
                type: 'Get',
                data: {
                    pUso: $("#UsoId").val(),
                    pModelo: $("#ModeloId").val(),
                    pZonaCirculacion: $("#ddlZonaCirculacion").val(),
                    pNumeroPlaca: $("#NumeroPlaca").val().toUpperCase()
                },
                async: false,
                cache: false,
                success: function (data) {
                    if (data.IsValid == false) {
                        alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                        return;
                    }
                    if (data.resultado == false) {
                        $("#lnkBusqPlanTarifa").focus();
                        $("#lnkBusqPlanTarifa").removeAttr('disabled');
                        alertValida("Se modificó un valor del vehiculo, seleccionar tarifa.");
                        return false;
                    } else {
                        $("#TarifDescripcionTarifa").val("ENDOSO");
                        $("#lnkBusqPlanTarifa").attr('disabled', 'disabled');
                        VistaPreviaEmisionPoliza();
                        return false;
                    }
                },
                error: function () {
                    alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk.");
                    return false;
                }

            });
        } else {
            VistaPreviaEmisionPoliza();
            return false;
        }
    }
    catch (e) {
        GrabaMensajeErrorVista("ENDOSO", "Ventas.js / lnkEndosar", e);
        return;
    }
});
$("#rbtnModaliadVentaTradicional").click(function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        $("#CodigoFormulario").removeAttr('disabled');
        $("#lnkBusqFormulario").removeAttr('disabled');
        $("#ModalidadVentaId").val("1");

        $("#rbtnModaliadVentaTradicional").val("1");
        $("#rbtnModaliadVentaDigital").val("0");
        HideShowLiqAuto(); //RQ2020-570
        $('#rbtnNoDebitoAutomatico').prop('checked', true);
        $('#rbtnSiDebitoAutomatico').prop('checked', false);
        $("#grpAfiliacionRenovacion").hide();
        HideShowPagoDigital(); //BUGFIX RQ2022-1037
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / rbtnModaliadVentaTradicional", e);
        return;
    }
});
$("#rbtnModaliadVentaDigital").click(function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        $("#CodigoFormulario").attr('disabled', 'disabled');
        $("#lnkBusqFormulario").attr('disabled', 'disabled');
        $("#ModalidadVentaId").val("0");

        $("#rbtnModaliadVentaTradicional").val("0");
        $("#rbtnModaliadVentaDigital").val("1");
        HideShowLiqAuto(); //RQ2020-570
        if ($("#hdnCotizacionActiva").val() > 0 && $("#hdnRenovacionActiva").val() === '1') {
            HideShowPagoDigital(); //BUGFIX RQ2022-1037
        }
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / rbtnModaliadVentaDigital", e);
        return;
    }
});
//INI RQ2021-698
$("#lnkLimpiarAsegurado").click(function () {
    LimpiarVentaIndividualAsegurado();
});

$("#lnkLimpiarContratante").click(function () {
    LimpiarVentaIndividualContratante();
});

function LimpiarVentaIndividualAsegurado() {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        if (idFlagEndoso != 1) { LimpiarDatosCertificado(); }
        LimpiarControlesAsegurado();
        $("#findSection2").val('0');
        return false;
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / lnkLimpiarAsegurado", e);
        return;
    }
}

function LimpiarVentaIndividualContratante() {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        if (idFlagEndoso != 1) { LimpiarDatosCertificado(); }
        LimpiarControlesContratante();
        return false;
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / lnkLimpiarContratante", e);
        return;
    }
}
//FIN RQ2021-698
$("#lnkCancelar").click(function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        var numCoti = document.getElementById("NumeroCotizacion");
        if (numCoti != null && numCoti.readOnly) {
            $("#lnkEditarCotizacion").click();
        }

        LiberarControles(); //RQ2021-290
        ControlesTipoPersona();
        ControlesInicial();
        ControlesCambiarPlaca();
        LimpiarControlesAsegurado();
        LimpiarControlesContratante();
        $("#TarifMontoTarifa").val('');
        $("#TarifaId").val('');
        $("#TarifMontoTarifaLabel").val('');
        $("#TarifMonedaDescLabel").val('');
        $("#TarifMonedaDesc").val('');
        $("#TarifDescripcionTarifa").val('');
        $("#TarifTipoCambio").val('');
        $("#CodigoFormulario").val('');
        $("#findSection1").val('0');
        $("#findSection2").val('0');
        $("#CalcMonto").val('');
        $("#hdnExisteCotizacion").val("0");
        document.getElementById('rbtnSiDebitoAutomatico').checked = false;
        $("#hdnRenovacion").val('0');
        $("#seccionTarjeta").hide();
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / lnkCancelar", e);
        return;
    }
});
$("#lnkBusqClienteAsegu").click(function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        if ($("#findSection1").val() == '0') {
            alertValida("VEHICULO: Por favor realice una búsqueda de placa.");
            return false;
        }
        if (validarSeccionVeh() == false) {
            return false;
        }
        PresentarParametrosBusquedaClienteAsegurado();
        return false;
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / lnkBusqClienteAsegu", e);
        return;
    }
});
$("#lnkBusqClienteContra").click(function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        PresentarParametrosBusquedaClienteContratante();
        return false;
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / lnkBusqClienteContra", e);
        return;
    }
});
$("#lnkBusqFormulario").click(function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        if ($("#findSection1").val() == '0') {
            alertValida("VEHICULO: Por favor realice una búsqueda de placa.");
            return false;
        }
        if (validarSeccionVeh() == false) {
            return false;
        }
        if ($("#findSection2").val() == '0') {
            alertValida("CONTRATANTE: Por favor realice una búsqueda de CONTRATANTE.");
            return false;
        }
        if (ValidarSeccionAse() == false) {
            return false;
        }
        if (ValidarSeccionCer() == false) {
            return false;
        }
        if (ValidacionUsoAsegurado() == false) {
            alertValida('CERTIFICADO: La placa ingresada tiene una póliza vigente para la fecha , uso y cliente ingresado.');
            return false;
        }
        var modalidadVenta = 0;
        if ($("#rbtnModaliadVentaTradicional").prop("checked")) {
            modalidadVenta = 1;
        }
        else {
            modalidadVenta = 0;
        }
        var tipouso = "";
        if ($('select[name="UsoId"]').val() == "1") {
            tipouso = "PRI";
        }
        else {
            tipouso = "PUB";
        }

        var urlAux = 'Ventas/ListarFormularioDisponibles';
        var fechaConsultar = $("#FechaInicioVigencia").val();
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) {
            urlAux = 'ListarFormularioDisponibles';
            fechaConsultar = new Date();
            var dd = fechaConsultar.getDate();
            var mm = fechaConsultar.getMonth() + 1;
            var yyyy = fechaConsultar.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            fechaConsultar = dd + '/' + mm + '/' + yyyy;
        }

        $.ajax({
            url: urlAux,
            type: 'Get',
            data: {
                pModalidadVenta: modalidadVenta,
                pUsoId: tipouso,
                pFechaEmision: fechaConsultar,
                pFechaInicioVigencia: fechaConsultar,
                flag: '2',
                NroPoliza: '0',
                NroCertificado: '0'
            },
            async: true,
            cache: false,
            success: function (data) {
                if (data.IsValid == false) {
                    alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                    return;
                }
                if (data.estado == "LO") {
                    LostSession();
                }
                else {
                    if (data.resultado == 0) {
                        alertValida("CERTIFICADO: No se encontró distribución de formularios para la fecha de inicio ingresada.");
                    }
                    else {
                        mostrar();
                    }
                }
            },
            error: function (xhr, status, error) {
                alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk.");
            }
        });
        return false;
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / lnkBusqFormulario", e);
        return;
    }
});
$("#lnkBusqPlanTarifa").click(function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        if ($("#findSection1").val() == '0') {
            alertValida("VEHICULO: Por favor realice una búsqueda de placa.");
            return false;
        }
        if (validarSeccionVeh() == false) {
            return false;
        }
        if ($("#findSection2").val() == '0') {
            alertValida("CONTRATANTE: Por favor realice una búsqueda de CONTRATANTE.");
            return false;
        }
        if (ValidarSeccionAse() == false) {
            return false;
        }
        if ($('#FechaInicioVigencia').val().trim() === '') {
            alertValida('CERTIFICADO: Debe ingresar la fecha de inicio de vigencia.');
            $('#FechaInicioVigencia').focus();
            return false;
        }
        if (ValidacionUsoAsegurado() == false) {
            alertValida('CERTIFICADO: La placa ingresada tiene una póliza vigente para la fecha , uso y cliente ingresado.');
            return false;
        }
        SeleccionarZonaCirculacionDefaul();
        var IdClienteVt_ = "";
        var idClienteAsegVT = $("#AseguradoCodigoVTime").val();
        var idClienteContVT = $("#ContratanteCodigoVTime").val();
        IdClienteVt_ = idClienteAsegVT;
        if ($("#grpDatosContratante").is(":visible") && idClienteContVT.length > 0) { IdClienteVt_ = idClienteAsegVT; } //RQ2022-598
        if ($("#ModalidadVentaId").val() == '1') {
            if ($('#CodigoFormulario').val().trim() == '') {
                alertValida('CERTIFICADO: Debe seleccionar un número de formulario.');
                $('#CodigoFormulario').focus();
                return false;
            }
        }
        var fechaConsultar = $("#FechaInicioVigencia").val();
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) {
            urlAux = 'ListarFormularioDisponibles';
            fechaConsultar = new Date();
            var dd = fechaConsultar.getDate();
            var mm = fechaConsultar.getMonth() + 1;
            var yyyy = fechaConsultar.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            fechaConsultar = dd + '/' + mm + '/' + yyyy;
        }
        ValidaFraude(fechaConsultar, IdClienteVt_, 1);
        return false;
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / lnkBusqPlanTarifa", e);
        return;
    }
});
$("#lnkCambiarPlaca").click(function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        LiberarControles(); //RQ2021-290
        ControlesCambiarPlaca();
        LimpiarDatosCertificado();
        $("#findSection1").val('0');
        $("#CodInsunixPla").val('');
        ControlesCambiarPlaca();
        if (idFlagEndoso != 1) {
            $("#lnkLimpiarBusquedaContextual").click(); //RQ2022-254
            $("#lnkLimpiarBusquedaContextualContra").click(); //RQ2022-254
            LimpiarControlesAsegurado();
            LimpiarControlesContratante();
            $("#findSection2").val('0');
            $("#grpDatosCertificado").hide();
        }
        var codiubigeo = $("#hdnZonaCirculacionInicial").val();
        if (codiubigeo != '') {
            $("#ddlZonaCirculacion").val(codiubigeo);
        }
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / lnkCambiarPlaca", e);
        return;
    }
});
$("#lnkCambiarEndoso").click(function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        $("#idEndosoPoliza").val('');
        $("#AsegNumeroDocumento").val('');
        $("#IdOficina").val('');
        $("#idIntermediario").val(0);
        $("#lnkCambiarPlaca").click();
        $("#lnkLimpiarAsegurado").click();
        $("#lnkEndosar").show();
        $("#lnkContinuar").hide;
        $("#NumeroPlaca").attr('readOnly', true); //RQ2023-161
        $('#lnkBusqPlaca').attr("disabled", 'disabled'); //RQ2023-161
        $('#lnkCambiarPlaca').attr("disabled", 'disabled'); //RQ2023-161
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / lnkCambiarEndoso", e);
        return;
    }
});

//INI RQ2022-254
var validadorBool = true;
function validador(e) {
    validadorBool = e;
}
//FIN RQ2022-254

$("#lnkBusqAsegurado").click("click", function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        validador(true);//RQ2022-254
        if ($("#findSection1").val() == '0') {
            validador(false);//RQ2022-254
            alertValida("VEHICULO: Por favor realice una búsqueda de placa.");
            return false;
        }
        if (validarSeccionVeh() == false) {
            validador(false);//RQ2022-254
            return false;
        }
        if ($("#AsegTipoPersonaId").val() == "") {
            alertValida("CONTRATANTE: Debe seleccionar el tipo de persona.");
            $('#AsegTipoPersonaId').focus();
            return false;
        }
        if ($("#AsegTipoDocumentoId").val() == "") {
            alertValida("CONTRATANTE: Debe seleccionar un tipo de documento.");
            $('#AsegTipoDocumentoId').focus();
            return false;
        }
        if ($("#AsegNumeroDocumento").val() == "") {
            alertValida("CONTRATANTE: Debe de ingresar un número de documento.");
            $('#AsegNumeroDocumento').focus();
            return false;
        }
        if ($("#AsegTipoDocumentoId").val() === "1" && $.trim($("#AsegNumeroDocumento").val()).length !== 8) {
            alertValida("CONTRATANTE: El número de documento debe ser de 8 dígitos para DNI.");
            $('#AsegNumeroDocumento').focus();
            return false;
        }
        if ($("#AsegTipoDocumentoId").val() === "2" && $.trim($("#AsegNumeroDocumento").val()).length !== 11) {
            alertValida("CONTRATANTE: El número de documento debe ser de 11 dígitos para RUC.");
            $('#AsegNumeroDocumento').focus();
            return false;
        }
        if ($('#AsegTipoPersonaId').val() == '1' && $('#AsegTipoDocumentoId').val() == '2') {
            var tipoCaracter = $("#AsegNumeroDocumento").val().trim();
            if (tipoCaracter.substring(0, 2) != '10' && tipoCaracter.substring(0, 2) != '15' && tipoCaracter.substring(0, 2) != '17') {
                alertValida("CONTRATANTE: Número de ruc no válido para persona natural.");
                return false;
            }
        }
        if ($('#AsegTipoPersonaId').val() == '2' && $('#AsegTipoDocumentoId').val() == '2') {
            var tipoCaracter = $("#AsegNumeroDocumento").val().trim();

            if (tipoCaracter.substring(0, 2) != '20') {
                alertValida("CONTRATANTE: Número de ruc no válido para persona jurídica.");
                return false;
            }
        }

        //RQ2022-1131
        if ($('#AsegNumeroDocumento').val().indexOf(" ") !== -1) {
            alertValida("CONTRATANTE: El número de documento no puede contener espacios en blanco");
            $('#AsegNumeroDocumento').focus();
            return false;
        }
        //RQ2022-1131
        var control = false;
        control = ConsultaClienteAsegurado($("#AsegNumeroDocumento").val(), $("#AsegTipoDocumentoId :selected").val(), $("#AsegTipoPersonaId :selected").val(), $("#ComercializadorDni").val(), $("#AplicacionId").val(), 0, $("#hiddenCodigoClienteContextual").val());

        if (control == true) {
            ControlesBusqAsegurado();
            //INI RQ2024-664
            if ($('#ddlTipoComprobante').length == 1) {
                if (document.getElementsByName('titular')[0].checked) {
                    CambioTipoComprobanteAsegurado();
                }
            }
            //FIN RQ2024-664
        }
        return false;
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / lnkBusqAsegurado", e);
        return;
    }
});
//INI RQ2024-664
function CambioTipoComprobanteAsegurado() {
    $('#ddlTipoComprobante').val(1);

    if ($('#AsegTipoPersonaId').val() == 1 && $('#AsegTipoDocumentoId').val() != 2) {
        $('#ddlTipoComprobante').val(1);
        $("#ddlTipoComprobante").attr('disabled', 'disabled');
    }

    if ($('#AsegTipoPersonaId').val() == 2 && $('#AsegTipoDocumentoId').val() == 2) {
        $('#ddlTipoComprobante').val(2);
        $("#ddlTipoComprobante").attr('disabled', 'disabled');
    }

    if ($('#AsegTipoPersonaId').val() == 1 && $('#AsegTipoDocumentoId').val() == 2) {
        $('#ddlTipoComprobante').removeAttr('disabled');
    }
}
function CambioTipoComprobantePagador() {
    $('#ddlTipoComprobante').val(1);

    if ($('#ContraTipoPersonaId').val() == 1 && $('#ContraTipoDocumentoId').val() != 2) {
        $('#ddlTipoComprobante').val(1);
        $("#ddlTipoComprobante").attr('disabled', 'disabled');
    }

    if ($('#ContraTipoPersonaId').val() == 2 && $('#ContraTipoDocumentoId').val() == 2) {
        $('#ddlTipoComprobante').val(2);
        $("#ddlTipoComprobante").attr('disabled', 'disabled');
    }

    if ($('#ContraTipoPersonaId').val() == 1 && $('#ContraTipoDocumentoId').val() == 2) {
        $('#ddlTipoComprobante').removeAttr('disabled');
    }
}
//FIN RQ2024-664

$("#rbtnPlacaNacional").click("click", function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        $("#comboZonaFronteriza").hide();
        $("#lnkCambiarPlaca").click();
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / rbtnPlacaNacional", e);
        return;
    }
});

$("#rbtnPlacaExtranjera").click("click", function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        $("#comboZonaFronteriza").show();
        $("#lnkCambiarPlaca").click();
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / rbtnPlacaNacional", e);
        return;
    }
});

$("#rbtnNoTitularVehiculo").click("click", function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        ControlesNoTitularVehiculo();
        $("#ComprobantePagoANombreAsegurado").val(false);
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / rbtnNoTitularVehiculo", e);
        return;
    }
});
$("#rbtnSiTitularVehiculo").click("click", function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        $("#lnkLimpiarBusquedaContextualContra").click(); //RQ2022-254
        LimpiarControlesContratante();
        ControlesSiTitularVehiculo();
        $("#ComprobantePagoANombreAsegurado").val(true);
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / rbtnSiTitularVehiculo", e);
        return;
    }
});
$("#lnkBusqContratante").click("click", function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        validador(true);//RQ2022-254
        if ($("#findSection1").val() == '0') {
            validador(false);//RQ2022-254
            alertValida("VEHICULO: Por favor realice una búsqueda de placa.");
            return false;
        }
        if (validarSeccionVeh() == false) {
            validador(false);//RQ2022-254
            return false;
        }
        if ($("#ContraTipoPersonaId").val() == "") {
            alertValida("RESPONSABLE DE PAGO: Debe seleccionar el tipo de persona.");
            $('#ContraTipoPersonaId').focus();
            return false;
        }
        if ($("#ContraTipoDocumentoId").val() == "") {
            alertValida("RESPONSABLE DE PAGO: Debe seleccionar el tipo de documento.");
            $('#ContraTipoDocumentoId').focus();
            return false;
        }
        if ($("#ContraNumeroDocumento").val() == "") {
            alertValida("RESPONSABLE DE PAGO: Debe de ingresar un número de documento.");
            $('#ContraNumeroDocumento').focus();
            return false;
        }
        if ($("#ContraTipoDocumentoId").val() === "1" && $.trim($("#ContraNumeroDocumento").val()).length !== 8) {
            alertValida("RESPONSABLE DE PAGO: El número de documento debe ser de 8 dígitos para DNI.");
            $('#ContraNumeroDocumento').focus();
            return false;
        }
        if ($("#ContraTipoDocumentoId").val() === "2" && $.trim($("#ContraNumeroDocumento").val()).length !== 11) {
            alertValida("RESPONSABLE DE PAGO: El número de documento debe ser de 11 dígitos para RUC.");
            $('#ContraNumeroDocumento').focus();
            return false;
        }
        if ($('#ContraTipoPersonaId').val() == '1' && $('#ContraTipoDocumentoId').val() == '2') {
            var tipoCaracter = $("#ContraNumeroDocumento").val().trim();
            if (tipoCaracter.substring(0, 2) != '10') {
                alertValida("RESPONSABLE DE PAGO: Por favor ingrese un número de ruc válido.");
                return false;
            }
        }
        if ($('#ContraTipoPersonaId').val() == '2' && $('#ContraTipoDocumentoId').val() == '2') {
            var tipoCaracter = $("#ContraNumeroDocumento").val().trim();
            if (tipoCaracter.substring(0, 2) != '20') {
                alertValida("RESPONSABLE DE PAGO: Por favor ingrese un número de ruc válido.");
                return false;
            }
        }

        if ($('#ContraNumeroDocumento').val().indexOf(" ") !== -1) {
            alertValida("RESPONSABLE DE PAGO: El número de documento no puede contener espacios en blanco");
            $('#AsegNumeroDocumento').focus();
            return false;
        }
        var control = false;
        control = ConsultaClienteContratante($("#ContraNumeroDocumento").val(), $("#ContraTipoDocumentoId :selected").val(), $("#ContraTipoPersonaId :selected").val(), $("#ComercializadorDni").val(), $("#AplicacionId").val(), "0", $("#hiddenCodigoClienteContextualContra").val());

        if (control == true) {
            ControlesBusqContratante();

            //INI RQ2024-664
            if ($('#ddlTipoComprobante').length == 1) {
                if (document.getElementsByName('titular')[1].checked) {
                    CambioTipoComprobantePagador();
                }
            }
            //FIN RQ2024-664
        }
        return false;
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / lnkBusqContratante", e);
        return;
    }
});
function validarFormatoDePlaca(cadena) { //PE2025-72
    let regex = /^(?! )(?!.* $)(?!.*--)(?!.*  )[A-Za-z0-9-. ]{1,10}$/;
    return regex.test(cadena);
}
function escogerOpcionFormato() {
    let tipoFormatoPlacaFront = 0;
    tipoFormatoPlacaFront = (document.getElementById('rbtnPlacaNacional').checked ? 1 : document.getElementById('rbtnPlacaExtranjera').checked ? 2 : 0);

    return tipoFormatoPlacaFront;
}
function escogerZonaFornteriza() {
    let tipoZonaFront = 0;
    tipoZonaFront = ($("#ddlZonaFronteriza option:selected").val() == 0 ? false : true);

    return tipoZonaFront;
}
$("#lnkBusqPlaca").click("click", function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    var cadenaplaca = $("#NumeroPlaca").val();
    try {

        if ($('#rbtnPlacaNacional').length == 1 && $('#rbtnPlacaExtranjera').length == 1) {
            if (escogerOpcionFormato() == 0) {
                alertValida("Debe escoger entre Placa Nacional o Extranjera.");
                $("#NumeroPlaca").val('');
                return;
            }
            else if (escogerOpcionFormato() == 2) {
                if (!escogerZonaFornteriza()) {
                    alertValida("Debe escoger una zona fronteriza.");
                    $("#NumeroPlaca").val('');
                    return;
                }
            }
        }

        if (!validarFormatoDePlaca(cadenaplaca)) //PE2025-72
        {
            alertValida("La placa ingresada no tiene un formato válido.");
            $("#NumeroPlaca").val('');
            return;
        }

        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        var PlacaMay = $("#NumeroPlaca").val().toUpperCase().trim();
        $("#NumeroPlaca").val(PlacaMay);

        var modalidadVenta = 0;

        if ($("#hdnFlagFisico").val() === "1") {
            if (document.getElementById("rbtnModaliadVentaTradicional").checked == true) {
                modalidadVenta = 1;
            }
        }
        else {
            $("#rbtnModaliadVentaDigital").click();
        }

        var urlAux = 'Ventas/ContarModalidad';
        var resultado = 0;
        if (idFlagEndoso == 1) { urlAux = 'ContarModalidad'; }
        $.ajax({
            dataType: "json",
            url: urlAux,
            data: { Modalidad: modalidadVenta },
            async: true,
            cache: true,
            success: function (data) {
                resultado = data;
                if (resultado < 1) {
                    alertValida("No existen polizas para la Modalidad elegida.");
                }
                else {
                    var esPlacaEnTramite = $("#NumeroPlaca").val().toUpperCase() == 'P/T' || $("#NumeroPlaca").val().toUpperCase() == 'X9X-999' ? 1 : 0;
                    if (esPlacaEnTramite == 0) {
                        if ($("#NumeroPlaca").val() == "") {
                            alertValida("VEHICULO: Por favor realice una búsqueda de placa.");
                            $('#NumeroPlaca').focus();
                            return false;
                        }
                    }
                    $("#primerGrpVehi").hide();
                    $("#segundoGrpVehi").hide();
                    $("#tercerGrpVehi").hide();
                    $("#cuartoGrpVehi").hide();
                    LimpiarDatosCertificado();
                    if ($('#trCotizacion').is(':visible')) {
                        cargaCotizacion("", $("#NumeroPlaca").val());
                    } else {
                        ObtenerInformacionPlaca($("#hdnTipoPlaca").val(), $("#NumeroPlaca").val().toUpperCase(), $("#Ramo").val(), esPlacaEnTramite);
                    }
                }
            }
        });

        return false;
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / lnkBusqPlaca", e);
        return;
    }
});
$("#lnkBusqEndoso").click("click", function () {
    try {
        var poliza = $('#idEndosoPoliza').val();
        if (poliza == '') {
            alertValida("ENDOSO: Ingrese un número de póliza.");
        } else {
            ObtenerEndoso(poliza);
        }
    }
    catch (e) {
        GrabaMensajeErrorVista('ENDOSO', "Ventas.js / lnkBusqEndoso", e);
        return;
    }
});
$("#lnkObtenerTarjetaFormaPago").click("click", function () {
    try {
        var _Tarjeta = $('#NumeroTarjeta2').val();
        if (_Tarjeta.match(/^4\d{3}-?\d{4}-?\d{4}-?\d{4}$/)) {
            $('#TipoTarjetaID2').val('10');
        }
        else if (_Tarjeta.match(/^5[1-5]\d{2}-?\d{4}-?\d{4}-?\d{4}$/)) {
            $('#TipoTarjetaID2').val('12');
        }
        else if (_Tarjeta.match(/^(?:3[47][0-9]{13})$/)) {
            $('#TipoTarjetaID2').val('14');
        }
        else if (_Tarjeta.match(/^(?:3(?:0[0-5]|[68][0-9])[0-9]{11})$/)) {
            $('#TipoTarjetaID2').val('15');
        }
        else {
            $('#TipoTarjetaID2').val('');
        }
        if ($('#TipoTarjetaID2').val() == '10') {
            var _visa = $('#NumeroTarjeta2').val();
            if (!_visa.match(/^4\d{3}-?\d{4}-?\d{4}-?\d{4}$/)) {
                alertValida('AFILIACIÓN DE RENOVACIÓN: El número de tarjeta ingresado, no es un número de Visa correcto.');
                return false;
            }
        }
        if ($('#TipoTarjetaID2').val() == '12') {
            var _mastercard = $('#NumeroTarjeta2').val();
            if (!_mastercard.match(/^5[1-5]\d{2}-?\d{4}-?\d{4}-?\d{4}$/)) {
                alertValida('AFILIACIÓN DE RENOVACIÓN: El número de tarjeta ingresado, no es un número de MASTERCARD correcto.');
                return false;
            }
        }
        if ($('#TipoTarjetaID2').val() == '14') {
            var _americanexpress = $('#NumeroTarjeta2').val();
            if (!_americanexpress.match(/^(?:3[47][0-9]{13})$/)) {
                alertValida('AFILIACIÓN DE RENOVACIÓN: El número de tarjeta ingresado, no es un número de AMERICAN EXPRESS correcto.');
                return false;
            }
        }
        if ($('#TipoTarjetaID2').val() == '15') {
            var _dinnersclub = $('#NumeroTarjeta2').val();
            if (!_dinnersclub.match(/^(?:3(?:0[0-5]|[68][0-9])[0-9]{11})$/)) {
                alertValida('AFILIACIÓN DE RENOVACIÓN: El número de tarjeta ingresado, no es un número de DINNERS CLUB correcto.');
                return false;
            }
        }
        var nroTarjeta = $("#NumeroTarjeta2").val();
        $.ajax({
            url: nameAplicativo + "Ventas/ConsultaNroTarjetaAfiliacion",
            type: 'Get',
            async: true,
            cache: true,
            data: {
                nroTarjeta: nroTarjeta
            },
            success: function (data) {
                if (data.Valid == false) {
                    alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                    return;
                }
                if (data.IsValid == false) {
                    alertValida(data.ErrorMessage);
                    $("#idBancoPagoVirtual2").removeAttr("disabled");
                    $('#idBancoPagoVirtual2 option')[0].selected = true;
                    $('#TipoTarjetaID2').removeAttr("disabled");
                    $('#idTipoPos').removeAttr("disabled");
                    $("#idBancoPagoVirtual2").removeAttr("disabled");
                }
                console.debug();
                var flagValidaTarjetacredito = $("#hdnFlagValidaTarjetaCredito").val();
                if (data.IsValid == true) {
                    $("#idBancoPagoVirtual2").val(data.IdBanco);
                    $("#idBancoPagoVirtual2").attr('disabled', 'disabled');
                    $("#NumeroTarjeta2").attr('readOnly', true);
                    $("#NumeroTarjeta2").attr('disabled', 'disabled');
                }
                $('#Cod_FormaPagoID2 option')[2].selected = true;
            },
            error: function () {
                alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk.");
            }
        });
        return false;
    }
    catch (e) {
        GrabaMensajeErrorVista('VENTAS_INDIVIDUALES', "Ventas.js / lnkObtenerTarjetaFormaPago", e);
        return;
    }
});
$("#lnkObtenerTarjetaFormaPagoVirtual").click("click", function () {
    try {
        if ($('#TipoTarjetaID').val() == '') {
            alertValida('FORMA DE PAGO: Debe seleccionar el tipo de tarjeta. ( VISA, MASTERCARD, etc.)');
            $('#TipoTarjetaID').focus();
            return false;
        }
        if ($('#TipoTarjetaID').val() == '10') {
            var _visa = $('#NumeroTarjeta').val();
            if (!_visa.match(/^4\d{3}-?\d{4}-?\d{4}-?\d{4}$/)) {
                alertValida('FORMA DE PAGO: El número de tarjeta ingresado, no es un número de Visa correcto.');
                return false;
            }
        }
        if ($('#TipoTarjetaID').val() == '12') {
            var _mastercard = $('#NumeroTarjeta').val();
            if (!_mastercard.match(/^5[1-5]\d{2}-?\d{4}-?\d{4}-?\d{4}$/)) {
                alertValida('FORMA DE PAGO: El número de tarjeta ingresado, no es un número de MASTERCARD correcto.');
                return false;
            }
        }
        if ($('#TipoTarjetaID').val() == '14') {
            var _americanexpress = $('#NumeroTarjeta').val();
            if (!_americanexpress.match(/^(?:3[47][0-9]{13})$/)) {
                alertValida('FORMA DE PAGO: El número de tarjeta ingresado, no es un número de AMERICAN EXPRESS correcto.');
                return false;
            }
        }
        if ($('#TipoTarjetaID').val() == '15') {
            var _dinnersclub = $('#NumeroTarjeta').val();
            if (!_dinnersclub.match(/^(?:3(?:0[0-5]|[68][0-9])[0-9]{11})$/)) {
                alertValida('FORMA DE PAGO: El número de tarjeta ingresado, no es un número de DINNERS CLUB correcto.');
                return false;
            }
        }
        var nroTarjeta = $("#NumeroTarjeta").val();
        $.ajax({
            url: nameAplicativo + "Ventas/ConsultaNroTarjetaAfiliacion",
            type: 'Get',
            async: true,
            cache: true,
            data: {
                nroTarjeta: nroTarjeta
            },
            success: function (data) {
                if (data.Valid == false) {
                    alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                    return;
                }
                console.debug();
                if (data.IsValid == true) {
                    $("#idBancoPagoVirtual").val(data.IdBanco);
                    $("#idBancoPagoVirtual").attr('disabled', 'disabled');
                    if (data.HabilitarTipoTarjeta == "1") {
                        $("#Cod_TipoPago").removeAttr("disabled");
                    } else {
                        $("#Cod_TipoPago").val(data.IdTipoTarjeta);
                        $("#Cod_TipoPago").attr('disabled', 'disabled');
                    }
                    $("#NumeroTarjeta").attr('readOnly', true);
                    $("#NumeroTarjeta").attr('disabled', 'disabled');
                } else {
                    alertValida(data.ErrorMessage);
                    $('#Cod_TipoPago option')[0].selected = true;
                    $('#idBancoPagoVirtual option')[0].selected = true;
                    $("#Cod_TipoPago").removeAttr("disabled");
                    $("#idBancoPagoVirtual").removeAttr("disabled");
                }
            },
            error: function () {
                alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk.");
            }
        });
        return false;
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / lnkObtenerTarjetaFormaPagoVirtual", e);
        return;
    }
});
$("#lnkLimpiarFPVirtual").click("click", function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        $("#NumeroTarjeta").val('');
        $("#NumeroTarjeta").removeAttr('readOnly');
        $("#NumeroTarjeta").removeAttr('disabled');
        event.preventDefault();
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / lnkLimpiarFPVirtual", e);
        return;
    }
});
$("#lnkLimpiarAfiliacion").click("click", function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        $("#NumeroTarjeta2").val('');
        $('#TipoTarjetaID2').val('');
        $('#Cod_FormaPagoID2').val('');
        $('#idBancoPagoVirtual2').val('00');
        $("#NumeroTarjeta2").removeAttr('readOnly');
        $("#NumeroTarjeta2").removeAttr('disabled');
        $("#idBancoPagoVirtual2").attr('disabled', 'disabled');
        $("#Cod_FormaPagoID2").attr('disabled', 'disabled');
        $("#TipoTarjetaID2").attr('disabled', 'disabled');
        $("#NumeroTarjeta2").focus();
        event.preventDefault();
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / lnkLimpiarAfiliacion", e);
        return;
    }
});
$("#FechaInicioVigencia").blur(function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        LimpiarDatosCertificado();
        var fechaActual = new Date();
        var fechaHoy = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate());
        var fechaform = $("#FechaInicioVigencia").val().trim();
        var esPlacaEnTramite = $("#NumeroPlaca").val().toUpperCase() == 'P/T' ? 1 : 0;
        if (fechaform == '') {
            CalcularVigenciaDefault();
            if (esPlacaEnTramite == 0) {
                var Placa = $("#NumeroPlaca").val().trim();
                var Fecha = $("#FechaInicioVigencia").val();
                var result = '';
                $.ajax({
                    url: "Ventas/CalcularFinVigencia",
                    type: 'Get',
                    data: {
                        pPlaca: Placa,
                        pFechaInicio: Fecha
                    },
                    async: false,
                    cache: false,
                    success: function (data) {
                        if (data.IsValid == false) {
                            alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                            return;
                        }
                        if (data.resultado != '') {
                            if (data.resultado != '01/01/0001') {
                                $("#FechaInicioVigencia").val(data.resultado);
                            }
                        }
                    },
                    error: function () {
                        alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk.");
                    }
                });
            }
        }
        else {
            var dataSplit = fechaform.split('/');
            var fechaIni = new Date(dataSplit[2], dataSplit[1] - 1, dataSplit[0]);
            var IniSplit = $("#VigMin").val().split('/');
            var IniVig = new Date(IniSplit[2], IniSplit[1] - 1, IniSplit[0]);
            var FinSplit = $("#VigMax").val().split('/');
            var FinVig = new Date(FinSplit[2], FinSplit[1] - 1, FinSplit[0]);
            if (fechaIni < IniVig) {
                alertValida("Inicio Vigencia no puede ser menor a " + $("#VigMin").val());
                return false;
            }
            if (fechaIni > FinVig) {
                alertValida("Inicio Vigencia no puede ser mayor a " + $("#VigMax").val());
                return false;
            }
            CalcularVigenciaDefault();
        }

        $("#TarifMonedaDescLabel").text('');
        $("#TarifMontoTarifaLabel").text('');
        $("#CalcMontoLabel").text('');
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / ", e);
        return;
    }
});

$('.modal-content-vw').css({
    top: ($('.ddcss3support').height() - $('.modal-content-vw').outerHeight()) / 2
});

function ContarModalidad() {
    var urlAux = 'Ventas/ContarModalidad';
    var idFlagEndoso = $("#divEndoso").data('value');
    if (idFlagEndoso == 1) { urlAux = 'ContarModalidad'; }
    var modalidadVenta = 0;
    if ($("#rbtnModaliadVentaTradicional").prop("checked")) {
        modalidadVenta = 1;
    }
    var resultado = 0;
    $.ajax({
        dataType: "json",
        url: urlAux,
        data: { Modalidad: modalidadVenta },
        async: false,
        success: function (data) {
            resultado = data;
        }
    });
    return resultado;
};
function VerificarValorDoc(IdTipo, evento) {
    try {
        var validaNumber = false;
        var sTipOrigen = $('#AsegTipoDocumentoId').val();
        if (IdTipo != 1) {
            sTipOrigen = $('#ContraTipoDocumentoId').val();
        }
        switch (sTipOrigen) {
            case "1": //DNI
                validaNumber = true;
                break;
            case "2": //RUC
                validaNumber = true;
                break;
            default:  //OTROS
                validaNumber = false;
                break;
        }

        if (validaNumber == true) {
            var key = evento.keyCode || evento.which;
            key = String.fromCharCode(key);
            var regex = /[0-9]|\./;
            if (!regex.test(key)) {
                evento.returnValue = false;
                if (evento.preventDefault) evento.preventDefault();
            }
        }
        return false;
    }
    catch (e) {
        throw e;
    }
}
function ConsultaProvinciasPorFiltro(elementoCombo, departamentoId) {
    try {
        var ddlfProvincia = document.getElementById(elementoCombo);
        ddlfProvincia.options.length = 0;
        ddlfProvincia.options[0] = new Option("--Seleccione--", "");
        ddlfProvincia.selectedIndex = 0;
        ddlfProvincia.disabled = true;
        var urlAux = 'Ventas/ObtenerProvincias';
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { urlAux = 'ObtenerProvincias'; }
        $.ajax({
            url: urlAux,
            type: 'Get',
            data: {
                pDepartamentoId: departamentoId
            },
            async: false,
            cache: false,
            success: function (data) {
                if (data.IsValid == false) {
                    alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                    return;
                }
                $.each(data, function (i, row) {
                    ddlfProvincia.options[i + 1] = new Option(row.DescripcionProvincia, row.ProvinciaId);

                });
                ddlfProvincia.disabled = false;
            },
            error: function () {
                alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk.");
            }
        });
    }
    catch (e) {
        throw e;
    }
};
function ConsultaDistritosPorFiltro(elementoCombo, departamentoId, provinciaId) {
    try {
        var ddlfDistrito = document.getElementById(elementoCombo);
        ddlfDistrito.options.length = 0;
        ddlfDistrito.options[0] = new Option("--Seleccione--", "");
        ddlfDistrito.selectedIndex = 0;
        ddlfDistrito.disabled = true;
        var urlAux = 'Ventas/ObtenerDistritos';
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { urlAux = 'ObtenerDistritos'; }
        $.ajax({
            url: urlAux,
            type: 'Get',
            data: {
                pDepartamentoId: departamentoId,
                pProvinciaId: provinciaId
            },
            async: false,
            cache: false,
            success: function (data) {
                if (data.IsValid == false) {
                    alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                    return;
                }
                $.each(data, function (i, row) {
                    ddlfDistrito.options[i + 1] = new Option(row.DescripcionDistrito, row.DistritoId);
                });
                ddlfDistrito.disabled = false;
            },
            error: function () {
                alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk.");
            }
        });
    }
    catch (e) {
        throw e;
    }
};
function bootstrapConfirm(mensaje, functioncall) {
    var $textAndPic = $('<div></div>');
    $textAndPic.append(' <i class="icono_alerta_modal"><img src="../../Images/iconos/color/icono-alerta.png" alt=""></i> ');
    $textAndPic.append('<div class="content_texto_modal"><span class="error-msg">' + mensaje + '</span></div>');

    BootstrapDialog.confirm({
        title: 'Confirmación',
        message: $textAndPic,
        type: BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
        closable: true, // <-- Default value is false
        draggable: false, // <-- Default value is false
        icon: 'glyphicon glyphicon-check',
        btnOKLabel: 'Confirmar', // <-- Default value is 'OK',
        btnCancelLabel: 'Cancelar', // <-- Default value is 'Cancel',
        btnOKClass: 'btn-principal', // <-- If you didn't specify it, dialog type will be used,
        callback: function (result) {
            // result will be true if button was click, while it will be false if users close the dialog directly.
            if (result) {
                window[functioncall]();
            }
        }
    });
}
function LimpiarDatosCertificado() {
    try {
        $("#TarifDescripcionTarifa").val('');
        $("#TarifTipoCambio").val('');
        $("#TarifMontoTarifa").val('');
        $("#TarifaId").val('');
        $("#TarifMontoTarifaLabel").val('');
        $("#TarifMonedaDescLabel").val('');
        $("#TarifMonedaDesc").val('');
        $("#CodigoFormulario").val('');
        $("#CalcMonto").val('');
        $("#CalcMonto").html("");
        $("#TarifMonedaDescLabel").html("");
        $("#TarifMontoTarifaLabel").html("");
        $("#TipoCambioLabel").html("");
        $("#CalcMontoLabel").html("");
        var _ddlMonedaLst = document.getElementById("ddlMonedaLst");
        _ddlMonedaLst.selectedIndex = 0;
    }
    catch (e) {
        throw e;
    }
};
function LimpiarDatosVehiAlSelMarca() {
    try {
        $("#ModeloId").children('option:not(:first)').remove();
        $("#VersionId").children('option:not(:first)').remove();
    }
    catch (e) {
        throw e;
    }
};
function ConsultaModelosPorFiltro(claseId, marcaId, fechaInicioVigencia, ModeloId, tipo) {
    try {
        var ddlfModelos = document.getElementById("ModeloId");
        var datalenght = 0;
        var modelotmp = 0;
        var idtmp = 0;
        ddlfModelos.options.length = 0;
        ddlfModelos.options[0] = new Option("--Seleccione--", "");
        ddlfModelos.selectedIndex = 0;
        ddlfModelos.disabled = true;
        var urlAux = 'Ventas/ObtenerModelos';
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { urlAux = 'ObtenerModelos'; }
        $.ajax({
            url: urlAux,
            type: 'Get',
            data: {
                pClaseId: claseId,
                pMarcaId: marcaId,
                pFechaInicioVigencia: fechaInicioVigencia
            },
            async: tipo,
            cache: false,
            success: function (data) {
                if (data.IsValid == false) {
                    alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                    return;
                }
                if (data.EsFraude === true) {
                    alertValida("Se encontró alteraciones externas en el sistema.");
                    document.location.href = "/Home/Index";
                    return;
                }
                datalenght = data.length;
                $.each(data, function (i, row) {
                    ddlfModelos.options[i + 1] = new Option(row.DescripcionModelo, row.ModeloId);
                    idtmp = row.ModeloId;
                    if (row.ModeloId == ModeloId) {
                        modelotmp = i + 1
                    }
                });
                if (datalenght == 1) {
                    ddlfModelos.selectedIndex = 1;
                    ConsultaVersionesPorFiltro(claseId, marcaId, idtmp, fechaInicioVigencia, 0)
                }
                else {
                    if (modelotmp > 0) {
                        ddlfModelos.selectedIndex = modelotmp;
                    }
                }
                ddlfModelos.disabled = false;
            },
            error: function () {
                alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk.");
            }
        });
    }
    catch (e) {
        throw e;
    }
};
function ConsultaVersionesPorFiltro(claseId, marcaId, modeloId, fechaInicioVigencia, VersionId) {
    try {
        var ddlfVersiones = document.getElementById("VersionId");
        var datalenght = 0;
        var versiontmp = 0;
        ddlfVersiones.options.length = 0;
        ddlfVersiones.options[0] = new Option("--Seleccione--", "");
        ddlfVersiones.selectedIndex = 0;
        ddlfVersiones.disabled = true;
        var urlAux = 'Ventas/ObtenerVersiones';
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { urlAux = 'ObtenerVersiones'; }
        $.ajax({
            url: urlAux,
            type: 'Get',
            data: {
                pClaseId: claseId,
                pMarcaId: marcaId,
                pModeloId: modeloId,
                pFechaInicioVigencia: fechaInicioVigencia
            },
            async: false,
            cache: false,
            success: function (data) {
                if (data.IsValid == false) {
                    alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                    return;
                }
                if (data.EsFraude === true) {
                    alertValida("Se encontró alteraciones externas en el sistema.");
                    document.location.href = "/Home/Index";
                    return;
                }
                datalenght = data.length;
                $.each(data, function (i, row) {
                    ddlfVersiones.options[i + 1] = new Option(row.DescripcionVersion, row.VersionId);
                    if (row.VersionId == VersionId) {
                        versiontmp = i + 1;
                    }
                });
                if (datalenght == 1) {
                    ddlfVersiones.selectedIndex = 1;
                }
                else {
                    if (versiontmp > 0) {
                        ddlfVersiones.selectedIndex = versiontmp;
                    }
                }
                ddlfVersiones.disabled = false;
            },
            error: function () {
                alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk.");
            }
        });
    }
    catch (e) {
        throw e;
    }
};
function LimpiarDatosVehiAlSelModelo() {
    try {
        $("#VersionId").children('option:not(:first)').remove();
    }
    catch (e) {
        throw e;
    }
};
function LimpiarDatosVehiAlSelClase() {
    try {
        $("#UsoId").children('option:not(:first)').remove();
        $("#MarcaId").children('option:not(:first)').remove();
        $("#ModeloId").children('option:not(:first)').remove();
        $("#VersionId").children('option:not(:first)').remove();
        $("#CatId").children('option:not(:first)').remove();
    }
    catch (e) {
        throw e;
    }
};
function ConsultaCatsPorFiltro(claseId, idCat) {
    try {
        var ddlfCats = document.getElementById("CatId");
        var datalenght = 0;
        ddlfCats.options.length = 0;
        ddlfCats.options[0] = new Option("--Seleccione--", "0");
        ddlfCats.selectedIndex = 0;
        ddlfCats.disabled = true;
        var urlAux = 'Ventas/ObtenerCats';
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { urlAux = 'ObtenerCats'; }
        $.getJSON(
            urlAux,
            {
                pClaseId: claseId
            },
            function (data) {
                if (data.IsValid == false) {
                    alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                    return;
                }
                datalenght = data.length;
                $.each(data, function (i, row) {
                    ddlfCats.options[i + 1] = new Option(row.DescripcionCat, row.CatId);
                });
                if (datalenght == 1) {
                    ddlfCats.selectedIndex = 1;
                }
                ddlfCats.disabled = false;
            });
    }
    catch (e) {
        throw e;
    }
};
function ConsultaUsosPorFiltro(claseId, intermediarioId, sIntermediario, sRol, idUso) {
    try {
        var ddlfUsos = document.getElementById("UsoId");
        var datalenght = 0;
        ddlfUsos.options.length = 0;
        ddlfUsos.options[0] = new Option("--Seleccione--", "0");
        ddlfUsos.selectedIndex = 0;
        ddlfUsos.disabled = true;
        var urlAux = 'Ventas/ObtenerUsos';
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { urlAux = 'ObtenerUsos'; }
        var FlagPlacaEnTramite = 0;
        if ($("#NumeroPlaca").val().toUpperCase() == 'P/T') { FlagPlacaEnTramite = 1; }
        if ($("#NumeroPlaca").val().toUpperCase() == 'X9X-999') { FlagPlacaEnTramite = 1; }
        $.ajax({
            url: urlAux,
            type: 'Get',
            data: {
                pClaseId: claseId,
                pIntermediarioId: intermediarioId,
                pIntermediario: sIntermediario,
                pRol: sRol,
                pEsPlacaEnTramite: FlagPlacaEnTramite
            },
            async: false,
            cache: false,
            success: function (data) {
                if (data.IsValid == false) {
                    alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                    return;
                }
                datalenght = data.length;
                $.each(data, function (i, row) {
                    ddlfUsos.options[i + 1] = new Option(row.DescripcionUso, row.UsoId);
                });
                if (datalenght == 1) {
                    ddlfUsos.selectedIndex = 1;
                }
                ddlfUsos.disabled = false;
                $('#UsoId').val(idUso);
            },
            error: function () {
                alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk.");
            }
        });
    }
    catch (e) {
        throw e;
    }
};
function ConsultaMarcasPorFiltro(claseId, fechaInicioVigencia, MarcaId, tipo) {
    try {
        var ddlfMarcas = document.getElementById("MarcaId");
        var datalenght = 0;
        var marcatmp = 0;
        ddlfMarcas.options.length = 0;
        ddlfMarcas.options[0] = new Option("--Seleccione--", "");
        ddlfMarcas.selectedIndex = 0;
        ddlfMarcas.disabled = true;
        var urlAux = 'Ventas/ObtenerMarcas';
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { urlAux = 'ObtenerMarcas'; }
        $.ajax({
            url: urlAux,
            type: 'Get',
            data: {
                pClaseId: claseId,
                pFechaInicioVigencia: fechaInicioVigencia,
                pPlaca: $("#NumeroPlaca").val().toUpperCase(),
                pTipoPlaca: $("#hdnTipoPlaca").val()
            },
            async: tipo,
            cache: false,
            success: function (data) {
                if (data.IsValid == false) {
                    alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                    return;
                }
                if (data.EsFraude === true) {
                    alertValida("Se encontró alteraciones externas en el sistema.");
                    document.location.href = "/Home/Index";
                    return;
                }
                datalenght = data.length;
                $.each(data, function (i, row) {
                    ddlfMarcas.options[i + 1] = new Option(row.DescripcionMarca, row.MarcaId);
                    if (row.MarcaId == MarcaId) {
                        marcatmp = i + 1;
                    }
                });
                if (datalenght == 1) {
                    ddlfMarcas.selectedIndex = 1;
                    ConsultaModelosPorFiltro(claseId, $("#MarcaId").val(), $("#FechaInicioVigencia").val(), 0, false);
                }
                else {
                    if (marcatmp > 0) {
                        ddlfMarcas.selectedIndex = marcatmp;
                    }
                }
                ddlfMarcas.disabled = false;
            },
            error: function () {
                alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk.");
            }
        });
    }
    catch (e) {
        throw e;
    }
};
function VerificarLongitudDoc(IdTipo, ctrl) {
    try {
        var sLenghtDefault = 12;
        var sLenghtDoc = 0;
        ctrl.val('');
        switch (IdTipo) {
            case "1": //DNI
                sLenghtDoc = 8;
                break;
            case "2": //RUC
                sLenghtDoc = 11;
                break;
            case "23": //CARNET IDENTIDAD
                sLenghtDoc = 9;
                break;
            case "34":  //CARNET EXTRANJERIA
                sLenghtDoc = sLenghtDefault;
                break;
            case "78":  //OTROS
                sLenghtDoc = sLenghtDefault;
                break;
            default:  //OTROS
                sLenghtDoc = sLenghtDefault;
                break;
        }
        ctrl.attr('maxlength', sLenghtDoc);
        return false;
    }
    catch (e) {
        throw e;
    }
}
function ConsultaTiposDocumentoAseguradoPorFiltro(tipoPersonaId) {
    try {
        var ddlfTipoDocumento = document.getElementById("AsegTipoDocumentoId");
        ddlfTipoDocumento.options.length = 0;
        ddlfTipoDocumento.options[0] = new Option("--Seleccione--", "");
        ddlfTipoDocumento.selectedIndex = 0;
        ddlfTipoDocumento.disabled = true;

        var urlAux = 'Ventas/ObtenerTiposDocumento';
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { urlAux = 'ObtenerTiposDocumento'; }

        $.ajax({
            url: urlAux,
            type: 'Get',
            data: {
                pTipoPersonaId: tipoPersonaId
            },
            async: false,
            cache: false,
            success: function (data) {
                if (data.IsValid == false) {
                    alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                    return;
                }
                $.each(data, function (i, row) {
                    ddlfTipoDocumento.options[i + 1] = new Option(row.DescripcionTipoDocumento, row.TipoDocumentoId);
                });
                ddlfTipoDocumento.disabled = false;
            },
            error: function () {
                alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk.");
            }
        });
    }
    catch (e) {
        throw e;
    }
};
function SeleccionarDocumentoDefault() {
    try {
        if ($.trim($("#AsegTipoPersonaId").val()) === "1") {
            $("#AsegTipoDocumentoId").val('1');
        }
        if ($.trim($("#AsegTipoPersonaId").val()) === "2") {
            $("#AsegTipoDocumentoId").val('2');
        }

        return VerificarLongitudDoc($("#AsegTipoDocumentoId").val(), $("#AsegNumeroDocumento"))
    }
    catch (e) {
        throw e;
    }
}
function ConsultaTiposDocumentoContratantePorFiltro(tipoPersonaId) {
    try {
        var ddlfTipoDocumento = document.getElementById("ContraTipoDocumentoId");
        ddlfTipoDocumento.options.length = 0;
        ddlfTipoDocumento.options[0] = new Option("--Seleccione--", "");
        ddlfTipoDocumento.selectedIndex = 0;
        ddlfTipoDocumento.disabled = true;
        var urlAux = 'Ventas/ObtenerTiposDocumento';
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { urlAux = 'ObtenerTiposDocumento'; }

        $.ajax({
            url: urlAux,
            type: 'Get',
            data: {
                pTipoPersonaId: tipoPersonaId
            },
            async: false,
            cache: false,
            success: function (data) {
                if (data.IsValid == false) {
                    alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                    return;
                }
                $.each(data, function (i, row) {
                    ddlfTipoDocumento.options[i + 1] = new Option(row.DescripcionTipoDocumento, row.TipoDocumentoId);

                });
                ddlfTipoDocumento.disabled = false;
            },
            error: function () {
                alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk.");
            }
        });
    }
    catch (e) {
        throw e;
    }
};
function SeleccionarDocumentoDefaultContratante() {
    try {
        if ($.trim($("#ContraTipoPersonaId").val()) === "1") {
            $("#ContraTipoDocumentoId").val('1');
        }
        if ($.trim($("#ContraTipoPersonaId").val()) === "2") {
            $("#ContraTipoDocumentoId").val('2');
        }

        return VerificarLongitudDoc($("#ContraTipoDocumentoId").val(), $("#ContraNumeroDocumento"))
    }
    catch (e) {
        throw e;
    }
}
function ControlesCambiarPlaca() {
    try {
        DesbloquearControlesBusquedaPlaca();
        $("#NumeroPlaca").val('');
        $("#NumeroSerie").val('');
        $("#ModeloEspecifico").val('');
        $("#NumeroAsiento").val('');
        $("#Año").val('');
        $("#ClaseId").prop("selectedIndex", 0);
        $("#UsoId").children().remove();
        $("#UsoId").prop("selectedIndex", 0);
        $("#CatId").children().remove();
        $("#CatId").prop("selectedIndex", 0);
        $("#MarcaId").children().remove();
        $("#ModeloId").children().remove();
        $("#VersionId").children().remove();
        $("#chkTramite").prop('checked', false);
        $("#lnkBusqPlaca").removeAttr("disabled");
        $("#chkTramite").removeAttr("disabled");
        $("#NumeroPlaca").removeAttr("disabled");
        $("#primerGrpVehi").hide();
        $("#segundoGrpVehi").hide();
        $("#tercerGrpVehi").hide();
        $("#cuartoGrpVehi").hide();
        $("#NumeroPlaca").focus();
    }
    catch (e) {
        throw e;
    }
};
function DesbloquearControlesBusquedaPlaca() {
    try {
        $("#NumeroPlaca").removeAttr("readOnly");
    }
    catch (e) {
        throw e;
    }
};
function LimpiarControlesAsegurado() {
    try {

        //RQ2019-602 - EGALICIA - 11/08/2019 
        LimpiarControlesPerfilamiento("GrpAsegu");

        $("#AseguradoCodigoInsunix").val('');
        $("#AseguradoCodigoVTime").val('');
        $("#AsegTipoPersonaId").removeAttr('readOnly');
        $("#AsegTipoDocumentoId").removeAttr('readOnly');
        $("#AsegNumeroDocumento").removeAttr('readOnly');
        $("#AsegApellidoPaterno").removeAttr('readOnly');
        $("#AsegApellidoMaterno").removeAttr('readOnly');
        $("#AsegNombre").removeAttr('readOnly');
        $('#AsegTipoPersonaId > option[value="1"]').attr('selected', 'selected');
        $('#AsegTipoDocumentoId > option[value="1"]').attr('selected', 'selected');
        $("#AsegNumeroDocumento").attr('maxlength', 8);
        $("#AsegNumeroDocumento").val('');
        $("#AsegApellidoPaterno").val('');
        $("#AsegApellidoMaterno").val('');
        $("#AsegNombre").val('');
        $("#AsegDireccion").val('');
        $("#AsegNumero").val('');
        $("#AsegManzana").val('');
        $("#AsegLote").val('');
        $("#AsegRazonSocial").val('');
        $("#AsegNumeroDepartamento").val('');
        $("#AsegNumeroInterior").val('');
        $("#AsegReferencia").val('');
        $("#AsegProvinciaId").children().remove();
        $("#AsegDistritoId").children().remove();
        $("#AsegEmail").val('');
        $("#AsegTelefonoCasa").val('');
        $("#AsegTelefonoCelular").val('');
        $("#segundoGrpAsegu").hide();
        $("#quintoGrpAsegu").hide();
        $("#sextoGrpAsegu").hide();
        $("#septimoGrpAsegu").hide();
        $("#octavoGrpAsegu").hide();
        habilitarControlCombo("#AsegTipoPersonaId", true);
        habilitarControlCombo("#AsegTipoDocumentoId", true);
        $("#AccionSeConsultoAsegurado").val("0");
        $("#primerGrpAsegu").hide();
        $("#primerGrpAseguJuridico").hide();
        $("#AsegNumeroDocumento").removeAttr("disabled");
        $("#lnkBusqAsegurado").removeAttr("disabled");
        $('#AsegTipoNacionalidadID option').eq(0).prop('selected', true);
        $('#AsegTipoDeEmpresaID option').eq(0).prop('selected', true);
        $('#AsegRubroEconomicoID option').eq(0).prop('selected', true);
        $('#AseguradoCodigoSexo option').eq(0).prop('selected', true);
        $('#AseguradoEstadoCivil option').eq(0).prop('selected', true);
        $('#AseguradoFechaNacimiento').val('');
        setearValoresDefaultAsegurado();

        if ($("#hiddenFlagContextual").val() == '1') {
            $("#GrpAseguTipoPersona").hide();
            $("#GrpAseguTipoDocumentoNumero").hide();
        }
    }
    catch (e) {
        throw e;
    }
};
function habilitarControlCombo(control, habilitado) {
    try {
        if (habilitado) {
            $(control).removeAttr('disabled');
        } else {
            $(control).attr('disabled', 'disabled');
        }
    }
    catch (e) {
        throw e;
    }
}
function setearValoresDefaultAsegurado() {
    try {
        $("#AsegTipoPersonaId").val("1");
        habilitarControlCombo("#AsegTipoDocumentoId", true);
        ConsultaTiposDocumentoAseguradoPorFiltro('1');
        $("#AsegTipoDocumentoId").val("1");
    }
    catch (e) {
        throw e;
    }
}
function LimpiarControlesContratante() {
    try {

        //INI RQ2019-602 - EGALICIA - 11/08/2019   
        LimpiarControlesPerfilamiento("GrpContrata");

        $("#ContratanteCodigoInsunix").val('');
        $("#ContratanteCodigoVTime").val('');
        $("#ContraTipoPersonaId").removeAttr("disabled");
        $("#ContraTipoDocumentoId").removeAttr("disabled");
        $("#ContraNumeroDocumento").removeAttr('readOnly');
        $("#ContraApellidoPaterno").removeAttr('readOnly');
        $("#ContraApellidoMaterno").removeAttr('readOnly');
        $("#ContraNombre").removeAttr('readOnly');
        $('#ContraTipoDocumentoId > option[value="1"]').attr('selected', 'selected');
        $('#ContraTipoDocumentoId > option[value="1"]').attr('selected', 'selected');
        $("#ContraNumeroDocumento").attr('maxlength', 8);
        $("#ContraRazonSocial").val('');
        $("#ContraNumeroDocumento").val('');
        $("#ContraApellidoPaterno").val('');
        $("#ContraApellidoMaterno").val('');
        $("#ContraNombre").val('');
        $("#ContraDireccion").val('');
        $("#ContraNumero").val('');
        $("#ContraManzana").val('');
        $("#ContraLote").val('');
        $("#ContraNumeroDepartamento").val('');
        $("#ContraNumeroInterior").val('');
        $("#ContraReferencia").val('');
        $("#ContraRazonSocial").val('');
        $("#ContraProvinciaId").children().remove();
        $("#ContraDistritoId").children().remove();
        $("#ContraEmail").val('');
        $("#ContraTelefonoCasa").val('');
        $("#ContraTelefonoCelular").val('');
        $("#segundoGrpContrata").hide();
        $("#quintoGrpContrata").hide();
        $("#sextoGrpContrata").hide();
        $("#septimoGrpContrata").hide();
        $("#octavoGrpContrata").hide();
        $("#primerGrpContrata").hide();
        $("#primerGrpContrataJuridico").hide();
        $("#ContraNumeroDocumento").removeAttr("disabled");
        $("#lnkBusqContratante").removeAttr("disabled");
        $('#ContTipoNacionalidadID option').eq(0).prop('selected', true);
        $('#ContTipoDeEmpresaID option').eq(0).prop('selected', true);
        $('#ContRubroEconomicoID option').eq(0).prop('selected', true);
        $('#ContratanteCodigoSexo option').eq(0).prop('selected', true);
        $('#ContratanteEstadoCivil option').eq(0).prop('selected', true);
        $('#ContratanteFechaNacimiento').val('');
        setearValoresDefaultContratante();

        if ($("#hiddenFlagContextual").val() == '1') {
            $("#GrpContraTipoPersona").hide();
            $("#GrpContraTipoDocumentoNumero").hide();
        }
    }
    catch (e) {
        throw e;
    }
};
//INI RQ2019-602 - EGALICIA - 11/08/2019
//Se revierten los posibles bloqueos por privilegios de perfilamiento   
function LimpiarControlesPerfilamiento(grp) {

    var pref = grp == 'GrpAsegu' ? 'Aseg' : 'Contra';

    $("#" + pref + "Direccion").removeAttr('readOnly');
    $("#" + pref + "Referencia").removeAttr('readOnly');
    $("#" + pref + "DepartamentoId").prop('disabled', false);
    $("#" + pref + "ProvinciaId").prop('disabled', false);
    $("#" + pref + "DistritoId").prop('disabled', false);
    $("#" + pref + "TelefonoCasa").removeAttr('readOnly');
    $("#" + pref + "TelefonoCelular").removeAttr('readOnly');
    $("#" + pref + "Email").removeAttr('readOnly');
    $("#Flag" + pref + "BusqPerfPerfilamiento").val(false);
}
//FIN RQ2019-602 - EGALICIA - 11/08/2019
function setearValoresDefaultContratante() {
    try {
        $("#ContraTipoPersonaId").val("1");
        habilitarControlCombo("#ContraTipoDocumentoId", true);
        ConsultaTiposDocumentoContratantePorFiltro('1');
        $("#ContraTipoDocumentoId").val("1");
    }
    catch (e) {
        throw e;
    }
}
function ListarIntermediarios(idOficina, idIntermediarioRelacionado, descIntermediario, tipo) {
    try {
        var ddlIntermediario = document.getElementById("idIntermediario");
        var idTipoIntermediario = $("#idTipoIntermediario").val();
        var datalenght = 0;
        var idIntermediarioRelacionado2 = 0;
        ddlIntermediario.options.length = 0;
        ddlIntermediario.options[0] = new Option("--Seleccione--", "0");
        ddlIntermediario.selectedIndex = 0;
        ddlIntermediario.disabled = false;
        if (tipo != "ENDOSO") {
            idIntermediarioRelacionado2 = idIntermediarioRelacionado
        }
        var urlAux = 'Ventas/ObtenerIntermediarios2';
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { urlAux = 'ObtenerIntermediarios2'; }
        $.getJSON(
            urlAux,
            {
                idOficina: idOficina,
                idIntermediarioRelacionado: idIntermediarioRelacionado2,
                idTipoIntermediario: idTipoIntermediario,
            },
            function (data) {
                if (data.IsValid == false) {
                    alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                    return;
                }
                datalenght = data.length;
                $.each(data, function (i, row) {
                    if (idTipoIntermediario == 0) {
                    }
                    ddlIntermediario.options[i + 1] = new Option(row.DescIntermediario, row.IdIntermediario);
                });
                if (tipo == "ENDOSO") {
                    $('#idIntermediario').val(idIntermediarioRelacionado);
                }
            });
        if (tipo != "ENDOSO") {
            ddlIntermediario.selectedIndex = 0;
        }
    }
    catch (e) {
        throw e;
    }
}
function ListarRoles(idOficina, tipoIntermediario, descripcion) {
    try {
        var ddlRol = document.getElementById("idRol");
        var datalenght = 0;
        ddlRol.options.length = 0;
        ddlRol.options[0] = new Option("--Seleccione--", "0");
        ddlRol.selectedIndex = 0;
        ddlRol.disabled = false;
        var urlAux = 'Ventas/ObtenerRoles';
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { urlAux = 'ObtenerRoles'; }
        $.getJSON(
            urlAux,
            {
                idOficina: idOficina,
                tipoIntermediario: tipoIntermediario,
                descRol: descripcion,
            },
            function (data) {
                if (data.IsValid == false) {
                    alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                    return;
                }
                datalenght = data.length;
                $.each(data, function (i, row) {
                    ddlRol.options[i + 1] = new Option(row.DescRol, row.Rol);
                });
            });
        ddlRol.selectedIndex = 0;
    }
    catch (e) {
        throw e;
    }
}
function validarSeccionVeh() {
    try {
        var esPlacaEnTramite = $("#NumeroPlaca").val().toUpperCase() == 'P/T' ? 1 : 0;
        if (esPlacaEnTramite == 0) {
            if ($("#NumeroPlaca").val() == "") {
                alertValida("VEHICULO: Por favor ingrese un número de placa.");
                $('#NumeroPlaca').focus();
                return false;
            }
            if ($("#NumeroPlaca").val().indexOf(String.fromCharCode(9)) > 0) {
                alertValida("VEHICULO: No se aceptan Tab.");
                $('#NumeroPlaca').focus();
                return false;
            }
        }
        if ($('#ClaseId').val().trim() === '0') {
            alertValida('VEHICULO: Por favor seleccione una clase.');
            $('#ClaseId').focus();
            return false;
        }
        if ($('#UsoId').val().trim() === '0') {
            alertValida('VEHICULO: Por favor seleccione un uso.');
            $('#UsoId').focus();
            return false;
        }
        if ($('#CatId').val().trim() === '0') {
            alertValida('VEHICULO: Por favor seleccione una categoria.');
            $('#CatId').focus();
            return false;
        }
        if ($('#MarcaId').val().trim() === '') {
            alertValida('VEHICULO: Por favor seleccione una marca.');
            $('#MarcaId').focus();
            return false;
        }
        if ($('#ModeloId').val().trim() === '') {
            alertValida('VEHICULO: Por favor seleccione un modelo.');
            $('#ModeloId').focus();
            return false;
        }
        if ($("#VersionId").val() === '') {
            alertValida('VEHICULO: Por favor seleccione una versión.');
            return false;
        }
        if ($('#NumeroSerie').val().trim() === '') {
            alertValida('VEHICULO: Por favor ingrese un número de serie.');
            $('#NumeroSerie').focus();
            return false;
        }
        if ($('#NumeroAsiento').val().trim() === '') {
            alertValida('VEHICULO: Por favor ingrese número de asientos.');
            $('#NumeroAsiento').focus();
            return false;
        }
        if ($('#NumeroAsiento').val() == '0') {
            alertValida('VEHICULO: El número de asientos debe ser mayor a 0.');
            $('#NumeroAsiento').focus();
            return false;
        }
        if ($('#Año').val().trim() === '') {
            alertValida('VEHICULO: Por favor ingresar año.');
            $('#Año').focus();
            return false;
        }

        //INI GP2026-81
        var regex = new RegExp($("#hdnRegex").val().trim());
        if ($('#ModeloEspecifico').val().trim() != '') {
            if (!regex.test($('#ModeloEspecifico').val().trim())) {
                alertValida('VEHICULO: Modelo especifico contiene caracteres no permitidos.');
                $('#ModeloEspecifico').focus();
                return false;
            }
        }
        //FIN GP2026-81
        var anio = $('#Año').val();
        var fechActual = new Date();
        var topemin = 1900;
        var year = fechActual.getFullYear();

        var aniosConfigurados = ObtenerAniosConfigurados();
        year = parseInt(year) + parseInt(aniosConfigurados);

        if ($("#NumeroPlaca").val() == 'P/T') { topemin = year - (parseInt(aniosConfigurados) + 2); }

        if (anio < topemin || anio > year) {
            alertValida('VEHICULO: El año tiene que ser entre ' + topemin + ' y ' + year);
            return false;
        }
        if ($("#ddlZonaCirculacion").val() != null) {
            if ($("#ddlZonaCirculacion").val().trim() === '') {
                alertValida('VEHICULO: Por favor seleccionar una zona de circulación.');
                $('#ZonaCirculacionId').focus();
                return false;
            }
            $('#ZonaCirculacionId').val($("#ddlZonaCirculacion").val());
        }
        return true;
    }
    catch (e) {
        throw e;
    }
}

function ObtenerAniosConfigurados() {

    var valorAnios = "0";

    var urlAux = 'Ventas/ObtenerConfiguracion';
    var idFlagEndoso = $("#divEndoso").data('value');
    if (idFlagEndoso == 1) { urlAux = 'ObtenerConfiguracion'; }
    $.ajax({
        url: urlAux,
        type: 'Get',
        data: {
        },
        async: false,
        success: function (data) {
            $.each(data.resultado, function (i, item) {
                valorAnios = item.Valor;
            });
        }
    });
    return valorAnios;
}

function PTarifa() {
    var resultado = false;

    $.ajax({
        dataType: "json",
        url: nameAplicativo + "Ventas/PTarifa",
        data: {
            idClase: $('#ClaseId').val().trim(),
            idUso: $('#UsoId').val().trim()
        },
        async: false,
        success: function (data) { resultado = data; }
    });
    return resultado;
}
function SeleccionarZonaCirculacionDefaul() {
    try {
        var estadoValidacion = 0;
        var sZipCode = $("#ComercializadorZipCode").val();
        $('#ZonaCirculacionId').val(sZipCode);
        if ($('#Enabled').val().trim() === 'True') {
            $('#ZonaCirculacionId').val($("#ddlZonaCirculacion").val());
        }
    }
    catch (e) {
        throw e;
    }
}
function ValidacionUsoAsegurado() {
    try {
        var urlAux = 'Ventas/ValidacionUsoAsegurado';
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso === 1) { urlAux = 'ValidacionUsoAsegurado'; }

        var bValida = true;
        var esPlacaEnTramite = $("#NumeroPlaca").val().toUpperCase() === 'P/T' ? 1 : 0;

        //console.log('esPlacaEnTramite', esPlacaEnTramite);
        //console.log('CodInsunixAseg', $("#CodInsunixAseg").val());
        //console.log('idFlagEndoso', idFlagEndoso);
        //console.log('pNumeroPlaca', $("#NumeroPlaca").val().toUpperCase());
        //console.log('pCodigoAsegPlaca', $("#CodInsunixPla").val());
        //console.log('pCodigoAsegRol', $('#CodInsunixAseg').val());
        //console.log('pUsoOrigen', $("#IdUsoOrigen").val());
        //console.log('pUsoNuevo', $("#UsoId").val());
        //console.log('pFechaInicioVigencia', $("#FechaInicioVigencia").val());

        if (esPlacaEnTramite === 1) {
            bValida = true;
        }
        else {
            if (($("#CodInsunixAseg").val() !== '') && (idFlagEndoso === 0)) {

                $.ajax({
                    url: urlAux,
                    type: 'Get',
                    data: {
                        pNumeroPlaca: $("#NumeroPlaca").val().toUpperCase(),
                        pCodigoAsegPlaca: $("#CodInsunixPla").val(),
                        pCodigoAsegRol: $('#CodInsunixAseg').val(),
                        pUsoOrigen: $("#IdUsoOrigen").val(),
                        pUsoNuevo: $("#UsoId").val(),
                        pFechaInicioVigencia: $("#FechaInicioVigencia").val()
                    },
                    async: false,
                    cache: false,
                    success: function (data) {
                        if (data.IsValid == false) {
                            alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                            return;
                        }
                        if (data.Emision) {
                            bValida = false;
                        }
                    },
                    error: function () {
                        alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk.");
                    }
                });
            }
        }
        return bValida;
    }
    catch (e) {
        throw e;
    }
}
function ValidarSeccionAse() {
    var tipoPersona = $('#AsegTipoPersonaId').val();
    if (tipoPersona == 1) {
        if ($('#AsegApellidoPaterno').val().trim() === '') {
            alertValida('CONTRATANTE: Debe ingresar el apellido paterno.');
            $('#AsegApellidoPaterno').focus();
            return false;
        }
        if ($('#AsegApellidoMaterno').val().trim() === '') {
            alertValida('CONTRATANTE: Debe ingresar el apellido materno del CONTRATANTE.');
            $('#AsegApellidoMaterno').focus();
            return false;
        }
        if ($('#AsegNombre').val().trim() === '') {
            alertValida('CONTRATANTE: Debe ingresar el nombre del CONTRATANTE.');
            $('#AsegNombre').focus();
            return false;
        }
    } else if (tipoPersona == 2) {
        //RQ2022-1108
        var regex1 = new RegExp($("#hdnCaracteresP").val().trim());
        if ($('#AsegRazonSocial').val().trim() != '') {
            if (!regex1.test($('#AsegRazonSocial').val().trim())) {
                alertValida('CONTRATANTE: La Razón Social ingresada contiene caracteres inválidos.');
                $('#AsegRazonSocial').focus();
                return false;
            }
        }
        //RQ2022-1108

        if ($('#AsegRazonSocial').val().trim() === '') {
            alertValida('CONTRATANTE: Debe ingresar la razón social del CONTRATANTE.');
            $('#AsegRazonSocial').focus();
            return false;
        }

        if ($('#AsegTipoDeEmpresaID').val().trim() === '') {
            alertValida('CONTRATANTE: Debe ingresar el tipo de empresa del CONTRATANTE.');
            $('#AsegTipoDeEmpresaID').focus();
            return false;
        }
        if ($('#AsegRubroEconomicoID').val().trim() === '') {
            alertValida('CONTRATANTE: Debe ingresar el rubro económico del CONTRATANTE.');
            $('#AsegRubroEconomicoID').focus();
            return false;
        }
    }

    if ($('#AsegDireccion').val().trim() === '') {
        alertValida('CONTRATANTE: Debe ingresar la dirección.');
        $('#AsegDireccion').focus();
        return false;
    }

    if ($('#AsegDepartamentoId').val().trim() === '') {
        alertValida('CONTRATANTE: Debe seleccionar el departamento.');
        $('#AsegDepartamentoId').focus();
        return false;
    }

    if ($('#AsegProvinciaId').val().trim() === '') {
        alertValida('CONTRATANTE: Debe seleccionar la provincia.');
        $('#AsegProvinciaId').focus();
        return false;
    }

    if ($('#AsegDistritoId').val().trim() === '') {
        alertValida('CONTRATANTE: Debe seleccionar el distrito.');
        $('#AsegDistritoId').focus();
        return false;
    }

    var regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if ($('#AsegEmail').val().trim() != '') {
        if (!regex.test($('#AsegEmail').val().trim())) {
            alertValida('CONTRATANTE: La dirección de correo no es válida.');
            $('#AsegEmail').focus();
            return false;
        }
    }
    if ($('#rbtnModaliadVentaTradicional').is(":checked")) {
        var telefonoCasa = $('#AsegTelefonoCasa').val();
        var telefonoCelular = $('#AsegTelefonoCelular').val();
        if (telefonoCasa + telefonoCelular == '') {
            alertValida('CONTRATANTE: Debe ingresar un teléfono de casa o celular.');
            $('#AsegTelefonoCasa').focus();
            return false;
        }
    }
    if ($('#rbtnModaliadVentaDigital').is(":checked")) {
        var email = $('#AsegEmail').val();
        var telefonoCelular = $('#AsegTelefonoCelular').val();
        if (email == '') {
            alertValida('CONTRATANTE: Debe ingresar un email.');
            $('#AsegEmail').focus();
            return false;
        }
        if (telefonoCelular == '') {
            alertValida('CONTRATANTE: Debe ingresar un teléfono celular.');
            $('#AsegTelefonoCelular').focus();
            return false;
        }
    }
    if ($('#AsegTelefonoCasa').val().trim().length > 0) {
        if ($('#AsegTelefonoCasa').val().trim().length != 9) {
            alertValida('CONTRATANTE: El teléfono fijo debe de tener como mínimo 9 caracteres .');
            $('#AsegTelefonoCasa').focus();
            return false;
        }
        var telf = $('#AsegTelefonoCasa').val().trim();
        if (telf.substr(0, 1) != '0') {
            alertValida('CONTRATANTE: El teléfono fijo debe comenzar con "0", Ejemplo : ( 012935454 ).');
            $('#AsegTelefonoCasa').focus();
            return false;
        }
    }

    if ($('#AsegTelefonoCelular').val().trim().length > 0) {
        if ($('#AsegTelefonoCelular').val().trim().length < 9) {
            alertValida('CONTRATANTE: El teléfono celular debe de tener como mínimo 9 caracteres.');
            $('#AsegTelefonoCelular').focus();
            return false;
        }
        if ($('#AsegTelefonoCelular').val().substring(0, 1) != '9') {
            alertValida("CONTRATANTE: El teléfono celular debe de empezar con 9.");
            return false;
        }
    }
    if (tipoPersona == 1) {

        if ($('#AseguradoFechaNacimiento').val().trim() === '') {
            alertValida('CONTRATANTE: Debe ingresar la fecha de nacimiento.');
            $('#AseguradoFechaNacimiento').focus();
            return false;
        }

        if ($('#AseguradoFechaNacimiento').val().trim().length != 10) {
            alertValida('CONTRATANTE: Debe ingresar la fecha de nacimiento correcta en formato dd/mm/aaaa');
            $('#AseguradoFechaNacimiento').focus();
            return false;
        }

        if (!validaFechaDDMMAAAA($('#AseguradoFechaNacimiento').val())) {
            alertValida('CONTRATANTE: La fecha ingresada no es válida, ingrese la fecha de nacimiento correcta en formato dd/mm/aaaa.');
            $('#AseguradoFechaNacimiento').focus();
            return false;
        }

        var strIni = '01/01/1900';
        var IniSplit = strIni.split('/');
        var IniVig = new Date(IniSplit[2], IniSplit[1] - 1, IniSplit[0]);

        var f = new Date();
        var strFin = f.getDate() + "/" + (f.getMonth() + 1) + "/" + f.getFullYear();
        var FinSplit = strFin.split('/');
        var FinVig = new Date(FinSplit[2], FinSplit[1] - 1, FinSplit[0]);

        var strFechNac = $('#AseguradoFechaNacimiento').val();
        var FechNacSplit = strFechNac.split('/');
        var fechaIni = new Date(FechNacSplit[2], FechNacSplit[1] - 1, FechNacSplit[0]);

        if (fechaIni < IniVig) {
            alertValida("CONTRATANTE: La fecha de nacimiento no puede ser menor a " + strIni);
            $('#AseguradoFechaNacimiento').focus();
            return false;
        }
        if (fechaIni > FinVig) {
            alertValida("CONTRATANTE: La fecha de nacimiento no puede ser mayor a " + strFin);
            $('#AseguradoFechaNacimiento').focus();
            return false;
        }

        if ($('#AseguradoCodigoSexo').val() != null) {
            if ($('#AseguradoCodigoSexo').val().trim() == '') {
                alertValida('CONTRATANTE: Debe seleccionar el sexo.');
                $('#AseguradoCodigoSexo').focus();
                return false;
            }
        }
        if ($('#AseguradoEstadoCivil').val().trim() == '') {
            alertValida('CONTRATANTE: Debe seleccionar el estado civil.');
            $('#AseguradoEstadoCivil').focus();
            return false;
        }
        if ($('#AsegTipoNacionalidadID').val().trim() == '') {
            alertValida('CONTRATANTE: Debe seleccionar la nacionalidad.');
            $('#AsegTipoNacionalidadID').focus();
            return false;
        }
    }

    var esTitular = $("input[name='titular']:checked").val();
    if (esTitular == 2) {
        var tipoPersonaCont = $('#ContraTipoPersonaId').val();

        var askBusqContra = $('#ContraNumeroDocumento').val();

        if (askBusqContra == '') {
            alertValida('RESPONSABLE DE PAGO: Por favor realice una búsqueda de RESPONSABLE DE PAGO.');
            $('#ContraNumeroDocumento').focus();
            return false;
        }

        if (tipoPersonaCont == 1) {
            if ($('#ContraApellidoPaterno').val().trim() === '') {
                alertValida('RESPONSABLE DE PAGO: Debe ingresar el apellido paterno.');
                $('#ContraApellidoPaterno').focus();
                return false;
            }
            if ($('#ContraApellidoMaterno').val().trim() === '') {
                alertValida('RESPONSABLE DE PAGO: Debe ingresar el apellido materno del RESPONSABLE DE PAGO.');
                $('#ContraApellidoMaterno').focus();
                return false;
            }
            if ($('#ContraNombre').val().trim() === '') {
                alertValida('RESPONSABLE DE PAGO: Debe ingresar el nombre del RESPONSABLE DE PAGO');
                $('#ContraNombre').focus();
                return false;
            }
        } else if (tipoPersonaCont == 2) {
            //RQ2022-1108
            var regex1 = new RegExp($("#hdnCaracteresP").val().trim());
            if ($('#ContraRazonSocial').val().trim() != '') {
                if (!regex1.test($('#ContraRazonSocial').val().trim())) {
                    alertValida('RESPONSABLE DE PAGO: La Razón Social ingresada contiene caracteres inválidos.');
                    $('#ContraRazonSocial').focus();
                    return false;
                }
            }
            //RQ2022-1108

            if ($('#ContraRazonSocial').val().trim() === '') {
                alertValida('RESPONSABLE DE PAGO: Debe ingresar la razón social.');
                $('#ContraRazonSocial').focus();
                return false;
            }

            if ($('#ContTipoDeEmpresaID').val().trim() === '') {
                alertValida('RESPONSABLE DE PAGO: Debe ingresar el tipo de empresa.');
                $('#ContTipoDeEmpresaID').focus();
                return false;
            }
            if ($('#ContRubroEconomicoID').val().trim() === '') {
                alertValida('RESPONSABLE DE PAGO: Debe ingresar el rubro económico del CONTRATANTE.');
                $('#ContRubroEconomicoID').focus();
                return false;
            }

        }

        if ($('#ContraDireccion').val().trim() === '') {
            alertValida('RESPONSABLE DE PAGO: Debe ingresar la dirección.');
            $('#ContraDireccion').focus();
            return false;
        }

        if ($('#ContraDepartamentoId').val().trim() === '') {
            alertValida('RESPONSABLE DE PAGO: Debe seleccionar el departamento.');
            $('#ContraDepartamentoId').focus();
            return false;
        }

        if ($('#ContraProvinciaId').val().trim() === '') {
            alertValida('RESPONSABLE DE PAGO: Debe seleccionar la provincia.');
            $('#ContraProvinciaId').focus();
            return false;
        }

        if ($('#ContraDistritoId').val().trim() === '') {
            alertValida('RESPONSABLE DE PAGO: Debe seleccionar el distrito.');
            $('#ContraDistritoId').focus();
            return false;
        }

        var regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

        if ($('#ContraEmail').val().trim() != '') {
            if (!regex.test($('#ContraEmail').val().trim())) {
                alertValida('RESPONSABLE DE PAGO: La dirección de correo no es válida');
                $('#ContraEmail').focus();
                return false;
            }
        }

        if ($('#rbtnModaliadVentaTradicional').is(":checked")) {
            var telefonoCasaContra = $('#ContraTelefonoCasa').val();
            var telefonoCelularContra1 = $('#ContraTelefonoCelular').val();
            if (telefonoCasaContra + telefonoCelularContra1 === '') {
                alertValida('RESPONSABLE DE PAGO: Debe ingresar un teléfono de casa o celular.');
                $('#ContraTelefonoCasa').focus();
                return false;
            }
        }
        if ($('#rbtnModaliadVentaDigital').is(":checked")) {
            var emailContra = $('#ContraEmail').val();
            var telefonoCelularContra2 = $('#ContraTelefonoCelular').val();
            if (emailContra === '') {
                alertValida('RESPONSABLE DE PAGO: Debe ingresar un email.');
                $('#ContraEmail').focus();
                return false;
            }
            if (telefonoCelularContra2 === '') {
                alertValida('RESPONSABLE DE PAGO: Debe ingresar un teléfono celular.');
                $('#ContraTelefonoCelular').focus();
                return false;
            }
        }

        if ($('#ContraTelefonoCasa').val().trim().length > 0) {
            if ($('#ContraTelefonoCasa').val().trim().length != 9) {
                alertValida('RESPONSABLE DE PAGO: El teléfono fijo debe de tener como mínimo 9 caracteres .');
                $('#ContraTelefonoCasa').focus();
                return false;
            }
            var telf = $('#ContraTelefonoCasa').val().trim();
            if (telf.substr(0, 1) != '0') {
                alertValida('RESPONSABLE DE PAGO: El teléfono fijo debe comenzar con "0", Ejemplo : ( 012935454 ).');
                $('#ContraTelefonoCasa').focus();
                return false;
            }
        }

        if ($('#ContraTelefonoCelular').val().trim().length > 0) {
            if ($('#ContraTelefonoCelular').val().trim().length < 9) {
                alertValida('RESPONSABLE DE PAGO: El teléfono celular debe de tener como mínimo 9 caracteres.');
                $('#ContraTelefonoCelular').focus();
                return false;
            }
            if ($('#ContraTelefonoCelular').val().substring(0, 1) != '9') {
                alertValida("RESPONSABLE DE PAGO: El teléfono celular debe de empezar con ´9´.");
                return false;
            }
        }

        if (tipoPersonaCont == 1) {

            if ($('#ContratanteFechaNacimiento').val().trim() === '') {
                alertValida('RESPONSABLE DE PAGO: Debe ingresar la fecha de nacimiento.');
                $('#ContratanteFechaNacimiento').focus();
                return false;
            }

            if ($('#ContratanteFechaNacimiento').val().trim().length != 10) {
                alertValida('RESPONSABLE DE PAGO: Debe ingresar la fecha de nacimiento correcta en formato dd/mm/aaaa');
                $('#ContratanteFechaNacimiento').focus();
                return false;
            }

            if (!validaFechaDDMMAAAA($('#ContratanteFechaNacimiento').val())) {
                alertValida('RESPONSABLE DE PAGO: La fecha ingresada no es válida, ingrese la fecha de nacimiento correcta en formato dd/mm/aaaa.');
                $('#ContratanteFechaNacimiento').focus();
                return false;
            }

            var strIni = '01/01/1900';
            var IniSplit = strIni.split('/');
            var IniVig = new Date(IniSplit[2], IniSplit[1] - 1, IniSplit[0]);

            var f = new Date();
            var strFin = f.getDate() + "/" + (f.getMonth() + 1) + "/" + f.getFullYear();
            var FinSplit = strFin.split('/');
            var FinVig = new Date(FinSplit[2], FinSplit[1] - 1, FinSplit[0]);


            var strFechNac = $('#ContratanteFechaNacimiento').val();
            var FechNacSplit = strFechNac.split('/');
            var fechaIni = new Date(FechNacSplit[2], FechNacSplit[1] - 1, FechNacSplit[0]);

            if (fechaIni < IniVig) {
                alertValida("RESPONSABLE DE PAGO: La fecha de nacimiento no puede ser menor a " + strIni);
                $('#ContratanteFechaNacimiento').focus();
                return false;
            }
            if (fechaIni > FinVig) {
                alertValida("RESPONSABLE DE PAGO: La fecha de nacimiento no puede ser mayor a " + strFin);
                $('#ContratanteFechaNacimiento').focus();
                return false;
            }
            if ($('#ContratanteCodigoSexo').val() !== null && $('#ContratanteCodigoSexo').val().trim() === '') {
                alertValida('RESPONSABLE DE PAGO: Debe seleccionar el sexo.');
                $('#ContratanteCodigoSexo').focus();
                return false;
            }
            if ($('#ContratanteEstadoCivil').val().trim() == '') {
                alertValida('RESPONSABLE DE PAGO: Debe seleccionar el estado civil.');
                $('#ContratanteEstadoCivil').focus();
                return false;
            }
            if ($('#ContTipoNacionalidadID').val().trim() == '') {
                alertValida('RESPONSABLE DE PAGO: Debe seleccionar la nacionalidad.');
                $('#ContTipoNacionalidadID').focus();
                return false;
            }
        }
    }
    return true;
}
function validaFechaDDMMAAAA(txtDate) {
    try {
        var currVal = txtDate;
        if (currVal == '')
            return false;

        if (currVal.length != 10) {
            return false;
        } else {

            var _anio = currVal.substr(6, 4);
            var _mes = currVal.substr(3, 2);
            var _dia = currVal.substr(0, 2);

            currVal = _mes + '/' + _dia + '/' + _anio;
        }
        var rxDatePattern = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/; //Declare Regex
        var dtArray = currVal.match(rxDatePattern); // is format OK?

        if (dtArray == null)
            return false;

        dtMonth = dtArray[1];
        dtDay = dtArray[3];
        dtYear = dtArray[5];

        if (dtMonth < 1 || dtMonth > 12)
            return false;
        else if (dtDay < 1 || dtDay > 31)
            return false;
        else if ((dtMonth == 4 || dtMonth == 6 || dtMonth == 9 || dtMonth == 11) && dtDay == 31)
            return false;
        else if (dtMonth == 2) {
            var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
            if (dtDay > 29 || (dtDay == 29 && !isleap))
                return false;
        }
        return true;
    }
    catch (e) {
        throw e;
    }
}
function ValidarSeccionCer() {
    try {
        var fechaform = $("#FechaInicioVigencia").val().trim();
        var dataSplit = fechaform.split('/');
        var fechaIni = new Date(dataSplit[2], dataSplit[1] - 1, dataSplit[0]);

        var IniSplit = $("#VigMin").val().split('/');
        var IniVig = new Date(IniSplit[2], IniSplit[1] - 1, IniSplit[0]);
        var FinSplit = $("#VigMax").val().split('/');
        var FinVig = new Date(FinSplit[2], FinSplit[1] - 1, FinSplit[0]);
        if (fechaIni < IniVig) {
            alertValida("Inicio Vigencia no puede ser menor a " + $("#VigMin").val());
            return false;
        }
        if (fechaIni > FinVig) {
            alertValida("Inicio Vigencia no puede ser mayor a " + $("#VigMax").val());
            return false;
        }
        return true;
    }
    catch (e) {
        throw e;
    }
}
function ValidarSeccionPago() {
    try {
        if ($('#Cod_FormaPagoID').val() == '5') {

            if ($("#ddlIdTipoPos").val() != '3') {

                if ($('#TipoTarjetaID').val() == '') {
                    alertValida('FORMA DE PAGO: Debe seleccionar el tipo de tarjeta. ( VISA, MASTERCARD, etc.)');
                    $('#TipoTarjetaID').focus();
                    return false;
                }
                if ($('#TipoTarjetaID').val() == '10') {
                    var _visa = $('#NumeroTarjeta').val();
                    if (!_visa.match(/^4\d{3}-?\d{4}-?\d{4}-?\d{4}$/)) {
                        alertValida('FORMA DE PAGO: El número de tarjeta ingresado, no es un número de Visa correcto.');
                        return false;
                    }
                }
                if ($('#TipoTarjetaID').val() == '12') {
                    var _mastercard = $('#NumeroTarjeta').val();
                    if (!_mastercard.match(/^5[1-5]\d{2}-?\d{4}-?\d{4}-?\d{4}$/)) {
                        alertValida('FORMA DE PAGO: El número de tarjeta ingresado, no es un número de MASTERCARD correcto.');
                        return false;
                    }
                }
                if ($('#TipoTarjetaID').val() == '14') {
                    var _americanexpress = $('#NumeroTarjeta').val();
                    if (!_americanexpress.match(/^(?:3[47][0-9]{13})$/)) {
                        alertValida('FORMA DE PAGO: El número de tarjeta ingresado, no es un número de AMERICAN EXPRESS correcto.');
                        return false;
                    }
                }
                if ($('#TipoTarjetaID').val() == '15') {
                    var _dinnersclub = $('#NumeroTarjeta').val();
                    if (!_dinnersclub.match(/^(?:3(?:0[0-5]|[68][0-9])[0-9]{11})$/)) {
                        alertValida('FORMA DE PAGO: El número de tarjeta ingresado, no es un número de DINNERS CLUB correcto.');
                        return false;
                    }
                }

                if ($('#NumeroTarjeta').val().trim() == '') {
                    alertValida('FORMA DE PAGO: Debe ingresar un número de tarjeta.');
                    $('#NumeroTarjeta').focus();
                    return false;
                }
                if ($('#NumeroOperacion').val().trim() == '') {
                    alertValida('FORMA DE PAGO: Debe ingresar un número de operación.');
                    $('#NumeroOperacion').focus();
                    return false;
                }

                var resNroOpeacion = validarNroOperacion($('#NumeroOperacion').val().trim());
                if (resNroOpeacion == false) {
                    return false;

                }
                var _NumeroTarjeta = $('#NumeroTarjeta').val();
                var _NumeroOperacion = $('#NumeroOperacion').val();
                var _resvalidacionTarjetaOperacion = validarTarjetaNroOperacion(_NumeroTarjeta, _NumeroOperacion);
                if (_resvalidacionTarjetaOperacion == false) {
                    alertValida("FORMA DE PAGO: El Número de Tarjeta y Número de Operación ya fueron registradas.");
                    $('#NumeroOperacion').focus();
                    return false;
                }

                if ($('#idBancoPagoVirtual').val() == '') {
                    alertValida('FORMA DE PAGO: Debe seleccionar un Banco.');
                    $('#idBancoPagoVirtual').focus();
                    return false;
                }

                if ($('#ddlIdTipoPos').val() == '') {
                    alertValida('FORMA DE PAGO: Debe seleccionar un tipo de POS.');
                    $('#ddlIdTipoPos').focus();
                    return false;
                }
            }
            if ($("#ddlIdTipoPos").val() == '3') {
                if ($('#NumeroCargo').val() == '') {
                    alertValida('FORMA DE PAGO: Debe ingresar el Número de Cargo IVR.');
                    $('#NumeroCargo').focus();
                    return false;
                }
                if ($("#TarifMontoTarifaLabel").text() == '') {
                    alertValida('TARIFA: Debe ingresar una Tarifa.');
                    $('#NumeroCargo').focus();
                    return false;
                }
                var _resvalidacionCargoIVR = validarCargoIVR($('#NumeroCargo').val(), $('#ddlMonedaLst').val(), $("#CalcMontoLabel").html(), $("#AsegTipoDocumentoId").val(), $("#AsegNumeroDocumento").val());
                if (_resvalidacionCargoIVR != '') {
                    alertValida("FORMA DE PAGO:  IVR " + _resvalidacionCargoIVR);
                    $('#NumeroCargo').focus();
                    return false;
                }
            }
        }
        return true;
    }
    catch (e) {
        throw e;
    }
}
function validarNroOperacion(str) {
    try {
        var _texto = str;
        if (_texto.length != 10) {
            alertValida('El formato ingresado no es el correcto.');
            return false;
        }
        var str1 = _texto.substr(0, 4);
        var res1 = true;
        var pattern = /^\d+$/;
        res1 = pattern.test(str1);
        if (!res1) {
            alertValida('Los primeros 4 digitos deben ser numéricos.');
            return false;
        }
        var strmiddle = _texto.substr(4, 1);
        var resmiddle = true;
        var pattermiddle = /^[dDvVmMaA]+$/
        resmiddle = pattermiddle.test(strmiddle);
        if (!resmiddle) {
            alertValida('El quinto caracter debe ser D ó V ó M ó A');
            return false;
        }
        var str2 = _texto.substr(5, 5);
        var res2 = true;
        var pattern2 = /^([a-zA-Z0-9]+)$/
        res2 = pattern2.test(str2);

        if (!res2) {
            alertValida('Los últimos 5 caracteres deben ser alfanuméricos.');
            return false;
        }
        return true;
    }
    catch (e) {
        throw e;
    }
}
function validarTarjetaNroOperacion(NroTarjeta, NroOperacion) {
    try {
        var pasa = true;
        $.ajax({
            url: "Ventas/validarTarjetaNroOperacion",
            type: 'Get',
            data: {
                pTarjeta: NroTarjeta,
                pnroOperacion: NroOperacion
            },
            async: false,
            cache: true,
            success: function (data) {
                if (data.valida == "1") {
                    pasa = false;
                }
            }
        });
        return pasa;
    }
    catch (e) {
        throw e;
    }
}
function validarDelivery(departamento, provincia, distrito) {
    try {
        var pasa = true;
        $.ajax({
            url: "Ventas/validarDelivery",
            type: 'Get',
            data: {
                pDepartamento: departamento,
                pProvincia: provincia,
                pDistrito: distrito
            },
            async: false,
            cache: true,
            success: function (data) {
                if (data.IsValid == false) {
                    alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                    return;
                }
                if (data.valida == "0") {
                    pasa = false;
                }
            }
        });
        return pasa;
    }
    catch (e) {
        throw e;
    }
}
function VistaPreviaEmisionPoliza() {
    try {
        $('#verPolizaAEmitir').modal('show');
        var NombreAsegurado = "";
        // Parametros Formna de Pago

        let codTipoComprobante = 0;
        let descTipoComprobante = '';

        if ($('#ddlTipoComprobante').length == 1) {
            codTipoComprobante = $("#ddlTipoComprobante option:selected").val();
            descTipoComprobante = $("#ddlTipoComprobante option:selected").text();
        }

        var tipoFormaPago = $("#Cod_FormaPagoID option:selected").text();
        var codtipoFormaPago = $("#Cod_FormaPagoID option:selected").val();
        var tipoTarjetaFormaPago = $("#TipoTarjetaID option:selected").text();
        var fechaOperacion = $("#FechaOperacion").val();
        var numeroTarjeta = $("#NumeroTarjeta").val();
        var numeroOperacion = $("#NumeroOperacion").val();
        var ddlIdTipoPos = $("#ddlIdTipoPos option:selected").text();
        // Fin parametros forma de pago
        var MontoTarifa = $("#TarifMontoTarifa").val();
        //TarifMontoTarifaLabel

        var CalcMontoLabel = $("#CalcMontoLabel").html();
        var ddlMonedaLstLabel = $("#ddlMonedaLst option:selected").text();
        if ($('#AsegTipoPersonaId').val() == "2") {

            NombreAsegurado = $('#AsegRazonSocial').val();
        }
        else {
            NombreAsegurado = $('#AsegNombre').val();
        }

        if (MontoTarifa == '' || MontoTarifa == '0.00') {
            MontoTarifa = $("#TarifMontoTarifaLabel").html();
        }

        var urlAux = 'Ventas/VistaPreviaEmisionPoliza';
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { urlAux = 'VistaPreviaEndosoPoliza'; }
        $.ajax({
            url: urlAux,
            type: 'Get',
            data: {
                pCertificadoId: $("#CertificadoId").val(),
                pTarifMontoTarifa: MontoTarifa,
                pFechaInicioVigencia: $("#FechaInicioVigencia").val(),
                pFechaFinVigencia: $("#FechaFinVigencia").val(),
                pNumeroPlaca: $("#NumeroPlaca").val().toUpperCase(),
                pAño: $("#Año").val(),
                pDescripcionClase: $("#CatId option:selected").html().toUpperCase() + "-" + $("#ClaseId option:selected").html().toUpperCase(),   //A.E.
                pDescripcionUso: $("#UsoId option:selected").html().toUpperCase(),
                pDescripcionMarca: $("#MarcaId option:selected").html().toUpperCase(),
                pDescripcionModelo: $("#ModeloId option:selected").html().toUpperCase(),
                pDescripcionModeloEspecifico: $("#ModeloEspecifico").val().toUpperCase(),
                pDescripcionVersion: $("#VersionId option:selected").html().toUpperCase(),
                pNumeroAsiento: $("#NumeroAsiento").val(),
                pNumeroSerie: $("#NumeroSerie").val().toUpperCase(),
                pAsegNombre: NombreAsegurado,
                pAsegNumeroDocumento: $("#AsegNumeroDocumento").val(),
                pAsegTelefonoCelular: $("#AsegTelefonoCasa").val(),
                pAsegDireccion: $("#AsegDireccion").val().toUpperCase(),
                pDescripcionTipoVia: "",
                pAsegNumero: "",
                pAsegManzana: "",
                pAsegLote: "",
                pAsegNumeroDepartamento: "",
                pAsegNumeroInterior: "",
                pDescripcionDepartamentoAseg: $("#AsegDepartamentoId option:selected").html(),
                pDescripcionProvinciaAseg: $("#AsegProvinciaId option:selected").html(),
                pDescripcionDistritoAseg: $("#AsegDistritoId option:selected").html(),
                pApellidoPaterno: $('#AsegApellidoPaterno').val().toUpperCase(),
                pApellidoMaterno: $('#AsegApellidoMaterno').val().toUpperCase(),
                pReferencia: $("#AsegReferencia").val().toUpperCase(),
                ptipoFormaPago: tipoFormaPago,
                pcodtipoFormaPago: codtipoFormaPago,
                ptipoTarjetaFormaPago: tipoTarjetaFormaPago,
                pfechaOperacion: fechaOperacion,
                pnumeroTarjeta: numeroTarjeta,
                pnumeroOperacion: numeroOperacion,
                pddlIdTipoPos: ddlIdTipoPos,
                pCalcMontoLabel: CalcMontoLabel,
                pddlMonedaLstLabel: ddlMonedaLstLabel,
                pFlagFrontera: $("#hdnFlagFrontera").val(),
                pCodTipoComprobante: codTipoComprobante,
                pDescTipoComprobante: descTipoComprobante
            },
            async: false,
            cache: false,
            success: function (data) {
                if (data.IsValid == false) {
                    alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                    return;
                }
                $("#EmisionPoliza").show();
                $("#EmisionPoliza").html(data);
            },
            error: function () {
                alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk.");
            }
        });
    }
    catch (e) {
        throw e;
    }
};
function ControlesTipoPersona() {
    try {
        ConsultaTiposDocumentoAseguradoPorFiltro('1');
        LimpiarDatosCertificado();
    }
    catch (e) {
        throw e;
    }
};

//RQ2020-569
function LeyendaMedioPago() {
    try {
        //var idFormaPagoSeleccionado = $('#hdnTipoPagoDigital').val();//RQ2022-1037
        var idFormaPagoSeleccionado = $("#Cod_FormaPagoID option:selected").val();

        if (idFormaPagoSeleccionado == 1) {
            $('#hdnTipoPagoDigital').val(1);
            document.getElementById('mediodepagoseleccionado').innerHTML = 'El pago se realizará en Efectivo.';
            $("#grpAfiliacionRenovacion").hide();//RQ2022-1037
            $("#seccionRenovacion").hide();//RQ2022-1037
        }
        if (idFormaPagoSeleccionado == 8) {
            $('#hdnTipoPagoDigital').val(8);
            document.getElementById('mediodepagoseleccionado').innerHTML = 'El pago se realizará por Banca Móvil.';
            $("#grpAfiliacionRenovacion").hide();//RQ2022-1037
            $("#seccionRenovacion").hide();//RQ2022-1037
        }
        if (idFormaPagoSeleccionado == 5) {
            $('#hdnTipoPagoDigital').val(5);
            document.getElementById('mediodepagoseleccionado').innerHTML = 'Introduzca los datos de la tarjeta.';
            $("#grpAfiliacionRenovacion").hide();//RQ2022-1037
            $("#seccionRenovacion").hide();//RQ2022-1037
        }
        //INI RQ2022-975
        if (idFormaPagoSeleccionado == 9) {
            $('#hdnTipoPagoDigital').val(9);
            document.getElementById('mediodepagoseleccionado').innerHTML = 'El pago se realizará a través del Portal de Pagos Digitales.';
            $("#grpAfiliacionRenovacion").show();//RQ2022-1037
            $("#seccionRenovacion").show();//RQ2022-1037
        }
        //FIN RQ2022-975
    }
    catch (e) {
        throw e;
    }
};

function SeleccionarNotificacionPagoDigital() {
    try {
        //INI RQ2022-975
        var idFormaPago = $("#Cod_FormaPagoID option:selected").val();

        if (idFormaPago == 9) {
            $("#SeccNotificacionPagoDigital").show();
        }
        else {
            $("#SeccNotificacionPagoDigital").hide();
        }
        //FIN RQ2022-975
    }
    catch (e) {
        throw e;
    }
};

function ControlesInicial() {
    try {
        ObtenerModalidad();
        $("#primerGrpVehi").hide();
        $("#segundoGrpVehi").hide();
        $("#tercerGrpVehi").hide();
        $("#cuartoGrpVehi").hide();
        $("#grpDatosCertificado").hide();
        $("#primerGrpAseguJuridico").hide();
        $("#primerGrpContrataJuridico").hide();
        $("#lnkContinuar").hide();
        var actualDate = new Date();
        var newDate = new Date(actualDate.getFullYear(), actualDate.getMonth(), actualDate.getDate());
        $("#FechaInicioVigencia").datepicker('setDate', newDate);
        LimpiarControlesAsegurado();
        LimpiarControlesContratante();
        ObtenerRol();
    }
    catch (e) {
        throw e;
    }
};
function ObtenerModalidad() {
    try {
        var urlAux = 'Ventas/ObtenerModalidad';
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { urlAux = 'ObtenerModalidad'; }
        $.ajax({
            url: urlAux,
            type: 'Get',
            data: {
            },
            async: true,
            cache: false,
            success: function (data) {
                if (data.IsValid == false) {
                    alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                    return;
                }
                if (data == "1") {
                    $("#trModalidadVenta").show();
                }
                else {
                    $("#trModalidadVenta").hide();
                }
            },
            error: function () {
                alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk.");
            }
        });
    }
    catch (e) {
        throw e;
    }
}
function ObtenerRol() {
    try {
        var urlAux = 'Ventas/ObtenerRol';
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { urlAux = 'ObtenerRol'; }
        $.ajax({
            url: urlAux,
            type: 'Get',
            data: {

            },
            async: true,
            cache: false,
            success: function (data) {
                if (data.IsValid == false) {
                    alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                    return;
                }
                if (data == "1") {
                    if (idFlagEndoso == 0) { $("#trDatosAgenciamiento").show(); }
                    var ddlIntermediario = document.getElementById("idIntermediario");
                    var ddlTipoIntermediario = document.getElementById("idTipoIntermediario");
                    ddlIntermediario.disabled = true;
                    ddlTipoIntermediario.disabled = true;
                    var ddlRol = document.getElementById("idRol");
                    ddlRol.disabled = true;
                }
                else {
                    $("#trDatosAgenciamiento").hide();
                }
            },
            error: function () {
                alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk.");
            }
        });
    }
    catch (e) {
        throw e;
    }
}
function PresentarParametrosBusquedaClienteAsegurado() {
    try {
        $('#buscarClientesAseguradoParam').modal('show');
        var urlAux = 'Ventas/ObtenerParametrosBusquedaClienteAsegurado';
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { urlAux = 'ObtenerParametrosBusquedaClienteAsegurado'; }
        $.ajax({
            url: urlAux,
            type: 'Get',
            data: {
            },
            async: true,
            cache: false,
            success: function (data) {
                if (data.IsValid == false) {
                    alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                    return;
                }
                $("#detTableClientesAsegParam").html(data);
            },
            error: function () {
                alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk.");
            }
        });
    }
    catch (e) {
        throw e;
    }
}
function PresentarParametrosBusquedaClienteContratante() {
    try {
        $('#buscarClientesContratanteParam').modal('show');
        var urlAux = 'Ventas/ObtenerParametrosBusquedaClienteContratante';
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { urlAux = 'ObtenerParametrosBusquedaClienteContratante'; }
        $.ajax({
            url: urlAux,
            type: 'Get',
            data: {
            },
            async: true,
            cache: false,
            success: function (data) {
                if (data.IsValid == false) {
                    alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                    return;
                }
                $("#detTableClientesContraParam").html(data);
            },
            error: function () {
                alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk.");
            }
        });
    }
    catch (e) {
        throw e;
    }
}
function ConsultarTarifas(ramo, fechaInicioVigencia, placa, uso, clase, idMarca, idModelo, anio, ubigeoCirculacion, tipoMoneda, idIntermediario, nroPoliza, tipoPersona, idCliente, idModalidad, idAplicacion, flagTarifaOrberlite) {
    try {
        $("#detTablePlanTarifario").html('');
        $('#buscarPlanesYTarifas').modal('show');
        var flagTipoPers = "";
        var nomAseg = "";
        var docAseg = $("#AsegNumeroDocumento").val();
        flagTipoPers = $('#AsegTipoPersonaId').val();
        if (flagTipoPers == 1) {
            nomAseg = $("#AsegNombre").val() + " " + $("#AsegApellidoPaterno").val() + " " + $("#AsegApellidoMaterno").val();
        } else {
            nomAseg = $("#AsegRazonSocial").val();
        }
        var emailAseg = $("#AsegEmail").val();
        var phoneAseg = $("#AsegTelefonoCasa").val() + "/" + $("#AsegTelefonoCelular").val();
        var zipcodeaseg = $("#AsegDepartamentoId").val() + $("#AsegProvinciaId").val() + $("#AsegDistritoId").val();
        flagTipoPers = "";
        var nomCont = "";
        var docCont = $("#ContraNumeroDocumento").val();
        flagTipoPers = $('#ContraTipoPersonaId').val();
        if (flagTipoPers == 1) {
            nomCont = $("#ContraNombre").val() + " " + $("#ContraApellidoPaterno").val() + " " + $("#ContraApellidoMaterno").val();
        } else {
            nomCont = $("#ContraRazonSocial").val();
        }
        var emailCont = $("#ContraEmail").val();
        var phoneCont = $("#ContraTelefonoCasa").val() + "/" + $("#ContraTelefonoCelular").val();
        var zipcodecont = $("#ContraDepartamentoId").val() + $("#ContraProvinciaId").val() + $("#ContraDistritoId").val();
        var sIntermediario = "";
        var sRol = "";

        /*
            Para el RQ2019-983 es necesario agregar al request el tipo de documento y número de documento.
        */
        var tipoDocAseg = $("#AsegTipoDocumentoId").val();
        var tipoDocCont = $("#ContraTipoDocumentoId").val();

        if ($('#trDatosAgenciamiento').is(':visible')) {
            var oficina = $("#IdOficina").val();
            var rol = $("#idRol").val();
            var intermediario = $("#idIntermediario").val();
            var tipoIntermediario = $("#idTipoIntermediario").val();

            if (oficina == "" || oficina == "0") {
                alertValida("Favor de seleccionar una oficina.");
                $("#IdOficina").focus();
                return false;
            }
            if (tipoIntermediario == 0) {
                if (intermediario == "" || intermediario == "0") {
                    alertValida("Favor de seleccionar un Broker.");
                    $("#idIntermediario").focus();
                    return false;
                }
            } else {
                if (rol == "" || rol == "0") {
                    alertValida("Favor de seleccionar un Rol.");
                    $("#idRol").focus();
                    return false;
                }
            }
            sIntermediario = intermediario;
            sRol = rol;
        }
        var nroAsientos = $("#NumeroAsiento").val();
        if (phoneCont == null) { phoneCont = "/"; }
        var urlAux = 'Ventas/ObtenerTarifas';
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { urlAux = 'ObtenerTarifas'; }
        $.ajax({
            url: urlAux,
            type: 'Post',
            data: {
                pRamo: validarFormato(ramo, objEncrypt),
                pFechaInicioVigencia: validarFormato(fechaInicioVigencia, objEncrypt),
                pPlaca: validarFormato(placa, objEncrypt),
                pUso: validarFormato(uso, objEncrypt),
                pClase: validarFormato(clase, objEncrypt),
                pIdMarca: validarFormato(idMarca, objEncrypt),
                pIdModelo: validarFormato(idModelo, objEncrypt),
                pAnio: validarFormato(anio, objEncrypt),
                pUbigeoCirculacion: validarFormato(ubigeoCirculacion, objEncrypt),
                pTipoMoneda: validarFormato(tipoMoneda, objEncrypt),
                pIdIntermediario: validarFormato(idIntermediario, objEncrypt),
                pNroPoliza: validarFormato(nroPoliza, objEncrypt),
                pTipoPersona: validarFormato(tipoPersona, objEncrypt),
                pIdCliente: validarFormato(idCliente, objEncrypt),
                pIdModalidad: validarFormato(idModalidad, objEncrypt),
                pIdAplicacion: validarFormato(idAplicacion, objEncrypt),
                pDocAseg: validarFormato(docAseg, objEncrypt),
                pNomAseg: validarFormato(nomAseg, objEncrypt),
                pzipcodeaseg: validarFormato(zipcodeaseg, objEncrypt),
                pEmailAseg: validarFormato(emailAseg, objEncrypt),
                pPhoneAseg: validarFormato(phoneAseg, objEncrypt),
                pDocCont: validarFormato(docCont, objEncrypt),
                pNomCont: validarFormato(nomCont, objEncrypt),
                pzipcodecont: validarFormato(zipcodecont, objEncrypt),
                pEmailCont: validarFormato(emailCont, objEncrypt),
                pPhoneCont: validarFormato(phoneCont, objEncrypt),
                pIntermediario: validarFormato(sIntermediario, objEncrypt),
                pRol: validarFormato(sRol, objEncrypt),
                pNumAsientos: validarFormato(nroAsientos, objEncrypt),
                pTipoDocAseg: validarFormato(tipoDocAseg, objEncrypt),
                pTipoDocCont: validarFormato(tipoDocCont, objEncrypt),
                pFlagPlacaExtrangera: validarFormato($("#hdnFlagPlacaExtrangera").val(), objEncrypt),
                pflagTarifaOrberlite: validarFormato(flagTarifaOrberlite, objEncrypt)

            },
            async: true,
            cache: false,
            success: function (data) {
                if (data.IsValid == false) {
                    //alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                    if (data.ErrorMessage == "VALFRAUDE") {
                        $('#buscarPlanesYTarifas').modal('hide');
                        alertValida("TARIFARIO: Error en el proceso de tarifa.");
                    } else {
                        alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Vuelva a intentarlo. Si el error persiste favor de comunicarse con Service Desk.</br>");
                    }
                    return;
                }
                if (data.EsFraude === true) {
                    alertValida("Se encontró alteraciones externas en el sistema.");
                    document.location.href = "/Home/Index";
                    return;
                }
                if (data.estado == "LO") {
                    LostSession();
                }
                else {
                    $("#detTablePlanTarifario").html(data);
                }
            },
            error: function () {
                alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk.");
            }
        });
    }
    catch (e) {
        throw e;
    }
};
function ValidaFraude(fechaConsultar, IdClienteVt_, _tipo) {
    try {
        var urlAux = 'Ventas/ValidarFraude';
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { urlAux = 'ValidarFraude'; }
        var _idUso = $("#UsoId").val();
        var _nomUso = document.getElementById("UsoId").options[document.getElementById("UsoId").selectedIndex].text;
        var _idMarca = $("#MarcaId").val();
        if ($("#hdnResultadoPlacaTarifa").val() == '1' && ($("#hdnMarcaTarifaRes").val() != '' || $("#hdnModeloTarifaRes").val() != '')) {
            var _idClaseVehiculo = $("#hdnClaseTarifaRes").val();
            var _nomClaseVehiculo = $("#hdnDescClaseTarifaRes").val();
            var _idMarca = $("#hdnMarcaTarifaRes").val();
            var _descMarca = $("#hdnDescMarcaTarifaRes").val();
            var _idModelo = $("#hdnModeloTarifaRes").val();
            var _descModelo = $("#hdnDescModeloTarifaRes").val();
            var _idVersion = $("#hdnVersionTarifaRes").val();
            var _descVersion = $("#hdnDescVersionTarifaRes").val();
            var _flagTarifaOrberlite = '1';
            $("#hdnflagTarifaOrberlite").val('1');
        }
        else {
            var _idClaseVehiculo = $("#ClaseId").val();
            var _nomClaseVehiculo = document.getElementById("ClaseId").options[document.getElementById("ClaseId").selectedIndex].text;
            var _idMarca = $("#MarcaId").val();
            var _descMarca = document.getElementById("MarcaId").options[document.getElementById("MarcaId").selectedIndex].text;
            var _idModelo = $("#ModeloId").val();
            var _descModelo = document.getElementById("ModeloId").options[document.getElementById("ModeloId").selectedIndex].text;
            var _idVersion = $("#VersionId").val();
            var _descVersion = document.getElementById("VersionId").options[document.getElementById("VersionId").selectedIndex].text;
            var _flagTarifaOrberlite = '0';
            $("#hdnflagTarifaOrberlite").val('0');
        }
        var _zonaCirculacion = $("#ddlZonaCirculacion option:selected").val();
        var _idTarifa = $("#TarifaId").val();
        var _montoTarifa = $("#TarifMontoTarifa").val();
        var _dias = $("#hdnDiasFrontera").val();
        var _idPais = $("#hdnFlagFrontera").val();
        if (_dias == "") { _dias = 0; }
        if (_idPais == "") { _idPais = 0; }

        if (_idTarifa == '') {
            _idTarifa = 0;
        }
        if (_montoTarifa == '') {
            _montoTarifa = 0;
        }
        $.ajax({
            url: urlAux,
            type: 'Get',
            async: false,
            cache: true,
            data: {
                idClaseVehiculo: _idClaseVehiculo,
                nomClaseVehiculo: _nomClaseVehiculo,
                idUso: _idUso,
                nomUso: _nomUso,
                idMarca: _idMarca,
                descMarca: _descMarca,
                idModelo: _idModelo,
                descModelo: _descModelo,
                idVersion: _idVersion,
                descVersion: _descVersion,
                zonaCirculacion: _zonaCirculacion,
                tarifa: _montoTarifa,
                idTarifa: _idTarifa,
                tipo: _tipo,
                dias: _dias,
                idPais: _idPais,
                flagTarifaOrberlite: _flagTarifaOrberlite,
            },
            success: function (data) {
                if (data.IsValid == false) {
                    alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                    return;
                }
                else {
                    if (data.EsCritico == true) {
                        alertValida("Se encontró alteraciones externas en el sistema.");
                        document.location.href = "Home/Index";
                        return;
                    }
                    else {
                        var numCoti = document.getElementById("NumeroCotizacion");
                        if (data.EsFraude && (numCoti == null && !numCoti.readOnly)) {
                            $("#ddlZonaCirculacion option:selected").val(data.mZonaCirculacion);
                            var sIntermediario = "";
                            var sRol = "";
                            if ($('#trDatosAgenciamiento').is(':visible')) {
                                var oficina = $("#IdOficina").val();
                                var rol = $("#idRol").val();
                                var intermediario = $("#idIntermediario").val();
                                var tipoIntermediario = $("#idTipoIntermediario").val();
                                if (oficina == "" || oficina == "0") {
                                    alertValida("Favor de seleccionar una oficina.");
                                    $("#IdOficina").focus();
                                    return false;
                                }
                                if (tipoIntermediario == 0) {
                                    if (intermediario == "" || intermediario == "0") {
                                        alertValida("Favor de seleccionar un Broker.");
                                        $("#idIntermediario").focus();
                                        return false;
                                    }
                                } else {
                                    if (rol == "" || rol == "0") {
                                        alertValida("Favor de seleccionar un Rol.");
                                        $("#idRol").focus();
                                        return false;
                                    }
                                }
                                sIntermediario = intermediario;
                                sRol = rol;
                            }
                            if (data.mClases != null) {
                                CargarClasesPorData(data.mClases, data.IdClaseVehiculo);
                                ConsultaUsosPorFiltro(data.IdClaseVehiculo, $("#ComercializadorIntermediarioId").val(), sIntermediario, sRol, data.IdUso);
                                ConsultaMarcasPorFiltro(data.IdClaseVehiculo, $("#FechaInicioVigencia").val(), data.IdMarca, false);
                                ConsultaModelosPorFiltro(data.IdClaseVehiculo, data.IdMarca, $("#FechaInicioVigencia").val(), data.IdModelo, false);
                                ConsultaVersionesPorFiltro(data.IdClaseVehiculo, data.IdMarca, data.IdModelo, $("#FechaInicioVigencia").val(), data.IdVersion);
                            }
                        }
                        if (data.EsFraudeTarifa == true) {
                            $("#TarifMontoTarifa").val(data.montoTarifa);
                            $("#Comision").val(data.comision);
                            $("#Recargo").val(data.recargo);
                            $("#TarifMontoTarifa").val(data.montoTarifa);
                            $("#TarifMontoTarifa").val(data.montoTarifa);
                            var descMoneda = '';
                            if (data.idMoneda == 1) {
                                descMoneda = 'S/.'
                                $("#TarifMonedaDescLabel").html('Soles');
                            }
                            else {
                                descMoneda = '$'
                                $("#TarifMonedaDescLabel").html('Dólares');
                            }
                            $("#TarifMontoTarifaLabel").html(descMoneda + ' ' + data.montoTarifa.toFixed(2));
                        }
                        if (_tipo == 1) {
                            //RQ2023-484 
                            if ($("#hdnResultadoPlacaTarifa").val() == '1' && ($("#hdnMarcaTarifaRes").val() != '' || $("#hdnModeloTarifaRes").val() != '')) {
                                //  ConsultarTarifas($("#Ramo").val(), fechaConsultar, $("#NumeroPlaca").val().toUpperCase(), $("#UsoId").val(), $("#ClaseId").val(), $("#MarcaId").val(),
                                //$("#VersionId").val(), $("#Año").val(), $('#ZonaCirculacionId').val(), $("#TipoMoneda").val(), $("#ComercializadorIntermediarioId").val(), $("#PolizaId").val(),
                                //$("#AsegTipoPersonaId").val(), IdClienteVt_, $("#ModalidadVentaId").val(), $("#AplicacionId").val());
                                ConsultarTarifas($("#Ramo").val(), fechaConsultar, $("#NumeroPlaca").val().toUpperCase(), $("#UsoId").val(), $("#hdnClaseTarifaRes").val(), $("#hdnMarcaTarifaRes").val(),
                                    $("#hdnVersionTarifaRes").val(), $("#Año").val(), $('#ZonaCirculacionId').val(), $("#TipoMoneda").val(), $("#ComercializadorIntermediarioId").val(), $("#PolizaId").val(),
                                    $("#AsegTipoPersonaId").val(), IdClienteVt_, $("#ModalidadVentaId").val(), $("#AplicacionId").val(), '1');
                            } else {
                                ConsultarTarifas($("#Ramo").val(), fechaConsultar, $("#NumeroPlaca").val().toUpperCase(), $("#UsoId").val(), $("#ClaseId").val(), $("#MarcaId").val(),
                                    $("#VersionId").val(), $("#Año").val(), $('#ZonaCirculacionId').val(), $("#TipoMoneda").val(), $("#ComercializadorIntermediarioId").val(), $("#PolizaId").val(),
                                    $("#AsegTipoPersonaId").val(), IdClienteVt_, $("#ModalidadVentaId").val(), $("#AplicacionId").val(), '0');
                            }
                        }
                        if (_tipo == 2) {
                            VistaPreviaEmisionPoliza();
                        }
                    }
                }
            },
            error: function (data) {
                alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk.");
            }
        });
    }
    catch (e) { }
}
function ConsultaClienteAsegurado(numeroDocumento, tipoDocumentoId, tipoPersonId, dniVendedor, aplicacionId, pPoliza, codigoClienteContextual) {
    try {
        if (tipoDocumentoId == "2" && !validarFormatoRuc('CONTRATANTE', numeroDocumento, tipoPersonId)) return;
        if (tipoDocumentoId == "2" && !validarFormatoRuc('ASEGURADO', numeroDocumento, tipoPersonId)) return;

        if (codigoClienteContextual == "NUEVO_CLIENTE") {
            codigoClienteContextual = "";
        }
        $("#CodInsunixAseg").val('');
        var urlAux = 'Ventas/ObtenerCliente';
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) {
            urlAux = 'ObtenerCliente';
        } else { pPoliza = 0; }

        $.ajax({
            url: urlAux,
            type: 'Get',
            data: {
                pNumeroDocumento: objEncrypt.encrypt(numeroDocumento),
                pTipoDocumentoId: objEncrypt.encrypt(tipoDocumentoId + ''),
                pTipoPersonaId: objEncrypt.encrypt(tipoPersonId + ''),
                pDniVendedor: objEncrypt.encrypt(dniVendedor),
                pIdAplicacion: aplicacionId,
                pPoliza: pPoliza,
                pIndicadorContAseg: 1,
                pCodigoClienteContextual: codigoClienteContextual
            },
            async: true,
            cache: false,
            success: function (data) {
                if (data.IsValid == false) {
                    //alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                    alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Vuelva a intentarlo. Si el error persiste favor de comunicarse con Service Desk.</br>");
                    return;
                }
                if (data.estado == "LO") {
                    LostSession();
                }
                else if (data.Clientes.length == 0 && $("#hiddenFlagContextual").val() == '1' && codigoClienteContextual != "NUEVO_CLIENTE" && codigoClienteContextual != "") {
                    alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Tipo de documento no permitido.</a> <br>Vuelva a realizar la busqueda o cree un nuevo cliente.</br>");
                    $("#lnkLimpiarBusquedaContextual").click();
                    return;
                }
                else {
                    if ($("#AsegTipoDocumentoId").val() == '1' || $("#AsegTipoDocumentoId").val() == '2') {
                        $("#AsegTipoNacionalidadID").val(1);
                        habilitarControlCombo("#AsegTipoNacionalidadID", false);
                    } else if ($("#AsegTipoDocumentoId").val() == '3') {
                        habilitarControlCombo("#AsegTipoNacionalidadID", true);
                        $("#AsegTipoNacionalidadID").val(25);
                    } else {
                        habilitarControlCombo("#AsegTipoNacionalidadID", true);
                    }

                    $("#septimoGrpAsegu").show();
                    $("#octavoGrpAsegu").show();
                    if ($("#AsegTipoDocumentoId").val() == '2' && $("#AsegTipoPersonaId").val() == '2') {
                        $("#septimoGrpAsegu").hide();
                        $("#octavoGrpAsegu").hide();
                    }
                    //mostrar campos
                    $('#AseguradoCodigoSexo').show();
                    $('#AseguradoEstadoCivil').show();
                    $('#AseguradoFechaNacimiento').show('');
                    $("#AsegTipoNacionalidadID").show();

                    $("#lblSexoAseg").show();
                    $("#lblFecnacAseg").show();
                    $("#lblEstadocivilAseg").show();
                    $("#lblNacionalidadAseg").show();
                    // Indicar siempre por defector soltero para DNI y RUC 10
                    if ($("#AsegTipoPersonaId").val() == '1' && ($("#AsegTipoDocumentoId").val() == '1' || $("#AsegTipoDocumentoId").val() == '2')) {
                        $('#AseguradoEstadoCivil option').eq(2).prop('selected', true);
                    }
                    if ($("#AsegTipoPersonaId").val() == '2') {
                        $("#AsegRubroEconomicoID").val('7499');
                        $("#AsegTipoDeEmpresaID").val('7');
                        habilitarControlCombo("#AsegTipoDeEmpresaID", true);
                        habilitarControlCombo("#AsegRubroEconomicoID", true);
                        $("#AsegRazonSocial").removeAttr('readOnly');
                    }
                    habilitarControlCombo("#AsegTipoPersonaId", false);
                    habilitarControlCombo("#AsegTipoDocumentoId", false);
                    habilitarControl("#AsegNumeroDocumento", false);

                    /* SETEO DE DEPARTAMENTO - PROVINCIA - DISTRITO */
                    var idZonaCirculacion = $("#ddlZonaCirculacion option:selected").val();
                    var idDepartamento = idZonaCirculacion.substring(0, 2);; //RQ2022-598
                    $("#AsegDepartamentoId").prop('disabled', false); //RQ2022-598
                    $("#AsegDepartamentoId").val(idDepartamento);
                    ConsultaProvinciasPorFiltro("AsegProvinciaId", idDepartamento);
                    ConsultaDistritosPorFiltro("AsegDistritoId", idDepartamento, '00');
                    /*----------------------------------------------*/
                    $('#AseguradoEstadoCivil option').eq(2).prop('selected', true);
                    $('#AseguradoCodigoSexo option').eq(2).prop('selected', true);

                    //RQ2019-602 - EGALICIA - 11/08/2019 
                    //Se modifica la lectura del response
                    $.each(data.Clientes, function (i, fila) {

                        //INI RQ2021-698
                        if ($("#hiddenFlagContextual").val() == '1' && $("#AsegTipoDocumentoId").val() == null) {
                            $("#AsegTipoPersonaId").val(fila.TipoPersonaId);
                            $("#AsegTipoDocumentoId").val(fila.TipoDocumentoId);
                            $("#AsegNumeroDocumento").val(fila.NumeroDocumento);

                            if ($("#AsegTipoDocumentoId").val() == '1' || $("#AsegTipoDocumentoId").val() == '2') {
                                $("#AsegTipoNacionalidadID").val(1);
                                habilitarControlCombo("#AsegTipoNacionalidadID", false);
                            } else if ($("#AsegTipoDocumentoId").val() == '3') {
                                habilitarControlCombo("#AsegTipoNacionalidadID", true);
                                $("#AsegTipoNacionalidadID").val(25);
                            } else {
                                habilitarControlCombo("#AsegTipoNacionalidadID", true);
                            }

                            if ($("#AsegTipoDocumentoId").val() == '2' && $("#AsegTipoPersonaId").val() == '2') {
                                $("#septimoGrpAsegu").hide();
                                $("#octavoGrpAsegu").hide();
                            }

                            if ($("#AsegTipoPersonaId").val() == '1' && ($("#AsegTipoDocumentoId").val() == '1' || $("#AsegTipoDocumentoId").val() == '2')) {
                                $('#AseguradoEstadoCivil option').eq(2).prop('selected', true);
                            }

                        }
                        //FIN RQ2021-698

                        $("#AseguradoId").val(fila.ClienteId);
                        $("#AccionSeConsultoAsegurado").val("1");
                        var tipoPersona = $('#AsegTipoPersonaId').val();
                        habilitarControlCombo("#AsegTipoPersonaId", false);
                        habilitarControlCombo("#AsegTipoDocumentoId", false);
                        habilitarControl("#AsegNumeroDocumento", false);

                        if ($("#AsegTipoDocumentoId").val() == '3' || $("#AsegTipoDocumentoId").val() == '12') {
                            $("#AsegTipoNacionalidadID").val(fila.NacionalidadId);
                        }
                        if (tipoPersona == 1) {
                            $("#primerGrpAseguJuridico").hide();
                            if ($.trim(fila.ApellidoPaterno) != "" && $.trim(fila.ApellidoPaterno) != null) {
                                $("#AsegApellidoPaterno").val($.trim(fila.ApellidoPaterno));
                                $("#AsegApellidoMaterno").val($.trim(fila.ApellidoMaterno));
                                $("#AsegNombre").val($.trim(fila.Nombre));
                                if (pPoliza == 0) {
                                    habilitarControl("#AsegApellidoPaterno", false);
                                    habilitarControl("#AsegApellidoMaterno", false);
                                    habilitarControl("#AsegNombre", false);
                                }
                                //ini dataquality
                                /*$('#AseguradoCodigoSexo').hide();
                                $('#AseguradoEstadoCivil').hide();
                                $('#AseguradoFechaNacimiento').hide('');
                                $("#AsegTipoNacionalidadID").hide();

                                $("#lblSexoAseg").hide();
                                $("#lblFecnacAseg").hide();
                                $("#lblEstadocivilAseg").hide();
                                $("#lblNacionalidadAseg").hide();*/
                                //fin dataquality
                            }
                            else {
                                habilitarControl("#AsegApellidoPaterno", true);
                                habilitarControl("#AsegApellidoMaterno", true);
                                habilitarControl("#AsegNombre", true);
                            }

                        } else if (tipoPersona == 2) {
                            $("#primerGrpAsegu").hide();
                            if ($.trim(fila.RazonSocial) != "" && $.trim(fila.RazonSocial) != null) {
                                $("#AsegRazonSocial").val($.trim(fila.RazonSocial));
                                if (pPoliza == 0) {
                                    habilitarControl("#AsegRazonSocial", false);
                                    //ini dataquality
                                    habilitarControlCombo("#AsegTipoDeEmpresaID", false);
                                    habilitarControlCombo("#AsegRubroEconomicoID", false);
                                    //fin dataquality
                                }
                            }
                            else {
                                habilitarControl("#AsegRazonSocial", true);
                                //ini dataquality
                                habilitarControlCombo("#AsegTipoDeEmpresaID", true);
                                habilitarControlCombo("#AsegRubroEconomicoID", true);
                                //fin dataquality
                            }
                        }
                        if (fila.SCODIGOINX != '') {
                            $("#CodInsunixAseg").val(fila.SCODIGOINX);
                        }
                        if (fila.SCODIGOINX != '' || fila.SCODIGOVT != '') {
                            $("#septimoGrpAsegu").hide();
                            $("#octavoGrpAsegu").hide();
                        }
                        //ini dataquality
                        var existsEmp = $('#AsegTipoDeEmpresaID option').filter(function () { return $(this).val() == fila.TipoEmpresaId; }).length;
                        if (existsEmp == 0 || fila.TipoEmpresaId == '0') {
                            $("#AsegTipoDeEmpresaID").val('7');
                            habilitarControlCombo("#AsegTipoDeEmpresaID", false);
                        }
                        else {
                            $("#AsegTipoDeEmpresaID").val(fila.TipoEmpresaId);
                            habilitarControlCombo("#AsegTipoDeEmpresaID", false);
                        }
                        if (fila.SCODIGOVT == '' && fila.SCODIGOINX == '') {

                            habilitarControlCombo("#AsegTipoDeEmpresaID", true);
                            habilitarControl("#AsegRazonSocial", true);

                            if ($.trim(fila.RazonSocial) == '') {
                                $("#AsegRazonSocial").removeAttr('readOnly');
                            }
                            if ($.trim(fila.ApellidoPaterno) == '') {
                                $("#AsegApellidoPaterno").removeAttr('readOnly');
                            }
                            if ($.trim(fila.ApellidoMaterno) == '') {
                                $("#AsegApellidoMaterno").removeAttr('readOnly');
                            }
                            if ($.trim(fila.Nombre) == '') {
                                $("#AsegNombre").removeAttr('readOnly');
                            }

                            $('#AseguradoCodigoSexo').show();
                            $('#AseguradoEstadoCivil').show();
                            $('#AseguradoFechaNacimiento').show('');
                            $("#AsegTipoNacionalidadID").show();
                            if ($("#AsegTipoDocumentoId").val() == '1' || $("#AsegTipoDocumentoId").val() == '2') {
                                habilitarControlCombo("#AsegTipoNacionalidadID", false);
                            } else {
                                habilitarControlCombo("#AsegTipoNacionalidadID", true);
                            }
                            $("#lblSexoAseg").show();
                            $("#lblFecnacAseg").show();
                            $("#lblEstadocivilAseg").show();
                            $("#lblNacionalidadAseg").show();
                        }
                        var existsRubEmp = $('#AsegRubroEconomicoID option').filter(function () { return $(this).val() == fila.RubroEconomico; }).length;
                        if (existsRubEmp == 0 || fila.RubroEconomico == '0') {
                            $("#AsegRubroEconomicoID").val('7499');
                            habilitarControlCombo("#AsegRubroEconomicoID", true);
                        }
                        else {
                            $("#AsegRubroEconomicoID").val(fila.RubroEconomico);
                            habilitarControlCombo("#AsegRubroEconomicoID", false);
                        }
                        $("#AsegRazonSocial").val(fila.RazonSocial);
                        if (fila.TipoViaId == 0 || fila.TipoViaId == '') {
                            $("#AsegTipoViaId").val('1');
                        }
                        else {
                            $("#AsegTipoViaId").val(fila.TipoViaId);
                        }
                        $("#AsegDireccion").val(fila.Direccion);
                        $("#AsegNumero").val($.trim(fila.Numero == 0 ? "" : fila.Numero));
                        $("#AsegManzana").val(fila.Manzana);
                        $("#AsegLote").val(fila.Lote);

                        if (fila.NumeroDepartamento != '0') {
                            $("#AsegNumeroDepartamento").val($.trim(fila.NumeroDepartamento));
                        }
                        $("#AsegNumeroInterior").val(fila.Interior);
                        $("#AsegReferencia").val(fila.Referencia);

                        var existsProv = $('#AsegProvinciaId option').filter(function () { return $(this).val() == fila.ProvinciaId }).length;
                        if (existsProv == 0) {
                            $("#AsegProvinciaId").val('');
                            ConsultaDistritosPorFiltro("AsegDistritoId", idDepartamento, '00');
                            fila.ProvinciaId = "";
                        }
                        else {
                            if (idDepartamento == fila.DepartamentoId) {
                                $("#AsegProvinciaId").val(fila.ProvinciaId);
                                ConsultaDistritosPorFiltro("AsegDistritoId", idDepartamento, fila.ProvinciaId);
                            } else {
                                $("#AsegProvinciaId").val('');
                                ConsultaDistritosPorFiltro("AsegDistritoId", idDepartamento, '00');
                                fila.ProvinciaId = "";
                            }
                        }
                        var existsDist = $('#AsegDistritoId option').filter(function () { return $(this).val() == fila.DistritoId }).length;
                        if (existsDist == 0) {
                            $("#AsegDistritoId").val('');
                            fila.DistritoId = "";
                        }
                        else {
                            if (idDepartamento == fila.DepartamentoId) {
                                $("#AsegDistritoId").val(fila.DistritoId);
                            } else {
                                $("#AsegDistritoId").val('');
                                fila.DistritoId = "";
                            }

                        }
                        $("#AsegEmail").val($.trim(fila.Email));

                        if (!isNaN(fila.TelefonoCasa)) {
                            var tlf = fila.TelefonoCasa;
                            fila.TelefonoCasa = fila.TelefonoCasa * 1;
                            if (fila.TelefonoCasa != '0') {
                                $("#AsegTelefonoCasa").val(tlf);
                            }
                        }
                        if (!isNaN(fila.TelefonoCelular)) {
                            fila.TelefonoCelular = fila.TelefonoCelular * 1;
                            if (fila.TelefonoCelular != '0') {
                                if (fila.TelefonoCelular != fila.TelefonoCasa) {
                                    $("#AsegTelefonoCelular").val(fila.TelefonoCelular);
                                }
                            }
                        }
                        $("#AseguradoCodigoInsunix").val($.trim(fila.SCODIGOINX));
                        $("#AseguradoCodigoVTime").val($.trim(fila.SCODIGOVT));
                        $("#AseguradoCodigoSexo").val($.trim(fila.CodigoSexo));
                        $("#RazonAntigua").val(fila.RazonSocial);
                        $("#AseguradoFechaNacimiento").val(fila.FechaNacimiento);
                        $("#AseguradoEstadoCivil").val(fila.EstadoCivil);

                        ControlesSeEncontroAsegurado();

                        //RQ2019-602
                        var Contacto = {
                            Direccion: {
                                Direccion: fila.Direccion,
                                Referencia: fila.Referencia,
                                DepartamentoId: fila.DepartamentoId,
                                ProvinciaId: fila.ProvinciaId,
                                DistritoId: fila.DistritoId
                            },
                            Email: $.trim(fila.Email),
                            Telefonos: {
                                TelefonoCasa: $.trim($("#AsegTelefonoCasa").val()),
                                TelefonoCelular: $.trim($("#AsegTelefonoCelular").val())
                            }
                        }
                        if (data.FlagBusqPerfPerfilamiento != null && data.FlagBusqPerfPerfilamiento == "1")
                            $("#FlagAsegBusqPerfPerfilamiento").val(true);

                        ControlesPerfilamiento(data.Perfilamiento, "GrpAsegu", Contacto);

                        if ($.trim($("#AsegDireccion").val()) == "POR DEFINIR") {

                            if ($.trim($("#AsegDepartamentoId").val()) == "99") {

                                if ($.trim($("#AsegProvinciaId").val()) == "99") {

                                    if ($.trim($("#AsegDistritoId").val()) == "99") {
                                        $("#flagDireccionAseg").val("1");
                                        document.getElementById("AsegTipoViaId").readOnly = false;
                                        document.getElementById("AsegDireccion").readOnly = false;
                                        document.getElementById("AsegReferencia").readOnly = false;
                                        document.getElementById("AsegProvinciaId").readOnly = false;
                                        document.getElementById("AsegDistritoId").readOnly = false;
                                        document.getElementById("AsegNumero").readOnly = false;
                                        document.getElementById("AsegLote").readOnly = false;
                                        document.getElementById("AsegNumeroDepartamento").readOnly = false;
                                        document.getElementById("AsegNumeroInterior").readOnly = false;
                                        document.getElementById("AsegReferencia").readOnly = false;
                                        document.getElementById("AsegDepartamentoId").readOnly = false;
                                        document.getElementById("AsegManzana").readOnly = false;
                                        document.getElementById("AsegTelefonoCasa").readOnly = false;
                                        document.getElementById("AsegTelefonoCelular").readOnly = false;
                                        document.getElementById("AsegEmail").readOnly = false;
                                    }
                                }
                            }
                        }
                        else {
                            $("#flagDireccionAseg").val("0");
                        }
                        if ($("#AsegTipoPersonaId").val() == "2" && $("#AsegTipoDeEmpresaID").val() == "2") {
                            $("#flagAsegRazonSocial").val("1");
                        }
                        $("#AsegNumeroDocumento").attr("disabled", "disabled");
                        $("#lnkBusqAsegurado").attr("disabled", "disabled");

                        if ($("#NumeroPlaca").val() == '') {
                            CalcularVigenciaDefault();
                        }
                    });
                    $("#findSection2").val('1');
                }
            },
            error: function () {
                alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk.");
            }
        });
        return true;
    }
    catch (e) {
        throw e;
    }
};
function habilitarControl(control, habilitado) {
    try {
        if (habilitado) {
            $(control).removeProp('readonly');
        } else {
            $(control).prop('readonly', true);
        }
    }
    catch (e) {
        throw e;
    }
}
//RQ2019-602 - EGALICIA - 11/08/2019
function ControlesPerfilamiento(perfilamiento, grp, contacto) {
    try {

        //Se generaliza por grupo de controles (Contratante / Asegurado)
        var pref = grp == 'GrpAsegu' ? 'Aseg' : 'Contra';

        //Validar permisos para la edición de la dirección
        if (perfilamiento.IndicadorDireccion == '0') {

            var obj = contacto.Direccion;

            /*
                Se valida que se tengan todos los valores necesarios de lo contrario no se podrá bloquear los controles correspondientes
                a la dirección
            */

            if ($.trim(obj.Direccion) != '' && $.trim(obj.DepartamentoId) != '' &&
                $.trim(obj.ProvinciaId) != '' && $.trim(obj.DistritoId) != '') {

                habilitarControl("#" + pref + "Direccion", false);
                habilitarControl("#" + pref + "Referencia", false);
                $("#" + pref + "DepartamentoId").prop('disabled', true);
                $("#" + pref + "ProvinciaId").prop('disabled', true);
                $("#" + pref + "DistritoId").prop('disabled', true);
            }
            else {
                //Se activa el flag para la busqueda de un perfil con mayor privilegio
                $("#Flag" + pref + "BusqPerfPerfilamiento").val(true);
            }
        }

        //Validar permisos para la edición de la dirección
        if (perfilamiento.IndicadorTelefono == '0') {

            /*
                Se valida que se tengan todos los valores necesarios de lo contrario no se podrá bloquear los controles correspondientes
                al teléfono
            */

            if (contacto.Telefonos.TelefonoCasa != '' && contacto.Telefonos.TelefonoCelular != '') {
                habilitarControl("#" + pref + "TelefonoCasa", false);
                habilitarControl("#" + pref + "TelefonoCelular", false);
            }
            else {
                $("#Flag" + pref + "BusqPerfPerfilamiento").val(true);
            }
        }

        //Validar permisos para la edición del correo
        if (perfilamiento.IndicadorCorreo == '0') {

            if (contacto.Email != "")
                habilitarControl("#" + pref + "Email", false);
            else
                $("#Flag" + pref + "BusqPerfPerfilamiento").val(true);
        }
    }
    catch (e) {
        throw e;
    }
}
function ControlesSeEncontroAsegurado() {
    try {
        if ($("#AsegTipoPersonaId :selected").val() == "1") {
            if ($("#AsegApellidoPaterno").val() != "" &&
                $("#AsegApellidoMaterno").val() != "" &&
                $("#AsegNombre").val() != "") {
                $("#AsegTipoPersonaId").attr('readOnly', true);
                $("#AsegTipoDocumentoId").attr('readOnly', true);
                $("#AsegNumeroDocumento").attr('readOnly', true);
                if ($("#AseguradoCodigoVTime").val() != '') {
                    $("#AsegApellidoPaterno").attr('readOnly', true);
                    $("#AsegApellidoMaterno").attr('readOnly', true);
                    $("#AsegNombre").attr('readOnly', true);
                }
            }
        }
        else {
            if ($("#AsegRazonSocial").val() != "" &&
                $("#AsegTipoEmpresaId :selected").val() != "") {
                $("#AsegTipoPersonaId").attr('readOnly', true);
                $("#AsegTipoDocumentoId").attr('readOnly', true);
                $("#AsegNumeroDocumento").attr('readOnly', true);
                if ($("#AseguradoCodigoVTime").val() != '') {
                    $("#AsegRazonSocial").attr('readOnly', true);
                    $("#AsegTipoEmpresaId").attr('readOnly', true);
                }
            }
        }
    }
    catch (e) {
        throw e;
    }
};
function CalcularVigenciaDefault() {
    try {
        var fechaActual = new Date();
        var fechaCalcul = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate());
        var fechaFinal = agregarMeses(fechaCalcul, 12);
        $("#FechaInicioVigencia").val(getFormattedDate(fechaCalcul));
        $("#FechaFinVigencia").val(getFormattedDate(fechaFinal));
        $("#FechaFinVigencia2").val(getFormattedDate(fechaFinal));
    }
    catch (e) {
        throw e;
    }
}
function ControlesNoTitularVehiculo() {
    try {
        $('#ContraTipoPersonaId').val("1");
        $('#ContraTipoDocumentoId').val("1");
        $("#grpDatosContratante").show();
        $("#primerGrpContrata").hide();
        $("#segundoGrpContrata").hide();
        $("#tercerGrpContrata").hide();
        $("#cuartoGrpContrata").hide();
        $("#quintoGrpContrata").hide();
        $("#sextoGrpContrata").hide();
    }
    catch (e) {
        throw e;
    }
};
function ControlesSiTitularVehiculo() {
    try {
        $("#grpDatosContratante").hide();
        $("#primerGrpContrata").hide();
        $("#segundoGrpContrata").hide();
        $("#tercerGrpContrata").hide();
        $("#cuartoGrpContrata").hide();
        $("#quintoGrpContrata").hide();
        $("#sextoGrpContrata").hide();
    }
    catch (e) {
        throw e;
    }
};
function ControlesBusqAsegurado() {
    try {
        $("#primerGrpAseguJuridico").hide();
        $("#primerGrpAsegu").hide();
        if ($("#AsegTipoPersonaId :selected").val() == "1") {
            $("#primerGrpAsegu").show();
        }
        else {
            $("#primerGrpAseguJuridico").show();
            $("#septimoGrpAsegu").hide();
            $("#octavoGrpAsegu").hide();
            $("#AsegRazonSocial").attr('maxlength', 60);
        }

        if ($("#hiddenFlagContextual").val() == '1') {
            $("#GrpAseguTipoPersona").show();
            $("#GrpAseguTipoDocumentoNumero").show();
        }

        $("#segundoGrpAsegu").show();
        $("#quintoGrpAsegu").show();
        $("#sextoGrpAsegu").show();
        $("#grpDatosCertificado").show();

        if ($("#AsegTipoPersonaId :selected").val() == "1" && $("#AsegTipoDocumentoId :selected").val() == "2") {
            $("#septimoGrpAsegu").show();
        }
    }
    catch (e) {
        throw e;
    }
};
function ConsultaClienteContratante(numeroDocumento, tipoDocumentoId, tipoPersonId, dniVendedor, aplicacionId, pPoliza, codigoClienteContextual) {
    try {
        if (tipoDocumentoId == "2" && !validarFormatoRuc('CONTRATANTE', numeroDocumento, tipoPersonId)) return;
        if (codigoClienteContextual == "NUEVO_CLIENTE") {
            codigoClienteContextual = "";
        }
        var urlAux = 'Ventas/ObtenerCliente';
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) {
            urlAux = 'ObtenerCliente';
        } else { pPoliza = 0; }

        $.ajax({
            url: urlAux,
            type: 'Get',
            data: {
                pNumeroDocumento: objEncrypt.encrypt(numeroDocumento),
                pTipoDocumentoId: objEncrypt.encrypt(tipoDocumentoId + ''),
                pTipoPersonaId: objEncrypt.encrypt(tipoPersonId + ''),
                pDniVendedor: objEncrypt.encrypt(dniVendedor),
                pIdAplicacion: aplicacionId,
                pPoliza: pPoliza,
                pIndicadorContAseg: 2,
                pCodigoClienteContextual: codigoClienteContextual

            },
            async: true,
            cache: true,
            success: function (data) {
                if (data.estado == "LO") {
                    LostSession();
                } else if (data.Clientes.length == 0 && $("#hiddenFlagContextual").val() == '1' && codigoClienteContextual != "NUEVO_CLIENTE" && codigoClienteContextual != "") {
                    alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Tipo de documento no permitido.</a> <br>Vuelva a realizar la busqueda o cree un nuevo cliente.</br>");
                    $("#lnkLimpiarBusquedaContextualContra").click();
                    return;
                }
                else {
                    // Setear por defecto nacionalidad para DNI y RUC
                    if ($("#ContraTipoDocumentoId").val() == '1' || $("#ContraTipoDocumentoId").val() == '2') {
                        $("#ContTipoNacionalidadID").val(1);
                        habilitarControlCombo("#ContTipoNacionalidadID", false);
                        // Setear por defecto Luxemburgo para carnet de extranjeria
                    } else if ($("#ContraTipoDocumentoId").val() == '3') {
                        habilitarControlCombo("#ContTipoNacionalidadID", true);
                        $("#ContTipoNacionalidadID").val(25);
                    } else {
                        habilitarControlCombo("#ContTipoNacionalidadID", true);
                    }
                    $("#septimoGrpContrata").show();
                    $("#octavoGrpContrata").show();
                    if ($("#ContraTipoDocumentoId").val() == '2') {
                        $("#septimoGrpContrata").hide();
                        $("#octavoGrpContrata").hide();
                    }
                    //mostrar campos
                    $('#ContratanteCodigoSexo').show();
                    $('#ContratanteEstadoCivil').show();
                    $('#ContratanteFechaNacimiento').show('');
                    $("#ContTipoNacionalidadID").show();

                    $("#lblSexoCont").show();
                    $("#lblFecnacCont").show();
                    $("#lblEstadocivilCont").show();
                    $("#lblNacionalidadCont").show();
                    // Indicar siempre por defector soltero para DNI y RUC 10
                    if ($("#ContraTipoPersonaId").val() == '1' && ($("#ContraTipoDocumentoId").val() == '1' || $("#ContraTipoDocumentoId").val() == '2')) {
                        $('#ContratanteEstadoCivil option').eq(2).prop('selected', true);
                    }
                    if ($("#ContraTipoPersonaId").val() == '2') {
                        $("#ContRubroEconomicoID").val('7499');
                        $("#ContTipoDeEmpresaID").val('7');
                        habilitarControlCombo("#ContTipoDeEmpresaID", true);
                        habilitarControlCombo("#ContRubroEconomicoID", true);
                        $("#ContraRazonSocial").removeAttr('readOnly');
                    }
                    habilitarControlCombo("#ContraTipoPersonaId", false);
                    habilitarControlCombo("#ContraTipoDocumentoId", false);
                    habilitarControl("#ContraNumeroDocumento", false);

                    /* SETEO DE DEPARTAMENTO - PROVINCIA - DISTRITO */
                    var idZonaCirculacion = $("#ddlZonaCirculacion option:selected").val();
                    var idDepartamento = idZonaCirculacion.substring(0, 2); //RQ2022-598
                    $("#ContraDepartamentoId").prop('disabled', false); //RQ2022-598
                    $("#ContraDepartamentoId").val(idDepartamento);
                    ConsultaProvinciasPorFiltro("ContraProvinciaId", idDepartamento);
                    ConsultaDistritosPorFiltro("ContraDistritoId", idDepartamento, '00');
                    /*----------------------------------------------*/
                    $('#ContratanteCodigoSexo option').eq(2).prop('selected', true);
                    $('#ContratanteEstadoCivil option').eq(2).prop('selected', true);

                    //RQ2019-602 - EGALICIA - 11/08/2019 
                    //Se modifica la lectura del response
                    $.each(data.Clientes, function (i, fila) {

                        //INI RQ2021-698
                        if ($("#hiddenFlagContextual").val() == '1' && $("#ContraTipoDocumentoId").val() == null) {
                            $("#ContraTipoPersonaId").val(fila.TipoPersonaId);
                            $("#ContraTipoDocumentoId").val(fila.TipoDocumentoId);
                            $("#ContraNumeroDocumento").val(fila.NumeroDocumento);
                            if ($("#ContraTipoDocumentoId").val() == '1' || $("#ContraTipoDocumentoId").val() == '2') {
                                $("#ContTipoNacionalidadID").val(1);
                                habilitarControlCombo("#ContTipoNacionalidadID", false);
                                // Setear por defecto Luxemburgo para carnet de extranjeria
                            } else if ($("#ContraTipoDocumentoId").val() == '3') {
                                habilitarControlCombo("#ContTipoNacionalidadID", true);
                                $("#ContTipoNacionalidadID").val(25);
                            } else {
                                habilitarControlCombo("#ContTipoNacionalidadID", true);
                            }

                            if ($("#ContraTipoDocumentoId").val() == '2') {
                                $("#septimoGrpContrata").hide();
                                $("#octavoGrpContrata").hide();
                            }

                            if ($("#ContraTipoPersonaId").val() == '1' && ($("#ContraTipoDocumentoId").val() == '1' || $("#ContraTipoDocumentoId").val() == '2')) {
                                $('#ContratanteEstadoCivil option').eq(2).prop('selected', true);
                            }
                        }
                        //FIN RQ2021-698

                        $("#ContratanteId").val(fila.ClienteId);

                        var tipoPersona = $('#ContraTipoPersonaId').val();
                        habilitarControlCombo("#ContraTipoPersonaId", false);
                        habilitarControlCombo("#ContraTipoDocumentoId", false);
                        habilitarControl("#ContraNumeroDocumento", false);

                        //ini dataquality
                        if ($("#ContraTipoDocumentoId").val() == '3' || $("#ContraTipoDocumentoId").val() == '12') {
                            $("#ContTipoNacionalidadID").val(fila.NacionalidadId);
                        }
                        //fin dataquality

                        if (tipoPersona == 1) {
                            if ($.trim(fila.ApellidoPaterno) != "" && $.trim(fila.ApellidoPaterno) != null) {
                                $("#ContraApellidoPaterno").val($.trim(fila.ApellidoPaterno));
                                $("#ContraApellidoMaterno").val($.trim(fila.ApellidoMaterno));
                                $("#ContraNombre").val($.trim(fila.Nombre));
                                habilitarControl("#ContraApellidoPaterno", false);
                                habilitarControl("#ContraApellidoMaterno", false);
                                habilitarControl("#ContraNombre", false);

                                //ini dataquality
                                $('#ContratanteCodigoSexo').hide();
                                $('#ContratanteEstadoCivil').hide();
                                $('#ContratanteFechaNacimiento').hide('');
                                $("#ContTipoNacionalidadID").hide();

                                $("#lblSexoCont").hide();
                                $("#lblFecnacCont").hide();
                                $("#lblEstadocivilCont").hide();
                                $("#lblNacionalidadCont").hide();
                                //fin dataquality
                            }
                            else {
                                habilitarControl("#ContraApellidoPaterno", true);
                                habilitarControl("#ContraApellidoMaterno", true);
                                habilitarControl("#ContraNombre", true);
                            }

                        } else if (tipoPersona == 2) {
                            if ($.trim(fila.RazonSocial) != "" && $.trim(fila.RazonSocial) != null) {
                                $("#ContraRazonSocial").val($.trim(fila.RazonSocial));

                                habilitarControl("#ContraRazonSocial", false);
                                //ini dataquality
                                habilitarControlCombo("#ContTipoDeEmpresaID", false);
                                habilitarControlCombo("#ContRubroEconomicoID", false);
                                //fin dataquality
                            }
                            else {
                                habilitarControl("#ContraRazonSocial", true);
                                //ini dataquality
                                habilitarControlCombo("#ContTipoDeEmpresaID", true);
                                habilitarControlCombo("#ContRubroEconomicoID", true);
                                //fin dataquality
                            }
                        }

                        if (fila.SCODIGOINX != '' || fila.SCODIGOVT != '') {
                            $("#septimoGrpContrata").hide();
                            $("#octavoGrpContrata").hide();
                        }
                        var existsEmp = $('#ContTipoDeEmpresaID option').filter(function () { return $(this).val() == fila.TipoEmpresaId; }).length;
                        if (existsEmp == 0 || fila.TipoEmpresaId == '0') {
                            $("#ContTipoDeEmpresaID").val('7');
                            habilitarControlCombo("#ContTipoDeEmpresaID", false);
                        }
                        else {
                            $("#ContTipoDeEmpresaID").val(fila.TipoEmpresaId);
                            habilitarControlCombo("#ContTipoDeEmpresaID", false);
                        }
                        if (fila.SCODIGOVT == '' && fila.SCODIGOINX == '') {
                            habilitarControlCombo("#ContTipoDeEmpresaID", true);
                            habilitarControl("#ContRazonSocial", true);
                            if ($.trim(fila.RazonSocial) == '') {
                                $("#ContraRazonSocial").removeAttr('readOnly');
                            }
                            if ($.trim(fila.ApellidoPaterno) == '') {
                                $("#ContraApellidoPaterno").removeAttr('readOnly');
                            }
                            if ($.trim(fila.ApellidoMaterno) == '') {
                                $("#ContraApellidoMaterno").removeAttr('readOnly');
                            }
                            if ($.trim(fila.Nombre) == '') {
                                $("#ContraNombre").removeAttr('readOnly');
                            }
                            $('#ContratanteCodigoSexo').show();
                            $('#ContratanteEstadoCivil').show();
                            $('#ContratanteFechaNacimiento').show('');
                            $("#ContTipoNacionalidadID").show();
                            if ($("#ContraTipoDocumentoId").val() == '1' || $("#ContraTipoDocumentoId").val() == '2') {
                                habilitarControlCombo("#ContTipoNacionalidadID", false);
                            } else {
                                habilitarControlCombo("#ContTipoNacionalidadID", true);
                            }
                            $("#lblSexoCont").show();
                            $("#lblFecnacCont").show();
                            $("#lblEstadocivilCont").show();
                            $("#lblNacionalidadCont").show();
                        }
                        var existsRubEmp = $('#ContRubroEconomicoID option').filter(function () { return $(this).val() == fila.RubroEconomico; }).length;
                        if (existsRubEmp == 0 || fila.RubroEconomico == '0') {
                            $("#ContRubroEconomicoID").val('7499');
                            habilitarControlCombo("#ContRubroEconomicoID", true);
                        }
                        else {
                            $("#ContRubroEconomicoID").val(fila.RubroEconomico);
                            habilitarControlCombo("#ContRubroEconomicoID", false);
                        }
                        $("#ContraRazonSocial").val(fila.RazonSocial);
                        if (fila.TipoViaId == 0 || fila.TipoViaId == '') {
                            $("#ContraTipoViaId").val('1');
                        }
                        else {
                            $("#ContraTipoViaId").val(fila.TipoViaId);
                        }
                        $("#ContraDireccion").val(fila.Direccion);
                        $("#ContraNumero").val($.trim(fila.Numero == 0 ? "" : fila.Numero));
                        $("#ContraManzana").val(fila.Manzana);
                        $("#ContraLote").val(fila.Lote);
                        if (fila.NumeroDepartamento != '0') {
                            $("#ContraNumeroDepartamento").val($.trim(fila.NumeroDepartamento));
                        }
                        $("#ContraNumeroInterior").val(fila.Interior);
                        $("#ContraReferencia").val(fila.Referencia);

                        var existsProv = $('#ContraProvinciaId option').filter(function () { return $(this).val() == fila.ProvinciaId }).length;
                        if (existsProv == 0) {
                            $("#ContraProvinciaId").val('');
                            ConsultaDistritosPorFiltro("ContraDistritoId", idDepartamento, '00');
                            fila.ProvinciaId = "";
                        }
                        else {
                            if (idDepartamento == fila.DepartamentoId) {
                                $("#ContraProvinciaId").val(fila.ProvinciaId);
                                ConsultaDistritosPorFiltro("ContraDistritoId", idDepartamento, fila.ProvinciaId);
                            } else {
                                $("#ContraProvinciaId").val('');
                                ConsultaDistritosPorFiltro("ContraDistritoId", idDepartamento, '00');
                                fila.ProvinciaId = "";
                            }

                        }
                        var existsDist = $('#ContraDistritoId option').filter(function () { return $(this).val() == fila.DistritoId }).length;
                        if (existsDist == 0) {
                            $("#ContraDistritoId").val('');
                            fila.DistritoId = "";
                        }
                        else {
                            if (idDepartamento == fila.DepartamentoId) {
                                $("#ContraDistritoId").val(fila.DistritoId);
                            } else {
                                $("#ContraDistritoId").val('');
                                fila.DistritoId = "";
                            }
                        }

                        $("#ContraEmail").val($.trim(fila.Email));

                        if (!isNaN(fila.TelefonoCasa)) {
                            var tlf = fila.TelefonoCasa;
                            fila.TelefonoCasa = fila.TelefonoCasa * 1;
                            if (fila.TelefonoCasa != '0') {
                                $("#ContraTelefonoCasa").val(tlf);
                            }
                        }
                        if (!isNaN(fila.TelefonoCelular)) {
                            fila.TelefonoCelular = fila.TelefonoCelular * 1;
                            if (fila.TelefonoCelular != '0') {
                                if (fila.TelefonoCelular != fila.TelefonoCasa) {
                                    $("#ContraTelefonoCelular").val(fila.TelefonoCelular);
                                }
                            }
                        }
                        $("#ContratanteCodigoInsunix").val($.trim(fila.SCODIGOINX));
                        $("#ContratanteCodigoVTime").val($.trim(fila.SCODIGOVT));
                        $("#ContratanteCodigoSexo").val($.trim(fila.CodigoSexo));
                        $("#ContratanteFechaNacimiento").val(fila.FechaNacimiento);
                        $("#ContratanteEstadoCivil").val(fila.EstadoCivil);

                        ControlesSeEncontroContratante();

                        //RQ2019-602
                        var Contacto = {
                            Direccion: {
                                Direccion: fila.Direccion,
                                Referencia: fila.Referencia,
                                DepartamentoId: fila.DepartamentoId,
                                ProvinciaId: fila.ProvinciaId,
                                DistritoId: fila.DistritoId
                            },
                            Email: $.trim(fila.Email),
                            Telefonos: {
                                TelefonoCasa: $.trim($("#ContraTelefonoCasa").val()),
                                TelefonoCelular: $.trim($("#ContraTelefonoCelular").val())
                            }
                        }

                        if (data.FlagBusqPerfPerfilamiento != null && data.FlagBusqPerfPerfilamiento == "1")
                            $("#FlagContraBusqPerfPerfilamiento").val(true);

                        ControlesPerfilamiento(data.Perfilamiento, "GrpContrata", Contacto);

                        if ($.trim($("#ContraDireccion").val()) == "POR DEFINIR") {

                            if ($.trim($("#ContraDepartamentoId").val()) == "99") {

                                if ($.trim($("#ContraProvinciaId").val()) == "99") {

                                    if ($.trim($("#ContraDistritoId").val()) == "99") {
                                        document.getElementById("ContraTipoViaId").readOnly = false;
                                        document.getElementById("ContraDireccion").readOnly = false;
                                        document.getElementById("ContraReferencia").readOnly = false;
                                        document.getElementById("ContraProvinciaId").readOnly = false;
                                        document.getElementById("ContraDistritoId").readOnly = false;
                                        document.getElementById("ContraNumero").readOnly = false;
                                        document.getElementById("ContraLote").readOnly = false;
                                        document.getElementById("ContraNumeroDepartamento").readOnly = false;
                                        document.getElementById("ContraNumeroInterior").readOnly = false;
                                        document.getElementById("ContraReferencia").readOnly = false;
                                        document.getElementById("ContraDepartamentoId").readOnly = false;
                                        document.getElementById("ContraManzana").readOnly = false;
                                        document.getElementById("ContraTelefonoCasa").readOnly = false;
                                        document.getElementById("ContraTelefonoCelular").readOnly = false;
                                        document.getElementById("ContraEmail").readOnly = false;
                                    }
                                }
                            }
                        }
                        $("#ContraNumeroDocumento").attr("disabled", "disabled");
                        $("#lnkBusqContratante").attr("disabled", "disabled");

                        if ($("#NumeroPlaca").val() == '') {
                            CalcularVigenciaDefault();
                        }
                    });
                }
            },
            error: function () {
                alertValida("Se produjo un error al obtener los datos de clientes.");
            }
        });
        return true;
    }
    catch (e) {
        throw e;
    }
};
function validarFormatoRuc(tipoCli, numeroDocumento, tipoPersonId) {
    try {
        var urlAux = 'Ventas/ValidarFormatoRuc';
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { urlAux = 'ValidarFormatoRuc'; }

        var pasa = true;
        $.ajax({
            url: urlAux,
            type: 'Get',
            data: {
                pNumeroDocumento: numeroDocumento,
                pTipoPersonaId: tipoPersonId
            },
            async: false,
            cache: true,
            success: function (data) {
                if (data.IsValid == false) {
                    alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                    return;
                }
                if (data.valida == "0") {
                    alertValida(tipoCli + ": El formato de ruc ingresado no es correcto.");
                    pasa = false;
                }
            }
        });
        return pasa;
    }
    catch (e) {
        throw e;
    }
}
function ControlesSeEncontroContratante() {
    try {
        $("#ContraTipoPersonaId").attr("disabled", "disabled");
        $("#ContraTipoDocumentoId").attr("disabled", "disabled");
        $("#ContraNumeroDocumento").attr('readOnly', true);
        $("#ContraNumeroDocumento").attr("disabled", "disabled");

        if ($("#ContraTipoPersonaId :selected").val() == "1") {
            if ($("#ContraApellidoPaterno").val() != "" &&
                $("#ContraApellidoMaterno").val() != "" &&
                $("#ContraNombre").val() != "") {
                $("#ContraNumeroDocumento").attr('readOnly', true);
                if ($("#ContratanteCodigoVTime").val() != '') {
                    $("#ContraApellidoPaterno").attr('readOnly', true);
                    $("#ContraApellidoMaterno").attr('readOnly', true);
                    $("#ContraNombre").attr('readOnly', true);
                }
            }
        }
        else {
            if ($("#ContraRazonSocial").val() != "" &&
                $("#ContraTipoEmpresaId :selected").val() != "") {
                $("#ContraNumeroDocumento").attr('readOnly', true);
                if ($("#ContratanteCodigoVTime").val() != '') {
                    $("#ContraRazonSocial").attr('readOnly', true);
                    $("#ContraTipoEmpresaId").attr("disabled", "disabled");
                }
            }
        }
    }
    catch (e) {
        throw e;
    }
};
function ObtenerInformacionPlaca(tipoPlaca, placa, ramo, esPlacaEnTramite) {
    try {
        var sIntermediario = "";
        var sRol = "";
        $("#tlpExtrangera").text('');
        $("#tdExtrangera").css("display", "none");
        $('#pnlPlaca').css("padding", "0 32%");
        $("#hdnFlagPlacaExtrangera").val('0');

        //INI RQ2025-884
        let valorTipoFormatoPlaca = $("input[name='tipoFormatoPlaca']:checked").val();

        if (typeof valorTipoFormatoPlaca === "undefined")
            valorTipoFormatoPlaca = 0;
        //FIN RQ2025-884

        if (flagAgenciamiento() === 1) {
            var oficina = $("#IdOficina").val();
            var rol = $("#idRol").val();
            var intermediario = $("#idIntermediario").val();
            var tipoIntermediario = $("#idTipoIntermediario").val();
            if (oficina == "" || oficina == "0") {
                alertValida("Favor de seleccionar una oficina.");
                $("#IdOficina").focus();
                return false;
            }
            if (tipoIntermediario == 0) {
                if (intermediario == "" || intermediario == "0") {
                    alertValida("Favor de seleccionar un Broker.");
                    $("#idIntermediario").focus();
                    return false;
                }
            } else {
                if (rol == "" || rol == "0") {
                    alertValida("Favor de seleccionar un Rol.");
                    $("#idRol").focus();
                    return false;
                }
            }
            sIntermediario = intermediario;
            sRol = rol;
        }
        var urlAux = 'Ventas/ObtenerInformacionPlaca';
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { urlAux = 'ObtenerInformacionPlaca'; }

        var bObtenerInformacionPlaca = false;
        $.ajax({
            url: urlAux,
            type: 'Get',
            data: {
                pPlaca: placa,
                pRamo: ramo,
                pTipoPlaca: tipoPlaca,
                pEsPlacaTramite: esPlacaEnTramite,
                pTipoPlacaId: tipoPlaca,
                pLetraPlaca: $("#NumeroPlaca").val().toUpperCase(),
                pComercializadorId: $("#ComercializadorIntermediarioId").val(),
                pIdAplicacion: $("#AplicacionId").val(),
                pFechaInicioVigencia: $("#FechaInicioVigencia").val(),
                pIntermediario: sIntermediario,
                pRol: sRol,
                pTipoFormatoPlaca: valorTipoFormatoPlaca //RQ2025-884
            },
            async: true,
            cache: true,
            success: function (data) {
                if (data.IsValid == false) {
                    alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                    return;
                }
                if (data.Valid == false) {
                    alertValida(data.ErrorMessage);
                    return;
                }
                $("#findSection1").val('1');
                //console.log('data.estado.1', data.estado);
                if (data.estado == "LO") {
                    LostSession();
                    $("#findSection1").val('0');
                }
                else {
                    var certifVigente = false;
                    var fechaCalculo;
                    var haveRoles = false;
                    var procesoClass = false;
                    CalcularVigenciaDefault();
                    cmbSeleccione('MarcaId');
                    cmbSeleccione('ModeloId');
                    cmbSeleccione('VersionId');
                    cmbSeleccione('CatId');
                    $("#NumeroAsiento").val('');
                    $("#Año").val('');
                    $("#CodInsunixPla").val('');
                    //console.log('data.estado.2', data.estado);
                    //console.log('data.resultado.FlagPlacaExtrangera', data.resultado.FlagPlacaExtrangera);
                    //console.log('(data.resultado.CertificadosDTO', data.resultado.CertificadosDTO);
                    if (data.estado == "OK") {

                        ValidaPlacaExtrangera(data.resultado.FlagPlacaExtrangera);

                        $.each(data.resultado.CertificadosDTO, function (i, fila) {
                            $("#hdnTipoPlaca").val(fila.VehiculoDTO.TipoPlacaId);
                            var vehiculo = fila.VehiculoDTO;
                            var asegurado = fila.AseguradoDTO;
                            var contratante = fila.ContratanteDTO;
                            var procesoCheck = false;
                            if (data.mClases != null) {
                                CargarClasesPorData(data.mClases, vehiculo.ClaseId);
                            }
                            if (data.mUsos != null) {
                                CargarUsosPorData(data.mUsos);
                            }
                            //A.E.
                            if (data.mCats != null) {
                                CargarCatsPorData(data.mCats);
                            }
                            var existsClase = $('#ClaseId option').filter(function () { return $(this).val() == vehiculo.ClaseId; }).length;
                            if (vehiculo.ClaseId == 0 || existsClase == 0) {
                                $("#ClaseId").val('0');
                            }
                            else {
                                $("#ClaseId").val(vehiculo.ClaseId);
                                procesoCheck = true;
                                //RQ2023-484
                                if ($("#hdnFlagTarifaOrbeliteAct").val() == '1') {
                                    $("#hdnResultadoPlacaTarifa").val('1');
                                    $("#hdnClaseTarifaRes").val(vehiculo.ClaseId);
                                    var descClase = document.getElementById("ClaseId").options[document.getElementById("ClaseId").selectedIndex].text;
                                    $("#hdnDescClaseTarifaRes").val(descClase);
                                }


                            }
                            procesoClass = true;


                            if (procesoClass == true) {
                                var fechaFinVigenciaPoliza = fila.FechaFinPolizaVigente;
                                $('#fechaFinVigenciaPoliza').val(fechaFinVigenciaPoliza);
                                var existsUso = $('#UsoId option').filter(function () { return $(this).val() == vehiculo.UsoId; }).length;
                                if (existsUso == 0) {
                                    if ($('#UsoId option').length == 2) {
                                        $("#UsoId").val('1');
                                        $("#IdUsoOrigen").val('1');
                                    }
                                    else {
                                        $("#UsoId").val('0');
                                        $("#IdUsoOrigen").val('0');
                                    }
                                }
                                else {
                                    if (vehiculo.UsoId == 0) {
                                        $("#UsoId").val('0');
                                        $("#IdUsoOrigen").val('0');
                                    }
                                    else {
                                        $("#UsoId").val(vehiculo.UsoId);
                                        $("#IdUsoOrigen").val(vehiculo.UsoId);
                                    }
                                }

                                $("#NumeroSerie").val(vehiculo.NumeroSerie);
                                $("#Año").val(vehiculo.Año == 0 ? "" : vehiculo.Año);
                                $("#MotorVehiculo").val(vehiculo.NroMotor);
                                $("#ModeloEspecifico").val(vehiculo.ModeloEspecifico);
                                $("#NumeroAsiento").val(vehiculo.NumeroAsiento == 0 ? "" : vehiculo.NumeroAsiento);

                                if (procesoCheck == true) {
                                    CargaMarcasPorData(data.mMarcas, vehiculo.MarcaId);
                                    if (vehiculo.MarcaId == '0' || vehiculo.MarcaId == '') {
                                        cmbSeleccione('ModeloId');
                                        cmbSeleccione('VersionId');
                                    }
                                    else {
                                        CargaModelosPorData(data.mModelos, vehiculo.ModeloId);
                                        CargaVersionPorData(data.mVersiones, vehiculo.VersionId);
                                        //RQ2023-484
                                        if ($("#hdnFlagTarifaOrbeliteAct").val() == '1') {
                                            $("#hdnMarcaTarifaRes").val(vehiculo.MarcaId);
                                            $("#hdnModeloTarifaRes").val(vehiculo.ModeloId);
                                            $("#hdnVersionTarifaRes").val(vehiculo.VersionId);

                                            var descMarca = document.getElementById("MarcaId").options[document.getElementById("MarcaId").selectedIndex].text;
                                            $("#hdnDescMarcaTarifaRes").val(descMarca);
                                            var descModelo = document.getElementById("ModeloId").options[document.getElementById("ModeloId").selectedIndex].text;
                                            $("#hdnDescModeloTarifaRes").val(descModelo);
                                            var descVersion = document.getElementById("VersionId").options[document.getElementById("VersionId").selectedIndex].text;
                                            $("#hdnDescVersionTarifaRes").val(descVersion);
                                            $("#hdnAnioTarifaRes").val(vehiculo.Año);
                                        }
                                    }

                                    ControlesBusqVehiculo();
                                }
                                if ((asegurado.NumeroDocumento !== '') && (asegurado.NumeroDocumento !== null)) {
                                    if (asegurado.SCODIGOINX != '') {
                                        $("#CodInsunixPla").val(asegurado.SCODIGOINX);
                                    }
                                    $("#AsegTipoPersonaId").val(asegurado.TipoPersonaId);
                                    OcultarControlTipoPersona('1');
                                    $("#AsegTipoDocumentoId").val(asegurado.TipoDocumentoId);
                                    $("#AsegNumeroDocumento").val(asegurado.NumeroDocumento);
                                    $("#AseguradoOrigen").val(asegurado.NumeroDocumento);
                                    $("#hiddenCodigoClienteContextual").val(asegurado.SCODIGOVT);//RQ2022-254
                                    ConsultaClienteAsegurado(asegurado.NumeroDocumento,
                                        asegurado.TipoDocumentoId,
                                        asegurado.TipoPersonaId,
                                        $("#ComercializadorDni").val(),
                                        $("#AplicacionId").val(), 0, $("#hiddenCodigoClienteContextual").val());
                                    ControlesBusqAsegurado();
                                    if ($('#ddlTipoComprobante').length == 1) {
                                        CambioTipoComprobanteAsegurado();
                                    }
                                    haveRoles = true;
                                }
                                if ((contratante.NumeroDocumento !== '') && (contratante.NumeroDocumento !== null)) {
                                    if ((asegurado.NumeroDocumento !== '') && (asegurado.NumeroDocumento !== null)) {
                                        if (contratante.NumeroDocumento !== asegurado.NumeroDocumento) {
                                            $("#rbtnNoTitularVehiculo").click();
                                            $("#ContraTipoPersonaId").val(contratante.TipoPersonaId);
                                            $("#ContraTipoDocumentoId").val(contratante.TipoDocumentoId);
                                            $("#ContraNumeroDocumento").val(contratante.NumeroDocumento);
                                            $("#hiddenCodigoClienteContextualContra").val(contratante.SCODIGOVT);//RQ2022-254
                                            ConsultaClienteContratante(contratante.NumeroDocumento,
                                                contratante.TipoDocumentoId,
                                                contratante.TipoPersonaId,
                                                $("#ComercializadorDni").val(),
                                                $("#AplicacionId").val(),
                                                "0",
                                                $("#hiddenCodigoClienteContextualContra").val());
                                            ControlesBusqContratante();
                                            haveRoles = true;
                                            if ($('#ddlTipoComprobante').length == 1) {
                                                CambioTipoComprobantePagador();
                                            }
                                        }
                                    }
                                }

                                $.each(data.resultado.CertificadosDTO, function (i, fila) {
                                    var fechaActual = new Date();
                                    var fechaCalcul = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate());
                                    var fechaFinVigencia = fila.datefin;

                                    var fechaInicioVigenciaParaEndoso = fila.dateini; //RQ2023-161

                                    certifVigente = false;
                                    if (fechaFinVigencia != '') {
                                        if (fechaFinVigencia != '01/01/0001') {
                                            certifVigente = true;
                                            fechaCalculo = fechaFinVigencia;

                                            //INI RQ2023-161
                                            $('#hdnFechaInicioVigenciaEndoso').val(fechaInicioVigenciaParaEndoso);
                                            $('#hdnFechaFinVigenciaEndoso').val(fechaFinVigencia);
                                            //FIN RQ2023-161
                                        }
                                    }
                                });
                            }
                            else {
                                cmbSeleccione('MarcaId');
                                cmbSeleccione('ModeloId');
                                cmbSeleccione('VersionId');
                                cmbSeleccione('CatId');
                            }

                        });

                        //console.log('procesoClass', procesoClass);
                        if (procesoClass == true) {
                            $("#lnkBusqPlaca").attr('disabled', 'disabled');
                            $("#chkTramite").attr('disabled', 'disabled');
                            $("#NumeroPlaca").attr("disabled", "disabled");

                            var cFlagActivo = data.mflag;
                            var cConfTipoIntermed = data.mConf;
                            BloquearControles(cFlagActivo, cConfTipoIntermed);

                            ControlesBusqPlaca();
                            //console.log('certifVigente', certifVigente);
                            //console.log('esPlacaEnTramite', esPlacaEnTramite);
                            if (certifVigente == true && esPlacaEnTramite == 0) {
                                //alertValida('VEHICULO: A la fecha de hoy la placa ingresada cuenta con una póliza vigente que finaliza el ´' + fechaCalculo + '´.');
                                CambioVigencia(fechaCalculo);
                            }
                        }

                        if (data.mAlertaPolizasVigentes !== '') {
                            alertValida(data.mAlertaPolizasVigentes);
                        }

                    }
                    else {
                        $("#primerGrpVehi").hide();
                        $("#segundoGrpVehi").hide();
                        $("#tercerGrpVehi").hide();
                        $("#cuartoGrpVehi").hide();
                        $("#NumeroAsiento").val('');
                        $("#Año").val('');
                        $("#NumeroPlaca").removeAttr("disabled");
                        alertValida('VEHICULO:' + data.resultado);
                        $("#NumeroPlaca").focus();
                        $("#findSection1").val('0');
                    }

                    //INI RQ2023-161
                    if (idFlagEndoso == 1) {
                        $('#FechaInicioVigencia').val($('#hdnFechaInicioVigenciaEndoso').val());
                        $('#FechaFinVigencia2').val($('#hdnFechaFinVigenciaEndoso').val());
                    }
                    //FIN RQ2023-161

                }
            },
            error: function () {
                alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk.");
                LostSession();
            }
        });
        return bObtenerInformacionPlaca;
    }
    catch (e) {
        throw e;
    }
};

function flagAgenciamiento() {
    var flagAgenciamiento = 0;
    if ($('#trDatosAgenciamiento').is(':visible') && $("#hdnCotizacionEditar").val() === "0") {
        flagAgenciamiento = 1;
    }
    return flagAgenciamiento;
}

//RQ2021-290
function BloquearControles(valor, conTipoIntermed) {
    var ddlClase = document.getElementById("ClaseId");
    var txtNumeroAsiento = document.getElementById("NumeroAsiento");
    var txtAnio = document.getElementById("Año");
    var ddlfCats = document.getElementById("CatId");
    var ddlMarca = document.getElementById("MarcaId");
    var ddlModelo = document.getElementById("ModeloId");


    if (valor === 1 && conTipoIntermed === 1) {
        if (ddlClase.value !== '0' && ddlMarca.value !== '' && ddlModelo.value !== '') {
            ddlClase.disabled = true;
            ddlMarca.disabled = true;
            ddlModelo.disabled = true;

            RemoverItems(ddlClase);
            RemoverItems(ddlMarca);
            RemoverItems(ddlModelo);

        }

        if ($('#CatId').val().trim() !== '0') {
            ddlfCats.disabled = true;
        }
    }
}
function RemoverItems(objeto) {
    for (var count = objeto.options.length - 1; count >= 0; count--) {
        if (objeto.options[count].selected !== true) {
            objeto.remove(count, null);
        }
    }
}

function LiberarControles() {
    var ddlClase = document.getElementById("ClaseId");
    var txtAsientos = document.getElementById("NumeroAsiento");
    var txtAnio = document.getElementById("Año");
    var ddlfCats = document.getElementById("CatId");
    var ddlMarca = document.getElementById("MarcaId");
    var ddlModelo = document.getElementById("ModeloId");

    ddlClase.disabled = false;
    txtAsientos.disabled = false;
    txtAnio.disabled = false;
    ddlfCats.disabled = false;
    ddlMarca.disabled = false;
    ddlModelo.disabled = false;

    //RQ2023-484
    $("#hdnResultadoPlacaTarifa").val('');
    $("#hdnMarcaTarifaRes").val('');
    $("#hdnModeloTarifaRes").val('');
    $("#hdnAnioTarifaRes").val('');
    $("#hdnClaseTarifaRes").val('');
    $("#hdnDescMarcaTarifaRes").val('');
    $("#hdnDescModeloTarifaRes").val('');
    $("#hdnDescClaseTarifaRes").val('');
    $("#hdnVersionTarifaRes").val('');
    $("#hdnDescVersionTarifaRes").val('');
    $("#hdnflagTarifaOrberlite").val('');
}
//RQ2021-290
function ValidaPlacaExtrangera(a) {
    if (a === 1) {
        $("#tdExtrangera").css("display", "block");
        $("#tlpExtrangera").text(' * La placa ingresada tiene formato extranjero, solo podrá consultar tarifas de frontera.');
        $("#hdnFlagPlacaExtrangera").val('1');
        $('#pnlPlaca').css("padding", "0 18%");
    }
}
function CargarClasesPorData(data, claseSel) {
    try {
        var ddlfClases = document.getElementById("ClaseId");
        ddlfClases.options.length = 0;
        ddlfClases.options[0] = new Option("--Seleccione--", "0");
        ddlfClases.selectedIndex = 0;
        ddlfClases.disabled = true;
        datalenght = data.length;
        if (datalenght > 0) {
            $.each(data, function (i, row) {
                ddlfClases.options[i + 1] = new Option(row.DescripcionClase, row.ClaseId);
            });
            ddlfClases.disabled = false;
            if (claseSel != "") {
                $("#ClaseId").val(claseSel);
            }
            else {
                $("#ClaseId").prop("selectedIndex", 0);
            }
            if (datalenght == 1) {
                ddlfClases.selectedIndex = 1;
            }
        }
    }
    catch (e) {
        throw e;
    }
};
function cmbSeleccione(miCtrlId) {
    try {
        var ddl = document.getElementById(miCtrlId);
        ddl.options.length = 0;
        ddl.options[0] = new Option("--Seleccione--", "");
        ddl.selectedIndex = 0;
    }
    catch (e) {
        throw e;
    }
}
function CargarUsosPorData(data) {
    try {
        var ddlfUsos = document.getElementById("UsoId");
        var datalenght = 0;
        ddlfUsos.options.length = 0;
        ddlfUsos.options[0] = new Option("--Seleccione--", "0");
        ddlfUsos.selectedIndex = 0;
        ddlfUsos.disabled = true;
        datalenght = data.length;
        if (datalenght > 0) {
            $.each(data, function (i, row) {
                ddlfUsos.options[i + 1] = new Option(row.DescripcionUso, row.UsoId);
            });
            if (datalenght == 1) {
                ddlfUsos.selectedIndex = 1;
            }
            ddlfUsos.disabled = false;
        }
    }
    catch (e) {
        throw e;
    }
};
function CargarCatsPorData(data) {
    try {
        var ddlfCats = document.getElementById("CatId");
        var datalenght = 0;
        ddlfCats.options.length = 0;
        ddlfCats.options[0] = new Option("--Seleccione--", "0");
        ddlfCats.selectedIndex = 0;
        ddlfCats.disabled = true;
        datalenght = data.length;
        if (datalenght > 0) {
            $.each(data, function (i, row) {
                ddlfCats.options[i + 1] = new Option(row.DescripcionCat, row.CatId);
            });
            if (datalenght == 1) {
                ddlfCats.selectedIndex = 1;
            }
            ddlfCats.disabled = false;
        }
    }
    catch (e) {
        throw e;
    }
};
function CargaMarcasPorData(data, MarcaId) {
    try {
        var ddlfMarcas = document.getElementById("MarcaId");
        var datalenght = 0;
        var marcatmp = 0;
        ddlfMarcas.options.length = 0;
        ddlfMarcas.options[0] = new Option("--Seleccione--", "");
        ddlfMarcas.selectedIndex = 0;
        ddlfMarcas.disabled = true;
        datalenght = data.length;
        if (datalenght > 0) {
            $.each(data, function (i, row) {
                ddlfMarcas.options[i + 1] = new Option(row.DescripcionMarca, row.MarcaId);
                if (row.MarcaId == MarcaId) {
                    marcatmp = i + 1;
                }
            });
            if (datalenght == 1) {
                ddlfMarcas.selectedIndex = 1;
            }
            else {
                if (marcatmp > 0) {
                    ddlfMarcas.selectedIndex = marcatmp;
                }
            }
            ddlfMarcas.disabled = false;
        }
    }
    catch (e) {
        throw e;
    }
};
function CargaModelosPorData(data, ModeloId) {
    try {
        var ddlfModelos = document.getElementById("ModeloId");
        var datalenght = 0;
        var modelotmp = 0;
        var idtmp = 0;
        ddlfModelos.options.length = 0;
        ddlfModelos.options[0] = new Option("--Seleccione--", "");
        ddlfModelos.selectedIndex = 0;
        ddlfModelos.disabled = true;
        datalenght = data.length;
        if (datalenght > 0) {
            $.each(data, function (i, row) {
                ddlfModelos.options[i + 1] = new Option(row.DescripcionModelo, row.ModeloId);
                idtmp = row.ModeloId;
                if (row.ModeloId == ModeloId) {
                    modelotmp = i + 1
                }
            });
            if (datalenght == 1) {
                ddlfModelos.selectedIndex = 1;
            }
            else {
                if (modelotmp > 0) {
                    ddlfModelos.selectedIndex = modelotmp;
                }
            }
            ddlfModelos.disabled = false;
        }
    }
    catch (e) {
        throw e;
    }
};
function CargaVersionPorData(data, VersionId) {
    try {
        var ddlfVersiones = document.getElementById("VersionId");
        var datalenght = 0;
        var versiontmp = 0;
        ddlfVersiones.options.length = 0;
        ddlfVersiones.options[0] = new Option("--Seleccione--", "");
        ddlfVersiones.selectedIndex = 0;
        ddlfVersiones.disabled = true;
        datalenght = data.length;
        if (datalenght > 0) {
            $.each(data, function (i, row) {
                ddlfVersiones.options[i + 1] = new Option(row.DescripcionVersion, row.VersionId);
                if (row.VersionId == VersionId) {
                    versiontmp = i + 1;
                }
            });
            if (datalenght == 1) {
                ddlfVersiones.selectedIndex = 1;
            }
            else {
                if (versiontmp > 0) {
                    ddlfVersiones.selectedIndex = versiontmp;
                }
            }
            ddlfVersiones.disabled = false;
        }
    }
    catch (e) {
        throw e;
    }
};
function ControlesBusqVehiculo() {
    try {
        if ($("#MarcaId :selected").val() != "" &&
            $("#ModeloId :selected").val() != "" &&
            $("#NumeroSerie").val() != "" &&
            $("#NumeroAsiento").val() != "" &&
            $("#Año").val() != "") {
            BloquearControlesBusquedaPlaca();
        }
        else {
            DesbloquearControlesBusquedaPlaca();
        }
    }
    catch (e) {
        throw e;
    }
};
function BloquearControlesBusquedaPlaca() {
    try {
        $("#NumeroPlaca").attr('readOnly', true);
    }
    catch (e) {
        throw e;
    }
};
function OcultarControlTipoPersona(TipoPersona) {
    try {
        if (TipoPersona == '1') {
            $("#primerGrpAsegu").hide();
            $("#primerGrpAseguJuridico").hide();
        }
        else {
            $("#primerGrpContrata").show();
            $("#primerGrpContrataJuridico").show();
        }
        ConsultaTiposDocumentoAseguradoPorFiltro(TipoPersona);
    }
    catch (e) {
        throw e;
    }
}
function ControlesBusqContratante() {
    try {
        $("#primerGrpContrataJuridico").hide();
        $("#primerGrpContrata").hide();

        if ($("#ContraTipoPersonaId :selected").val() == "1") {
            $("#primerGrpContrata").show();
        } else {
            $("#septimoGrpContrata").hide();
            $("#octavoGrpContrata").hide();
            $("#primerGrpContrataJuridico").show();
        }

        if ($("#hiddenFlagContextual").val() == '1') {
            $("#GrpContraTipoPersona").show();
            $("#GrpContraTipoDocumentoNumero").show();
        }

        $("#segundoGrpContrata").show();
        $("#quintoGrpContrata").show();
        $("#sextoGrpContrata").show();
    }
    catch (e) {
        throw e;
    }
};
function ControlesBusqPlaca() {
    try {
        var idFlagEndoso = $("#divEndoso").data('value');

        $("#primerGrpVehi").show();
        $("#segundoGrpVehi").show();
        $("#tercerGrpVehi").show();
        $("#cuartoGrpVehi").show();
        $("#grpDatosAsegurado").show();
        if (idFlagEndoso == 0) { $("#lnkContinuar").show(); }
    }
    catch (e) {
        throw e;
    }
};
function LostSession() {
    try {
        alertValida("Su sesión ha expirado");
        document.location.href = "Home/Index";
    }
    catch (e) {
        throw e;
    }
}
function ObtenerEndoso(poliza) {
    try {
        $.ajax({
            url: "ObtenerEndoso",
            type: 'Get',
            data: {
                pPoliza: poliza
            },
            async: true,
            cache: false,
            success: function (data) {
                if (data.IsValid == false) {
                    alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                    return;
                }
                if (data.resultado == 0) {
                    alertValida("ENDOSO: La póliza ingresada no se encuentra en Insunix.");
                } else if (data.resultado == 3) {
                    alertValida("ENDOSO: No se puede endosar mientras que no este cancelada la proforma.")
                } else if (data.resultado == -1) {
                    alertValida("ENDOSO: No existe póliza vigente en SEL o no corresponde al intermediario, validar si la emisión se realizó a través de INSUNIX."); //RQ2023-161
                } else if (data.resultado == 16) {
                    alertValida("ENDOSO: La póliza ingresada se encuentra anulada.");
                } else if (data.resultado == 2) {
                    alertValida("ENDOSO: La póliza no puede ser endosada por ser internacional.");
                } else if (data.resultado == 17) {
                    alertValida("ENDOSO: Usuario no cuenta con permisos para endosar pólizas digitales.");
                } else if (data.resultado == 18) {
                    alertValida("ENDOSO: Usuario no cuenta con permisos para endosar pólizas tradicionales.");
                } else if (data.resultado == 403) {
                    alertValida("ENDOSO: La póliza es tradicional, solo se pueden endosar pólizas digitales.");
                }
                else {
                    if (data.modVenta == 0) {

                        if ($("#hdnCantidadFormulariosDig").val() == '0') {
                            alertValida("ENDOSO: No se puede endosar debido a que no existe papel distribuido para la modalidad de la póliza ingresada (Modalidad Digital).")
                            return;
                        }
                    }
                    if (data.modVenta == 1) {
                        if ($("#hdnCantidadFormulariosTrad").val() == '0') {
                            alertValida("ENDOSO: No se puede endosar debido a que no existe papel distribuido para la modalidad de la póliza ingresada (Modaliad Tradicional).")
                            return;
                        }
                    }

                    $('#IdOficina').val(data.oficina);
                    ListarIntermediarios(data.oficina, data.Broker, "", "ENDOSO");
                    $("#idIntermediario").prop('selectedIndex', 1);

                    $('#idIntermediario').val(data.Broker);
                    $('#ResponsablePago').hide();
                    $('#ddlZonaCirculacion').val(data.vehiculo.ZonaCirculacionId);
                    document.getElementById("IdOficina").disabled = true;
                    document.getElementById("idIntermediario").disabled = true;
                    document.getElementById("idTipoIntermediario").disabled = true;
                    document.getElementById("idRol").disabled = true;
                    endosoVehiculo(data.vehiculo, data.Broker, data.Rol, data.BloqCampos);
                    $("#findSection1").val(1);
                    $('#AsegTipoPersonaId').val(data.tipoPersona);
                    $('#AsegTipoDocumentoId').val(data.tipoDocu);
                    $('#AsegNumeroDocumento').val(data.documentoAsegurado);
                    var control = false;
                    control = ConsultaClienteAsegurado(data.documentoAsegurado, data.tipoDocu, data.tipoPersona, $("#ComercializadorDni").val(), $("#AplicacionId").val(), $("#idEndosoPoliza").val(), $("#hiddenCodigoClienteContextual").val());
                    if (control == true) {
                        ControlesBusqAsegurado();
                    }
                    $('#ContraTipoPersonaId').val(data.tipoPersona_contr);
                    $('#ContraTipoDocumentoId').val(data.tipoDocu_contr);
                    $('#ContraNumeroDocumento').val(data.documentoContratante);
                    control = false;
                    control = ConsultaClienteContratante(data.documentoContratante, data.tipoDocu_contr, data.tipoPersona_contr, $("#ComercializadorDni").val(), $("#AplicacionId").val(), $("#idEndosoPoliza").val(), $("#hiddenCodigoClienteContextualContra").val());
                    if (control = true) {
                        ControlesBusqContratante();
                    }
                    var monedaDescNomb = '';
                    if (data.descMoneda == "S/.") {
                        monedaDescNomb = "Soles";
                    } else {
                        monedaDescNomb = "Dólares Americanos";
                    }
                    $("#TarifMontoTarifaLabel").html($.trim(data.descMoneda) + " " + $.trim(data.premium));
                    $('#TarifMonedaDescLabel').html($.trim(monedaDescNomb));
                    $('#Cod_FormaPagoID').val(1); // Efectivo
                    $('#ddlMonedaLst').val(data.idMoneda);
                    $("#CalcMontoLabel").html($.trim(data.descMoneda) + " " + $.trim(data.premium));
                    $("#TipoCambioLabel").html(data.tipoCambio);
                    $("#TipoMoneda").val(data.idMoneda);
                    var dataSplitIni = data.effecdate.split('/');
                    var dataSplitFin = data.expirdate.split('/');
                    var fechaIniVigencia = new Date(dataSplitIni[0], dataSplitIni[1] - 1, dataSplitIni[2]); //data.effecdate;
                    var fechaFinVigencia = new Date(dataSplitFin[0], dataSplitFin[1] - 1, dataSplitFin[2]);// data.expirdate;
                    $('#FechaInicioVigencia').val(getFormattedDate(fechaIniVigencia));
                    $('#FechaFinVigencia2').val(getFormattedDate(fechaFinVigencia));

                    //INI RQ2023-161
                    $('#hdnFechaInicioVigenciaEndoso').val($('#FechaInicioVigencia').val());
                    $('#hdnFechaFinVigenciaEndoso').val($('#FechaFinVigencia2').val());
                    $("#lnkCambiarPlaca").removeAttr('disabled');
                    $("#lnkBusqPlaca").removeAttr('disabled');
                    //FIN RQ2023-161

                    document.getElementById("FechaInicioVigencia").disabled = true;
                    document.getElementById("Cod_FormaPagoID").disabled = true;
                    document.getElementById("ddlMonedaLst").disabled = true;

                    if (data.modVenta == 0) {
                        $('#rbtnModaliadVentaDigital').prop('checked', true);
                        $('#rbtnModaliadVentaDigital').click();
                    } else {
                        $('#rbtnModaliadVentaTradicional').prop('checked', true);
                        $('#rbtnModaliadVentaTradicional').click();
                    }
                    $('#trModalidadVenta').hide();
                    $('#lnkContinuar').hide();
                    $('#lnkEndosar').show();
                    $("#lnkBusqPlanTarifa").attr('disabled', 'disabled');

                    //INI RQ2025-884
                    if ($('#rbtnPlacaNacional').length == 1 && $('#rbtnPlacaExtranjera').length == 1) {

                        let varTipoFormatoPlacaNacional = data.vehiculo.TipoFormatoPlaca == 1 ? true : false;
                        let varTipoFormatoPlacaExtranjera = data.vehiculo.TipoFormatoPlaca == 2 ? true : false;
                        let varZonaFronteriza = data.vehiculo.ZonaFronteriza;

                        $('#rbtnPlacaNacional').prop('checked', varTipoFormatoPlacaNacional);
                        $('#rbtnPlacaExtranjera').prop('checked', varTipoFormatoPlacaExtranjera);
                        $('#ddlZonaFronteriza').val(varZonaFronteriza);

                    }
                    //FIN RQ2025-884

                    return false;
                }
            },
            error: function (xhr, status, error) {
                alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk.");
            }
        });
    }
    catch (e) {
        throw e;
    }
};
function endosoVehiculo(oVehiculo, broker, rol, bloqcampos) {
    try {
        var placaTramite = 0;
        $('#hdnTipoPlaca').val(oVehiculo.TipoPlacaId);
        if (oVehiculo.NumeroPlaca.toUpperCase() == 'P/T') {
            placaTramite = 1;
            IniciarPlacaEnTramite();
            CalcularVigenciaDefault();
        } else {
            $("#primerGrpVehi").show();
            $("#segundoGrpVehi").show();
            $("#tercerGrpVehi").show();
            $("#cuartoGrpVehi").show();
            $("#grpDatosAsegurado").show();
            $("#NumeroPlaca").val(oVehiculo.NumeroPlaca);
        }
        $("#NumeroSerie").val('');
        $("#ModeloEspecifico").val('');
        $("#NumeroAsiento").val('');
        $("#Año").val('');
        $("#ClaseId").prop("selectedIndex", 0);
        $("#UsoId").children().remove();
        $("#UsoId").prop("selectedIndex", 0);
        $("#MarcaId").children().remove();
        $("#ModeloId").children().remove();
        $("#VersionId").children().remove();
        //Seteo de DDL's
        var ddlfClases = document.getElementById("ClaseId");
        ddlfClases.options.length = 0;
        ddlfClases.options[0] = new Option("--Seleccione--", "0");
        ddlfClases.selectedIndex = 0;
        ddlfClases.disabled = true;
        $.ajax({
            url: "ObtenerClases",
            type: 'Get',
            data: {
                pEsPlacaTramite: placaTramite,
                pTipoPlacaId: $("#hdnTipoPlaca").val(),
                pLetraPlaca: $("#NumeroPlaca").val().toUpperCase(),
                pComercializadorId: $("#ComercializadorIntermediarioId").val(),
                pIdAplicacion: $("#AplicacionId").val(),
                pFechaInicioVigencia: $("#FechaInicioVigencia").val(),
                pIntermediario: broker,
                pRol: rol,
                pClaseId: oVehiculo.ClaseIdSEL
            },
            async: true,
            cache: false,
            success: function (data) {
                if (data.IsValid == false) {
                    alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                    return;
                }
                datalenght = data.length;
                $.each(data, function (i, row) {
                    ddlfClases.options[i + 1] = new Option(row.DescripcionClase, row.ClaseId);
                });
                ddlfClases.disabled = false;
                $("#ClaseId").val(oVehiculo.ClaseIdSEL);
                endosoVehiculoUsos(oVehiculo, broker, rol, bloqcampos, placaTramite); //USOS
            },
            error: function () { alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk."); }
        });
        $('#ModeloEspecifico').val(oVehiculo.ModeloEspecifico);
        $('#NumeroSerie').val(oVehiculo.NumeroSerie);
        $('#NumeroAsiento').val(oVehiculo.NumeroAsiento);
        $('#Año').val(oVehiculo.Año);
    } catch (e) { throw e; }
}
function endosoVehiculoUsos(oVehiculo, broker, rol, bloqcampos, placaTramite) {
    try {
        var ddlfUsos = document.getElementById("UsoId");
        ddlfUsos.options.length = 0;
        ddlfUsos.options[0] = new Option("--Seleccione--", "0");
        ddlfUsos.selectedIndex = 0;
        ddlfUsos.disabled = true;
        $.ajax({
            url: "ObtenerUsos",
            type: 'Get',
            data: {
                pClaseId: oVehiculo.ClaseIdSEL,
                pIntermediarioId: $("#ComercializadorIntermediarioId").val(),
                pIntermediario: broker,
                pRol: rol,
                pEsPlacaEnTramite: placaTramite
            },
            async: true,
            cache: false,
            success: function (data) {
                if (data.IsValid == false) {
                    alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                    return;
                }
                $.each(data, function (i, row) {
                    ddlfUsos.options[i + 1] = new Option(row.DescripcionUso, row.UsoId);
                });
                ddlfUsos.disabled = false;
                $('#UsoId').val(oVehiculo.UsoId);
                var marcatmp = 0;
                //---------------------Marcas--------------  
                endosoVehiculoMarcas(oVehiculo);
            },
            error: function () {
                alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk.");
            }
        });
        if (bloqcampos === 1) {
            $("#ClaseId").attr('disabled', 'disabled');
            $("#ddlZonaCirculacion").attr('disabled', 'disabled');
        } else {
            $("#ClaseId").removeAttr('disabled');
            $("#ddlZonaCirculacion").removeAttr('disabled');
        }
    }
    catch (e) {
        throw e;
    }
}
function endosoVehiculoMarcas(oVehiculo) {
    try {
        var ddlfMarcas = document.getElementById("MarcaId");
        var marcatmp = 0;
        ddlfMarcas.options.length = 0;
        ddlfMarcas.options[0] = new Option("--Seleccione--", "");
        ddlfMarcas.selectedIndex = 0;
        ddlfMarcas.disabled = true;
        $.ajax({
            url: "ObtenerMarcas",
            type: 'Get',
            data: {
                pClaseId: oVehiculo.ClaseIdSEL,
                pFechaInicioVigencia: $("#FechaInicioVigencia").val(),
                pPlaca: $("#NumeroPlaca").val().toUpperCase(),
                pTipoPlaca: $("#hdnTipoPlaca").val()
            },
            async: true,
            cache: false,
            success: function (data) {
                if (data.EsFraude === true) {
                    alertValida("Se encontró alteraciones externas en el sistema.");
                    document.location.href = "/Home/Index";
                    return;
                }
                $.each(data, function (i, row) {
                    ddlfMarcas.options[i + 1] = new Option(row.DescripcionMarca, row.MarcaId);
                    if (row.MarcaId == oVehiculo.MarcaId) {
                        marcatmp = i + 1;
                    }
                });
                ddlfMarcas.disabled = false;
                ddlfMarcas.selectedIndex = marcatmp;
                var modelotmp = 0;

                //-----Modelos                                
                endosoVehiculoModelos(oVehiculo);
            },
            error: function () {
                alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk.");
            }
        });
    }
    catch (e) {
        throw e;
    }
}
function endosoVehiculoModelos(oVehiculo) {
    try {
        var ddlfCats = document.getElementById("CatId");
        ddlfCats.options.length = 0;
        ddlfCats.options[0] = new Option("--Seleccione--", "0");
        ddlfCats.selectedIndex = 0;
        ddlfCats.disabled = true;
        var ddlfModelos = document.getElementById("ModeloId");
        var modelotmp = 0;
        var idtmp = 0;
        ddlfModelos.options.length = 0;
        ddlfModelos.options[0] = new Option("--Seleccione--", "");
        ddlfModelos.selectedIndex = 0;
        ddlfModelos.disabled = true;
        $.ajax({
            url: "ObtenerModelos",
            type: 'Get',
            data: {
                pClaseId: oVehiculo.ClaseIdSEL,
                pMarcaId: oVehiculo.MarcaId,
                pFechaInicioVigencia: $("#FechaInicioVigencia").val()
            },
            async: true,
            cache: false,
            success: function (data) {
                if (data.IsValid == false) {
                    alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                    return;
                }
                if (data.EsFraude === true) {
                    alertValida("Se encontró alteraciones externas en el sistema.");
                    document.location.href = "/Home/Index";
                    return;
                }
                $.each(data, function (i, row) {
                    ddlfModelos.options[i + 1] = new Option(row.DescripcionModelo, row.ModeloId);
                    idtmp = row.ModeloId;
                    if (row.ModeloId == oVehiculo.ModeloId) {
                        modelotmp = i + 1
                    }
                });

                ddlfModelos.disabled = false;
                ddlfModelos.selectedIndex = modelotmp;
                var versiontmp = 0;
                //-------- Versiones --------
                endosoVehiculoVersiones(oVehiculo);
            },
            error: function () {
                alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk.");
            }
        });
    }
    catch (e) {
        throw e;
    }
}
function endosoVehiculoVersiones(oVehiculo) {
    try {
        var ddlfCats = document.getElementById("CatId");
        ddlfCats.options.length = 0;
        ddlfCats.options[0] = new Option("--Seleccione--", "0");
        ddlfCats.selectedIndex = 0;
        ddlfCats.disabled = true;
        var ddlfVersiones = document.getElementById("VersionId");
        var versiontmp = 0;
        ddlfVersiones.options.length = 0;
        ddlfVersiones.options[0] = new Option("--Seleccione--", "");
        ddlfVersiones.selectedIndex = 0;
        ddlfVersiones.disabled = true;
        $.ajax({
            url: "ObtenerVersiones",
            type: 'Get',
            data: {
                pClaseId: oVehiculo.ClaseIdSEL,
                pMarcaId: oVehiculo.MarcaId,
                pModeloId: oVehiculo.ModeloId,
                pFechaInicioVigencia: $("#FechaInicioVigencia").val()
            },
            async: true,
            cache: false,
            success: function (data) {
                if (data.IsValid == false) {
                    alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                    return;
                }
                if (data.EsFraude === true) {
                    alertValida("Se encontró alteraciones externas en el sistema.");
                    document.location.href = "/Home/Index";
                    return;
                }
                $.each(data, function (i, row) {
                    ddlfVersiones.options[i + 1] = new Option(row.DescripcionVersion, row.VersionId);
                    if (row.VersionId == oVehiculo.VersionId) {
                        versiontmp = i + 1;
                    }
                });
                ddlfVersiones.disabled = false;
                ddlfVersiones.selectedIndex = versiontmp;
                var categoriatmp = 0;
                //--------   Categorias  A.E. RQ2017-1695 Categoria -----------
                $.ajax({
                    url: "ObtenerCats",
                    type: 'Get',
                    data: {
                        pClaseId: oVehiculo.ClaseIdSEL
                    },
                    async: true,
                    cache: false,
                    success: function (data) {
                        if (data.IsValid == false) {
                            alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                            return;
                        }
                        $.each(data, function (i, row) {
                            ddlfCats.options[i + 1] = new Option(row.DescripcionCat, row.CatId);
                            if (row.CatId == oVehiculo.CatId) {
                                categoriatmp = i + 1;
                            }
                        });
                        ddlfCats.disabled = false;
                        ddlfCats.selectedIndex = categoriatmp;
                    },
                    error: function () {
                        alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk.");
                    }
                });
            },
            error: function () {
                alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk.");
            }
        });
    }
    catch (e) {
        throw e;
    }
}
function IniciarPlacaEnTramite() {
    try {
        BloquearControlesBusquedaPlaca();
        $("#primerGrpVehi").show();
        $("#segundoGrpVehi").show();
        $("#tercerGrpVehi").show();
        $("#cuartoGrpVehi").show();
        $("#grpDatosAsegurado").show();
        if (SeConsultoAsegurado()) {
        } else {
            $("#primerGrpAsegu").hide();
            $("#segundoGrpAsegu").hide();
            $("#quintoGrpAsegu").hide();
            $("#sextoGrpAsegu").hide();
            $("#septimoGrpAsegu").hide();
            $("#octavoGrpAsegu").hide();
        }
        $("#lnkContinuar").show();
        var actualDate = new Date();
        var newDate = new Date(actualDate.getFullYear(), actualDate.getMonth(), actualDate.getDate() + 1);

        $("#FechaInicioVigencia").datepicker('setDate', newDate);
    }
    catch (e) {
        throw e;
    }
};
function SeConsultoAsegurado() {
    try {
        var seConsulto = false;
        if ($("#AccionSeConsultoAsegurado").val() === "1") {
            seConsulto = true;
        };
        return seConsulto;
    }
    catch (e) {
        throw e;
    }
}
function CopiardatosTarjeta() {
    try {
        $('#TipoTarjetaID2').val($('#TipoTarjetaID').val());
        $('#NumeroTarjeta2').val($('#NumeroTarjeta').val());
    }
    catch (e) {
        throw e;
    }
}
function mostrar() {
    try {
        var urlAux = 'ventas/ListarFormulario';
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { urlAux = 'ListarFormulario'; }

        $('#verInformacionEmpresa').modal('show');
        $.ajax({
            url: urlAux,
            type: 'Get',
            data: {
                proceso: '1'
            },
            async: true,
            cache: false,
            success: function (data) {
                if (data.IsValid == false) {
                    alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                    return;
                }
                $("#RegistroObservacionesInformacion").html(data);
            },
            error: function () {
                alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk.");
            }
        });
    }
    catch (e) {
        throw e;
    }
}
function agregarMeses(isoDate, numberMonths) {
    try {
        var dateObject = new Date(isoDate),
            day = dateObject.getDate();
        dateObject.setHours(20);
        dateObject.setMonth(dateObject.getMonth() + numberMonths + 1, 0);
        dateObject.setDate(Math.min(day, dateObject.getDate()));
        return dateObject;
    }
    catch (e) {
        throw e;
    }
};
function getFormattedDate(date) {
    try {
        var year = date.getFullYear();
        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        return day + '/' + month + '/' + year;
    }
    catch (e) {
        throw e;
    }
}
function ValidaEmail(email) {
    try {
        var regex = /[\w-\.]{2,}@([\w-]{2,}\.)*([\w-]{2,}\.)[\w-]{2,4}/;
        if (!regex.test(email.trim())) {
            return false;
        }
        return true;
    }
    catch (e) {
        throw e;
    }
}
function ValidarSeccionCerEndoso() {
    try {
        if ($('#fechainiciovigencia').val() === '') {
            alertvalida('certificado: debe ingresar la fecha de inicio de vigencia.');
            $('#fechainiciovigencia').focus();
            return false;
        }

        if ($('#tarifdescripciontarifa').val() === '') {
            alertvalida('certificado: por favor debe seleccionar un plan.');
            $('#tarifdescripciontarifa').focus();
            return false;
        }

        if ($('#tarifmontotarifa').val() === '') {
            alertvalida('certificado: debe seleccionar una tarifa.');
            $('#tarifmontotarifa').focus();
            return false;
        }
        return true;
    }
    catch (e) {
        throw e;
    }
}
function CalcularFinVigencia() {
    try {
        var Placa = $("#NumeroPlaca").val().toUpperCase().trim();
        var Fecha = $("#FechaInicioVigencia").val();
        var result = '';
        $.ajax({
            url: "Ventas/CalcularFinVigencia",
            type: 'Get',
            data: {
                pPlaca: Placa,
                pFechaInicio: Fecha
            },
            async: false,
            cache: false,
            success: function (data) {
                if (data.IsValid == false) {
                    alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                    return;
                }
                if (data.resultado != '') {
                    if (data.resultado != '01/01/0001') {
                        certifVigente = true;
                        result = 'VEHICULO: A la fecha ´' + Fecha + '´ la placa ingresada cuenta con una póliza vigente que finaliza el ´' + data.resultado + '´.';
                    }
                }
            },
            error: function () {
                alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk.");
            }
        });
        return result;
    }
    catch (e) {
        throw e;
    }
};
function ControlesValoresPorDefecto() {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        $('#hdnTipoPlaca > option[value="7"]').attr('selected', 'selected');
        $('#AsegTipoViaId > option[value="1"]').attr('selected', 'selected');
        $('#ContraTipoViaId > option[value="1"]').attr('selected', 'selected');
        $("#AsegTipoEmpresaId").val("7");
        $("#ContraTipoEmpresaId").val("7");
        $("#TarifDescripcionTarifa").attr('readOnly', true);
        $("#TarifMontoTarifa").attr('readOnly', true);
        $("#TarifMontoTarifaLabel").attr('readOnly', true);
        $("#TarifMonedaDescLabel").attr('readOnly', true);
        $("#TarifMonedaDesc").attr('readOnly', true);
        $("#TarifTipoCambio").attr('readOnly', true);
        $("#CodigoFormulario").attr('readOnly', true);
        $("#CalcMonto").attr('readOnly', true);
        $("#NumeroPlaca").focus();
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / ControlesValoresPorDefecto", e);
        return;
    }
};
function validarCargoIVR(NumeroCargo, IdMoneda, Importe, IdTipoDocumento, NroDocumento) {
    try {
        var res = '';
        $.ajax({
            url: "Ventas/validarNumeroCargo",
            type: 'Get',
            data: {
                pNumeroCargo: NumeroCargo,
                pIdMoneda: IdMoneda,
                pImporte: Importe,
                pIdTipoDocumento: IdTipoDocumento,
                pNroDocumento: NroDocumento
            },
            async: false,
            cache: true,
            success: function (data) {
                if (data.IsValid == false) {
                    alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                    return;
                }

                if (data.estado == false) {
                    res = data.msg;
                    res = res.replace('\\n', '</br>');
                }
            }
        });
        return res;
    }
    catch (e) {
        throw e;
    }
}
function AplicarCargoIVR(NumeroCargo, IdMoneda, Importe, IdTipoDocumento, NroDocumento, Poliza, Certificado, Recibo) {
    try {
        var res = '';
        $.ajax({
            url: "Ventas/aplicarCargo",
            type: 'Get',
            data: {
                pNumeroCargo: NumeroCargo,
                pIdMoneda: IdMoneda,
                pImporte: Importe,
                pIdTipoDocumento: IdTipoDocumento,
                pNroDocumento: NroDocumento,
                pPoliza: Poliza,
                pCertificado: Certificado,
                pRecibo: Recibo
            },
            async: false,
            cache: true,
            success: function (data) {
                if (data.IsValid == false) {
                    alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                    return;
                }

            }
        });
    }
    catch (e) {
        throw e;
    }
}
function GrabarPoliza(pAction) {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        ValidaFraude('', 0, 3);
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        var myform = $('form');
        var form = document.querySelector('form');
        var disabled = myform.find(':input:disabled').removeAttr('disabled');
        var dataserialize = serializeArraySel(form);
        var data = serializarAJson(dataserialize, objEncrypt);
        disabled.attr('disabled', 'disabled');
        var tipouso = "";
        if ($('select[name="UsoId"]').val() === "1") { tipouso = "PRI"; }
        else { tipouso = "PUB"; }
        var copia = document.getElementById('rbtnSiTitularVehiculo').checked;
        var result = false;
        if (copia) { result = true; }
        var tiporenovacion = document.getElementById('rbtnTradicional').checked;
        var _TipoRenovacion = "1";
        if (tiporenovacion == false) { _TipoRenovacion = "2"; }
        var infoAfiliacion = (document.getElementById('rbtnSiRecibirInformacion').checked == true ? '1' : '0');
        var idOficina = $("#IdOficina").val();
        var idIntermediario = $("#idIntermediario").val();
        var idTipoIntermediario = $("#idTipoIntermediario").val();
        var idRol = $("#idRol").val();
        if (idOficina == "") idOficina = 0;
        if (idIntermediario == "") idIntermediario = "0";
        if (idRol == "") idRol = "0";

        //INI RQ2025-884
        let tipoFormatoPlacaFront = '0';
        let zonaFronterizaFront = '0';
        if ($('#rbtnPlacaNacional').length == 1 && $('#rbtnPlacaExtranjera').length == 1) {
            tipoFormatoPlacaFront = (document.getElementById('rbtnPlacaNacional').checked ? '1' : document.getElementById('rbtnPlacaExtranjera').checked ? 2 : '0');
        }

        if ($('#ddlZonaFronteriza').length == 1) {
            zonaFronterizaFront = $("#ddlZonaFronteriza option:selected").val();
        }
        //FIN RQ2025-884

        var urlAux = 'Ventas/SeteaDatosAgenciamiento';
        if (idFlagEndoso == 1) { urlAux = 'SeteaDatosAgenciamiento'; }
        $.ajax({
            url: urlAux,
            type: 'Get',
            data: {
                idOficina: idOficina,
                idIntermediario: idIntermediario,
                tipoIntermediario: idTipoIntermediario,
                idRol: idRol,
            },
            async: true,
            cache: false,
            success: function (data2) {
                if (data2.IsValid == false) {
                    alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data2.ErrorMessage + "<b/>");
                    return;
                }
                urlAux = '';
                var _dias = $("#hdnDiasFrontera").val();
                var _idPais = $("#hdnFlagFrontera").val();
                if (_dias === "") { _dias = 0; }
                if (_idPais === "") { _idPais = 0; }
                if (idFlagEndoso == 1) { urlAux = pAction; }
                else { urlAux = "Ventas/" + pAction; }
                data.TipoUso = validarFormato(tipouso, objEncrypt);
                data.certif_form = validarFormato($("#flagCertificadoFor").val(), objEncrypt);
                data.flagDireccionAseg = validarFormato($("#flagDireccionAseg").val(), objEncrypt);
                data.TipOrigenTarifa = validarFormato($("#TipoOrigenTarifa").val(), objEncrypt);
                data.CoincidentesTarifas = validarFormato($("#Coincidentestarifas").val(), objEncrypt);
                data.ComprobantePagoANombreAsegurado = validarFormato(result.toString(), objEncrypt);
                data.FlagRucAse = validarFormato($("#flagAsegRazonSocial").val(), objEncrypt);
                data.RazonSocialAntigua = validarFormato($("#RazonAntigua").val(), objEncrypt);
                data.ZonaCirculacionId = validarFormato($("#ZonaCirculacionId").val(), objEncrypt);
                data.Indicador = validarFormato($("#Indicador").val(), objEncrypt);
                data.FechaFinPolizaVigente = validarFormato($("#fechaFinVigenciaPoliza").val(), objEncrypt);
                data.AseguradoOrigen = validarFormato($("#AseguradoOrigen").val(), objEncrypt);
                data.IdUsoOrigen = validarFormato($("#IdUsoOrigen").val(), objEncrypt);
                data.FlagRenovacion = validarFormato(document.getElementById('rbtnSiDebitoAutomatico').checked.toString(), objEncrypt);
                data.idMoneda = validarFormato($("#TarifMonedaId").val(), objEncrypt);
                data.idMonedaPagoVirtual = validarFormato($("#ddlMonedaLst option:selected").val(), objEncrypt);
                data.TipoRenovacion = validarFormato(_TipoRenovacion, objEncrypt);
                data.infoAfiliacion = validarFormato(infoAfiliacion, objEncrypt);
                data.idTipoPos = validarFormato($("#ddlIdTipoPos option:selected").val(), objEncrypt);
                data.FlagFrontera = validarFormato($("#hdnFlagFrontera").val(), objEncrypt);
                data.idTipoPos = validarFormato($("#ddlIdTipoPos option:selected").val(), objEncrypt);
                data.diasFrontera = validarFormato(_dias, objEncrypt);
                data.idPais = validarFormato(_idPais, objEncrypt);
                data.FlagPlacaExtrangera = validarFormato($("#hdnFlagPlacaExtrangera").val(), objEncrypt);
                data.Quotation = validarFormato($('#hdnQuotation').val(), objEncrypt);
                if ($('#ddlTipoComprobante').length == 1) {
                    data.CodTipoComprobante = validarFormato($("#ddlTipoComprobante option:selected").val(), objEncrypt);
                }
                else {
                    data.CodTipoComprobante = validarFormato(0, objEncrypt);
                }
                data.CodTipoFormatoPlaca = validarFormato(tipoFormatoPlacaFront, objEncrypt);
                data.CodZonaFronteriza = validarFormato(zonaFronterizaFront, objEncrypt);
                //Rq2023-484
                data.FlagTarifaOrberlite = validarFormato($('#hdnflagTarifaOrberlite').val(), objEncrypt);

                var form_data = "";
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        form_data += key + '=' + data[key] + '&';
                    }
                }

                $.post(urlAux, form_data, insertcallback);
                function insertcallback(data) {
                    VerEmisionPoliza(data);
                }
            },
            error: function () {
                alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk.");
            }
        });
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / GrabarPoliza", e);
        return;
    }
}
function VerEmisionPoliza(data) {
    try {
        if (data.IsValid == false) {
            if (data.ErrorMessage === "UserLocked") {
                alertLocked("El usuario ha sido bloqueado, favor de comunicarse con el Administrador.");
                $("#lnkEmitirPoliza").removeAttr('disabled');
                return;
            } else {
                alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                $("#lnkCancelarEndosoPoliza").click(); //RQ2025-406
                $("#lnkEmitirPoliza").removeAttr('disabled');
                return;
            }
        }
        if (data.EsFraude === true) {
            alertValida("Se encontró alteraciones externas en el sistema.");
            document.location.href = "/Home/Index";
            return;
        }
        if (MostrarMensajeValidacion(data)) { //if (MostrarMensajeValidacion(data.message)) {
            $("#lnkEmitirPoliza").removeAttr('disabled');
            return;
        }
        else {
            if (data.message == "PNOEMITIDA") {
                VistaPreviaEmisionPoliza();
            } else {
                if (data.message == "PEMITIDA") {
                    $('#verPolizaAEmitir, .window').hide();
                    if ($("#ddlIdTipoPos").val() == '3') {
                        AplicarCargoIVR($('#NumeroCargo').val(), $('#ddlMonedaLst').val(), $("#CalcMontoLabel").html(), $("#AsegTipoDocumentoId").val(), $("#AsegNumeroDocumento").val(), data.NumeroPoliza, data.NumeroCertificado, data.Recibo.toString());
                    }
                    VerVentanaImpresion(data.NumeroPoliza, data.NumeroCertificado, data.NumeroFormulario, data.Recibo, data.PrimaTotal, data.PrimaDiferencial, data.Identificador);
                }
                else {
                    if (data.message == "PPOSTEMITIDA") {
                        $("#cerrar").click();
                        document.location.href = "/Ventas";
                    } else {
                        alertValida(data.message);
                    }
                }
            }
        }
        $("#lnkEmitirPoliza").removeAttr('disabled');
    }
    catch (e) {
        throw e;
    }
};
//function MostrarMensajeValidacion(mensaje) {
function MostrarMensajeValidacion(data) {
    var mensaje = data.message;
    var respuesta = false;
    if (mensaje === 'VALFRAUDE') {
        respuesta = true;
        alertValida("CERTIFICADO: La información ingresada fue alterada.");
    }
    else if (mensaje === 'VALDATAERR') {
        respuesta = true;
        alertValida("Se encontró alteraciones externas en el sistema.");
        if (enabledAzure === "true") {
            document.location.href = linkRedirect2;
        }
        else {
            document.location.href = linkRedirect1;
        }
    }//INI RQ2023-161
    else if (mensaje === 'DATAERRORENDOSO') {
        respuesta = true;
        alertValida("ENDOSO: Para realizar un endoso, debe buscar la información con el número de póliza.");
    }//FIN RQ2023-161
    else if (mensaje === 'ROLINVALIDO') {
        respuesta = true;
        alertValida("EMISION: Error en el proceso de emisión, validar información.");
    }
    else if (mensaje === 'EXCEEDSDATE') {
        respuesta = true;
        alertValida("CERTIFICADO: La fecha de inicio de vigencia es mayor a la fecha máxima permitida.");
    }
    else if (mensaje === 'POLIZAVIGENTE') {
        respuesta = true;
        //alertValida("CERTIFICADO: La placa ingresada cuenta con una póliza vigente a la fecha.");
        alertValida(data.menssage_result);
    }
    else if (mensaje === 'POLIZANOPAGO') {
        respuesta = true;
        alertValida("CERTIFICADO: El cliente aun no ha realizado el pago de la póliza a través del portal de Pagos Digitales.");
    }//INI GP2026-81
    else if (mensaje === 'CARACTER_ERROR') {
        respuesta = true;
        alertValida("VEHICULO: Modelo especifico contiene caracteres no permitidos.");
    }//FIN GP2026-81
    return respuesta;
};

function VerVentanaImpresion(numeroPoliza, numeroCeritificado, numeroFromulario, Recibo, primaTotal, primaDiferencial, identificador) {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        var idFlagEndoso = $("#divEndoso").data('value');
        if (idFlagEndoso == 1) { modulo = 'ENDOSO'; }
        $('#verPolizaAImprimir').modal('show');
        var urlAux = 'Ventas/VistaPreviaImpresionPoliza';
        if (idFlagEndoso === 1) { urlAux = 'VistaPreviaImpresionPoliza'; } else {
            $.ajax({
                url: '/Ventas/NotificarPoliza',
                type: 'Post',
                data: {
                    pIdentificador: identificador
                }
            });
        }

        $.ajax({
            url: urlAux,
            type: 'Get',
            data: {
                pNumeroPoliza: numeroPoliza,
                pNumeroCertificado: numeroCeritificado,
                pNumeroFormulario: numeroFromulario,
                pRecibo: Recibo,
                pPrimaTotal: primaTotal,
                pPrimaDiferencial: primaDiferencial
            },
            async: true,
            cache: false,
            success: function (data) {
                if (data.IsValid == false) {
                    alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                    return;
                }
                $("#ImpresionEmisionPoliza").html(data);
            },
            error: function () {
                alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk.");
            }
        });
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / VerVentanaImpresion", e);
        return;
    }
};

//RQ2020-570 
function HideShowLiqAuto() {
    if ($("#rbtnModaliadVentaTradicional").is(":checked")) {

        var valor = $("#Cod_FormaPagoID").find('option:selected').val();

        if (valor === "8") {
            $("#Cod_FormaPagoID")[0].selectedIndex = 0;
            $('#Cod_FormaPagoID').trigger('change');
        }

        $("#Cod_FormaPagoID").find('option[value="8"]').hide();
    }

    if ($("#rbtnModaliadVentaDigital").is(":checked")) {
        $("#Cod_FormaPagoID").find('option[value="8"]').show();
    }
}

//INI BUGFIX RQ2022-1037
function HideShowPagoDigital() {

    var valorTipoDocumento = $("#AsegTipoDocumentoId").find('option:selected').val();

    if ($("#rbtnModaliadVentaTradicional").is(":checked")) {

        var valorFormaPago = $("#Cod_FormaPagoID").find('option:selected').val();

        if (valorFormaPago === "9") {
            $("#Cod_FormaPagoID")[0].selectedIndex = 0;
            $('#Cod_FormaPagoID').trigger('change');
        }

        $("#Cod_FormaPagoID").find('option[value="9"]').hide();
    }

    if ($("#rbtnModaliadVentaDigital").is(":checked")) {
        if ($("#hdnCotizacionActiva").val() > 0 && $("#hdnRenovacionActiva").val() === '1') {
            $("#Cod_FormaPagoID").find('option[value="9"]').show();
        }
        else {
            $("#Cod_FormaPagoID").find('option[value="9"]').hide();
        }
    }

    if (valorTipoDocumento == "12") {

        var valorFormaPago = $("#Cod_FormaPagoID").find('option:selected').val();

        if (valorFormaPago === "9") {
            $("#Cod_FormaPagoID")[0].selectedIndex = 0;
            $('#Cod_FormaPagoID').trigger('change');
        }

        $("#Cod_FormaPagoID").find('option[value="9"]').hide();
    }
}
//FIN BUGFIX RQ2022-1037

function CambioVigencia(fecha) {
    var parts = fecha.split('/');
    var newDate = new Date(parts[2], parts[1] - 1, parts[0]);

    newDate.setDate(newDate.getDate() + 1);
    $("#FechaInicioVigencia").val(getFormattedDate(newDate));

    var fechaCalcul = newDate;
    var fechaFinal = agregarMeses(fechaCalcul, 12);

    $("#FechaFinVigencia").val(getFormattedDate(fechaFinal));
    $("#FechaFinVigencia2").val(getFormattedDate(fechaFinal));
}

function CambioVigenciaCotizacion(fechaIni, fechaFin) {
    var partsFechaIni = fechaIni.split('/');
    var partsFechaFin = fechaFin.split('/');

    var newDateIni = new Date(partsFechaIni[2], partsFechaIni[1] - 1, partsFechaIni[0]);
    var newDateFin = new Date(partsFechaFin[2], partsFechaFin[1] - 1, partsFechaFin[0]);

    $("#FechaInicioVigencia").val(getFormattedDate(newDateIni));
    $("#FechaFinVigencia").val(getFormattedDate(newDateFin));
    $("#FechaFinVigencia2").val(getFormattedDate(newDateFin));
}

function GrabarCotizar() {
    var modulo = 'COTIZACION';
    try {
        ValidaFraude('', 0, 3);
        var myform = $('form');
        var form = document.querySelector('form');
        var disabled = myform.find(':input:disabled').removeAttr('disabled');
        var dataserialize = serializeArraySel(form);
        var vdata = serializarAJson(dataserialize, objEncrypt);
        disabled.attr('disabled', 'disabled');
        var urlAux = "Cotizacion/GrabarCotizacion";
        let codTipoComprobanteCotizacion = 0; //RQ2024-664

        if ($('#ddlTipoComprobante').length == 1) {
            codTipoComprobanteCotizacion = $("#ddlTipoComprobante option:selected").val(); //RQ2024-664
        }

        vdata.ZonaCirculacionId = validarFormato($("#ZonaCirculacionId").val(), objEncrypt);
        vdata.FechaFinPolizaVigente = validarFormato($("#fechaFinVigenciaPoliza").val(), objEncrypt);
        vdata.Indicador = validarFormato($("#Indicador").val(), objEncrypt);
        vdata.idMoneda = validarFormato($("#TarifMonedaId").val(), objEncrypt);
        vdata.Renovacion = validarFormato($("#hdnRenovacion").val(), objEncrypt);
        vdata.IdNotificacion = validarFormato($("#IdNotificacion").val(), objEncrypt);//RQ2022-975
        vdata.NumeroCotizacion = validarFormato($("#NumeroCotizacion").val(), objEncrypt);
        vdata.IdAseguradoCotizacion = validarFormato($("#hdnClienteAseguradoId").val(), objEncrypt);
        vdata.IdContratanteCotizacion = validarFormato($("#hdnClienteContratanteId").val(), objEncrypt);
        //Rq2023-484
        vdata.FlagTarifaOrberlite = validarFormato($('#hdnflagTarifaOrberlite').val(), objEncrypt);
        vdata.CodTipoComprobante = validarFormato(codTipoComprobanteCotizacion, objEncrypt); //RQ2024-664

        //INI RQ2025-884
        let tipoFormatoPlacaFront = '0';
        let zonaFronterizaFront = '0';
        if ($('#rbtnPlacaNacional').length == 1 && $('#rbtnPlacaExtranjera').length == 1) {
            tipoFormatoPlacaFront = (document.getElementById('rbtnPlacaNacional').checked ? '1' : document.getElementById('rbtnPlacaExtranjera').checked ? 2 : '0');
        }

        if ($('#ddlZonaFronteriza').length == 1) {
            zonaFronterizaFront = $("#ddlZonaFronteriza option:selected").val();
        }

        vdata.CodTipoFormatoPlaca = validarFormato(tipoFormatoPlacaFront, objEncrypt);
        vdata.CodZonaFronteriza = validarFormato(zonaFronterizaFront, objEncrypt);
        //FIN RQ2025-884

        $.ajax({
            url: urlAux,
            type: 'Post',
            data: vdata,
            async: false,
            success: function (data) {
                if (data.EsFraude === true) {
                    alertValida("Se encontró alteraciones externas en el sistema.");
                    document.location.href = "/Home/Index";
                    return;
                }
                if (data.IsValid === false) {
                    if (data.IsValidCreaCliente === false) {
                        alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>No se pudo obtener información del cliente, por favor intente nuevamente. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                        return;
                    }
                    else if (data.IsValidApi === false) {
                        alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Error en servicio de pagos digitales no se pudo guardar la cotización. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                        return;
                    }
                    else if (data.IsValid === false) {
                        alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                        return;
                    }
                } else {
                    $('#verPolizaAEmitir, .window').hide();
                    VerCotizar(data.correo, data.NumeroCotizacion);
                }
            }
        });
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / GrabarCotizar", e);
        return;
    }
}

function VerCotizar(correo, id) {
    var modulo = 'COTIZACION';
    try {
        $('#verCotizacion').modal('show');

        var urlAux = 'Cotizacion/VistaPreviaCotizar';
        $.ajax({
            url: urlAux,
            type: 'Get',
            data: { idCotizacion: id },
            async: false,
            success: function (data) {
                if (data.IsValid !== undefined && !data.IsValid) {
                    return;
                }
                $("#GenerarCotizacion").html(data);
                $("#e_mailContratante").val(correo);
            }
        });
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / VerVentanaImpresion", e);
        return;
    }
}

$("#lnkBusqCotizacion").click("click", function () {
    var modulo = 'COTIZACION';
    try {
        var idCotizacion = $("#NumeroCotizacion").val().toUpperCase().trim();
        if (idCotizacion === "") {
            alertValida("Ingresar un numero de cotización valido");
            return false;
        }

        var regex = /^[0-9]{4}-[0-9]+$/;
        if (!regex.test(idCotizacion)) {
            alertValida("Ingresar un formato de cotización valido (Año-Correlativo)");
            return false;
        }

        cargaCotizacion(idCotizacion, "");

        return false;
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / lnkBusqCotizacion", e);
        return;
    }
});

function BloquearControlesBusquedaCotizacion(estado) {
    $("#NumeroCotizacion").attr('readOnly', estado);
    if (estado === true) {
        $('#lnkBusqCotizacion').attr("disabled", 'disabled');
        $('#rbtnModaliadVentaTradicional').attr("disabled", 'disabled');
        $('#rbtnModaliadVentaDigital').attr("disabled", 'disabled');
        $('#rbtnSiTitularVehiculo').attr("disabled", 'disabled');
        $('#rbtnNoTitularVehiculo').attr("disabled", 'disabled');
    } else {
        $("#lnkBusqCotizacion").removeAttr('disabled');
        $('#rbtnModaliadVentaTradicional').removeAttr('disabled');
        $('#rbtnModaliadVentaDigital').removeAttr('disabled');
        $('#rbtnSiTitularVehiculo').removeAttr('disabled');
        $('#rbtnNoTitularVehiculo').removeAttr('disabled');
    }

    return false;
}

function cargaCotizacion(idCotizacion, placa) {
    var urlAux = 'Cotizacion/BuscarCotizacion';
    $.ajax({
        dataType: "json",
        url: urlAux,
        type: 'Post',
        data: { idCotizacion: idCotizacion, placa: placa },
        async: true,
        cache: true,
        success: function (data) {
            if (data.IsValid === false) {
                alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                LimpiarForm();
                return;
            }
            if (data.EsFraude === true) {
                alertValida("Se encontró alteraciones externas en el sistema.");
                document.location.href = "/Home/Index";
                return;
            }
            if (data.TipoPlaca === 1) {
                ObtenerInformacionPlaca($("#hdnTipoPlaca").val(), $("#NumeroPlaca").val().toUpperCase(), $("#Ramo").val(), 0);
                return;
            } else if (data.Resultado === 0) {
                LimpiarForm();
                alertValida("COTIZACION: El número de cotización ingresada no se encuentra registrada.");

            } else if (data.Resultado === 3) {
                LimpiarForm();
                alertValida("COTIZACION: Esta cotización ya no se encuentra vigente.")
            } else if (data.Resultado === 4) {
                LimpiarForm();
                alertValida("COTIZACION: Esta cotización ya no se encuentra activa.")
            } else if (data.Resultado === 403) {
                LimpiarForm();
                alertValida("COTIZACION: La cotización es tradicional, solo se pueden emitir pólizas digitales.")
            } else {
                BloquearControlesBusquedaCotizacion(true);
                DatosVehiculoCotizacion(data.Vehiculo, data.Broker, data.Rol);
                $("#findSection1").val(1);
                ConsultarAseguradoCotizacion(data.Contratante);
                ControlesBusqAsegurado();

                if (data.CodAsegurado !== data.CodContratante) {
                    document.getElementById('rbtnNoTitularVehiculo').checked = true;
                    ConsultarContratanteCotizacion(data.Asegurado);
                    ControlesBusqContratante();
                } else {
                    $("#rbtnSiTitularVehiculo").click();
                    document.getElementById('rbtnSiTitularVehiculo').checked = true;
                }

                $('#ddlMonedaLst').val(data.IdMoneda);
                $("#TipoMoneda").val(data.IdMoneda);
                if (data.ModVenta === 0) {
                    $('#rbtnModaliadVentaDigital').prop('checked', true);
                    $('#rbtnModaliadVentaDigital').click();
                } else {
                    $('#rbtnModaliadVentaTradicional').prop('checked', true);
                    $('#rbtnModaliadVentaTradicional').click();
                }
                $("#NumeroCotizacion").val(data.NroCotizacion);
                if (data.Vigente === 1) {
                    alertValida('VEHICULO: A la fecha de hoy la placa ingresada cuenta con una póliza vigente que finaliza el ´' + data.FechaFinPolizaVigente + '´.');
                    CambioVigencia(data.FechaFinPolizaVigente);
                }

                BloquearControlesBusquedaCotizacion(true);
                BloquearControlesVehiculoCotizacion(true);
                BloquearControlesAseguradoCotizacion(true);

                $('#rbtnSiDebitoAutomatico').prop('checked', data.Renovacion);
                $('#rbtnNoDebitoAutomatico').prop('checked', !data.Renovacion);
                $("#hdnExisteCotizacion").val("1");

                $('#hdnTipoPagoDigital').val(data.FormaPago);
                $('#hdnQuotation').val(data.Quotation);

                if (data.FormaPago == 9) {
                    $("#Cod_FormaPagoID")[0].selectedIndex = $("#Cod_FormaPagoID").find('option[value="9"]').index(); //BUGFIX RQ2022-1037
                    $('#Cod_FormaPagoID').trigger('change');
                    $('#SeccNotificacionPagoDigital').show();
                    $('#divEditarCotizacion').hide();
                    $('#rbtnSiDebitoAutomatico').attr("disabled", 'disabled');
                    $('#rbtnNoDebitoAutomatico').attr("disabled", 'disabled');
                } else {
                    if (data.FormaPago == 5) {
                        $("#Cod_FormaPagoID")[0].selectedIndex = $("#Cod_FormaPagoID").find('option[value="5"]').index(); //BUGFIX RQ2022-1037
                        $('#Cod_FormaPagoID').trigger('change');
                    }

                    $('#SeccNotificacionPagoDigital').hide();
                    $('#divEditarCotizacion').show();
                    $('#rbtnSiDebitoAutomatico').removeAttr('disabled');
                    $('#rbtnNoDebitoAutomatico').removeAttr('disabled');
                }

                //INI RQ2024-664
                if ($('#ddlTipoComprobante').length == 1) {
                    $('#ddlTipoComprobante').val(data.CodTipoComprobante);
                }
                //FIN RQ2024-664

                $('#IdNotificacion').val(data.Notificacion);//RQ2022-975
                BloquearControlesFormaPago(true);

                if ($("#hdnCotizacionActiva").val() > 0 && $("#hdnRenovacionActiva").val() === '1') {
                    if ($("#hdnExisteCotizacion").val() === '1' && (data.FormaPago == 1 || data.FormaPago == 5)) {
                        BloquearControlesFormaPago(false);
                    }
                }

                $("#lnkContinuar").show();
                //RQ2023-324
                CambioVigenciaCotizacion(data.FechaInicioVigencia, data.FechaFinVigencia);//RQ2024-905

                if ($("#hdnCotizacionActiva").val() > 0 && $("#hdnRenovacionActiva").val() === '1') {
                    if ($("#hdnExisteCotizacion").val() === '1' && $('#hdnTipoPagoDigital').val() === '9') {
                        $("#grpComandos").show();
                        $("#grpActualizarCotizacionPagoDigital").hide();
                    }
                }

                //INI RQ2025-884
                if ($('#rbtnPlacaNacional').length == 1 && $('#rbtnPlacaExtranjera').length == 1) {

                    let varTipoFormatoPlacaNacional = data.Vehiculo.TipoFormatoPlaca == 1 ? true : false;
                    let varTipoFormatoPlacaExtranjera = data.Vehiculo.TipoFormatoPlaca == 2 ? true : false;
                    let varZonaFronteriza = data.Vehiculo.ZonaFronteriza;

                    $('#rbtnPlacaNacional').prop('checked', varTipoFormatoPlacaNacional);
                    $('#rbtnPlacaExtranjera').prop('checked', varTipoFormatoPlacaExtranjera);
                    $('#ddlZonaFronteriza').val(varZonaFronteriza);

                    if (varTipoFormatoPlacaExtranjera) {
                        $('#comboZonaFronteriza').show();
                    }
                    else {
                        $('#comboZonaFronteriza').hide();
                    }

                    $('#rbtnPlacaNacional').attr("disabled", 'disabled');
                    $('#rbtnPlacaExtranjera').attr("disabled", 'disabled');
                }
                //FIN RQ2025-884

                return false;
            }
        }
    });
}

function DatosVehiculoCotizacion(oVehiculo, broker, rol) {
    try {
        var placaTramite = 0;
        $('#hdnTipoPlaca').val(oVehiculo.TipoPlacaId);
        $("#primerGrpVehi").show();
        $("#segundoGrpVehi").show();
        $("#tercerGrpVehi").show();
        $("#cuartoGrpVehi").show();
        $("#grpDatosAsegurado").show();
        $("#NumeroPlaca").val(oVehiculo.NumeroPlaca);

        $("#NumeroSerie").val('');
        $("#ModeloEspecifico").val('');
        $("#NumeroAsiento").val('');
        $("#Año").val('');
        $("#ClaseId").prop("selectedIndex", 0);
        $("#UsoId").children().remove();
        $("#UsoId").prop("selectedIndex", 0);
        $("#MarcaId").children().remove();
        $("#ModeloId").children().remove();
        $("#VersionId").children().remove();
        //Seteo de DDL's
        var ddlfClases = document.getElementById("ClaseId");
        ddlfClases.options.length = 0;
        ddlfClases.options[0] = new Option("--Seleccione--", "0");
        ddlfClases.selectedIndex = 0;

        $.ajax({
            url: "Ventas/ObtenerClases",
            type: 'Get',
            data: {
                pEsPlacaTramite: placaTramite,
                pTipoPlacaId: $("#hdnTipoPlaca").val(),
                pLetraPlaca: $("#NumeroPlaca").val().toUpperCase(),
                pComercializadorId: $("#ComercializadorIntermediarioId").val(),
                pIdAplicacion: $("#AplicacionId").val(),
                pFechaInicioVigencia: $("#FechaInicioVigencia").val(),
                pIntermediario: broker,
                pRol: rol,
                pClaseId: oVehiculo.ClaseIdSEL
            },
            async: true,
            cache: false,
            success: function (data) {
                if (data.IsValid === false) {
                    alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                    return;
                }
                datalenght = data.length;
                $.each(data, function (i, row) {
                    ddlfClases.options[i + 1] = new Option(row.DescripcionClase, row.ClaseId);
                });

                $("#ClaseId").val(oVehiculo.ClaseIdSEL);
                //--------------USOS--------
                CargarUsosCotizacion(oVehiculo, placaTramite, broker, rol);
            },
            error: function () {
                alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk.");
            }
        });
        $('#ModeloEspecifico').val(oVehiculo.ModeloEspecifico);
        $('#NumeroSerie').val(oVehiculo.NumeroSerie);
        $('#NumeroAsiento').val(oVehiculo.NumeroAsiento);
        $('#Año').val(oVehiculo.Año);

        if ($("#ddlZonaCirculacion option[value='" + oVehiculo.ZonaCirculacionId + "']").length > 0) {
            $("#ddlZonaCirculacion").val(oVehiculo.ZonaCirculacionId);
        }
    }
    catch (e) {
        throw e;
    }
}

function CargarUsosCotizacion(oVehiculo, placaTramite, broker, rol) {
    var ddlfUsos = document.getElementById("UsoId");
    ddlfUsos.options.length = 0;
    ddlfUsos.options[0] = new Option("--Seleccione--", "0");
    ddlfUsos.selectedIndex = 0;
    var ddlfMarcas = document.getElementById("MarcaId");
    ddlfMarcas.options.length = 0;
    ddlfMarcas.options[0] = new Option("--Seleccione--", "");
    ddlfMarcas.selectedIndex = 0;
    var ddlfModelos = document.getElementById("ModeloId");
    ddlfModelos.options.length = 0;
    ddlfModelos.options[0] = new Option("--Seleccione--", "");
    ddlfModelos.selectedIndex = 0;
    $.ajax({
        url: "Ventas/ObtenerUsos",
        type: 'Get',
        data: {
            pClaseId: oVehiculo.ClaseIdSEL,
            pIntermediarioId: $("#ComercializadorIntermediarioId").val(),
            pIntermediario: broker,
            pRol: rol,
            pEsPlacaEnTramite: placaTramite
        },
        async: true,
        cache: false,
        success: function (data) {
            if (data.IsValid === false) {
                alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                return;
            }
            $.each(data, function (i, row) {
                ddlfUsos.options[i + 1] = new Option(row.DescripcionUso, row.UsoId);
            });

            $('#UsoId').val(oVehiculo.UsoId);
            var marcatmp = 0;
            //---------------------Marcas--------------
            $.ajax({
                url: "Ventas/ObtenerMarcas",
                type: 'Get',
                data: {
                    pClaseId: oVehiculo.ClaseIdSEL,
                    pFechaInicioVigencia: $("#FechaInicioVigencia").val(),
                    pPlaca: $("#NumeroPlaca").val().toUpperCase(),
                    pTipoPlaca: $("#hdnTipoPlaca").val()
                },
                async: true,
                cache: false,
                success: function (data) {
                    $.each(data, function (i, row) {
                        ddlfMarcas.options[i + 1] = new Option(row.DescripcionMarca, row.MarcaId);
                        if (row.MarcaId === oVehiculo.MarcaId) {
                            marcatmp = i + 1;
                        }
                    });

                    ddlfMarcas.selectedIndex = marcatmp;
                    var modelotmp = 0;
                    $.ajax({
                        url: "Ventas/ObtenerModelos",
                        type: 'Get',
                        data: {
                            pClaseId: oVehiculo.ClaseIdSEL,
                            pMarcaId: oVehiculo.MarcaId,
                            pFechaInicioVigencia: $("#FechaInicioVigencia").val()
                        },
                        async: true,
                        cache: false,
                        success: function (data) {
                            if (data.IsValid === false) {
                                alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                                return;
                            }
                            $.each(data, function (i, row) {
                                ddlfModelos.options[i + 1] = new Option(row.DescripcionModelo, row.ModeloId);
                                if (row.ModeloId === oVehiculo.ModeloId) {
                                    modelotmp = i + 1
                                }
                            });
                            ddlfModelos.selectedIndex = modelotmp;
                            CargarVersionesCotizacion(oVehiculo);
                        },
                        error: function () {
                            alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk.");
                        }
                    });
                },
                error: function () {
                    alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk.");
                }
            });
        },
        error: function () {
            alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk.");
        }
    });
}

function CargarVersionesCotizacion(oVehiculo) {
    var versiontmp = 0;
    var ddlfVersiones = document.getElementById("VersionId");

    ddlfVersiones.options.length = 0;
    ddlfVersiones.options[0] = new Option("--Seleccione--", "");
    ddlfVersiones.selectedIndex = 0;

    var ddlfCats = document.getElementById("CatId");

    ddlfCats.options.length = 0;
    ddlfCats.options[0] = new Option("--Seleccione--", "0");
    ddlfCats.selectedIndex = 0;

    $.ajax({
        url: "Ventas/ObtenerVersiones",
        type: 'Get',
        data: {
            pClaseId: oVehiculo.ClaseIdSEL,
            pMarcaId: oVehiculo.MarcaId,
            pModeloId: oVehiculo.ModeloId,
            pFechaInicioVigencia: $("#FechaInicioVigencia").val()
        },
        async: true,
        cache: false,
        success: function (data) {
            if (data.IsValid === false) {
                alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                return;
            }
            $.each(data, function (i, row) {
                ddlfVersiones.options[i + 1] = new Option(row.DescripcionVersion, row.VersionId);

                if (parseInt(row.VersionId) === oVehiculo.VersionId) {
                    versiontmp = i + 1;
                }
            });
            ddlfVersiones.selectedIndex = versiontmp;
            var categoriatmp = 0;
            //--------   Categorias  A.E. RQ2017-1695 Categoria -----------
            $.ajax({
                url: "Ventas/ObtenerCats",
                type: 'Get',
                data: {
                    pClaseId: oVehiculo.ClaseIdSEL
                },
                async: true,
                cache: false,
                success: function (data) {
                    if (data.IsValid === false) {
                        alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                        return;
                    }
                    $.each(data, function (i, row) {
                        ddlfCats.options[i + 1] = new Option(row.DescripcionCat, row.CatId);
                        if (row.CatId === oVehiculo.CatId) {
                            categoriatmp = i + 1;
                        }
                    });
                    ddlfCats.selectedIndex = categoriatmp;
                },
                error: function () {
                    alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk.");
                }
            });
        },
        error: function () {
            alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk.");
        }
    });
}

function BloquearControlesVehiculoCotizacion(flag) {
    var NumeroPlaca = document.getElementById("NumeroPlaca");

    if (flag === true) {
        $('#lnkBusqPlaca').attr("disabled", 'disabled');
        $('#trModalidadVenta').attr("disabled", 'disabled');
        $('#lnkCambiarPlaca').attr("disabled", 'disabled');
        NumeroPlaca.disabled = flag;
    } else {
        $("#lnkCambiarPlaca").removeAttr('disabled');
        $("#lnkBusqPlaca").removeAttr('disabled');
        $("#trModalidadVenta").removeAttr('disabled');
    }

    if ($("#hdnFlagFisico").val() === "1") {
        var rbtnModaliadVentaTradicional = document.getElementById("rbtnModaliadVentaTradicional");
    }
    var rbtnModaliadVentaDigital = document.getElementById("rbtnModaliadVentaDigital");
    var FechaInicioVigencia = document.getElementById("FechaInicioVigencia");
    var ddlClase = document.getElementById("ClaseId");
    var ddlUso = document.getElementById("UsoId");
    var ddlCategoria = document.getElementById("CatId");
    var ddlMarca = document.getElementById("MarcaId");
    var ddlModelo = document.getElementById("ModeloId");
    var modeloEspecifico = document.getElementById("ModeloEspecifico");
    var NumeroSerie = document.getElementById("NumeroSerie");
    var NumeroAsiento = document.getElementById("NumeroAsiento");
    var ddlAño = document.getElementById("Año");
    var ddlZonaCirculacion = document.getElementById("ddlZonaCirculacion");
    var ddlVersion = document.getElementById("VersionId");

    if ($("#hdnFlagFisico").val() === "1") {
        rbtnModaliadVentaTradicional.disabled = flag
    }
    rbtnModaliadVentaDigital.disabled = flag
    //FechaInicioVigencia.disabled = flag;
    ddlClase.disabled = flag;
    ddlUso.disabled = flag;
    ddlCategoria.disabled = flag;
    ddlMarca.disabled = flag;
    ddlModelo.disabled = flag;
    ddlVersion.disabled = flag;
    modeloEspecifico.disabled = flag;
    NumeroSerie.disabled = flag;
    NumeroAsiento.disabled = flag;
    ddlAño.disabled = flag;
    ddlZonaCirculacion.disabled = flag;

}

function ConsultarAseguradoCotizacion(data) {

    try {

        $("#hdnClienteAseguradoId").val(data.Id);

        if (data.TipoDocumentoId === "2" && !validarFormatoRuc('ASEGURADO', data.NumeroDocumento, data.TipoPersonaId)) return;

        if (data.TipoDocumentoId === "2") {
            $("#AsegRazonSocial").val(data.RazonSocial);
            habilitarControlCombo("#AsegTipoDeEmpresaID", true);
            habilitarControl("#AsegRazonSocial", true);
            $("#AsegTipoDeEmpresaID").val(data.TipoEmpresaId);
            $("#AsegRubroEconomicoID").val(data.RubroEconomico);
            $("#AsegApellidoPaterno").val(data.ApellidoPaterno);
            $("#AsegApellidoMaterno").val(data.ApellidoMaterno);
            $("#AsegNombre").val(data.Nombre);
            $("#AseguradoCodigoSexo").val($.trim(data.CodigoSexo));
            $("#AseguradoEstadoCivil").val(data.EstadoCivil);
        }

        if (data.TipoDocumentoId === "1") {
            $("#CodInsunixAseg").val('');
            $("#AsegApellidoPaterno").val(data.ApellidoPaterno);
            $("#AsegApellidoMaterno").val(data.ApellidoMaterno);
            $("#AsegNombre").val(data.Nombre);
            $("#AseguradoEstadoCivil").val(data.EstadoCivil);
            $("#AseguradoCodigoSexo").val($.trim(data.CodigoSexo));
            $('#AseguradoEstadoCivil option').eq(2).prop('selected', true);
            $('#AseguradoCodigoSexo option').eq(2).prop('selected', true);
        }

        $("#AseguradoFechaNacimiento").val(data.FechaNacimiento);
        $("#AsegTipoNacionalidadID").val(data.NacionalidadId);
        $('#AsegTipoPersonaId').val(data.TipoPersonaId);
        $('#AsegTipoDocumentoId').val(data.TipoDocumentoId);
        $('#AsegNumeroDocumento').val(data.NumeroDocumento);
        $("#AseguradoCodigoVTime").val(data.CodigoVTime);
        $("#AsegEmail").val(data.Email);
        $("#AsegTelefonoCasa").val(data.TelefonoCasa);
        $("#AsegTelefonoCelular").val(data.TelefonoCelular);

        ValidarProvinciaDistritoAsegurado(data.DepartamentoId, data.ProvinciaId, data.DistritoId);

        $("#AsegDireccion").val(data.Direccion);
        $("#AsegReferencia").val(data.Referencia);

        $('#AseguradoCodigoSexo').show();
        $('#AseguradoEstadoCivil').show();
        $('#AseguradoFechaNacimiento').show('');
        $("#AsegTipoNacionalidadID").show();
        $("#lblSexoAseg").show();
        $("#lblFecnacAseg").show();
        $("#lblEstadocivilAseg").show();
        $("#lblNacionalidadAseg").show();

        $("#findSection2").val('1');
        return true;
    }
    catch (e) {
        throw e;
    }
};

function ValidarProvinciaDistritoAsegurado(DepartamentoId, ProvinciaId, DistritoId) {
    var AsegProvinciaId = document.getElementById("AsegProvinciaId");
    var AsegDistritoId = document.getElementById("AsegDistritoId");
    var AsegDepartamentoId = document.getElementById("AsegDepartamentoId");
    if ($("#AsegDepartamentoId option[value='" + DepartamentoId + "']").length > 0) {
        $("#AsegDepartamentoId").val(DepartamentoId);
        AsegDepartamentoId.disabled = true;
        ConsultaProvinciasPorFiltro("AsegProvinciaId", DepartamentoId);
        if ($("#AsegProvinciaId option[value='" + ProvinciaId + "']").length > 0) {
            $("#AsegProvinciaId").val(ProvinciaId);
            AsegProvinciaId.disabled = true;
            ConsultaDistritosPorFiltro("AsegDistritoId", DepartamentoId, ProvinciaId);
            if ($("#AsegDistritoId option[value='" + DistritoId + "']").length > 0) {
                AsegDistritoId.disabled = true;
                $("#AsegDistritoId").val(DistritoId);
            }
        }
    } else {
        $("#AsegDepartamentoId").val('');
        AsegProvinciaId.disabled = false;
        AsegDistritoId.disabled = false;
        AsegDepartamentoId.disabled = false;
    }
}

function ValidarProvinciaDistritoContratante(DepartamentoId, ProvinciaId, DistritoId) {
    var ContraProvinciaId = document.getElementById("ContraProvinciaId");
    var ContraDistritoId = document.getElementById("ContraDistritoId");
    var ContraDepartamentoId = document.getElementById("ContraDepartamentoId");
    if ($("#ContraDepartamentoId option[value='" + DepartamentoId + "']").length > 0) {
        $("#ContraDepartamentoId").val(DepartamentoId);
        ContraDepartamentoId.disabled = true;
        ConsultaProvinciasPorFiltro("ContraProvinciaId", DepartamentoId);
        if ($("#ContraProvinciaId option[value='" + ProvinciaId + "']").length > 0) {
            $("#ContraProvinciaId").val(ProvinciaId);
            ContraProvinciaId.disabled = true;
            ConsultaDistritosPorFiltro("ContraDistritoId", DepartamentoId, ProvinciaId);
            if ($("#ContraDistritoId option[value='" + DistritoId + "']").length > 0) {
                ContraDistritoId.disabled = true;
                $("#ContraDistritoId").val(DistritoId);
            }
        }
    } else {
        $("#ContraDepartamentoId").val('');
        ContraProvinciaId.disabled = false;
        ContraDistritoId.disabled = false;
        ContraDepartamentoId.disabled = false;
    }
}

function ConsultarContratanteCotizacion(data) {

    try {

        $("#hdnClienteContratanteId").val(data.Id);

        ControlesNoTitularVehiculo();
        if (data.TipoDocumentoId === "2" && !validarFormatoRuc('CONTRATANTE', data.NumeroDocumento, data.TipoPersonaId)) return;

        if (data.TipoDocumentoId === "2") {
            $("#ContraRazonSocial").val(data.RazonSocial);
            habilitarControlCombo("#ContraTipoDeEmpresaID", true);
            habilitarControl("#ContraRazonSocial", true);
            $("#ContTipoDeEmpresaID").val(data.TipoEmpresaId);
            $("#ContRubroEconomicoID").val(data.RubroEconomico);
            $("#ContraApellidoPaterno").val(data.ApellidoPaterno);
            $("#ContraApellidoMaterno").val(data.ApellidoMaterno);
            $("#ContraNombre").val(data.Nombre);
            $("#ContratanteEstadoCivil").val(data.EstadoCivil);
            $("#ContratanteCodigoSexo").val($.trim(data.CodigoSexo));
        }

        if (data.TipoDocumentoId === "1") {
            $("#ContraApellidoPaterno").val(data.ApellidoPaterno);
            $("#ContraApellidoMaterno").val(data.ApellidoMaterno);
            $("#ContraNombre").val(data.Nombre);
            $("#ContratanteEstadoCivil").val(data.EstadoCivil);
            $("#ContratanteCodigoSexo").val($.trim(data.CodigoSexo));
            $('#ContratanteEstadoCivil option').eq(2).prop('selected', true);
            $('#ContratanteCodigoSexo option').eq(2).prop('selected', true);
        }
        $("#ContratanteFechaNacimiento").val(data.FechaNacimiento);
        $("#ContTipoNacionalidadID").val(data.NacionalidadId);
        $('#ContraTipoPersonaId').val(data.TipoPersonaId);
        $('#ContraTipoDocumentoId').val(data.TipoDocumentoId);
        $('#ContraNumeroDocumento').val(data.NumeroDocumento);
        $("#ContratanteCodigoVTime").val(data.CodigoVTime);
        $("#ContraEmail").val(data.Email);
        $("#ContraTelefonoCasa").val(data.TelefonoCasa);
        $("#ContraTelefonoCelular").val(data.TelefonoCelular);

        ValidarProvinciaDistritoContratante(data.DepartamentoId, data.ProvinciaId, data.DistritoId);

        $("#ContraDireccion").val(data.Direccion);
        $("#ContraReferencia").val(data.Referencia);

        $('#ContratanteCodigoSexo').show();
        $('#ContratanteEstadoCivil').show();
        $('#ContratanteFechaNacimiento').show('');
        $("#ContTipoNacionalidadID").show();
        $("#lblSexoCont").show();
        $("#lblFecnacCont").show();
        $("#lblEstadocivilCont").show();
        $("#lblNacionalidadCont").show();

        $("#findSection2").val('1');
        return true;
    }
    catch (e) {
        throw e;
    }
};

function BloquearControlesAseguradoCotizacion(flag) {
    var AsegTipoDocumentoId = document.getElementById("AsegTipoDocumentoId");
    var AsegTipoDeEmpresaID = document.getElementById("AsegTipoDeEmpresaID");
    var AsegRazonSocial = document.getElementById("AsegRazonSocial");
    var AsegTipoPersonaId = document.getElementById("AsegTipoPersonaId");
    var AsegNumeroDocumento = document.getElementById("AsegNumeroDocumento");
    var AsegApellidoPaterno = document.getElementById("AsegApellidoPaterno");
    var AsegApellidoMaterno = document.getElementById("AsegApellidoMaterno");
    var AsegNombre = document.getElementById("AsegNombre");
    var AsegRubroEconomicoID = document.getElementById("AsegRubroEconomicoID");
    var AsegProvinciaId = document.getElementById("AsegProvinciaId");
    var AsegDistritoId = document.getElementById("AsegDistritoId");
    var AsegDepartamentoId = document.getElementById("AsegDepartamentoId");
    var ContraTipoDocumentoId = document.getElementById("ContraTipoDocumentoId");
    var ContraTipoDeEmpresaID = document.getElementById("ContTipoDeEmpresaID");
    var ContraRazonSocial = document.getElementById("ContraRazonSocial");
    var ContraTipoPersonaId = document.getElementById("ContraTipoPersonaId");
    var ContraNumeroDocumento = document.getElementById("ContraNumeroDocumento");
    var ContraApellidoPaterno = document.getElementById("ContraApellidoPaterno");
    var ContraApellidoMaterno = document.getElementById("ContraApellidoMaterno");
    var ContraNombre = document.getElementById("ContraNombre");
    var ContraRubroEconomicoID = document.getElementById("ContRubroEconomicoID");
    var ContraDepartamentoId = document.getElementById("ContraDepartamentoId");
    var ContraProvinciaId = document.getElementById("ContraProvinciaId");
    var ContraDistritoId = document.getElementById("ContraDistritoId");
    if (flag === true) {
        AsegRazonSocial.disabled = flag;
        AsegTipoDeEmpresaID.disabled = flag;
        AsegTipoPersonaId.disabled = flag;
        AsegTipoDocumentoId.disabled = flag;
        AsegNumeroDocumento.disabled = flag;
        AsegApellidoPaterno.disabled = flag;
        AsegApellidoMaterno.disabled = flag;
        AsegNombre.disabled = flag;
        AsegRubroEconomicoID.disabled = flag;
        ContraTipoPersonaId.disabled = flag;
        ContraTipoDocumentoId.disabled = flag;
        ContraNumeroDocumento.disabled = flag;
        ContraApellidoPaterno.disabled = flag;
        ContraApellidoMaterno.disabled = flag;
        ContraNombre.disabled = flag;
        ContraRazonSocial.disabled = flag;
        ContraRubroEconomicoID.disabled = flag;
        ContraTipoDeEmpresaID.disabled = flag;
        if ($("#hiddenFlagContextual").val() === '1') {
            $("#lnkLimpiarBusquedaContextual").attr("disabled", 'disabled');
            $("#ddlBusquedaContextual").select2("disable");
            $("#lnkLimpiarBusquedaContextualContra").attr("disabled", 'disabled');
            $("#ddlBusquedaContextualContra").select2("disable");
        } else {
            $('#lnkLimpiarAsegurado').attr("disabled", 'disabled');
            $('#lnkBusqClienteAsegu').attr("disabled", 'disabled');
            $('#lnkLimpiarContratante').attr("disabled", 'disabled');
            $('#lnkBusqClienteContra').attr("disabled", 'disabled');
        }
        $('#lnkBusqAsegurado').attr("disabled", 'disabled');
        $('#lnkBusqContratante').attr("disabled", 'disabled');
    } else {
        if ($("#hiddenFlagContextual").val() === '1') {
            $("#lnkLimpiarBusquedaContextual").removeAttr('disabled');
            $("#lnkLimpiarBusquedaContextualContra").removeAttr('disabled');
        } else {
            $("#lnkLimpiarAsegurado").removeAttr('disabled');
            $("#lnkBusqClienteAsegu").removeAttr('disabled');
        }
        $("#lnkBusqAsegurado").removeAttr('disabled');
        $("#lnkBusqContratante").removeAttr('disabled');
        $("#lnkLimpiarContratante").removeAttr('disabled');
        $("#lnkBusqClienteContra").removeAttr('disabled');
        AsegProvinciaId.disabled = flag;
        AsegDistritoId.disabled = flag;
        AsegDepartamentoId.disabled = flag;
        ContraDepartamentoId.disabled = flag;
        ContraProvinciaId.disabled = flag;
        ContraDistritoId.disabled = flag;
    }
    var AseguradoFechaNacimiento = document.getElementById("AseguradoFechaNacimiento");
    var AsegTipoNacionalidadID = document.getElementById("AsegTipoNacionalidadID");
    var AseguradoEstadoCivil = document.getElementById("AseguradoEstadoCivil");
    var AseguradoCodigoSexo = document.getElementById("AseguradoCodigoSexo");
    var AsegDireccion = document.getElementById("AsegDireccion");
    var AsegReferencia = document.getElementById("AsegReferencia");
    var ContratanteFechaNacimiento = document.getElementById("ContratanteFechaNacimiento");
    var ContratanteEstadoCivil = document.getElementById("ContratanteEstadoCivil");
    var ContraDireccion = document.getElementById("ContraDireccion");
    var ContraReferencia = document.getElementById("ContraReferencia");
    var ContratanteCodigoSexo = document.getElementById("ContratanteCodigoSexo");
    var ContTipoNacionalidadID = document.getElementById("ContTipoNacionalidadID");
    ContratanteFechaNacimiento.disabled = flag;
    ContratanteEstadoCivil.disabled = flag;
    ContraDireccion.disabled = flag;
    ContraReferencia.disabled = flag;
    ContratanteCodigoSexo.disabled = flag;
    ContTipoNacionalidadID.disabled = flag;
    AseguradoFechaNacimiento.disabled = flag;
    AsegTipoNacionalidadID.disabled = flag;
    AseguradoEstadoCivil.disabled = flag;
    AseguradoCodigoSexo.disabled = flag;
    AsegDireccion.disabled = flag;
    AsegReferencia.disabled = flag;
}

function BloquearControlesFormaPago(flag) {
    var codFormaPago = document.getElementById("Cod_FormaPagoID");
    var codMoneda = document.getElementById("ddlMonedaLst");
    var codNotificacion = document.getElementById("IdNotificacion");

    codFormaPago.disabled = flag;
    codMoneda.disabled = flag;
    codNotificacion.disabled = flag;
}

$("#NumeroCotizacion").keypress(function (event) {
    try {
        if (event.which === 13) {
            event.preventDefault();
            $("#lnkBusqCotizacion").click();
        }
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / NumeroCotizacion", e);
        return;
    }
});

$("#lnkEditarCotizacion").click(function () {
    $("#hdnCotizacionEditar").val("1");
    var modulo = 'COTIZACION';
    try {
        $.ajax({
            url: "Cotizacion/EditarCotizacion",
            type: 'Post',
            async: true,
            cache: false,
            success: function (data) {
                if (data.IsValid === false) {
                    alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                    return;
                }

                BloquearControlesBusquedaCotizacion(false);
                BloquearControlesAseguradoCotizacion(false);
                BloquearControlesVehiculoCotizacion(false);

                $("#TarifMontoTarifa").val('');
                $("#TarifaId").val('');
                $("#TarifMontoTarifaLabel").val('');
                $("#TarifMonedaDescLabel").val('');
                $("#TarifMonedaDesc").val('');
                $("#TarifDescripcionTarifa").val('');
                $("#TarifTipoCambio").val('');
                $("#TarifTipoCambio").val('');
                $("#CalcMontoLabel").text('');
                $("#NumeroCotizacion").val('');

                ObtenerInformacionPlaca($("#hdnTipoPlaca").val(), $("#NumeroPlaca").val().toUpperCase(), $("#Ramo").val(), 0);
            },
            error: function () {
                alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk.");
            }
        });
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / lnkEditarCotizacion", e);
        return;
    }
});

function LimpiarForm() {

    try {
        BloquearControlesBusquedaCotizacion(false);
        LimpiarDatosCertificado();
        $("#findSection1").val('0');
        $("#CodInsunixPla").val('');
        ControlesCambiarPlaca();
        if (idFlagEndoso !== 1) {
            LimpiarControlesAsegurado();
            LimpiarControlesContratante();
            $("#findSection2").val('0');
            $("#grpDatosCertificado").hide();
        }
        var codiubigeo = $("#hdnZonaCirculacionInicial").val();
        if (codiubigeo !== '') {
            $("#ddlZonaCirculacion").val(codiubigeo);
        }
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / lnkCambiarPlaca", e);
        return;
    }
}

function serializeArraySel(form) {
    var arr = [];
    Array.prototype.slice.call(form.elements).forEach(function (field) {
        if (!field.name || ['file', 'reset', 'submit', 'button'].indexOf(field.type) > -1) return;
        if (field.type === 'select-multiple') {
            Array.prototype.slice.call(field.options).forEach(function (option) {
                if (!option.selected) return;
                arr.push({
                    name: field.name,
                    value: option.value
                });
            });
            return;
        }
        if (['checkbox', 'radio'].indexOf(field.type) > -1 && !field.checked) return;
        arr.push({
            name: field.name,
            value: field.value
        });
    });
    return arr;
};
//INI RQ2023-64
function ValidaPersonaJuricaUso() {
    var bvalidation = true;
    var idTipoPersonaContra = $("#AsegTipoPersonaId").val();
    var idTipoDocumentoContr = $("#AsegTipoDocumentoId").val();
    var checkContranteIgualAsegurado = document.getElementById('rbtnNoTitularVehiculo').checked;

    let idClaseSelecc = $("#ClaseId").val();
    let esClaseRestringidaRuc20 = EsClasesRestriccionRuc20(idClaseSelecc);

    if (!checkContranteIgualAsegurado) {
        if (idTipoPersonaContra == "2" && idTipoDocumentoContr == "2") {
            var idTipoUSo = $("#UsoId").val();
            if (idTipoUSo == "1" && esClaseRestringidaRuc20) {
                alertValida("VEHICULO: El contratante y responsable de pago como PERSONA JURÍDICA no corresponde un vehículo de uso particular.<br/> Por favor vuelva a revisar los datos ingresado.");
                bvalidation = false;
            }
        }
    } else {
        var ContraTipoPersonaId = $("#ContraTipoPersonaId").val();
        var ContraTipoDocumentoId = $("#ContraTipoDocumentoId").val();
        if (ContraTipoPersonaId == "2" && ContraTipoDocumentoId == "2" && idTipoPersonaContra == "2" && idTipoDocumentoContr == "2") {
            var idTipoUSo = $("#UsoId").val();
            if (idTipoUSo == "1" && esClaseRestringidaRuc20) {
                alertValida("VEHICULO: El contratante y responsable de pago como PERSONA JURÍDICA no corresponde un vehículo de uso particular.<br/> Por favor vuelva a revisar los datos ingresado.");
                bvalidation = false;
            }
        }
    }
    return bvalidation;
}

function ValidaPersonaJuricaUsoEndoso() {
    var bvalidation = true;
    var idTipoPersonaContra = $("#AsegTipoPersonaId").val();
    var idTipoDocumentoContr = $("#AsegTipoDocumentoId").val();

    let idClaseSelecc = $("#ClaseId").val();
    let esClaseRestringidaRuc20 = EsClasesRestriccionRuc20(idClaseSelecc);

    var ContraTipoPersonaId = $("#ContraTipoPersonaId").val();
    var ContraTipoDocumentoId = $("#ContraTipoDocumentoId").val();
    if (ContraTipoPersonaId == "2" && ContraTipoDocumentoId == "2" && idTipoPersonaContra == "2" && idTipoDocumentoContr == "2") {
        var idTipoUSo = $("#UsoId").val();
        if (idTipoUSo == "1" && esClaseRestringidaRuc20) {
            alertValida("VEHICULO: El contratante y responsable de pago como PERSONA JURÍDICA no corresponde un vehículo de uso particular.<br/> Por favor vuelva a revisar los datos ingresado.");
            bvalidation = false;
        }
    }

    return bvalidation;
}

function EsClasesRestriccionRuc20(idClase) {
    let esClaseRestRuc20 = false;
    $.ajax({
        url: "Ventas/ObtenerClasesRestriccionRUC20",
        type: 'Get',
        data: {},
        async: false,
        cache: false,
        success: function (data) {
            if (data.IsValid === false) {
                alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk. <br>Código de Error: <b style='color:#FF6A39;'>" + data.ErrorMessage + "<b/>");
                return;
            }
            $.each(data, function (i, row) {
                if (row.Valor === idClase) {
                    esClaseRestRuc20 = true;
                }
            });
        },
        error: function () {
            alertValida("<a style='font-size: 1.5em; color:#6f79bd;'>Se produjo un error inesperado.</a> <br>Si el error persiste favor de comunicarse con Service Desk.");
        }
    });

    return esClaseRestRuc20;
}
function MensajeProceso(mensaje) {
    let $textAndPic = $('<div></div>');
    $textAndPic.append(' <i class="icono_alerta_modal"><img src="../Images/iconos/color/icon-warning.png" alt=""></i> ');
    $textAndPic.append('<div class="content_texto_modal"><span class="error-msg">' + mensaje + '</span></div>');

    BootstrapDialog.show({
        title: 'Alerta',
        type: BootstrapDialog.TYPE_WARNING,
        message: $textAndPic,
        closable: true,
        buttons: [
            {
                cssClass: 'btn-principal',
                label: ' Continuar',
                icon: 'icono_check',
                action: function (dialogRef) {
                    dialogRef.close();
                    GrabarCotizar('Cotizar');
                }
            },
            {
                cssClass: 'btn-principal',
                label: ' Cancelar',
                icon: 'glyphicon glyphicon-ban-circle',
                action: function (dialogRef) {
                    dialogRef.close();
                }
            }
        ],
    });
}
$("#lnkActualizarCotizacion").click(function () {
    var modulo = 'VENTAS_INDIVIDUALES';
    try {
        if ($('#TarifDescripcionTarifa').val().trim() == '') {
            alertValida('TARIFA: Debe ingresar una Tarifa.');
            $('#lnkBusqPlanTarifa').focus();
            return false;
        }
        else {
            MensajeProceso("<a style='font-size: 1.5em; color:#6f79bd;'>¿Desea actualizar la forma de pago?</a> <br>Al aceptar se generará la cotización con el link de pago y posteriormente la forma de pago de esta cotización no podrá ser modificada nuevamente.");
        }
    }
    catch (e) {
        GrabaMensajeErrorVista(modulo, "Ventas.js / lnkActualizarCotizacion", e);
        return;
    }
});
//FIN RQ2023-64
LeyendaMedioPago(); //RQ2020-569
ControlesInicial();
ControlesValoresPorDefecto();
ConsultaTiposDocumentoContratantePorFiltro(1);