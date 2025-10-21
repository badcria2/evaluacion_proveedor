/**
 * Evaluación de Proveedor de TI
 * Script para gestionar la evaluación de proveedores de TI
 * Características:
 * - Cálculo automático de calificaciones y ponderados
 * - Gestión de criterios no aplicables
 * - Calculadora de conversión de métricas a calificaciones
 * - Exportación a CSV
 * - Carga de proveedores desde JSON
 */

// Variable global para almacenar los datos de los proveedores
let proveedoresData = [];

// Inicialización de elementos al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Establecer fecha actual en el campo de fecha de evaluación
    document.getElementById('fecha-evaluacion').valueAsDate = new Date();
    
    // Inicialmente ocultar las guías de calificación
    document.getElementById('guias-calificacion').style.display = 'none';
    
    // Configurar event listeners
    setupEventListeners();
    
    // Cargar proveedores desde el JSON embebido o archivo externo
    cargarProveedores();
});

/**
 * Carga los proveedores desde el JSON
 */
function cargarProveedores() {
    // Datos JSON embebidos (puedes reemplazar esto con fetch a un archivo externo)
    const jsonData = [
        {
            "nombre": "Deloitte",
            "servicios": {
                "Consultoría Estratégica": {
                    "sla": {
                        "critica": "2.0 horas",
                        "alta": "6.0 horas",
                        "media": "12.0 horas",
                        "baja": "48.0 horas"
                    }
                },
                "Ciberseguridad": {
                    "sla": {
                        "critica": "1.0 horas",
                        "alta": "3.0 horas",
                        "media": "6.0 horas",
                        "baja": "24.0 horas"
                    }
                }
            }
        },
        {
            "nombre": "Sencinet",
            "servicios": {
                "Conectividad": {
                    "sla": {
                        "critica": "1.5 horas",
                        "alta": "4.0 horas",
                        "media": "8.0 horas",
                        "baja": "24.0 horas"
                    }
                },
                "Cloud Híbrida": {
                    "sla": {
                        "critica": "2.0 horas",
                        "alta": "5.0 horas",
                        "media": "10.0 horas",
                        "baja": "36.0 horas"
                    }
                }
            }
        },
        {
            "nombre": "SoftwareONE",
            "servicios": {
                "Licenciamiento Software": {
                    "sla": {
                        "critica": "3.0 horas",
                        "alta": "8.0 horas",
                        "media": "16.0 horas",
                        "baja": "48.0 horas"
                    }
                },
                "Servicios Gestionados Cloud": {
                    "sla": {
                        "critica": "1.0 horas",
                        "alta": "3.0 horas",
                        "media": "6.0 horas",
                        "baja": "24.0 horas"
                    }
                }
            }
        },
        {
            "nombre": "Neosecure",
            "servicios": {
                "Seguridad Gestionada": {
                    "sla": {
                        "critica": "0.5 horas",
                        "alta": "1.5 horas",
                        "media": "3.0 horas",
                        "baja": "12.0 horas"
                    }
                },
                "Consultoría de Ciberseguridad": {
                    "sla": {
                        "critica": "1.5 horas",
                        "alta": "4.0 horas",
                        "media": "8.0 horas",
                        "baja": "24.0 horas"
                    }
                }
            }
        },
        {
            "nombre": "Stefanini",
            "servicios": {
                "Service Desk": {
                    "sla": {
                        "critica": "1.0 horas",
                        "alta": "2.0 horas",
                        "media": "4.0 horas",
                        "baja": "16.0 horas"
                    }
                },
                "Desarrollo de Software": {
                    "sla": {
                        "critica": "4.0 horas",
                        "alta": "12.0 horas",
                        "media": "24.0 horas",
                        "baja": "72.0 horas"
                    }
                }
            }
        }
    ];
    
    proveedoresData = jsonData;
    populateProveedorSelect(proveedoresData);
    
    // Si prefieres cargar desde un archivo externo, descomenta esto:
    /*
    fetch('js/proveedores.json')
        .then(response => response.json())
        .then(data => {
            proveedoresData = data;
            populateProveedorSelect(proveedoresData);
        })
        .catch(error => {
            console.error('Error al cargar los proveedores:', error);
            showCustomMessage('Error al cargar la lista de proveedores', 'error');
        });
    */
}

/**
 * Función para poblar el select de proveedores
 */
function populateProveedorSelect(proveedores) {
    const proveedorSelect = document.getElementById('proveedor-select');
    proveedorSelect.innerHTML = '<option value="">-- Seleccione un proveedor --</option>';

    proveedores.forEach(proveedor => {
        const option = document.createElement('option');
        option.value = proveedor.nombre;
        option.textContent = proveedor.nombre;
        proveedorSelect.appendChild(option);
    });
}

