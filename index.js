const fetch = require('node-fetch');
const readline = require('node:readline/promises');

const { listarInstancias, obtenerIpsDeInstancia, agregarIp } = require('./funciones');


(async () => {
    
    try{
        console.log('AGREGA TU IP PÚBLICA A UNA INSTANCIA DE GCP');
        console.log('********************************************');

        const instancias = await listarInstancias();
        mostrarInstancias(instancias);

        const seleccionada = parseInt( await preguntarPorIsntancia() );

        if( seleccionada < 0 || seleccionada > instancias.length || !seleccionada ){
            console.log('Opnción no válida');
            console.log('Chau Chau');
            return;
        }

        const instanciaSeleccionada = instancias[ seleccionada - 1 ];
        const nombreInstancia = instanciaSeleccionada.nombre;
        
        
        let ips = await obtenerIpsDeInstancia(nombreInstancia);
        ips = ips.map(ip => ({ name: ip.name?? '', value: ip.value}));
        let miIp = await obtenerMiIPPublica();
        
        let miIpesta = miIpEstaRegistrada(ips, miIp);
        if( miIpesta ) return console.log('\nLa ip ya se encuentra registrada\nchauchau\n');


        console.log(`\nMi ip : ${ miIp }\n`);
        const nombre = await preguntarPorNombreIp();

        let miNombreEsta = miNombredeRedEstaRegistrado(ips, nombre );
        if(miNombreEsta){
            console.log(`\nNombre de Red: ${nombre} encontrada...`);
            console.log('Actualizar Ip\n1- Si\n2-No');
            const opcionActualizar = await preguntarPorActualiacionIp();
            if(opcionActualizar < 1 || opcionActualizar > 2 ){
                return console.log("\nOpción incorrecta chau chau\n");
            }

            if( opcionActualizar == 2){
                return console.log('\nHasta la proxima...\n');
            }
            
            if(opcionActualizar == 1){

                ips = ips.map(ip => {
                    if(ip.name === nombre ){
                        ip.value = miIp
                    }

                    return ip;
                });
            }

        }else{
            ips.push({ name: nombre, value: miIp});
        }
            
        console.log(`\n Agregando: ${nombre} - ip: ${miIp}`);
        console.log('\nRealizando la magía, espere...');
        
        await agregarIp(instanciaSeleccionada, ips);
        console.log('\nListoco!');

    }catch(err){
        console.log('\nLo siento algo ocurrio...\n');
        console.log(err);
    }

})()


const mostrarInstancias = (instancias) => {
    console.log('\n*INSTANCIAS');
    instancias.forEach( (inst, i) => {
        console.log(`[${i+1}] ${inst.nombre}`);
    })
    console.log('\n');
}

const preguntarPorIsntancia = async () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.setPrompt(`Seleccione Instancia? `);
    let seleccionada = await rl.question('A que instancia desea agregar su ip? ');
    rl.close();
    return seleccionada;
} 

const preguntarPorNombreIp = async () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.setPrompt(`Nombre de la red? `);
    let nombre = await rl.question('Nombre de la red? ');
    rl.close();
    return nombre;
} 

const preguntarPorActualiacionIp = async () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.setPrompt(`Desea Actualizar ip? `);
    let opcion = await rl.question('Desea actualizar ip? ');
    rl.close();

    return opcion;
} 

const miIpEstaRegistrada = (ips, miIp) => {
    
    const ipEncontrada =  ips.find( ip => ip.value === miIp)

    return ipEncontrada != undefined;
} 

const miNombredeRedEstaRegistrado = (ips, nombre) => {
    
    const nombreEncontrado =  ips.find( ip => ip.name === nombre)

    return nombreEncontrado != undefined;
} 


const obtenerMiIPPublica = async () => {
    const URL_API = "https://api.ipify.org/?format=json";
    const respuestaRaw = await fetch(URL_API);
    const respuesta = await respuestaRaw.json();
    const ip = respuesta.ip;
    return ip;
}
