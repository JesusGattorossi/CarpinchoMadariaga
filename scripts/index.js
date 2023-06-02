
const ruleta = document.getElementById("ruleta");
let opcionesContainer;
let opciones = Array.from(document.getElementsByClassName("opcion"));
const root = document.documentElement;
const formContainer = document.getElementById("formContainer");
const modal = document.querySelector("dialog");
const totalElement = document.getElementById("porcentaje");
const botonCancelar = document.getElementById("cancelar");
const botonAceptar = document.getElementById("aceptar");
const botonAgregar = document.getElementById("agregar");
const ganadorTextoElement = document.getElementById("ganadorTexto");

/** Texto de la opción ganadora */
let ganador = "";

let animacionCarga;

let sorteando = false;

const colores=[
	"126253","134526","C7B446","5D9B9B","8673A1","100000","4C9141","8E402A","231A24","424632","1F3438","025669","008F39","763C28"
];

/** Cambia la escala para hacer la herramienta pseudo responsive */
let escala = screen.width < 550 ? screen.width * 0.7 : 400;
root.style.setProperty("--escala",escala+"px");




const uno = {
	nombre: "5% descuento",
	probabilidad:20
}
const dos = {
	nombre: "10% descuento",
	probabilidad: 22
}
const tres = {
	nombre: "15% descuento",
	probabilidad: 18
}
const cuatro = {
	nombre:"1 TABLA GRATIS!!",
	probabilidad: 16
}
const cinco = {
	nombre:"SEGUI PARTICIPANDO",
	probabilidad: 24
}

let conceptos = [uno,dos,tres,cuatro,cinco];


/** Pone a girar la ruleta y hace el sorteo del resultado */
function sortear(){
	sorteando = true;
	ganadorTextoElement.textContent = ".";
	animacionCarga = setInterval(()=>{
		switch( ganadorTextoElement.textContent){
			case ".":
				ganadorTextoElement.textContent = ".."
				break;
			case "..":
				ganadorTextoElement.textContent = "..."
				break;
			default:
				ganadorTextoElement.textContent = "."
				break;
		}
	} ,500)

	const nSorteo = Math.random();
	
	const giroRuleta = (1-nSorteo)*360 + 360*10; 
	root.style.setProperty('--giroRuleta', giroRuleta + "deg");
	ruleta.classList.toggle("girar",true)
	
	let pAcumulada = 0;
	conceptos.forEach(concepto => {
		if(nSorteo*100 > pAcumulada && nSorteo*100 <= pAcumulada+concepto.probabilidad){
			ganador = concepto.nombre;
			
		};
		pAcumulada +=concepto.probabilidad;
	})
}


ruleta.addEventListener("animationend", ()=>{
	ruleta.style.transform = "rotate("+getCurrentRotation(ruleta)+"deg)";
		ruleta.classList.toggle("girar",false)
		sorteando=false;
		ganadorTextoElement.textContent = ganador;
		clearInterval(animacionCarga);
})



function ajustarRuleta (){
	
	if(opcionesContainer)	ruleta.removeChild(opcionesContainer)
	opcionesContainer = document.createElement("div");
	opcionesContainer.id = "opcionesContainer";
	ruleta.appendChild(opcionesContainer);
	let pAcumulada = 0
	conceptos.forEach((concepto, i) => {
		
		const opcionElement = document.createElement("div");
		opcionElement.classList.toggle("opcion",true);
		opcionElement.style = `
			--color: #${colores[i%colores.length]};
			--deg:${probabilidadAGrados(pAcumulada)}deg;
			${getPosicionParaProbabilidad(concepto.probabilidad)}`
		opcionElement.addEventListener("click", ()=> onOpcionClicked(i))
		opcionesContainer.appendChild(opcionElement);
	
		const nombreElement = document.createElement("p");
		nombreElement.textContent = concepto.nombre;
		nombreElement.classList.add("nombre");
		nombreElement.style = `width : calc(${concepto.probabilidad} * var(--escala) * 1.5 / 80);
			transform: rotate(${probabilidadAGrados(concepto.probabilidad)/2+probabilidadAGrados(pAcumulada)}deg)`
		opcionesContainer.appendChild(nombreElement);
		
		const separadorElement = document.createElement("div");
		separadorElement.style = `transform: rotate(${probabilidadAGrados(pAcumulada)}deg)`
		separadorElement.classList.add("separador");
		opcionesContainer.appendChild(separadorElement);
		pAcumulada += concepto.probabilidad;
		
		ruleta.style.transform = "rotate(0deg)";
		ganadorTextoElement.textContent = "¡Click en Girar para iniciar!";
	})
}


