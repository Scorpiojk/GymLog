🔹 Roadmap de desarrollo para GymLog
Semana 1: Fundamentos y agregar ejercicio

Objetivo: dominar la función de agregar un ejercicio y mostrarlo en pantalla.

Trabajos a hacer:

Crear un array vacío ejercicios para guardar los ejercicios en memoria.

Capturar el submit del formulario de agregar ejercicio.

Crear un objeto con los datos del formulario (nombre, series, repeticiones, pesos, descanso, vueltas).

Agregar el objeto al array ejercicios.

Mostrar todos los ejercicios en .lista-rutinas dinámicamente.

Limpiar los inputs del formulario después de guardar.

Validar que no se guarden campos vacíos o inválidos.

Recomendación: este es el mejor lugar para empezar, porque aprendes a manejar arrays, objetos y DOM, que son la base de todo lo demás.

Semana 2: Editar y eliminar ejercicios

Objetivo: poder modificar o borrar cualquier ejercicio individual.

Trabajos a hacer:

Capturar el clic en los botones Editar y Eliminar de cada tarjeta.

Para Editar: llenar el formulario (o modal) con los datos actuales.

Guardar los cambios y actualizar el array y la vista.

Para Eliminar: remover el ejercicio del array y del DOM.

Actualizar LocalStorage con cada cambio.

Semana 3: Guardar y cargar con LocalStorage

Objetivo: persistir los datos aunque cierres la página.

Trabajos a hacer:

Guardar el array ejercicios en LocalStorage al agregar, editar o eliminar.

Al cargar la página, leer los datos de LocalStorage y reconstruir la lista de ejercicios.

Validar que la información se mantenga correcta y se refleje en el DOM.

Semana 4: Guardar rutina completa

Objetivo: agrupar todos los ejercicios en una rutina y guardarla.

Trabajos a hacer:

Capturar el clic en el botón Guardar Rutina Completa.

Pedir un nombre para la rutina con un prompt o input.

Guardar la rutina completa (array de ejercicios + nombre + fecha) en LocalStorage.

Limpiar la lista de ejercicios si querés iniciar una nueva rutina.

Semana 5: Historial de rutinas

Objetivo: poder ver rutinas pasadas y cargarlas de nuevo.

Trabajos a hacer:

Leer las rutinas guardadas en LocalStorage.

Mostrar cada rutina en .historial.

Permitir seleccionar una rutina para cargarla en la lista de ejercicios actual.

Opcional: eliminar o renombrar rutinas.

Semana 6: Modal de edición y mejoras de UX

Objetivo: hacer la app más usable y visualmente agradable.

Trabajos a hacer:

Implementar modal para editar ejercicios en lugar del formulario fijo.

Mensajes de confirmación: “Ejercicio guardado”, “Rutina eliminada”.

Animaciones al agregar/eliminar tarjetas.

Validaciones adicionales y temporizador de descanso (opcional).

Semana 7+: Funcionalidades avanzadas (opcional)

Contador de vueltas y series en tiempo real.

Exportar rutinas como JSON o PDF.

Filtros por tipo de ejercicio.

Diseño responsivo avanzado y animaciones.

🔹 Recomendación de dónde arrancar

Yo te recomiendo empezar directamente en la función de “Agregar ejercicio” porque:

Aprendés captura de formularios, objetos, arrays y manipulación del DOM.

Es el corazón de la app: todo lo demás (editar, eliminar, guardar rutina) depende de tener esto funcionando bien.

Te da retroalimentación inmediata: ves los ejercicios aparecer en pantalla mientras programás.