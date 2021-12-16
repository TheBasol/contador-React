//INSTALACION DEL SERVICE WORKED

//aqui se ponen todas las ruts en las que se van a hacer peticiones
const CACHE_ELEMENTS = [
    //pagina principal
    "./",
    //estilos
    "./styles.css",
    //logica del programa
    "./components/Contador.js",
    //urls esenciales para el funcionamiento
    "https://unpkg.com/react@17/umd/react.production.min.js",
    "https://unpkg.com/react-dom@17/umd/react-dom.production.min.js",
    "https://unpkg.com/@babel/standalone/babel.min.js"
];

const CACHE_NAME = "V8_cache_contenido";

//cuando se intale recibe el evento de instalacion del sw para guardar el cache y no
//depender del internet
self.addEventListener("install", (e)=>{
    //espera un evento
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            //se agregan todos los elementos en cache
            cache.addAll(CACHE_ELEMENTS).then(()=>{
                self.skipWaiting()
            }).catch(err => console.log(err))
        })
    )
});

//ACTIVACION 

self.addEventListener("activate", (e)=>{

    const cacheWhiteList = [CACHE_NAME];
    
    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(cacheNames.map(cacheName => {
                return(
                    cacheWhiteList.indexOf(cacheName) === -1 && caches.delete(cacheName) 
                )
            }))
        })
        //cobrar el cache
        .then(() => self.clients.claim())
    )    
});

//fetch captura el cache actual
self.addEventListener("fetch", (e)=>{
    e.respondWith(
        //verficar si el cache es correcto y si no lo obtiene de internet
        caches.match(e.request).then(res => {
            if (res) {
                return res;
            }
            return fetch(e.request);
        })
    );
});
