// DOM Elements
const form = document.querySelector("#form-exercise")
const exercises = []
const list = document.querySelector("#exercise-list")
const modal = document.querySelector("#edit-modal");
const closeModal = document.querySelector("#close-modal");
const editForm = document.querySelector("#edit-form")
const btnSaveRoutine = document.querySelector("#btn-save-routine")
const historySection = document.querySelector("#history")

// Navigation buttons
const btnRoutines = document.querySelector("#btn-routines")
const btnAdd = document.querySelector("#btn-add")
const btnHistory = document.querySelector("#btn-history")

// References to the exercise and item we are currently editing
let currentExercise = null;
let currentItem = null;

// LocalStorage keys
const STORAGE_KEY = 'gymlog-exercises'
const ROUTINES_KEY = 'gymlog-routines'

 /* === Function that creates the exercise <li> card ===
   - Adds structure with identifiable spans to update
     only what changes (name, reps, weights, sets, rest).
   - Creates and connects Edit / Delete buttons.
*/
    function createExerciseCard(exercise) {

        const item = document.createElement("li");
        item.classList.add("routine-card");
        item.innerHTML = `
            <div class="exercise-info">
                <h3 class="ex-name">${exercise.name}</h3>
                <p>Repeticiones: <span class="ex-reps editable">${exercise.reps}</span></p>
                <p>Pesos: <span class="ex-weight editable">${exercise.weight}</span></p>
                <p>Series: <span class="ex-sets">${exercise.sets}</span></p>
                <p>Descanso: <span class="ex-rest">${exercise.rest}</span></p>
            </div>
        `;

        // --- Function to enable quick editing ---
        function activateEditing(span, field){
            span.addEventListener("dblclick", () => {
                if (span.parentNode.querySelector("input")) return;

                const input = document.createElement("input");
                input.type = "text"
                input.value = span.textContent
                input.classList.add("input-inline")

                span.replaceWith(input)
                input.focus()

                // Save when pressing Enter or leaving the input
                function save(){
                    const newValue = input.value.trim()

                    // Update object in array
                    exercise[field] = newValue

                    // Replace input with updated span
                    span.textContent = newValue
                    input.replaceWith(span)
                    
                    // Save changes to localStorage
                    saveExercises()
                }

                input.addEventListener("blur", save)
                input.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") save()
                })
            })
        }

        // Activate quick editing on reps and weight
        activateEditing(item.querySelector(".ex-reps"), "reps")
        activateEditing(item.querySelector(".ex-weight"), "weight")
    
        // 4. Create button container
        const btnContainer = document.createElement("div");
        btnContainer.classList.add("exercise-buttons");
        
        // Edit Button
        const btnEdit = document.createElement("button");
        btnEdit.textContent = "Edit";
        btnEdit.classList.add("edit-btn");
        
        // Delete Button
        const btnDelete = document.createElement("button");
        btnDelete.textContent = "Delete";
        btnDelete.classList.add("delete-btn");
        /* --- Edit Event ---
        Here we use CLOSURE: inside this listener we have access
        to the 'exercise' variable (the specific object) and 'item' (the li).
        We save global references so the modal form knows
        what to update when changes are saved
        */
       btnEdit.addEventListener("click", () => {
           currentExercise = exercise
           currentItem = item
           
           // Fill modal inputs with data
           modal.querySelector("[name='name']").value = exercise.name;
           modal.querySelector("[name='reps']").value = exercise.reps;
           modal.querySelector("[name='weight']").value = exercise.weight;
           modal.querySelector("[name='sets']").value = exercise.sets;
           modal.querySelector("[name='rest']").value = exercise.rest;
           
           modal.style.display = "flex"
        })
        
        /* --- Delete Event ---
        Remove the item from DOM and the object from array.
        If that exercise is open in the modal, close the modal
        and clear the references.
        */
       // Delete action
       btnDelete.addEventListener("click", () => {
           // 1. Remove from DOM
           item.remove();
           // 2. Remove from array
           const index = exercises.indexOf(exercise);
           if(index !== -1) exercises.splice(index,1);
           
           // 3. Save changes to localStorage
           saveExercises()
           
           if (currentExercise === exercise) {
               currentExercise = null;
               currentItem = null;
               modal.style.display =  "none";
            }
        });
        
        // Add buttons to container
        btnContainer.appendChild(btnEdit);
        btnContainer.appendChild(btnDelete);
        
        // Add button container to item
        item.appendChild(btnContainer);

        return item;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault()
        
        // 1. Get form values
        const name = form.elements["name"].value.trim();
        const reps = form.elements["reps"].value.trim();
        const weight = form.elements["weight"].value.trim();
        const sets = form.elements["sets"].value.trim();
        const rest = form.elements["rest"].value.trim();

        // Validations
        if(!name){
            alert("El ejercicio necesita nombre.")
            return
        }
        
        if(!reps){
            alert("Repeticiones son necesarias.")
            return
        }
        
        if(!sets || sets < 1){
            alert("Al menos una serie.")
            return
        }

        // 2. Create exercise object
        const newExercise = {
            name,
            reps,
            weight,
            sets,
            rest
        };
        
        exercises.push(newExercise);

        // 3. Create <li> card
        const item = createExerciseCard(newExercise);
        list.appendChild(item);

        // 4. Save to localStorage
        saveExercises()

        form.reset()
    });

    /* === Close modal (X) and click outside === */
    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
        currentExercise = null;
        currentItem = null;
    });

    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
            currentExercise = null;
            currentItem = null;
        }
    });

    /* === Submit edit form modal: SAVE CHANGES ===
       Here we use currentExercise and currentItem that were set
       when the user clicked "Edit";
    */
   editForm.addEventListener("submit", (e) => {
        e.preventDefault()

        if (!currentExercise || !currentItem){
            console.warn("No se encontro ejercicio para editar")
            modal.style.display = "none"
            return
        }

    // 1) Get modal values
    const newName = editForm.elements["name"].value.trim();
    const newReps = editForm.elements["reps"].value.trim();
    const newWeight = editForm.elements["weight"].value.trim();
    const newSets = editForm.elements["sets"].value.trim();
    const newRest = editForm.elements["rest"].value.trim();
    
        // 2) Update object in memory (currentExercise is inside the array)
        currentExercise.name = newName;
        currentExercise.reps = newReps;
        currentExercise.weight = newWeight;
        currentExercise.sets = newSets;
        currentExercise.rest = newRest;

        // 3) Update ONLY the DOM parts that changed (spans)
        currentItem.querySelector(".ex-name").textContent = newName;
        currentItem.querySelector(".ex-reps").textContent = newReps;
        currentItem.querySelector(".ex-weight").textContent = newWeight;
        currentItem.querySelector(".ex-sets").textContent = newSets;
        currentItem.querySelector(".ex-rest").textContent = newRest;

        // 4) Save to localStorage
        saveExercises()
        
        // 5) Close modal and clear references
        modal.style.display = "none";
        currentExercise = null;
        currentItem = null;
        editForm.reset();
    });

    // === LocalStorage Functions ===
    function saveExercises() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(exercises));
    }

    function loadExercises() {
        const savedExercises = localStorage.getItem(STORAGE_KEY);
        if (savedExercises) {
            const exercisesArray = JSON.parse(savedExercises);
            exercisesArray.forEach(exercise => {
                exercises.push(exercise);
                const item = createExerciseCard(exercise);
                list.appendChild(item);
            });
        }
    }

    function saveRoutine(routineName, routineExercises) {
        const savedRoutines = JSON.parse(localStorage.getItem(ROUTINES_KEY) || '[]');
        const newRoutine = {
            id: Date.now(),
            name: routineName,
            date: new Date().toLocaleDateString(),
            exercises: [...routineExercises]
        };
        savedRoutines.push(newRoutine);
        localStorage.setItem(ROUTINES_KEY, JSON.stringify(savedRoutines));
        return newRoutine;
    }

    function loadRoutines() {
        return JSON.parse(localStorage.getItem(ROUTINES_KEY) || '[]');
    }

    // === Navigation Functions ===
