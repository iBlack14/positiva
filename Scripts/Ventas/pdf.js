(function () {
    var PURPLE = [89, 43, 145];
    var MUTED = [158, 151, 174];
    var LIGHT = [167, 174, 178];
    var LINE = [216, 216, 222];

    function fieldValue(id) {
        var field = document.getElementById(id);
        if (!field) return '';
        if (field.tagName === 'SELECT') {
            return field.selectedIndex >= 0 ? field.options[field.selectedIndex].text : '';
        }
        return field.value.trim();
    }

    function loadImageDataUrl(url) {
        return fetch(url)
            .then(function (response) {
                if (!response.ok) throw new Error('No se pudo cargar ' + url);
                return response.blob();
            })
            .then(function (blob) {
                return new Promise(function (resolve, reject) {
                    var reader = new FileReader();
                    reader.onload = function () { resolve(String(reader.result)); };
                    reader.onerror = function () { reject(reader.error); };
                    reader.readAsDataURL(blob);
                });
            });
    }

    async function buildSoatPdf() {
        var jsPDFClass = (window.jspdf && window.jspdf.jsPDF) ? window.jspdf.jsPDF : window.jsPDF;
        if (!jsPDFClass) {
            alert('Cargando librería PDF, por favor intente nuevamente en un segundo.');
            return;
        }

        var pageWidth = 65.26;
        var pageHeight = 120.30;
        var doc = new jsPDFClass({ orientation: 'portrait', unit: 'mm', format: [pageWidth, pageHeight] });
        var margin = 2.2;
        var usable = pageWidth - margin * 2;

        var setColor = function (rgb) { doc.setTextColor(rgb[0], rgb[1], rgb[2]); };
        var divider = function (y) {
            doc.setDrawColor(LINE[0], LINE[1], LINE[2]);
            doc.setLineWidth(0.18);
            doc.line(margin, y, pageWidth - margin, y);
        };
        var heading = function (text, x, y, size) {
            size = size || 7;
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(size);
            setColor(MUTED);
            doc.text(text, x, y);
        };
        var label = function (text, x, y) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(5.2);
            setColor(LIGHT);
            doc.text(text, x, y);
        };
        var value = function (text, x, y, size, maxWidth) {
            size = size || 7.1;
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(size);
            setColor(PURPLE);
            if (maxWidth) {
                var fittedSize = size;
                while (fittedSize > 4.5 && doc.getTextWidth(text) > maxWidth) {
                    fittedSize -= 0.2;
                    doc.setFontSize(fittedSize);
                }
            }
            doc.text(text, x, y);
        };

        var now = new Date();
        var formatDate = function (d) {
            var dd = String(d.getDate()).padStart(2, '0');
            var mm = String(d.getMonth() + 1).padStart(2, '0');
            var yy = d.getFullYear();
            return dd + '/' + mm + '/' + yy;
        };

        var start = now;
        var end = new Date(start);
        end.setFullYear(end.getFullYear() + 1);

        var placa = (fieldValue('txtPlaca') || '6250IA').toUpperCase();
        var clase = fieldValue('cmbClase') || 'Vehiculo Menor';
        var uso = fieldValue('cmbUso') || 'Particular';
        var vin = (fieldValue('txtSerie') || 'LALJA2597K3203282').toUpperCase();
        var holder = (fieldValue('txtNombreContratanteVenta') || 'morales sanchez, luis guillermo');
        var primaVal = fieldValue('txtPrima') || fieldValue('txtMontoPagar') || '570.00';
        var primaNum = parseFloat(primaVal.replace(/[^0-9.]/g, '')) || 570;

        // Generar número de póliza
        var policyNumber = fieldValue('txtPolizaVenta') || ('1406' + Math.floor(10000 + Math.random() * 90000));

        // 1. Logo oficial del MTC
        try {
            var mtcLogo = await loadImageDataUrl('assets/logos/mtc.png');
            doc.addImage(mtcLogo, 'PNG', 2.2, 0.15, 28.5, 9.5, undefined, 'FAST');
        } catch (e) {
            doc.setFillColor(239, 35, 35);
            doc.rect(7.7, 1.5, 5.6, 5.3, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(4.4);
            doc.setTextColor(255, 255, 255);
            doc.text('PERÚ', 10.5, 5.0, { align: 'center' });
            doc.setFillColor(48, 48, 48);
            doc.rect(13.6, 1.5, 16.6, 5.3, 'F');
            doc.setFontSize(2.9);
            doc.text(['Ministerio', 'de Transportes', 'y Comunicaciones'], 14.2, 3.0, { lineHeightFactor: 0.78 });
        }

        heading('Certificado Electrónico', margin, 11.7, 7.5);
        heading('Decreto Supremo 015 - 2016 MTC', margin, 15.1, 6.8);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(32);
        setColor(PURPLE);
        doc.text('SOAT', pageWidth - margin, 15.5, { align: 'right' });
        divider(18.8);

        // 2. Bloque principal aseguradora y emergencias
        doc.setFillColor(249, 247, 252);
        doc.roundedRect(2.8, 20.4, pageWidth - 5.6, 12.4, 1.2, 1.2, 'F');
        doc.setDrawColor(229, 224, 235);
        doc.setLineWidth(0.16);
        doc.line(32.6, 21.6, 32.6, 31.5);

        heading('COMPAÑÍA DE SEGUROS', 4.2, 23.0, 4.4);
        heading('EN CASO DE EMERGENCIAS', 35.0, 23.0, 4.2);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.6);
        setColor(PURPLE);
        doc.text(['LA POSITIVA SEGUROS', 'Y REASEGUROS'], 4.2, 26.5, { lineHeightFactor: 1.15 });

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.6);
        setColor(PURPLE);
        doc.text(['211 0211 LIMA Y/O', 'PROVINCIAS'], 35.0, 26.5, { lineHeightFactor: 1.15 });

        // Security band diagonal pattern
        doc.setDrawColor(PURPLE[0], PURPLE[1], PURPLE[2]);
        doc.setLineWidth(0.55);
        for (var x = margin; x < pageWidth - margin; x += 1.25) {
            doc.line(x, 33.7, x + 0.75, 35.0);
        }

        // Vigencia póliza y certificado SOAT
        heading('VIGENCIA DE LA PÓLIZA', 3.5, 38.3, 5.5);
        heading('CERTIFICADO SOAT', 29.8, 39.7, 5.3);
        heading('CONTROL POLICIAL', 29.8, 42.7, 5.3);

        label('N° Póliza - Certificado', 3.5, 41.0);
        doc.setFont('helvetica', 'bold');
        value(policyNumber + ' - 0', 3.5, 44.8, 7.5, 24.5);
        doc.setFont('helvetica', 'normal');
        label('Desde', 3.5, 47.6);
        doc.setFont('helvetica', 'bold');
        value(formatDate(start), 3.5, 51.2, 7.5);
        doc.setFont('helvetica', 'normal');
        label('Hasta', 3.5, 54.0);
        doc.setFont('helvetica', 'bold');
        value(formatDate(end), 3.5, 57.6, 7.5);

        doc.setFont('helvetica', 'normal');
        label('Desde', 29.8, 48.5);
        doc.setFont('helvetica', 'bold');
        value(formatDate(start), 29.8, 52.1, 7.5);
        doc.setFont('helvetica', 'normal');
        label('Hasta', 29.8, 54.9);
        doc.setFont('helvetica', 'bold');
        value(formatDate(end), 29.8, 58.5, 7.5);

        doc.setDrawColor(LINE[0], LINE[1], LINE[2]);
        doc.setLineWidth(0.16);
        doc.line(49.0, 44.2, 49.0, 61.4);
        doc.setFontSize(4.3);
        setColor(LIGHT);
        doc.text(['Vigencia de uso', 'exclusivo para', 'control policial'], 50.9, 51.8, { lineHeightFactor: 1.12 });
        divider(63.0);

        // Vehículo Asegurado y Contratante
        heading('VEHÍCULO ASEGURADO', 3.5, 67.1, 5.5);
        heading('CONTRATANTE / ASEGURADO', 31.8, 67.1, 5.2);

        label('Placa', 3.5, 70.0);
        doc.setFont('helvetica', 'bold');
        value(placa, 3.5, 73.5, 7.5);
        label('Categoría / Clase', 3.5, 76.3);
        value(clase, 3.5, 79.7, 6.6, 25.5);
        label('Uso', 3.5, 82.5);
        value(uso, 3.5, 85.9, 6.5);
        label('Vin / N° de serie', 3.5, 88.7);
        value(vin, 3.5, 92.0, 5.8, 26.0);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.5);
        setColor(PURPLE);
        var holderLines = doc.splitTextToSize(holder, 29.2).slice(0, 2);
        doc.text(holderLines, 31.8, 71.3, { lineHeightFactor: 1.1 });

        label('Importe de la prima', 31.8, 78.2);
        doc.setFont('helvetica', 'bold');
        value('S/. ' + primaNum.toFixed(2), 31.8, 81.6, 7.0);

        doc.setFont('helvetica', 'normal');
        label('Fecha', 31.8, 84.2);
        var isoDate = now.toISOString().slice(0, 10);
        value(isoDate, 31.8, 87.5, 6.4);

        label('Hora de emisión', 31.8, 90.1);
        var hh = String(now.getHours()).padStart(2, '0');
        var mi = String(now.getMinutes()).padStart(2, '0');
        value(hh + ' h : ' + mi + ' m', 31.8, 93.5, 6.2);

        // Legal text
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(3.8);
        setColor(LIGHT);
        var legal = 'Los establecimientos de salud públicos y privados están obligados a prestar atención médico quirúrgica de emergencia en caso de la ocurrencia de un accidente de tránsito conforme a la Ley N° 26842, Ley General de Salud y su Reglamento.';
        doc.text(doc.splitTextToSize(legal, usable - 2.4), 3.4, 100.2, { lineHeightFactor: 1.15 });

        // Footer APESEG
        doc.setFillColor(0, 0, 0);
        doc.rect(3.2, 106.0, pageWidth - 6.4, 11.6, 'F');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(4.3);
        doc.setTextColor(255, 255, 255);
        var footer = 'La información sobre las obligaciones y derechos del contratante/asegurado, coberturas y exclusiones, las podrás encontrar ingresando a www.apeseg.org/soat o solicitando tu cartilla informativa en las oficinas de la compañía de seguros.';
        var footerLines = doc.splitTextToSize(footer, pageWidth - 10);
        doc.text(footerLines, pageWidth / 2, 109.0, { align: 'center', lineHeightFactor: 1.1 });

        doc.save('Certificado-SOAT-' + placa + '.pdf');
    }

    window.descargarPdfDemo = function () {
        buildSoatPdf();
    };
})();