/**
 * Función para poblar el select de servicios basado en el proveedor seleccionado
 */
function populateServicioSelect(nombreProveedor) {
    const servicioSelect = document.getElementById('servicio-select');
    servicioSelect.innerHTML = '<option value="todos">Todos los servicios</option>';
    
    if (!nombreProveedor) {
        return;
    }
    
    const proveedor = proveedoresData.find(p => p.nombre === nombreProveedor);
    
    if (proveedor && proveedor.servicios) {
        Object.keys(proveedor.servicios).forEach(servicioNombre => {
            const option = document.createElement('option');
            option.value = servicioNombre;
            option.textContent = servicioNombre;
            servicioSelect.appendChild(option);
        });
    }
}

/**
 * Función para aplicar los SLAs a los parámetros del formulario
 */
function applySlaToParameters(nombreProveedor, nombreServicio) {
    if (!nombreProveedor || nombreServicio === 'todos') {
        return;
    }
    
    const proveedor = proveedoresData.find(p => p.nombre === nombreProveedor);
    
    if (!proveedor || !proveedor.servicios) {
        return;
    }
    
    const servicio = proveedor.servicios[nombreServicio];
    
    if (!servicio || !servicio.sla) {
        return;
    }
    
    // Aplicar los SLAs a los campos correspondientes
    document.getElementById('sla-critica').value = servicio.sla.critica || '';
    document.getElementById('sla-alta').value = servicio.sla.alta || '';
    document.getElementById('sla-media').value = servicio.sla.media || '';
    document.getElementById('sla-baja').value = servicio.sla.baja || '';
    
    showCustomMessage(`SLAs aplicados para ${nombreServicio}`, 'success');
}

/**
 * Configura todos los event listeners de la aplicación
 */
function setupEventListeners() {
    const proveedorSelect = document.getElementById('proveedor-select');
    const servicioSelect = document.getElementById('servicio-select');
    
    // Event listener para el cambio de proveedor
    if (proveedorSelect) {
        proveedorSelect.addEventListener('change', () => {
            const selectedProveedorName = proveedorSelect.value;
            populateServicioSelect(selectedProveedorName);
            
            // Resetear los campos de SLA cuando se cambia de proveedor
            if (servicioSelect) {
                servicioSelect.value = 'todos';
            }
        });
    }
    
    // Event listener para el cambio de servicio
    if (servicioSelect) {
        servicioSelect.addEventListener('change', () => {
            const selectedProveedorName = proveedorSelect.value;
            const selectedServiceName = servicioSelect.value;
            
            if (selectedServiceName !== 'todos') {
                applySlaToParameters(selectedProveedorName, selectedServiceName);
            }
        });
    }
    // Botones principales
    document.getElementById('calcular').addEventListener('click', calcularResultados);
    document.getElementById('exportar-csv').addEventListener('click', exportarCSV);
    document.getElementById('imprimir').addEventListener('click', imprimirEvaluacion);
    document.getElementById('toggleGuias').addEventListener('click', toggleGuiasCalificacion);
    
    // Botón para abrir calculadora
    const btnAbrirCalculadora = document.getElementById('abrir-calculadora');
    if (btnAbrirCalculadora) {
        btnAbrirCalculadora.addEventListener('click', () => {
            document.getElementById('calculadoraModal').style.display = 'block';
        });
    }
    
    // Calculadora de calificaciones
    document.getElementById('sugerir-calificaciones').addEventListener('click', sugerirCalificaciones);
    document.getElementById('cerrarModal').addEventListener('click', cerrarCalculadora);
    document.getElementById('criterio-select').addEventListener('change', cambiarCriterioCalculadora);
    document.getElementById('aplicar-calificacion').addEventListener('click', aplicarCalificacion);
    
    // Estadísticas de tickets
    document.getElementById('tickets-abiertos').addEventListener('input', calcularPorcentajes);
    document.getElementById('tickets-resueltos').addEventListener('input', calcularPorcentajes);
    document.getElementById('tickets-reabiertos').addEventListener('input', calcularPorcentajes);
    
    // Event listener para cambios en calificaciones y checkboxes N/A
    document.addEventListener('change', function(e) {
        // Validar rango de calificaciones (1-5)
        if (e.target.classList.contains('calificacion')) {
            if (e.target.value < 1) e.target.value = 1;
            if (e.target.value > 5) e.target.value = 5;
        }
        
        // Manejar cambios en checkboxes N/A
        if (e.target.classList.contains('na-check')) {
            const fila = e.target.closest('tr');
            const calificacion = fila.querySelector('.calificacion');
            const ponderadoCell = fila.querySelector('.ponderado');
            
            if (e.target.checked) {
                calificacion.disabled = true;
                calificacion.value = "";
                ponderadoCell.textContent = "N/A";
                fila.classList.add('na-row');
            } else {
                calificacion.disabled = false;
                ponderadoCell.textContent = "0";
                fila.classList.remove('na-row');
            }
            calcularResultados();
        }
    });

    // Add input event listener to all .calificacion inputs for real-time updates
    document.querySelectorAll('.calificacion').forEach(input => {
        input.addEventListener('input', calcularResultados);
    });
}

