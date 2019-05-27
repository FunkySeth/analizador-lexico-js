Object.prototype.error = function (message, t) {
    
   t = t || this;
    
   t.nombre = "Error de sintaxis";
    
   t.message = message;
    
   throw t;

};



function main() {
    
   var parse = make_parse();


    

   var source = INPUT.value;
    
   var string, tree;
    
   try {
        
      tree = parse(source);
        
        
     
      //string = JSON.stringify(tree, ['type', 'value', 'from', 'to'],  4);
        

     string = JSON.stringify(tree, ['key', 'nombre', 'message',
             
        'value', 'operador', 'primero', 'segundo', 'tercero', 'cuarto'], 4);
    
   } catch (e) {
        
      string = JSON.stringify(e, ['nombre', 'message', 'from', 'to', 'key',
                
         'value', 'operador', 'primero', 'segundo', 'tercero', 'cuarto'], 4);
    
   }
    
   OUTPUT.innerHTML = string.replace(/&/g, '&amp;').replace(/[<]/g, '&lt;');

};



window.onload = function() {
  
   PARSE.onclick = main;

}