function showSection(section) {
    const routineEditor = document.querySelector('.routine-editor');
    const routineList = document.querySelector('.routine-list');
    
    // Ocultar todo
    [routineEditor, routineList, historySection, btnSaveRoutine].forEach(el => {
        el.classList.add("hidden");
    });

    // Mostrar la sección seleccionada
    switch(section) {
        case 'add':
            routineEditor.classList.remove("hidden");
            routineList.classList.remove("hidden");
            btnSaveRoutine.classList.remove("hidden");
            break;
        case 'routines':
            routineList.classList.remove("hidden");
            break;
        case 'history':
            historySection.classList.remove("hidden");
            showHistory();
            break;
    }
}

    function showHistory() {
    const routines = loadRoutines();
    historySection.innerHTML = `
        <h2>Historial de entrenamiento</h2>
        ${routines.length === 0 ? 
            '<p>No hay rutinas aún</p>' : 
            routines.map(routine => `
                <div class="routine-history">
                    <h3>${routine.name}</h3>
                    <p class="history-date">Fecha: ${routine.date}</p>
                    <div class="history-exercises">
                        ${routine.exercises.map(ex => `
                            <p>• ${ex.name} - ${ex.sets} series x ${ex.reps} repeticiones - descanso: ${ex.rest}</p>
                        `).join('')}
                    </div>
                    <div class="history-buttons">
                        <button class="btn-load" onclick="loadRoutineInEditor(${routine.id})">Cargar rutina</button>
                        <button class="btn-delete" onclick="deleteRoutine(${routine.id})">Eliminar</button>
                    </div>
                </div>
            `).join('')}
    `;
}

    // === Event Listeners for Navigation ===
    btnRoutines.addEventListener('click', () => showSection('routines'));
    btnAdd.addEventListener('click', () => showSection('add'));
    btnHistory.addEventListener('click', () => showSection('history'));

    // === Save Complete Routine ===
    btnSaveRoutine.addEventListener('click', () => {
        if (exercises.length === 0) {
            alert('No hay ejercicios para guardar.');
            return;
        }
        
        const routineName = prompt('Ingrese nombre a la rutina:');
        if (routineName && routineName.trim()) {
            const routine = saveRoutine(routineName.trim(), exercises);
            alert(`Rutina de "${routine.name}" guardada correctamente!`);
            
            // Clear current routine
            exercises.length = 0;
            list.innerHTML = '';
            saveExercises();
        }
    });

    // === Global Functions for History ===
    window.loadRoutineInEditor = function(routineId) {
        const routines = loadRoutines();
        const routine = routines.find(r => r.id === routineId);
        
        if (routine) {
            // Clear current exercises
            exercises.length = 0;
            list.innerHTML = '';
            
            // Load routine exercises
            routine.exercises.forEach(exercise => {
                exercises.push({...exercise});
                const item = createExerciseCard(exercise);
                list.appendChild(item);
            });
            
            saveExercises();
            showSection('add');
            alert(`Rutina de "${routine.name}" guardada correctamente!`);
        }
    }

    window.deleteRoutine = function(routineId) {
        if (confirm('Seguro que queres eliminar la rutina?')) {
            const routines = loadRoutines();
            const updatedRoutines = routines.filter(r => r.id !== routineId);
            localStorage.setItem(ROUTINES_KEY, JSON.stringify(updatedRoutines));
            showHistory();
            alert('Rutina eliminada correctamente.');
        }
    }

    // === Initialize App ===
    document.addEventListener('DOMContentLoaded', () => {
        loadExercises();
        showSection('add'); // Show add section by default
    });