/**
 * Calcula los resultados de toda la evaluación, incluyendo la redistribución de pesos
 * para criterios "No Aplicables".
 */
function calcularResultados() {
    for (let i = 1; i <= 6; i++) {
        let subtotal = 0;
        let pesoTotalSeccion = 0;
        let pesoNASeccion = 0;
        
        const calificacionesSeccion = document.querySelectorAll(`#seccion${i} .calificacion`);

        calificacionesSeccion.forEach(function(calificacionInput) {
            const pesoOriginal = parseFloat(calificacionInput.getAttribute('data-peso'));
            pesoTotalSeccion += pesoOriginal;

            const fila = calificacionInput.closest('tr');
            const naCheck = fila.querySelector('.na-check');

            if (naCheck && naCheck.checked) {
                pesoNASeccion += pesoOriginal;
                calificacionInput.disabled = true;
                calificacionInput.value = "";
                fila.querySelector('.ponderado').textContent = "N/A";
                fila.classList.add('na-row');
            } else {
                calificacionInput.disabled = false;
                fila.classList.remove('na-row');
            }
        });

        let factorAjuste = 1;
        const pesoAplicableSeccion = pesoTotalSeccion - pesoNASeccion;

        if (pesoNASeccion > 0 && pesoAplicableSeccion > 0) {
            factorAjuste = pesoTotalSeccion / pesoAplicableSeccion;
        } else if (pesoNASeccion > 0 && pesoAplicableSeccion === 0) {
            factorAjuste = 0;
        }

        calificacionesSeccion.forEach(function(calificacionInput) {
            const fila = calificacionInput.closest('tr');
            const naCheck = fila.querySelector('.na-check');
            const ponderadoCell = fila.querySelector('.ponderado');

            if (!(naCheck && naCheck.checked)) {
                if (calificacionInput.value) {
                    const pesoOriginal = parseFloat(calificacionInput.getAttribute('data-peso'));
                    const valor = parseFloat(calificacionInput.value);
                    let ponderadoCalculado = 0;

                    if (factorAjuste > 0) {
                        const pesoAjustado = pesoOriginal * factorAjuste;
                        ponderadoCalculado = (valor * pesoAjustado);
                    }
                    
                    ponderadoCell.textContent = ponderadoCalculado.toFixed(3);
                    subtotal += ponderadoCalculado;
                } else {
                    ponderadoCell.textContent = "0";
                }
            }
        });
        
        const sectionWeightText = document.querySelector(`#seccion${i} .resultado td:nth-child(2)`).textContent.trim();
        const sectionTotalWeight = parseFloat(sectionWeightText.replace('%', '')) / 100;

        if (pesoAplicableSeccion === 0 && pesoTotalSeccion > 0) {
             document.querySelector(`#seccion${i} .subtotal`).textContent = "N/A";
             document.getElementById(`resultado-seccion${i}`).textContent = "N/A";
             document.getElementById(`cal-seccion${i}`).textContent = "N/A";
        } else {
            document.querySelector(`#seccion${i} .subtotal`).textContent = subtotal.toFixed(3);
            document.getElementById(`resultado-seccion${i}`).textContent = subtotal.toFixed(3);
            
            const normalizedSubtotal = (subtotal - sectionTotalWeight) / (sectionTotalWeight * 4);
            const calTexto = getCalificacionTexto(normalizedSubtotal);
            document.getElementById(`cal-seccion${i}`).textContent = calTexto;
        }
    }
    
    let totalPonderado = 0;
    const seccionesResultados = document.querySelectorAll('.seccion-resultado');
    seccionesResultados.forEach(function(seccion) {
        const val = parseFloat(seccion.textContent);
        if (!isNaN(val)) {
            totalPonderado += val;
        }
    });
    
    const normalizedTotalPonderado = (totalPonderado - 1) / 4;

    document.getElementById('total-ponderado').textContent = totalPonderado.toFixed(3);
    document.getElementById('calificacion-global').textContent = getCalificacionTexto(normalizedTotalPonderado);
}

