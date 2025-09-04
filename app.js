const form = document.querySelector("#form-ejercicio")

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const formdata = new FormData(form)
    console.log(formdata);
    
    
})