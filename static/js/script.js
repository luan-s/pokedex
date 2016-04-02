var pokeNomes = [];
var pokeUrl = [];
var obj;
var prefixo ='http://pokeapi.co/';
var aux;
var pokeImg;
var numeros = [];
var pokemon;
var poke = 0;

function httpGet(url) { 
	var xmlHttp = new XMLHttpRequest(); 
	xmlHttp.open( "GET", url, false ); // false para síncrono
	xmlHttp.send( null ); 
	return JSON.parse(xmlHttp.responseText);
}

function api(url,fun,modo){
	function httpGetAsync(url) { 
		var xmlHttp = new XMLHttpRequest(); 
		xmlHttp.onreadystatechange = function() { 
			if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
				console.log("carregou")
				if(modo){
					obj = JSON.parse(xmlHttp.responseText)
					fun();
				} 
				else{
					aux = JSON.parse(xmlHttp.responseText);
					pokemon = aux;
					console.log(pokemon);
					show(pokemon);
				} 
			}
		} 
		xmlHttp.open( "GET", url, true ); // true para assíncrono
		xmlHttp.send( null ); 
	}
	httpGetAsync(url);
}

function findIndex(nome){
	for(i in pokeNomes){
		if(nome==pokeNomes[i]){
			return pokeUrl[i];
		}
	}
}

main = function(){
	for(i in obj.objects[0].pokemon){
		pokeNomes.push(obj.objects[0].pokemon[i].name);
		pokeUrl.push(obj.objects[0].pokemon[i].resource_uri);
	}
	$('#btnProx').click();
	
	$('#ok').click(function(){
		reset();
		api(prefixo+findIndex($('#pes').val()),0,0);
	});
}

api('http://pokeapi.co/api/v1/pokedex/',main,1);

function show(pokemon){
	n = formataNumero(pokemon.pkdx_id);

	$('#img').attr('src','http://assets22.pokemon.com/assets/cms2/img/pokedex/full/'+n+'.png');
	
	poke = pokemon.pkdx_id;
	$('#ataque').text(aux.attack.toString());
	$('#defesa').text(aux.defense.toString());
	$('#vida').text(aux.hp.toString());
	$('#velocidade').text(aux.speed.toString());
	$('#tipo').text('Tipo: '+aux.types[0].name);
	$('#peso').text('Peso: '+aux.weight);
	$('#numero').text('ID: '+aux.pkdx_id);
	$('.nome').text(aux.name);
	numeros.push(aux.attack);
	numeros.push(aux.defense);
	numeros.push(aux.speed);
	numeros.push(aux.hp);
	var maior = aux.attack;
	for(i  = 1; i < 3;i++){
		if(maior<numeros[i])
			maior = numeros[i];
	}
	$('.box1').css('width',porcentagem(aux.attack,maior).toString()+'%');
	$('.box2').css('width',porcentagem(aux.defense,maior).toString()+'%');
	$('.box3').css('width',porcentagem(aux.hp,maior).toString()+'%');
	$('.box4').css('width',porcentagem(aux.speed,maior).toString()+'%');
	 var out1 = httpGet(prefixo+pokemon.moves[0].resource_uri);
	setTimeout(function(){
		$("#desMov").text(out1.description);
	},500);
	

	if(aux.evolutions.length > 0){
		n = formataNumero(parseInt(separaNumero(aux.evolutions[0].resource_uri)));
		$('#prox').text('Evolução: '+aux.evolutions[0].to);
		$('#evo').attr('src','http://assets22.pokemon.com/assets/cms2/img/pokedex/full/'+n+'.png');
	}else{
		$('#prox').text('Evolução: Nenhuma');
		$('#evo').attr('src','img/pokeball.png');
	}

	$('#evo').error(function(){
		$('#evo').attr('src','img/pokeball.png');
	});

	$('#sel1').empty();

	for(i = 0;i<pokemon.moves.length;i++){
		if(i<10) 
			$('<option id="mov0'+i.toString()+'">'+pokemon.moves[i].name+'</option>').appendTo("#sel1");
		else
			$('<option id="mov'+i.toString()+'">'+pokemon.moves[i].name+'</option>').appendTo("#sel1");
	}

	/*api(,0,0);*/
	var out = httpGet(prefixo+aux.descriptions[0].resource_uri)
	setTimeout(function(){
		$('#descri').text(out.description);
	},800);
}

$('#sel1').change(function(){
	$( "select option:selected" ).each(function() {
	    var n  = parseInt($( this ).attr('id')[3]+$( this ).attr('id')[4]);
	    var out = httpGet(prefixo+pokemon.moves[n].resource_uri);
		setTimeout(function(){
			$("#desMov").text(out.description);
		},500);
    });
	
})

function reset(){
	numeros.length = 0;
	$('#desMov').empty();
}

porcentagem = function(num,maior){
	return num*100/maior;
}

formataNumero = function(num){
	var n ='';
	if(num > 100 ){
		n = num.toString();
	}else{
		if(num < 100 && num > 9){
			n='0'+num.toString();
		}else{
			if(num < 10 ){
				n='00'+num.toString();
			}
		}
	}
	return n;
}

separaNumero = function(uri){
	var num = '';
	var i = 16;
	while(uri[i]!='/'){
		num+=uri[i];
		i++;
	}
	return num;
}

$('#btnProx').click(function(){
	reset();
		if(poke == 718) poke = 0;
		api('http://pokeapi.co/api/v1/pokemon/'+(++poke).toString()+'/',0,0);
});
$('#btnAnt').click(function(){
	reset();
		if(poke == 1) poke = 719;
		api('http://pokeapi.co/api/v1/pokemon/'+(--poke).toString()+'/',0,0);
});