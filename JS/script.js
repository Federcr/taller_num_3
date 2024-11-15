function mostrarSeccion(seccionId) {
    const secciones = document.querySelectorAll('.seccion');
    secciones.forEach(seccion => seccion.classList.remove('activo'));
    document.getElementById(seccionId).classList.add('activo');
}

function guardarEnLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function obtenerDeLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}


document.getElementById('duracionPrograma').addEventListener('input', function(e) {
    let valor = this.value.replace(/[^0-9]/g, '');
    valor = valor === '0' ? '' : valor; 
    if (parseInt(valor) > 10) {
        valor = '10'; 
    }
    this.value = valor;
});

const estudianteForm = document.getElementById('estudianteForm');
const listaEstudiantes = document.getElementById('listaEstudiantes');

estudianteForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const estudiante = {
        id: document.getElementById('estudianteId').value,
        nombre: document.getElementById('nombreEstudiante').value,
        fechaNacimiento: document.getElementById('fechaNacimiento').value,
        correo: document.getElementById('correoEstudiante').value,
        telefono: document.getElementById('telefonoEstudiante').value
    };

    
    if (!/^[a-zA-Z\s]*$/.test(estudiante.nombre)) {
        alert('El nombre solo debe contener caracteres alfabéticos');
        return;
    }

    if (new Date(estudiante.fechaNacimiento) > new Date()) {
        alert('La fecha de nacimiento no puede ser futura');
        return;
    }

    if (estudiante.telefono && (!/^\d{8,15}$/.test(estudiante.telefono))) {
        alert('El teléfono debe contener entre 8 y 15 dígitos');
        return;
    }

    const estudiantes = obtenerDeLocalStorage('estudiantes');
    if (estudiantes.some(e => e.id === estudiante.id)) {
        alert('Ya existe un estudiante con esa identificación');
        return;
    }

    estudiantes.push(estudiante);
    guardarEnLocalStorage('estudiantes', estudiantes);
    actualizarListaEstudiantes();
    estudianteForm.reset();
});

function actualizarListaEstudiantes() {
    const estudiantes = obtenerDeLocalStorage('estudiantes');
    listaEstudiantes.innerHTML = estudiantes.map(estudiante => `
        <div class="item-lista">
            <button onclick="eliminarEstudiante('${estudiante.id}')">Eliminar</button>
            <p>ID: ${estudiante.id}</p>
            <p>Nombre: ${estudiante.nombre}</p>
            <p>Fecha Nacimiento: ${estudiante.fechaNacimiento}</p>
            <p>Correo: ${estudiante.correo}</p>
            <p>Teléfono: ${estudiante.telefono || 'No especificado'}</p>
        </div>
    `).join('');
    actualizarSelectEstudiantes();
}

function eliminarEstudiante(id) {
    let estudiantes = obtenerDeLocalStorage('estudiantes');
    estudiantes = estudiantes.filter(e => e.id !== id);
    guardarEnLocalStorage('estudiantes', estudiantes);
    actualizarListaEstudiantes();
}

const programaForm = document.getElementById('programaForm');
const listaProgramas = document.getElementById('listaProgramas');

programaForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const programa = {
        codigo: document.getElementById('codigoPrograma').value,
        nombre: document.getElementById('nombrePrograma').value,
        duracion: document.getElementById('duracionPrograma').value,
        modalidad: document.getElementById('modalidadPrograma').value,
        fechaInicio: document.getElementById('fechaInicio').value
    };

    
    const duracion = parseInt(programa.duracion);
    if (!duracion || duracion < 1 || duracion > 10 || !Number.isInteger(duracion)) {
        alert('La duración debe ser un número entero entre 1 y 10 semestres');
        return;
    }

    if (programa.fechaInicio && new Date(programa.fechaInicio) > new Date()) {
        alert('La fecha de inicio debe ser pasada o actual');
        return;
    }

    const programas = obtenerDeLocalStorage('programas');
    if (programas.some(p => p.codigo === programa.codigo)) {
        alert('Ya existe un programa con ese código');
        return;
    }

    if (programas.some(p => p.nombre === programa.nombre)) {
        alert('Ya existe un programa con ese nombre');
        return;
    }

    programas.push(programa);
    guardarEnLocalStorage('programas', programas);
    actualizarListaProgramas();
    programaForm.reset();
});