/**
 * Determina la calificación textual basada en un valor numérico normalizado (0-1).
 */
function getCalificacionTexto(valor) {
    if (valor < 0.2) return "Deficiente";
    if (valor < 0.4) return "Regular";
    if (valor < 0.6) return "Aceptable";
    if (valor < 0.8) return "Bueno";
    return "Excelente";
}

/**
 * Calcula los porcentajes de resolución y reapertura de tickets.
 */
function calcularPorcentajes() {
    const abiertos = parseInt(document.getElementById('tickets-abiertos').value) || 0;
    const resueltos = parseInt(document.getElementById('tickets-resueltos').value) || 0;
    const reabiertos = parseInt(document.getElementById('tickets-reabiertos').value) || 0;
    
    if (abiertos > 0) {
        const porcentajeResolucion = ((resueltos / abiertos) * 100).toFixed(2) + '%';
        document.getElementById('porcentaje-resolucion').value = porcentajeResolucion;
    } else {
        document.getElementById('porcentaje-resolucion').value = "N/A";
    }
    
    if (resueltos > 0) {
        const porcentajeReapertura = ((reabiertos / resueltos) * 100).toFixed(2) + '%';
        document.getElementById('porcentaje-reapertura').value = porcentajeReapertura;
    } else {
        document.getElementById('porcentaje-reapertura').value = "N/A";
    }
}

/**
 * Muestra u oculta las guías de calificación.
 */
function toggleGuiasCalificacion() {
    const guias = document.getElementById('guias-calificacion');
    guias.style.display = guias.style.display === 'none' ? 'block' : 'none';
}

/**
 * Abre el modal de calculadora de calificaciones y sugiere calificaciones.
 */
function sugerirCalificaciones() {
    const ticketsAbiertos = parseInt(document.getElementById('tickets-abiertos').value) || 0;
    const ticketsResueltos = parseInt(document.getElementById('tickets-resueltos').value) || 0;
    const ticketsReabiertos = parseInt(document.getElementById('tickets-reabiertos').value) || 0;
    
    if (ticketsAbiertos > 0 && ticketsResueltos > 0) {
        const porcentajeResolucion = (ticketsResueltos / ticketsAbiertos) * 100;
        let calTicketsResueltos = 1;
        
        if (porcentajeResolucion >= 95) calTicketsResueltos = 5;
        else if (porcentajeResolucion >= 85) calTicketsResueltos = 4;
        else if (porcentajeResolucion >= 75) calTicketsResueltos = 3;
        else if (porcentajeResolucion >= 60) calTicketsResueltos = 2;
        
        const targetTicketsResueltos = document.querySelector('#seccion2 tr:nth-child(2) .calificacion');
        if (targetTicketsResueltos) {
            targetTicketsResueltos.value = calTicketsResueltos;
        }
        
        if (ticketsResueltos > 0 && ticketsReabiertos >= 0) {
            const porcentajeReapertura = (ticketsReabiertos / ticketsResueltos) * 100;
            let calReaperturas = 5;
            
            if (porcentajeReapertura > 30) calReaperturas = 1;
            else if (porcentajeReapertura > 20) calReaperturas = 2;
            else if (porcentajeReapertura > 10) calReaperturas = 3;
            else if (porcentajeReapertura > 5) calReaperturas = 4;
            
            const targetReaperturas = document.querySelector('#seccion2 tr:nth-child(5) .calificacion');
            if (targetReaperturas) {
                targetReaperturas.value = calReaperturas;
            }
        }
    }
    
    const slaCritica = document.getElementById('sla-critica').value;
    const actualCritica = document.getElementById('actual-critica').value;
    
    if (slaCritica && actualCritica) {
        const minutosCompromiso = convertirATiempo(slaCritica);
        const minutosActual = convertirATiempo(actualCritica);
        
        if (minutosCompromiso > 0 && minutosActual >= 0) {
            const porcentajeSLA = (minutosActual / minutosCompromiso) * 100;
            let calTiempoRespuesta = 3;

            if (porcentajeSLA > 150) calTiempoRespuesta = 1;
            else if (porcentajeSLA > 100) calTiempoRespuesta = 2;
            else if (porcentajeSLA >= 90) calTiempoRespuesta = 3;
            else if (porcentajeSLA >= 70) calTiempoRespuesta = 4;
            else calTiempoRespuesta = 5;
            
            const targetTiempoRespuesta = document.querySelector('#seccion1 tr:nth-child(2) .calificacion');
            if (targetTiempoRespuesta) {
                targetTiempoRespuesta.value = calTiempoRespuesta;
            }
        }
    }
    
    calcularResultados();
    showCustomMessage('Se han sugerido calificaciones basadas en los datos ingresados', 'success');
}

