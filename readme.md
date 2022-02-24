# Agregar ip pública a instancia sql de gcp

Mini proyecto que busca automatizar el agregar la ip pública a gcp.
Disponible para Mac/linux, ya que se ocupa curl.

## 1 Instalación

Se requiere instalar los paquetes de npm 

```
npm install
```


* Con la siguiente aplicación, se supone que usaste gcloud init o gcloud auth login para autenticar gcloud con tu cuenta de usuario. Para instalar gcloud cli visitar [aquí](https://cloud.google.com/sdk/docs/install)



## 2 ¿Cómo utilizar?

Luego de instalar los paquetes de node la aplicación se ejecuta con el siguiente comando.

```
npm start
```

* Preguntará por la instancía que se desea ocupar.

* Preguntará por el nombre que se desea registrar junto a la ip pública.

La aplicación permite agregar y también actualizar la ip pública si es que coincide con el mismo nombre y es una ip distinta.



## 3 Comentarios

Construido con cariño para el equipo de chek.