function actualizarListaProgramas() {
    const programas = obtenerDeLocalStorage('programas');
    listaProgramas.innerHTML = programas.map(programa => `
        <div class="item-lista">
            <button onclick="eliminarPrograma('${programa.codigo}')">Eliminar</button>
            <p>Código: ${programa.codigo}</p>
            <p>Nombre: ${programa.nombre}</p>
            <p>Duración: ${programa.duracion} semestres</p>
            <p>Modalidad: ${programa.modalidad}</p>
            <p>Fecha Inicio: ${programa.fechaInicio || 'No especificada'}</p>
        </div>
    `).join('');
    actualizarSelectProgramas();
}

function eliminarPrograma(codigo) {
    let programas = obtenerDeLocalStorage('programas');
    programas = programas.filter(p => p.codigo !== codigo);
    guardarEnLocalStorage('programas', programas);
    actualizarListaProgramas();
}

const matriculaForm = document.getElementById('matriculaForm');
const listaMatriculas = document.getElementById('listaMatriculas');

function actualizarSelectEstudiantes() {
    const estudiantes = obtenerDeLocalStorage('estudiantes');
    const select = document.getElementById('estudianteMatricula');
    select.innerHTML = '<option value="">Seleccione Estudiante</option>' +
        estudiantes.map(e => `<option value="${e.id}">${e.nombre}</option>`).join('');
}

function actualizarSelectProgramas() {
    const programas = obtenerDeLocalStorage('programas');
    const select = document.getElementById('programaMatricula');
    select.innerHTML = '<option value="">Seleccione Programa</option>' +
        programas.map(p => `<option value="${p.codigo}">${p.nombre}</option>`).join('');
}

matriculaForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const matricula = {
        id: document.getElementById('matriculaId').value,
        estudianteId: document.getElementById('estudianteMatricula').value,
        programaCodigo: document.getElementById('programaMatricula').value,
        fecha: document.getElementById('fechaMatricula').value,
        estado: document.getElementById('estadoMatricula').value
    };

   
    if (new Date(matricula.fecha) < new Date()) {
        alert('La fecha de matrícula debe ser actual o futura');
        return;
    }

    const matriculas = obtenerDeLocalStorage('matriculas');
    if (matriculas.some(m => m.id === matricula.id)) {
        alert('Ya existe una matrícula con ese ID');
        return;
    }

    
    const estudiantes = obtenerDeLocalStorage('estudiantes');
    const programas = obtenerDeLocalStorage('programas');

    if (!estudiantes.some(e => e.id === matricula.estudianteId)) {
        alert('El estudiante seleccionado no existe');
        return;
    }

    if (!programas.some(p => p.codigo === matricula.programaCodigo)) {
        alert('El programa seleccionado no existe');
        return;
    }

    matriculas.push(matricula);
    guardarEnLocalStorage('matriculas', matriculas);
    actualizarListaMatriculas();
    matriculaForm.reset();
});

function actualizarListaMatriculas() {
    const matriculas = obtenerDeLocalStorage('matriculas');
    const estudiantes = obtenerDeLocalStorage('estudiantes');
    const programas = obtenerDeLocalStorage('programas');

    listaMatriculas.innerHTML = matriculas.map(matricula => {
        const estudiante = estudiantes.find(e => e.id === matricula.estudianteId);
        const programa = programas.find(p => p.codigo === matricula.programaCodigo);

        return `
            <div class="item-lista">
                <button onclick="eliminarMatricula('${matricula.id}')">Eliminar</button>
                <p>ID Matrícula: ${matricula.id}</p>
                <p>Estudiante: ${estudiante ? estudiante.nombre : 'No encontrado'}</p>
                <p>Programa: ${programa ? programa.nombre : 'No encontrado'}</p>
                <p>Fecha: ${matricula.fecha}</p>
                <p>Estado: ${matricula.estado}</p>
            </div>
        `;
    }).join('');
}

function eliminarMatricula(id) {
    let matriculas = obtenerDeLocalStorage('matriculas');
    matriculas = matriculas.filter(m => m.id !== id);
    guardarEnLocalStorage('matriculas', matriculas);
    actualizarListaMatriculas();
}

document.addEventListener('DOMContentLoaded', function() {
    mostrarSeccion('estudiantes');
    actualizarListaEstudiantes();
    actualizarListaProgramas();
    actualizarListaMatriculas();
});