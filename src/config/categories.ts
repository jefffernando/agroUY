export const categories = [
 {slug:'ganaderia',name:'Ganadería',description:'Pasturas, alimentación y manejo para pensar el sistema ganadero.'},
 {slug:'agricultura',name:'Agricultura',description:'Suelos, cultivos y decisiones que empiezan antes de la siembra.'},
 {slug:'maquinaria',name:'Maquinaria',description:'Criterios prácticos para elegir, cuidar y aprovechar tus equipos.'},
 {slug:'forestacion',name:'Forestación',description:'Recursos para entender la producción forestal uruguaya.'},
 {slug:'mercados',name:'Mercados',description:'Las claves para leer indicadores y encontrar fuentes confiables.'},
 {slug:'tecnologia',name:'Tecnología',description:'Herramientas digitales con los pies en la tierra.'},
 {slug:'guias',name:'Guías y recursos',description:'Listas, conceptos y fuentes para volver a consultar.'},
];
export const categoryBySlug = (slug: string) => categories.find(c => c.slug === slug)!;
