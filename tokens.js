"use strict";


RegExp.prototype.bexec = function(str) {
  var i = this.lastIndex;
  var m = this.exec(str);
  if (m && m.index == i) return m;
  return null;
}

String.prototype.tokens = function () {
    var from;                   // apuntador del inicio del token
    var i = 0;                  // apuntador de la posicion actual
    var n;                      // el valor del numero
    var str;                    // el valor del string
    var m;                      // comparador
    var result = [];            // Array que almacena el resultado

    var WHITES              = /\s+/g;
    var ID                  = /[a-zA-Z_]\w*/g;
    var NUM                 = /\d+(\.\d*)?([eE][+-]?\d+)?\b/g;
    var STRING              = /('(\\.|[^'])*'|"(\\.|[^"])*")/g;
    var ONELINECOMMENT      = /\/\/.*/g;
    var MULTIPLELINECOMMENT = /\/[*](.|\n)*?[*]\//g;
    var TWOCHAROPERATORS    = /([+][+=]|-[-=]|=[=<>]|[<>][=<>]|&&|[|][|])/g;
    var ONECHAROPERATORS    = /([-+*\/=()&|;:<>[\]])/g;

    // creando el objeto token
    var make = function (type, value) {
        return {
            type: type,
            value: value,
            from: from,
            to: i
        };
    };

    // iniciando la carga al token, si el espacio esta en blanco no devuelve nada
    if (!this) return;

    var cadena = this; 

    // loop hasta terminar el texto
    while (i < cadena.length) {
        WHITES.lastIndex =  ID.lastIndex = NUM.lastIndex = STRING.lastIndex =
        ONELINECOMMENT.lastIndex = MULTIPLELINECOMMENT.lastIndex =
        TWOCHAROPERATORS.lastIndex = ONECHAROPERATORS.lastIndex = i;
        from = i;
        // ignora espacios en blanco
        if (m = WHITES.bexec(cadena)) {
            str = m[0];
            cadena = cadena.substr(m.index + m[0].length);
        // nombre.
        } else if (m = ID.bexec(cadena)) {
            str = m[0];
            cadena = cadena.substr(m.index + m[0].length);
            result.push(make('nombre', str));

        // numero.
        } else if (m = NUM.bexec(cadena)) {
            str = m[0];
            cadena = cadena.substr(m.index + m[0].length);

            n = +str;
            if (isFinite(n)) {
                result.push(make('number', n));
            } else {
                make('number', str).error("Bad number");
            }
        // string
        } else if (m = STRING.bexec(cadena)) {
            str = m[0];
            cadena = cadena.substr(m.index + m[0].length);
            str = str.replace(/^["']/,''); 
            str = str.replace(/["']$/,'');
            result.push(make('string', str));
        // comentario.
        } else if ((m = ONELINECOMMENT.bexec(cadena))  || 
                   (m = MULTIPLELINECOMMENT.bexec(cadena))) {
            str = m[0];
            cadena = cadena.substr(m.index + m[0].length);
        // operadoar de dos caracteres
        } else if (m = TWOCHAROPERATORS.bexec(cadena)) {
            str = m[0];
            cadena = cadena.substr(m.index + m[0].length);
            result.push(make('operator', str));
        // operador de un caracteres
        } else if (m = ONECHAROPERATORS.bexec(cadena)){
            result.push(make('operator', cadena.substr(i,1)));
            cadena = cadena.substr(m.index + m[0].length);
        } else {
          throw "Syntax error near '"+cadena.substr(i)+"'";
        }
    }
    return result;
};