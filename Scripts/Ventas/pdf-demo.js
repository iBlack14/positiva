(function () {
    // Replace these placeholders with the other company's approved identity.
    var demoCompany = 'EMPRESA DEMO';
    var demoDomain = 'empresa-ejemplo.com';
    var demoPdfUrl = '';

    function fieldValue(id) {
        var field = document.getElementById(id);
        if (!field) return '';
        if (field.tagName === 'SELECT') {
            return field.selectedIndex >= 0 ? field.options[field.selectedIndex].text : '';
        }
        return field.value.trim();
    }

    function ascii(value) {
        return String(value || '')
            .replace(/[ñÑ]/g, function (letter) { return letter === 'ñ' ? 'n' : 'N'; })
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^\x20-\x7E]/g, ' ');
    }

    function pdfString(value) {
        return ascii(value).replace(/([\\()])/g, '\\$1');
    }

    function buildDemoPdf() {
        var entries = [
            ['DATOS DEL VEHICULO', ''],
            ['Placa', 'txtPlaca'],
            ['Clase', 'cmbClase'],
            ['Marca', 'cmbMarca'],
            ['Modelo', 'cmbModelo'],
            ['Modelo especifico', 'txtModeloEsp'],
            ['Ano', 'txtAnio'],
            ['Uso', 'cmbUso'],
            ['Numero de serie', 'txtSerie'],
            ['Zona de circulacion', 'cmbZona'],
            ['Categoria', 'cmbCategoria'],
            ['Version', 'cmbVersion'],
            ['Numero de asientos', 'txtAsientos'],
            ['DATOS DEL CONTRATANTE', ''],
            ['Tipo de persona', 'cmbTipoPersonaVenta'],
            ['Tipo de documento', 'cmbTipoDocVenta'],
            ['Numero de documento', 'txtNumDocVenta'],
            ['Nombre / razon social', 'txtNombreContratanteVenta'],
            ['Direccion', 'txtDireccionContratanteVenta'],
            ['Departamento', 'txtDepartamentoContratanteVenta'],
            ['Provincia', 'txtProvinciaContratanteVenta'],
            ['Distrito', 'txtDistritoContratanteVenta'],
            ['Telefono', 'txtTelefonoContratanteVenta'],
            ['Correo', 'txtCorreoContratanteVenta'],
            ['DATOS DE PAGO', ''],
            ['Moneda', 'cmbMoneda'],
            ['Prima', 'txtPrima'],
            ['Monto a pagar', 'txtMontoPagar']
        ];
        var y = 650;
        var commands = [
            'q 0.02 0.65 0.63 rg 42 710 528 44 re f Q',
            'BT /F2 18 Tf 56 736 Td (' + pdfString(demoCompany) + ') Tj ET',
            'BT /F1 9 Tf 56 720 Td (' + pdfString(demoDomain) + ') Tj ET',
            'BT /F2 15 Tf 42 680 Td (RESUMEN DE DATOS SOAT) Tj ET',
            'q 1 0.93 0.86 rg 42 650 528 20 re f Q',
            'BT /F2 11 Tf 52 657 Td (DEMO / SIN VALIDEZ - NO ES UNA POLIZA) Tj ET',
            'BT /F1 9 Tf 42 635 Td (No acredita emision, cobertura ni pago.) Tj ET'
        ];

        entries.forEach(function (entry) {
            if (entry[1] === '') {
                y -= 18;
                commands.push('q 0.88 0.96 0.95 rg 42 ' + (y - 4) + ' 528 16 re f Q');
                commands.push('BT /F2 9 Tf 48 ' + y + ' Td (' + pdfString(entry[0]) + ') Tj ET');
                y -= 17;
                return;
            }
            if (y < 62) return;
            var value = fieldValue(entry[1]) || 'No ingresado';
            commands.push('BT /F1 8 Tf 50 ' + y + ' Td (' + pdfString(entry[0] + ': ' + value) + ') Tj ET');
            y -= 15;
        });

        commands.push('BT /F2 28 Tf 0.88 0 0 0.88 170 345 Tm 0.88 0.88 0.88 rg (DEMO - SIN VALIDEZ) Tj ET');
        commands.push('BT /F1 8 Tf 42 35 Td (Documento demostrativo para revision de diseno. Datos de prueba, sin efecto contractual.) Tj ET');

        var stream = commands.join('\n');
        var objects = [
            '<< /Type /Catalog /Pages 2 0 R >>',
            '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
            '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>',
            '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
            '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>',
            '<< /Length ' + stream.length + ' >>\nstream\n' + stream + '\nendstream'
        ];
        var pdf = '%PDF-1.4\n';
        var offsets = [0];
        objects.forEach(function (object, index) {
            offsets.push(pdf.length);
            pdf += (index + 1) + ' 0 obj\n' + object + '\nendobj\n';
        });
        var xrefOffset = pdf.length;
        pdf += 'xref\n0 ' + (objects.length + 1) + '\n0000000000 65535 f \n';
        offsets.slice(1).forEach(function (offset) {
            pdf += String(offset).padStart(10, '0') + ' 00000 n \n';
        });
        pdf += 'trailer\n<< /Size ' + (objects.length + 1) + ' /Root 1 0 R >>\nstartxref\n' + xrefOffset + '\n%%EOF';
        return new Blob([pdf], { type: 'application/pdf' });
    }

    function addDemoToSalesList(url) {
        var table = document.getElementById('tbodyListaVentas');
        if (!table) return;
        var previousRow = document.getElementById('filaPdfDemo');
        if (previousRow) previousRow.remove();
        var emptyRow = table.querySelector('tr td[colspan]');
        if (emptyRow) emptyRow.closest('tr').remove();

        var row = document.createElement('tr');
        row.id = 'filaPdfDemo';
        [
            'No generado',
            fieldValue('txtPlaca') || '—',
            fieldValue('txtNombreContratanteVenta') || '—',
            fieldValue('cmbClase') || '—',
            'No aplica',
            'No aplica'
        ].forEach(function (text) {
            var cell = document.createElement('td');
            cell.textContent = text;
            row.appendChild(cell);
        });

        var status = document.createElement('td');
        status.textContent = 'DEMO / SIN VALIDEZ';
        row.appendChild(status);

        var action = document.createElement('td');
        var download = document.createElement('a');
        download.href = url;
        download.download = 'resumen-soat-demo.pdf';
        download.className = 'btn-pill-orange';
        download.textContent = 'Descargar PDF DEMO';
        action.appendChild(download);
        row.appendChild(action);
        table.appendChild(row);
    }

    window.descargarPdfDemo = function () {
        if (demoPdfUrl) URL.revokeObjectURL(demoPdfUrl);
        demoPdfUrl = URL.createObjectURL(buildDemoPdf());

        var link = document.createElement('a');
        link.href = demoPdfUrl;
        link.download = 'resumen-soat-demo.pdf';
        document.body.appendChild(link);
        link.click();
        link.remove();
        addDemoToSalesList(demoPdfUrl);
    };
}());
