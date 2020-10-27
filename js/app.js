const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

document.addEventListener('DOMContentLoaded',()=>{
    formulario.addEventListener('submit',validarBusqueda);
});

function validarBusqueda(e){
    e.preventDefault();

    const busqueda = document.querySelector('#busqueda').value;
    
    if(busqueda.length < 3){
        mostrarMensaje('Por favor ingrese más datos para la búsqueda');
        return;
    }

    consultarAPI(busqueda);
}

function consultarAPI(busqueda){

    const githubURL = `https://jobs.github.com/positions.json?search=${busqueda}`;

    const url = `https://api.allorigins.win/get?url=${ encodeURIComponent(githubURL)}`; //con esto puedo consultar la api de git hub sin que me bloqueen por coors
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
    axios.get(url)
        .then(respuesta=>mostrarVacante(JSON.parse(respuesta.data.contents))) //la respuesta viene en string, la parseamos a json
}

function mostrarMensaje(mensaje){
    const existeAlerta = document.querySelector('.alerta');
    if(!existeAlerta){
        const alerta = document.createElement('div');
        alerta.classList.add('bg-red-100','p-3','text-center','mt-3','alerta');
        alerta.textContent= mensaje;
    
        formulario.appendChild(alerta);
    
        setTimeout(()=>{
            alerta.remove();
        },3000);
    }
}

function mostrarVacante(vacantes){
    //limpiamos
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }

    if(vacantes.length>0){
        resultado.classList.add('grid'); //agregamos una clase grid, que en tailwind me permite meter en forma de grilla a todos los resultados

        vacantes.forEach(vacante => {
            const {company,title,url,type } = vacante;
            
            resultado.innerHTML += /* html */`
            <div class="shadow bg-white p-6 rounded">
                <h2 class="text-2xl font-light mb-4">${title}</h2>
                <p class="font-bold uppercase">Compañía: <span class="font-light normal-case">${company}</span></p>
                <p class="font-bold uppercase">Tipo de Contrato: <span class="font-light normal-case">${type}</span></p>
                <a class="bg-teal-500 max-w-lg mx-auto mt-3 rounded p-2 block uppercase font-xl font-bold text-white text-center"href="${url}">Ver vacante </a>
            </div>
            ` 
        });
    }
    else{
        const noResultado = document.createElement('p');
        noResultado.classList.add('text-center','mt-10','text-gray-600','w-full');
        //quitamos la clase grid a resultado así nos muestra el msj en el medio
        resultado.classList.remove('grid');

        noResultado.textContent = 'No existen vacantes de lo que está buscando en este momento';
        
        resultado.appendChild(noResultado);
    }
}

