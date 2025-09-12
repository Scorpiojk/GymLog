const form = document.querySelector("#form-ejercicio")
const ejercicios = []
const lista = document.querySelector("#lista-ejercicios")
const modal = document.querySelector("#modal-editar");
const cerrarModal = document.querySelector("#cerrar-modal");
const formEditar = document.querySelector("#form-editar")

// Referencias al ejercicio y al item que estamos editando ahora
let ejercicioActual = null;
let itemActual = null;

 /* === Función que crea la tarjeta <li> de un ejercicio ===
   - Le añade la estructura con spans identificables para actualizar
     solo lo que cambie (nombre, repeticiones, pesos, series, descanso).
   - Crea y conecta los botones Editar / Eliminar.
*/
    function crearTarjetaEjercicio(ejercicio) {

        const item = document.createElement("li");
        item.classList.add("tarjeta-rutina");
        item.innerHTML = `
            <div class="ejercicio-info">
                <h3 class="ej-nombre">${ejercicio.nombre}</h3>
                <p>Repeticiones: <span class="ej-repeticiones editable">${ejercicio.repeticiones}</span></p>
                <p>Pesos: <span class="ej-pesos editable">${ejercicio.pesos}</span></p>
                <p>Series: <span class="ej-series">${ejercicio.series}</span></p>
                <p>Descanso: <span class="ej-descanso">${ejercicio.descanso}</span></p>
            </div>
        `;

        // --- Funcion para habilitar edicion rapida ---
        function activarEdicion(span, campo){
            span.addEventListener("dblclick", () => {
                const input = document.createElement("input");
                input.type = "text"
                input.value = span.textContent
                input.classList.add("input-line")

                span.replaceWith(input)
                input.focus()

                // Guardar al presionar Enter o salir del input
                function guardar(){
                    const nuevoValor = input.value.trim()

                    //actualizar objeto del array
                    ejercicio[campo] = nuevoValor

                    
                }
            })
        }
    
        // 4. Crear contenedor de botones
        const contBtns = document.createElement("div");
        contBtns.classList.add("botones-ejercicio");
        
        // Botón Editar
        const btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.classList.add("editar-btn");
        
        // Botón Eliminar
        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.classList.add("eliminar-btn");
        /* --- Evento Editar ---
        Aquí usamos CLOSURE: dentro de este listener tenemos acceso
        a la variable 'ejercicio' (el objeto especifico) y a 'item' (el li).
        Guardamos referncias globales para que el form del modal sepa
        que actualizar cuando se guarden los cambios
        */
       btnEditar.addEventListener("click", () => {
           ejercicioActual = ejercicio
           itemActual = item
           
           // Rellenar inputs del modal con los datos
           modal.querySelector("[name='nombre']").value = ejercicio.nombre;
           modal.querySelector("[name='repeticiones']").value = ejercicio.repeticiones;
           modal.querySelector("[name='pesos']").value = ejercicio.pesos;
           modal.querySelector("[name='series']").value = ejercicio.series;
           modal.querySelector("[name='descanso']").value = ejercicio.descanso;
           
           modal.style.display = "flex"
        })
        
        /* --- Evento Eliminar ---
        Eliminamos el item del DOM y el objeto del array.
        Si ese ejercicio está abierto en el modal, cerramos el modal
        y limpiamos las referencias.
        */
       // Acción eliminar
       btnEliminar.addEventListener("click", () => {
           // 1. Eliminar del DOM
           item.remove();
           // 2. Eliminar del array
           const index = ejercicios.indexOf(ejercicio);
           if(index !== -1) ejercicios.splice(index,1);
           
           if (ejercicioActual === ejercicio) {
               ejercicioActual = null;
               itemActual = null;
               modal.style.display =  "none";
            }
        });
        
        // Agregar botones al contenedor
        contBtns.appendChild(btnEditar);
        contBtns.appendChild(btnEliminar);
        
        // Agregar contenedor de botones al item
        item.appendChild(contBtns);

        return item;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault()
        
        // 1. Tomar valores del form
        const nombre = form.elements["nombre"].value.trim();
        const repeticiones = form.elements["repeticiones"].value.trim();
        const pesos = form.elements["pesos"].value.trim();
        const series = form.elements["series"].value.trim();
        const descanso = form.elements["descanso"].value.trim();

        if(!nombre){
            alert("El ejercicio necesita un nombre.")
            return
        }

        // 2. Crear objeto ejercicio
        const nuevoEjercicio = {
            nombre,
            repeticiones,
            pesos,
            series,
            descanso
        };
        
        ejercicios.push(nuevoEjercicio);

        // 3. Crear tarjeta <li>
        const item = crearTarjetaEjercicio(nuevoEjercicio);
        lista.appendChild(item);

        form.reset()
    });

    /* === Cerrar modal (X) y clic afuera === */
    cerrarModal.addEventListener("click", () => {
        modal.style.display = "none";
        ejercicioActual = null;
        itemActual = null;
    });

    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
            ejercicioActual = null;
            itemActual = null;
        }
    });

    /* === Submit del form del modal: GUARDAR CAMBIOS ===
       Aqui usamos ejercicioActual e itemActual que fueron seteados
       cuando el usuario hizo click en "Editar";
    */
   formEditar.addEventListener("submit", (e) => {
        e.preventDefault()

        if (!ejercicioActual || !itemActual){
            console.warn("No hay ejercicio seleccionado para editar")
            modal.style.display = "none"
            return
        }

    // 1) Obtener valores del modal
    const nuevoNombre = formEditar.elements["nombre"].value.trim();
    const nuevasReps = formEditar.elements["repeticiones"].value.trim();
    const nuevosPesos = formEditar.elements["pesos"].value.trim();
    const nuevasSeries = formEditar.elements["series"].value.trim();
    const nuevoDescanso = formEditar.elements["descanso"].value.trim();
    
        // 2) Actualizar el objeto en memoria (ejercicioActual está dentro del array)
        ejercicioActual.nombre = nuevoNombre;
        ejercicioActual.repeticiones = nuevasReps;
        ejercicioActual.pesos = nuevosPesos;
        ejercicioActual.series = nuevasSeries;
        ejercicioActual.descanso = nuevoDescanso;

        // 3) Actualizar SOLO las partes del DOM que cambiaron (spans)
        itemActual.querySelector(".ej-nombre").textContent = nuevoNombre;
        itemActual.querySelector(".ej-repeticiones").textContent = nuevasReps;
        itemActual.querySelector(".ej-pesos").textContent = nuevosPesos;
        itemActual.querySelector(".ej-series").textContent = nuevasSeries;
        itemActual.querySelector(".ej-descanso").textContent = nuevoDescanso;

        // 4) Cerrar modal y limpiar referencias
        modal.style.display = "none";
        ejercicioActual = null;
        itemActual = null;
        formEditar.reset();
    });