/**
 * Cierra el modal de calculadora de calificaciones.
 */
function cerrarCalculadora() {
    document.getElementById('calculadoraModal').style.display = 'none';
}

/**
 * Maneja el cambio de criterio en la calculadora.
 */
function cambiarCriterioCalculadora() {
    const criterio = document.getElementById('criterio-select').value;
    const formDiv = document.getElementById('calc-form');
    const calcResultadoDiv = document.getElementById('calc-resultado');
    calcResultadoDiv.innerHTML = 'Seleccione un criterio y complete los datos para ver el resultado';
    calcResultadoDiv.dataset.calificacion = '';
    calcResultadoDiv.dataset.criterio = '';
    
    if (!criterio) {
        formDiv.innerHTML = '';
        return;
    }
    
    let formHtml = '';
    
    switch(criterio) {
        case 'tiempo-respuesta':
            formHtml = `
                <div>
                    <label>Tiempo de respuesta acordado (minutos):</label>
                    <input type="number" id="tr-acordado" min="1">
                </div>
                <div style="margin-top: 10px;">
                    <label>Tiempo de respuesta real (minutos):</label>
                    <input type="number" id="tr-real" min="0">
                </div>
                <button class="btn" id="calcular-tr" style="margin-top: 10px;">Calcular</button>
            `;
            break;
            
        case 'uptime':
            formHtml = `
                <div>
                    <label>Porcentaje de disponibilidad (%):</label>
                    <input type="number" id="uptime-porcentaje" min="0" max="100" step="0.01">
                </div>
                <button class="btn" id="calcular-uptime" style="margin-top: 10px;">Calcular</button>
            `;
            break;
            
        case 'tickets-resueltos':
            formHtml = `
                <div>
                    <label>Tickets abiertos:</label>
                    <input type="number" id="tr-abiertos" min="0">
                </div>
                <div style="margin-top: 10px;">
                    <label>Tickets resueltos:</label>
                    <input type="number" id="tr-resueltos" min="0">
                </div>
                <button class="btn" id="calcular-tickets" style="margin-top: 10px;">Calcular</button>
            `;
            break;
            
        case 'entregables':
            formHtml = `
                <div>
                    <label>Fecha comprometida:</label>
                    <input type="date" id="entrega-fecha">
                </div>
                <div style="margin-top: 10px;">
                    <label>Fecha real de entrega:</label>
                    <input type="date" id="entrega-real">
                </div>
                <button class="btn" id="calcular-entrega" style="margin-top: 10px;">Calcular</button>
            `;
            break;
    }
    
    formDiv.innerHTML = formHtml;
    
    setTimeout(() => {
        if (criterio === 'tiempo-respuesta' && document.getElementById('calcular-tr')) {
            document.getElementById('calcular-tr').addEventListener('click', calcularTiempoRespuesta);
        }
        if (criterio === 'uptime' && document.getElementById('calcular-uptime')) {
            document.getElementById('calcular-uptime').addEventListener('click', calcularUptime);
        }
        if (criterio === 'tickets-resueltos' && document.getElementById('calcular-tickets')) {
            document.getElementById('calcular-tickets').addEventListener('click', calcularTicketsResueltos);
        }
        if (criterio === 'entregables' && document.getElementById('calcular-entrega')) {
            document.getElementById('calcular-entrega').addEventListener('click', calcularEntregables);
        }
    }, 100);
}

/**
 * Calcula la calificación para tiempo de respuesta.
 */
function calcularTiempoRespuesta() {
    const acordado = parseFloat(document.getElementById('tr-acordado').value) || 0;
    const real = parseFloat(document.getElementById('tr-real').value) || 0;
    
    if (acordado <= 0) {
        showCustomMessage('Error: Ingrese un tiempo acordado válido (mayor que 0)', 'error');
        return;
    }
    
    const porcentaje = (real / acordado) * 100;
    let calificacion = 0;
    
    if (porcentaje > 150) calificacion = 1;
    else if (porcentaje > 100) calificacion = 2;
    else if (porcentaje >= 90) calificacion = 3;
    else if (porcentaje >= 70) calificacion = 4;
    else calificacion = 5;
    
    document.getElementById('calc-resultado').innerHTML = `
        <p>Porcentaje del SLA: ${porcentaje.toFixed(2)}%</p>
        <p>Calificación sugerida: <strong>${calificacion}</strong></p>
        <p>Justificación: ${obtenerJustificacion('tiempo-respuesta', calificacion)}</p>
    `;
    
    document.getElementById('calc-resultado').dataset.calificacion = calificacion;
    document.getElementById('calc-resultado').dataset.criterio = 'tiempo-respuesta';
}