//CONFIG botones

document.getElementById("sortear").addEventListener("click", () => {
	if(!sorteando) sortear()
})

function onOpcionClicked(i){

	Array.from(formContainer.children).forEach(element => formContainer.removeChild(element))
	
	conceptos.forEach(concepto =>{
		agregarConfiguracionProbabilidad(concepto);
	})
	modal.showModal();
	verificarValidezFormulario()
}

botonAceptar.addEventListener("click",()=> {
	conceptos = Array.from(formContainer.children).map(opcion =>
		nuevaProbabilidad = {
			nombre: opcion.children[0].tagName==="LABEL" ? opcion.children[0].textContent : opcion.children[0].value,
			pInicial: 0,
			probabilidad: parseFloat(opcion.children[1].value)
		})
		ajustarRuleta()
		modal.close()
	});

	botonCancelar.addEventListener("click",()=> {
		modal.close();
	});



function getPosicionParaProbabilidad(probabilidad){
	if(probabilidad === 100){
		return ''
	}
	if(probabilidad >= 87.5){
		const x5 = Math.tan(probabilidadARadianes(probabilidad))*50+50;
		return `clip-path: polygon(50% 0%, 100% 0, 100% 100%, 0 100%, 0 0, ${x5}% 0, 50% 50%)`
	}
	if(probabilidad >= 75){
		const y5 = 100 - (Math.tan(probabilidadARadianes(probabilidad-75))*50+50);
		return `clip-path: polygon(50% 0%, 100% 0, 100% 100%, 0 100%, 0% ${y5}%, 50% 50%)`
	}
	if(probabilidad >= 62.5){
		const y5 = 100 - (0.5 - (0.5/ Math.tan(probabilidadARadianes(probabilidad))))*100;
		return `clip-path: polygon(50% 0%, 100% 0, 100% 100%, 0 100%, 0% ${y5}%, 50% 50%)`
	}
	if(probabilidad >= 50){
		const x4 = 100 - (Math.tan(probabilidadARadianes(probabilidad))*50+50);
		return `clip-path: polygon(50% 0, 100% 0, 100% 100%, ${x4}% 100%, 50% 50%)`
	}
	if(probabilidad >= 37.5){
		const x4 = 100 - (Math.tan(probabilidadARadianes(probabilidad))*50+50);
		return `clip-path: polygon(50% 0, 100% 0, 100% 100%, ${x4}% 100%, 50% 50%)`
	}
	if(probabilidad >= 25){
		const y3 = Math.tan(probabilidadARadianes(probabilidad-25))*50+50;
		return `clip-path: polygon(50% 0, 100% 0, 100% ${y3}%, 50% 50%)`
	}
	if(probabilidad >= 12.5){
		const y3 = (0.5 - (0.5/ Math.tan(probabilidadARadianes(probabilidad))))*100;
		return `clip-path: polygon(50% 0, 100% 0, 100% ${y3}%, 50% 50%)`
	}
	if(probabilidad >= 0){
		const x2 = Math.tan(probabilidadARadianes(probabilidad))*50 + 50;
		return `clip-path: polygon(50% 0, ${x2}% 0, 50% 50%)`
	}
}


ajustarRuleta();

 /** Devuelve la rotación en grados de un elemento */
 function getCurrentRotation(el){
	var st = window.getComputedStyle(el, null);
	var tm = st.getPropertyValue("-webkit-transform") ||
			 st.getPropertyValue("-moz-transform") ||
			 st.getPropertyValue("-ms-transform") ||
			 st.getPropertyValue("-o-transform") ||
			 st.getPropertyValue("transform") ||
			 "none";
	if (tm != "none") {
	  var values = tm.split('(')[1].split(')')[0].split(',');
	  var angle = Math.round(Math.atan2(values[1],values[0]) * (180/Math.PI));
	  return (angle < 0 ? angle + 360 : angle);
	}
	return 0;
  }
  
  
  
  function probabilidadAGrados(probabiliad){
	  return probabiliad * 360 / 100;
  }
  
  function probabilidadARadianes(probabilidad){
	  return probabilidad/100 * 2 * Math.PI;
  } 
