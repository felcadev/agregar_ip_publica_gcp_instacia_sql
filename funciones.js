const { exec } = require('child_process');
const execAsyn = require('await-exec')



const listarInstancias = async () => {
    const comando = `gcloud sql instances list`;
    const res = await ejecutarComando(comando);
    const salida_limpia = JSON.parse(res).map( ({ project, name}) => ({ proyecto: project, nombre: name }));
    return salida_limpia;
}

const obtenerIpsDeInstancia = async (nombreInstancia) => {
    const comando = `gcloud sql instances describe ${nombreInstancia}`;
    const res = await ejecutarComando(comando);
    const salida_limpia = JSON.parse(res)['settings']['ipConfiguration']['authorizedNetworks'] ?? [];
    return salida_limpia;
}

const agregarIp = async (instancia, ips) => {
    
    let body = {
        settings:
        {
          ipConfiguration:
          {
            authorizedNetworks: ips
          }
        }
    }
    
    const comando = `curl -X PATCH  -H "Authorization: Bearer "$(gcloud auth print-access-token) -H "Content-Type: application/json; charset=utf-8" -d '${JSON.stringify(body)}' "https://sqladmin.googleapis.com/v1/projects/${instancia.proyecto}/instances/${instancia.nombre}"`;
    const res =  await ejecutarAsyncComando(comando, false);
    return res;
}


const ejecutarComando = (comando, enJson = true) => {

    let formatoJson = enJson? '--format="json"' : '';

    return new Promise( (res,rej) => {
        exec(`${comando} ${formatoJson}`, (error, stdout, stderr) => {
            if (error) {
                rej(error.message);
            }
          
            if (stderr) {
              rej(stderr);
            }
            
            res(stdout ?? 'Listo en comando.');
    
        });
      } );
}


const ejecutarAsyncComando =  async (comando) => {
    return await execAsyn(comando);
}


module.exports = {
    listarInstancias,
    obtenerIpsDeInstancia,
    agregarIp
}