/**
 * Calcula la calificación para uptime.
 */
function calcularUptime() {
    const uptime = parseFloat(document.getElementById('uptime-porcentaje').value) || 0;
    
    if (uptime < 0 || uptime > 100) {
        showCustomMessage('Error: Ingrese un porcentaje válido (0-100)', 'error');
        return;
    }
    
    let calificacion = 0;
    
    if (uptime < 98) calificacion = 1;
    else if (uptime < 99) calificacion = 2;
    else if (uptime < 99.6) calificacion = 3;
    else if (uptime < 99.9) calificacion = 4;
    else calificacion = 5;
    
    document.getElementById('calc-resultado').innerHTML = `
        <p>Uptime: ${uptime}%</p>
        <p>Calificación sugerida: <strong>${calificacion}</strong></p>
        <p>Justificación: ${obtenerJustificacion('uptime', calificacion)}</p>
    `;
    
    document.getElementById('calc-resultado').dataset.calificacion = calificacion;
    document.getElementById('calc-resultado').dataset.criterio = 'uptime';
}

/**
 * Calcula la calificación para tickets resueltos.
 */
function calcularTicketsResueltos() {
    const abiertos = parseInt(document.getElementById('tr-abiertos').value) || 0;
    const resueltos = parseInt(document.getElementById('tr-resueltos').value) || 0;
    
    if (abiertos <= 0) {
        showCustomMessage('Error: Ingrese un número válido de tickets abiertos (mayor que 0)', 'error');
        return;
    }
    
    const porcentaje = (resueltos / abiertos) * 100;
    let calificacion = 0;
    
    if (porcentaje < 60) calificacion = 1;
    else if (porcentaje < 75) calificacion = 2;
    else if (porcentaje < 85) calificacion = 3;
    else if (porcentaje < 95) calificacion = 4;
    else calificacion = 5;
    
    document.getElementById('calc-resultado').innerHTML = `
        <p>Porcentaje de resolución: ${porcentaje.toFixed(2)}%</p>
        <p>Calificación sugerida: <strong>${calificacion}</strong></p>
        <p>Justificación: ${obtenerJustificacion('tickets-resueltos', calificacion)}</p>
    `;
    
    document.getElementById('calc-resultado').dataset.calificacion = calificacion;
    document.getElementById('calc-resultado').dataset.criterio = 'tickets-resueltos';
}

/**
 * Calcula la calificación para entregables documentales.
 */
function calcularEntregables() {
    const fechaComprometidaStr = document.getElementById('entrega-fecha').value;
    const fechaRealStr = document.getElementById('entrega-real').value;

    if (!fechaComprometidaStr || !fechaRealStr) {
        showCustomMessage('Error: Ingrese ambas fechas para calcular.', 'error');
        return;
    }

    const fechaComprometida = new Date(fechaComprometidaStr);
    const fechaReal = new Date(fechaRealStr);
    
    if (isNaN(fechaComprometida.getTime()) || isNaN(fechaReal.getTime())) {
        showCustomMessage('Error: Formato de fecha inválido. Use AAAA-MM-DD.', 'error');
        return;
    }
    
    const diffTime = fechaReal.getTime() - fechaComprometida.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let calificacion = 0;
    
    if (diffDays > 10) calificacion = 1;
    else if (diffDays > 5) calificacion = 2;
    else if (diffDays > 2) calificacion = 3;
    else if (diffDays > 0) calificacion = 4;
    else calificacion = 5;
    
    document.getElementById('calc-resultado').innerHTML = `
        <p>Días de diferencia: ${diffDays} (positivo = retraso, negativo = anticipado)</p>
        <p>Calificación sugerida: <strong>${calificacion}</strong></p>
        <p>Justificación: ${obtenerJustificacion('entregables', calificacion)}</p>
    `;
    
    document.getElementById('calc-resultado').dataset.calificacion = calificacion;
    document.getElementById('calc-resultado').dataset.criterio = 'entregables';
}

/**
 * Aplica la calificación calculada del modal al formulario principal.
 */
