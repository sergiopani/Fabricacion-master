//const { getProduct } = require("../../../controllers/product");

//import axios from "axios";

new Vue({
    el: "#app",
    data: {
        //Array de articulos que parseamos desde el fichero json
        //articulos: [],
        toProduce: [],
        //Array del fetch de json de empresas
        facturas: [],

        //Objeto que guarda la empresa que esta selecionada en el select
        selectedFactura: {
            id: '',
            nomfiscli: '',
            serie: '',
            tipo: '',
            centro: '',
            numero: '',
        },
        articulos: [],

        selectedArticulo: {
            centro: "",
            tipo: 0,
            serie: "",
            numero: 0,
            codiart: "",
            cantidad: 0,
            denoart: "",
            fondo: "",
            lateral: "",
            tapa: ""
        },
        articuloEnviar: {
            centro: "",
            tipo: 0,
            serie: "",
            numero: 0,

            tipoEnviar: "",
            valor: false
        },
        //Loading atributes
        loadingValue: "Cargando.....",
        //Button atributes
        buttonValue: "No se puede enviar a producción",
        isDisabled: true,



    },
    /*Metodos que se ejecutan al iniciar la pagina*/
    created() {
        const getfacturasExecution = new Promise((resolve, reject) => {
            resolve(this.getFacturas());
        });
        getfacturasExecution
            .then(value => {
                this.setDefault(this.facturas[0])
            })
            .catch(err => {
                console.log("NO SE PUEDEN OBTENER LAS FACTURAS! " + err)
            })


    },
    methods: {
        comprobarVerde: function (articulo) {

            //enviar objecto de post
            if (articulo.fondo === 'S' && articulo.lateral === 'S' && articulo.tapa === 'S') {
                return true;
            }else if (articulo.fondo === 'S' && articulo.lateral === 'S' && articulo.tapa === 'N'){
                return true;
            }
            /*
            if(this.enableProductionByDefault()){
                this.isDisabled = false;
                this.buttonValue = "Enviar a producción"

            }else{
                this.isDisabled = true;
                this.buttonValue = "No se puede enviar a produccion"

            }
            */

            /*else {
                this.deleteProduct(articulo);
            }*/

        },
        sendProduction: function (articulo) {
            //Comprueba que elementos li estan marcados en verde
            this.toProduce.push(articulo)

        },
        deleteProduct: function (articulo) {
            for (let i = 0; i < this.toProduce.length; i++) {
                if (this.toProduce[i] === articulo) {
                    this.toProduce[i] = null;
                }
            }
            this.deleteNullsFromArray();

        },
        deleteNullsFromArray: function () {
            //Eliminar las posiciones que son nulas
            this.toProduce = this.toProduce.filter(element => {
                return element !== null;
            });
        },
        showProduction: function () {

            //Eliminar las posiciones que son nulas
            /*
            const results = this.toProduce.filter(element => {
                return element !== null;
            });
            */
            this.postProduction(this.toProduce);

        },
        postProduction: async function (toProduceArray) {
            //Cambiamos el valor del boton y lo bloqueamos
            this.buttonValue = 'Enviando.....';
            this.loadingValue = 'Enviando.....'
            this.isDisabled = true;
            document.getElementById("products").style.display = "none";
            document.getElementById("reload").style.display = "block";
            //Envia a PEP todas los objectos que van a producion
            const url = "http://192.168.235.81:8080/kriterOMNI/KriterRS004/closeOP";
            try {
                await axios.post(url, toProduceArray)
                    .then(response => {
                        console.log("El response es igual a " + response.status);
                        console.log(toProduceArray);
                        if (response.status == 200) {
                            console.log("Respuesta satisfactoria");
                            this.buttonValue = "Enviar a producción";
                            this.isDisabled = false;
                            document.getElementById("products").style.display = "block";
                            document.getElementById("reload").style.display = "none";
                        }


                        //this.displayReload(data.status);
                    })
                this.buttonValue = "No se puede enviar a producción";
                this.isDisabled = true;

            } catch (error) {
                console.log("El error que devulve es: " + error.data);
            }

            /*if(res.status = 200){
                document.querySelector('#buttonProduction').value = 'Enviar';
            }*/

            this.refreshProducts();
            //this.refreshFacturas();
            this.loadingValue = "Cargando....."

        },
        refreshProducts: function () {
            this.toProduce = [];
            this.articulos = [];
            this.getProducts();
        },
        refreshFacturas: function () {
            console.log(this.articulos);
            /*if(this.articulos.length == 0){
                //Ya no quedan mas articulos en esa factura por lo tanto actualizamos las facturas y ponemos el set selected a el primero del array
                this.facturas = [];
                this.getFacturas();
                //setSelected(this.facturas[0]);

            }*/
            //this.setSelected(this.facturas[0]);

            this.facturas = [];
            this.getFacturas();
            this.setDefault(this.facturas[0]);



        },
        filter: function (a) {

            let ideProducto = a.centro + a.tipo + a.serie + a.numero;

            return ideProducto.toUpperCase() === this.selectedFactura.id.toUpperCase();
        },
        setSelected: function (facturaObject) {
            //console.log("cambiando  ->" + facturaId)
            //Sacamos una array separando por '/' en cada uno de las posiciones
            //let atributos = this.currentFactura.id.split('/');
            //console.log(atributos);
            //Recorrer la array
            this.setDefault(facturaObject);
        },
        setDefault: function (factura) {
            /*this.selectedFactura.id = factura.serie + factura.tipo + factura.centro + factura.numero;
            this.selectedFactura.nombre = factura.nomfiscli;
            this.selectedFactura.serie = factura.serie;
            this.selectedFactura.tipo = factura.tipo;
            this.selectedFactura.centro = factura.centro;
            this.selectedFactura.numero = factura.numero;*/

            this.selectedFactura = factura;

            this.selectedFactura.id = this.selectedFactura.centro + this.selectedFactura.tipo + this.selectedFactura.serie +
                this.selectedFactura.numero;

            this.getProducts();

            const getfacturasExecution =
                new Promise((resolve, reject) => {
                    resolve(this.getProducts());
                });
            getfacturasExecution.then((value) => {
                this.toProductionDefault();
            });


        },
        toProductionDefault: function () {
            console.log(this.articulos);
            if (this.articulos.length >= 1) {
                this.articulos.forEach(articulo => {
                    console.log(articulo)
                    if (this.comprobarVerde(articulo) === true) {
                        this.toProduce.push(articulo);
                        this.isDisabled = false;
                        this.buttonValue = "Enviar a produccion";
                    }
                });
            }

        },

        beforePost: function (articulo, tipo) {
            //Vamos a poner en el selected articulo actual los valores de de cada uno de los tipos...

            this.selectedArticulo = articulo;
            if (tipo === 'fondo') {
                if (event.target.checked === true) {
                    this.selectedArticulo.fondo = 'S';
                } else {
                    this.selectedArticulo.fondo = 'X';
                }
            }
            if (tipo === 'lateral') {
                if (event.target.checked === true) {
                    this.selectedArticulo.lateral = 'S';
                } else {
                    this.selectedArticulo.lateral = 'X';
                }
            }
            if (tipo === 'tapa') {
                if (event.target.checked === true) {
                    this.selectedArticulo.tapa = 'S';
                } else {
                    this.selectedArticulo.tapa = 'X';
                }
            }

            this.enableProduction();
            // if(this.enableProduction(this.articulos) === true){
            //     this.isDisabled = false;
            //     this.buttonValue = "Enviar a produccion";
            // }else{
            //     this.isDisabled = true;
            //     this.buttonValue = "No se puede enviar a produccion";
            // }
            console.log("*************" + this.selectedArticulo);
            //this.comprobarVerde(this.selectedArticulo);
            if (this.comprobarVerde(this.selectedArticulo) === true) {
                this.sendProduction(this.selectedArticulo);
            } else {
                this.deleteProduct(this.selectedArticulo);

            }
            console.log(event.target.checked);
            this.articuloEnviar.centro = articulo.centro;
            this.articuloEnviar.serie = articulo.serie;
            this.articuloEnviar.tipo = articulo.tipo;
            this.articuloEnviar.numero = articulo.numero;
            this.articuloEnviar.tipoEnviar = tipo;
            this.articuloEnviar.valor = event.target.checked;
            //console.log(this.articuloEnviar);

            this.postProduct();
        },
        postProduct: async function () {
            //Hay que pasar el estado en que se encuentra el check

            const url = "http://192.168.235.81:8080/kriterOMNI/KriterRS004/marcarFase";
            try {
                await axios.post(url, this.articuloEnviar)
                    .then(data => {
                        console.log(data);
                    })


            } catch (error) {
                console.log(error.response);
            }


        },
        checkEnable: function (){
            for(let i = 0; i<this.articulos.length; i++){
                if(this.comprobarVerde(this.articulos[i])){
                    return true;
                }
            }
            return false;
        },

        enableProduction: function () {
            if(this.checkEnable()){
                this.buttonValue = "Enviar a producción"
            }else{
                this.buttonValue = "No se puede enviar a producción"
            }
            this.isDisabled = !this.checkEnable()

        },
        displayReload: async function (status) {
            if (status == 200) {

                document.getElementById("products").style.display = "block";
                document.getElementById("reload").style.display = "none";
            } else {

                document.getElementById("products").style.display = "none";
                document.getElementById("reload").style.display = "block";
            }
        },
        //closeOP
        getProducts: async function () {

            try {
                const url = "http://192.168.235.81:8080/kriterOMNI/KriterRS004/getOP?centro=" + this.selectedFactura.centro + "&tipo=" + this.selectedFactura.tipo
                    + "&serie=" + this.selectedFactura.serie + "&numero=" + this.selectedFactura.numero;

                //const url = '../data/products.json';

                const response = await axios(url);
                const res = response.data;

                this.articulos = [];
                this.articulos = res;
                //Si la respeusta es 200 ponemos display none a la rueda y display true a los productos

                if (response.status === 200) {
                    document.getElementById("products").style.display = "block";
                    document.getElementById("reload").style.display = "none";
                } else {
                    document.getElementById("products").style.display = "none";
                    document.getElementById("reload").style.display = "block";
                }



            } catch (err) {
                console.log(err);
            }
        },

        /*
            getProducts:async function() {
                fetch("../data/products.json")
                    .then((res) => res.json())
                    .then((data) => ((this.selectedFactura.articulos = data)
                        ))
                    .catch((err) => console.log(err.message));
            },
        */



        getFacturas: async function () {


            try {
                const url = "http://192.168.235.81:8080/kriterOMNI/KriterRS004/getOrders";
                //const url = "http://localhost:8080/kriterOMNI/KriterRS004/getOrders";

                //const url = '../data/facturas.json'
                const response = await axios(url);

                const res = response.data;
                this.facturas = res;


            } catch (err) {
                console.log("NO SE PUEDEN OBTENER LAS FACTURAS!" + err);
            }
        }


        /*
                getFacturas:async function() {
                    fetch("https://40ac-45-15-136-50.eu.ngrok.io/kriterOMNI/KriterRS004/getOrders")
                        .then((res) => res.json())
                        .then((data) => ((this.facturas = data), console.log(this.facturas)))
                        .catch((err) => console.log(err.message));
                },
        */

    },
});


