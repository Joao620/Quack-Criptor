"use strict"

// output little endian format
function numTo8Bits(num){
	let stringBits = ''
	while(num >= 1){
		stringBits = stringBits + num % 2
		num = Math.floor(num / 2)
	}

	stringBits += '0'.repeat(8 - stringBits.length)

	return stringBits
}

// input little endian format
function bits2Num(stringBits){
	if(typeof(stringBits) != 'string') return;

	let numero = 0

	for (let i = 0; i < stringBits.length; i++) {
		const bit = stringBits[i];
		if(bit === '1') numero += 2 ** i
	}

	return numero
}

/**
 * usa uma string contendo so 0 e 1 que sera convertido em letras capitalizadas ou nao de palavra repetidamente
 * @param {string} stringBinaria string contendo 0 e 1
 * @param {string} palavra palavra que sera usada os 0 e 1
 */
function binario2palavras(stringBinaria, palavra){
	//stringBinaria só pode conter numeros
	if(stringBinaria.search(/[^01]/) != -1) return;
	//palavra só pode ter letras podendo ser acentuadas e espaco
	palavra = palavra.replace(/[^A-z\xc0-\xff\s]/g, '').toLowerCase()

	let stringFinal = ''
	let index = 0

	while(index < stringBinaria.length){
		for (const letra of palavra) {
			if(letra === ' '){
				stringFinal += ' '
				continue
			}
			
			if(stringBinaria.charAt(index) === '1'){
				stringFinal += letra.toUpperCase()
			} else {
				stringFinal += letra
			}

			index++
		}
		stringFinal += ' '
	}

	stringFinal = stringFinal.slice(0, -1)

	return stringFinal
}
/**
 * vai desfazer oque binario2palavras fez
 * @param {string} stringCodificada string que esteja com bits codificado em letra captalizadas
 * @param {string} binarioCorte sequencia binaria que vai trimmar o final da mensagem
 */
function palavra2binario(stringCodificada, binarioCorte){
	let stringBinariaSaida = ''

	for(const letra of stringCodificada){
		if(letra === ' '){
			continue
		}

		if(letra === letra.toUpperCase()){
			stringBinariaSaida += '1'
		} else {
			stringBinariaSaida += '0'
		}
	}

	let index = stringBinariaSaida.length - binarioCorte.length

	while(index > 0){
		let porcaoStringBinariaSaida = stringBinariaSaida.substr(index, binarioCorte.length)
		if(porcaoStringBinariaSaida === binarioCorte){
			stringBinariaSaida = stringBinariaSaida.slice(0, index)
			break
		}
		index--
	}

	return stringBinariaSaida
}

const CODIGO_PARADA = '00100000'
const LETRA_PARADA = String.fromCharCode(4)

function encriptacao(){
	let texto = document.getElementById("texto-nao-cripto").value;
	let chave = document.getElementById("chave").value;

	texto += LETRA_PARADA	
	/**@type {Uint8Array}*/
	let textoComprimidoArray = shoco.compress(texto)
	
	let textoBinario = ''
	for(const numero of textoComprimidoArray){
		textoBinario += numTo8Bits(numero)
	}

	let saida = binario2palavras(textoBinario, chave)

	document.getElementById("texto-cripto").value = saida;
}

function decriptacao(){
	/**@type {string} */
	let textoEncriptado = document.getElementById("texto-cripto").value;

	let binarioEncriptado = palavra2binario(textoEncriptado, CODIGO_PARADA)

	/**@type {Array}*/
	let encriptadosArray = []

	for(let i = 0; i < binarioEncriptado.length; i += 8){
		let parte = binarioEncriptado.substr(i, 8)
		let parteNum = bits2Num(parte)
		encriptadosArray.push(parteNum)
	}

	let UintArrayTexto = new Uint8Array(encriptadosArray)

	let saida = shoco.decompress(UintArrayTexto)

	document.getElementById("texto-nao-cripto").value = saida;

}