function aplicarCalificacion() {
    const resultado = document.getElementById('calc-resultado');
    const calificacion = resultado.dataset.calificacion;
    const criterio = resultado.dataset.criterio;
    
    if (!calificacion || !criterio) {
        showCustomMessage('Primero debe calcular una calificación en la calculadora.', 'error');
        return;
    }
    
    let targetField = null;
    
    switch(criterio) {
        case 'tiempo-respuesta':
            targetField = document.querySelector('#seccion1 tr:nth-child(2) .calificacion');
            break;
        case 'uptime':
            targetField = document.querySelector('#seccion1 tr:nth-child(4) .calificacion');
            break;
        case 'tickets-resueltos':
            targetField = document.querySelector('#seccion2 tr:nth-child(2) .calificacion');
            break;
        case 'entregables':
            targetField = document.querySelector('#seccion6 tr:nth-child(2) .calificacion');
            break;
        case 'resolucion-problemas':
            targetField = document.querySelector('#seccion1 tr:nth-child(3) .calificacion');
            break;
    }
    
    if (targetField) {
        targetField.value = calificacion;
        document.getElementById('calculadoraModal').style.display = 'none';
        calcularResultados();
        showCustomMessage('Calificación aplicada correctamente', 'success');
    } else {
        showCustomMessage('No se pudo encontrar el campo correspondiente en el formulario principal', 'error');
    }
}

/**
 * Exporta los datos de la evaluación a un archivo CSV.
 */
