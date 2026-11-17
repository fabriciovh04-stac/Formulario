let registros = JSON.parse(localStorage.getItem("alumnosCBTis")) || [];

function mostrarAlerta(mensaje) {
    const fondo = document.getElementById("modalFondo");
    const texto = document.getElementById("modalMensaje");
    const botones = document.getElementById("modalBotones");

    texto.textContent = mensaje;
    botones.innerHTML = '<button class="btn-enviar" onclick="cerrarModal()">Aceptar</button>';
    fondo.style.display = "flex";
}

function mostrarConfirmacion(mensaje, alConfirmar) {
    const fondo = document.getElementById("modalFondo");
    const texto = document.getElementById("modalMensaje");
    const botones = document.getElementById("modalBotones");

    texto.textContent = mensaje;
    botones.innerHTML = "";

    const btnSi = document.createElement("button");
    btnSi.textContent = "Sí, continuar";
    btnSi.className = "btn-enviar";
    btnSi.onclick = () => {
        cerrarModal();
        alConfirmar();
    };

    const btnNo = document.createElement("button");
    btnNo.textContent = "Cancelar";
    btnNo.className = "btn-limpiar";
    btnNo.onclick = cerrarModal;

    botones.appendChild(btnSi);
    botones.appendChild(btnNo);
    fondo.style.display = "flex";
}

function cerrarModal() {
    document.getElementById("modalFondo").style.display = "none";
}

function guardarRegistros() {
    localStorage.setItem("alumnosCBTis", JSON.stringify(registros));
}

function obtener(id) {
    return document.getElementById(id).value.trim();
}

document.getElementById("formulario").addEventListener("submit", function(e) {
    e.preventDefault();

    const apellidosUnidos = `${obtener("apellidoPaterno")} ${obtener("apellidoMaterno")}`.trim();

    const alumno = {
        apellido: apellidosUnidos,
        nombre: obtener("nombre"),
        curp: obtener("curp").toUpperCase(),
        fecha: obtener("fecha"),
        sexo: document.querySelector('input[name="sexo"]:checked').value,
        lugar: obtener("lugar"),
        celular: obtener("celular"),
        correo: obtener("correo"),
        secundaria: obtener("secundaria"),
        cct: obtener("cct"),
        promedio: obtener("promedio"),
        egreso: obtener("egreso"),
        turno: document.querySelector('input[name="turno"]:checked').value,
        inscrito: document.querySelector('input[name="inscrito"]:checked').value,
        carrera: obtener("carrera")
    };

    const repetido = registros.some(
        registro => registro.curp === alumno.curp
    );

    if (repetido) {
        mostrarAlerta("Este alumno ya se encuentra registrado.");
        return;
    }

    registros.push(alumno);

    guardarRegistros();
    mostrarRegistros();

    this.reset();

    mostrarAlerta("¡Inscripción realizada correctamente!");
});

function mostrarRegistros() {
    const tabla = document.getElementById("tablaRegistros");
    tabla.innerHTML = "";

    registros.forEach((alumno, indice) => {
        const fila = document.createElement("tr");

        const datos = [
            indice + 1,
            alumno.apellido,
            alumno.nombre,
            alumno.curp,
            alumno.fecha,
            alumno.sexo,
            alumno.celular,
            alumno.correo,
            alumno.secundaria,
            alumno.promedio,
            alumno.turno,
            alumno.carrera
        ];

        datos.forEach(dato => {
            const celda = document.createElement("td");
            celda.textContent = dato;
            fila.appendChild(celda);
        });

        const celdaAcciones = document.createElement("td");
        const boton = document.createElement("button");

        boton.textContent = "Eliminar";
        boton.className = "btn-eliminar";

        boton.addEventListener("click", function() {
            eliminarRegistro(indice);
        });

        celdaAcciones.appendChild(boton);
        fila.appendChild(celdaAcciones);
        tabla.appendChild(fila);
    });

    document.getElementById("contador").textContent =
        "Total de alumnos registrados: " + registros.length;

    if (registros.length === 0) {
        const fila = document.createElement("tr");
        const celda = document.createElement("td");

        celda.colSpan = 13;
        celda.className = "sin-registros";
        celda.textContent = "Todavía no hay alumnos registrados.";

        fila.appendChild(celda);
        tabla.appendChild(fila);
    }
}

function eliminarRegistro(indice) {
    mostrarConfirmacion("¿Deseas eliminar este registro?", () => {
        registros.splice(indice, 1);
        guardarRegistros();
        mostrarRegistros();
    });
}

function eliminarTodos() {
    if (registros.length === 0) {
        mostrarAlerta("No hay registros para eliminar.");
        return;
    }

    mostrarConfirmacion("¿Estás seguro de eliminar TODOS los registros?", () => {
        registros = [];
        guardarRegistros();
        mostrarRegistros();
        mostrarAlerta("Todos los registros fueron eliminados.");
    });
}

mostrarRegistros();