function exportarCSV() {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";

    csvContent += "Datos Generales\n";
    csvContent += "Nombre del Proveedor," + (document.getElementById('proveedor').value || '') + "\n";
    csvContent += "Período de Evaluación," + (document.getElementById('periodo').value || '') + "\n";
    csvContent += "Responsable de la Evaluación," + (document.getElementById('responsable').value || '') + "\n";
    csvContent += "Fecha de Evaluación," + (document.getElementById('fecha-evaluacion').value || '') + "\n\n";

    csvContent += "Parámetros de Evaluación - Tiempos de Respuesta Acordados (SLA)\n";
    csvContent += "Prioridad,Tiempo Acordado,Valor Actual\n";
    const slaRows = document.querySelectorAll('.flex-item:first-child table tr');
    slaRows.forEach((row, index) => {
        if (index === 0) return;
        const cols = row.querySelectorAll('td');
        
        if (cols.length < 3) {
            console.warn("Fila de SLA con formato inesperado, saltando:", row.outerHTML);
            return;
        }

        const priority = cols[0].textContent.trim();
        const agreedTime = cols[1].querySelector('input') ? (cols[1].querySelector('input').value || '') : '';
        const actualTime = cols[2].querySelector('input') ? (cols[2].querySelector('input').value || '') : '';
        csvContent += `${priority},"${agreedTime}","${actualTime}"\n`;
    });
    csvContent += "\n";

    csvContent += "Parámetros de Evaluación - Estadísticas de Tickets\n";
    csvContent += "Métricas,Valor\n";
    const ticketRows = document.querySelectorAll('.flex-item:last-child table tr');
    ticketRows.forEach((row, index) => {
        if (index === 0) return;
        const cols = row.querySelectorAll('td');
        
        if (cols.length < 2) { 
            console.warn("Fila de tickets con formato inesperado, saltando:", row.outerHTML);
            return;
        }

        const metric = cols[0].textContent.trim();
        const value = cols[1].querySelector('input') ? (cols[1].querySelector('input').value || '') : '';
        csvContent += `${metric},"${value}"\n`;
    });
    csvContent += "\n";

    for (let i = 1; i <= 6; i++) {
        const sectionTable = document.querySelector(`#seccion${i}`);
        let sectionTitle = `Sección ${i}`;
        
        if (sectionTable) {
            let parentDiv = sectionTable.closest('div');
            if (parentDiv) {
                const h2Element = parentDiv.querySelector('h2');
                if (h2Element) {
                    sectionTitle = h2Element.textContent.trim();
                }
            }
        }
        
        csvContent += `${sectionTitle}\n`;
        csvContent += "Criterio,Peso,Calificación (1-5),Ponderado,Observaciones\n";

        const rows = document.querySelectorAll(`#seccion${i} tr:not(.resultado)`);
        rows.forEach(row => {
            const cols = row.querySelectorAll('td');
            if (cols.length > 0 && cols[0].textContent.trim() !== 'Criterio') {
                if (cols.length < 5) {
                    console.warn(`Fila de sección ${i} con formato inesperado, saltando:`, row.outerHTML);
                    return;
                }
                const criterio = cols[0].textContent.trim();
                const peso = cols[1].textContent.trim();
                const calificacionInput = cols[2].querySelector('.calificacion');
                const calificacion = calificacionInput ? (calificacionInput.value || '') : '';
                const isNA = cols[2].querySelector('.na-check') ? cols[2].querySelector('.na-check').checked : false;
                const ponderado = isNA ? "N/A" : (cols[3].textContent.trim() || '0');
                const observaciones = cols[4].querySelector('.obs') ? (cols[4].querySelector('.obs').value || '') : '';
                csvContent += `"${criterio}",${peso},${calificacion},"${ponderado}","${observaciones}"\n`;
            }
        });

        const subtotalRow = document.querySelector(`#seccion${i} .resultado`);
        if (subtotalRow) {
            const subtotalPeso = subtotalRow.querySelector('td:nth-child(2)').textContent.trim();
            const subtotalValue = subtotalRow.querySelector('td:nth-child(4)').textContent.trim();
            csvContent += `Subtotal,${subtotalPeso},,${subtotalValue},\n`;
        }
        csvContent += "\n";
    }

    csvContent += "Análisis de Métricas Clave\n";
    const metricsDiv = document.querySelector('body > div:nth-of-type(8)'); 
    if (metricsDiv) {
        const metricsRows = metricsDiv.querySelectorAll('table tr');
        metricsRows.forEach(row => {
            const labelElement = row.querySelector('td:first-child strong');
            const valueElement = row.querySelector('td:last-child input');
            if (labelElement && valueElement) {
                const label = labelElement.textContent.trim();
                const value = valueElement.value || '';
                csvContent += `"${label.replace(':', '')}","${value}"\n`;
            }
        });
    }
    csvContent += "\n";

    csvContent += "Observaciones Generales y Plan de Acción\n";
    csvContent += "Fortalezas identificadas,\"" + (document.getElementById('fortalezas').value.replace(/"/g, '""') || '') + "\"\n";
    csvContent += "Áreas de mejora,\"" + (document.getElementById('areas-mejora').value.replace(/"/g, '""') || '') + "\"\n";
    csvContent += "Plan de acción recomendado,\"" + (document.getElementById('plan-accion').value.replace(/"/g, '""') || '') + "\"\n";
    csvContent += "Fecha de próxima evaluación," + (document.getElementById('proxima-evaluacion').value || '') + "\n";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "evaluacion_proveedor.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Convierte un string de tiempo a minutos.
 */
function convertirATiempo(tiempoStr) {
    tiempoStr = tiempoStr.toLowerCase().trim();
    const parts = tiempoStr.match(/(\d+(\.\d+)?)\s*(horas?|mins?|minutos?|días?|dias?)/);

    if (!parts) return 0;

    const value = parseFloat(parts[1]);
    const unit = parts[3];

    if (unit.startsWith('min')) {
        return value;
    } else if (unit.startsWith('hora')) {
        return value * 60;
    } else if (unit.startsWith('día') || unit.startsWith('dia')) {
        return value * 24 * 60;
    }
    return 0;
}

/**
 * Obtiene la justificación textual para una calificación.
 */
function obtenerJustificacion(criterio, calificacion) {
    const guias = {
        'tiempo-respuesta': {
            1: '>150% del SLA acordado',
            2: '101-150% del SLA',
            3: '90-100% del SLA',
            4: '70-89% del SLA',
            5: '<70% del SLA'
        },
        'uptime': {
            1: '<98%',
            2: '98-98.9%',
            3: '99-99.5%',
            4: '99.6-99.8%',
            5: '>99.8%'
        },
        'tickets-resueltos': {
            1: '<60% resueltos',
            2: '60-74% resueltos',
            3: '75-84% resueltos',
            4: '85-94% resueltos',
            5: '≥95% resueltos'
        },
        'entregables': {
            1: '>10 días de retraso',
            2: '6-10 días de retraso',
            3: '3-5 días de retraso',
            4: '1-2 días de retraso',
            5: 'En fecha o anticipado'
        },
        'resolucion-problemas': {
            1: '>150% del promedio acordado',
            2: '120-150% del promedio',
            3: '100-119% del promedio',
            4: '80-99% del promedio',
            5: '<80% del promedio'
        }
    };
    return guias[criterio]?.[calificacion] || 'No disponible';
}

/**
 * Función para mostrar mensajes personalizados en la UI.
 */
function showCustomMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    let backgroundColor = '';
    if (type === 'success') {
        backgroundColor = '#27ae60';
    } else if (type === 'error') {
        backgroundColor = '#e74c3c';
    }
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${backgroundColor};
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 1001;
        opacity: 0;
        transition: opacity 0.5s ease-in-out;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.opacity = 1;
    }, 100);

    setTimeout(() => {
        messageDiv.style.opacity = 0;
        messageDiv.addEventListener('transitionend', () => messageDiv.remove());
    }, 5000);
}

/**
 * Función para imprimir la evaluación.
 */
function imprimirEvaluacion() {
    window.print();
}