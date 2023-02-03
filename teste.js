let teste = `teste | teste2 | teste3
1123123
123
123
1231
2312
3`
/* console.log(teste.replace(/(\r\n|\n|\r)/gm).split(",")) */
/* const regexp = new RegExp(/(\r\n|\n|\r)/gm) */
/* console.log(regexp.exec(teste)) */

/* console.log(teste.split(/\r?\n|\r/g).filter(p => p.length !== 0)) */

/* const teste2 = [
    'Teste', 'sl',
    'asdads', 'asd',
    'as', 'da',
    'sd', 'as',
    'das', 'd', "leo"
]

let teste3 = ""

teste2.forEach(element => {
    teste3 += `${element}\n`
});

console.log(/[\n|\r|\n\r]/.exec(teste))
 */

/* const teste3 = [
    ['Teste leo'],
    ['Teste 3 LEo', 'Teste 3 LEo', 'Teste 3 LEo'],
    ['teste sla'],
    ['asdasdasdasdasd'],
    ['asdasdasdasd'],
    ['Teste sla sla slsa asdasdasda'],
    ['aaaaa'],
    ['asdasdasd'],
    ['teste'],
    ['asdasd'],
    ['aaa'],
    ['aaa'],
    ['asdasdasd'],
    ['123123123123asdasd'],
    ['99999'],
    ['55555', '55555', '55555', '55555']
]

teste3.forEach(element => {
    element.forEach(element => {
        console.log(element)
    });
}); */

/* const teste4 = [
    'Teste leo',
    'Teste 3 LEo',
    'Teste 3 LEo',
    'Teste 3 LEo',
    'teste sla',
    'asdasdasdasdasd',
    'asdasdasdasd',
    'Teste sla sla slsa asdasdasda',
    'aaaaa',
    'asdasdasd',
    'teste',
    'asdasd',
    'aaa',
    'aaa',
    'asdasdasd',
    '123123123123asdasd',
    '99999',
    '55555',
    '55555',
    '55555',
    '55555',
    'asdadasdasdasdasd',
    'asdadasdasdasdasd',
    'asdadasdasdasdasd',
    'asdadasdasdasdasd',
    'asdadasdasdasdasd',
    'asdadasdasdasdasd',
    'asdadasdasdasdasd',
    'asdadasdasdasdasd',
    'asdadasdasdasdasd',
    'asdadasdasdasdasd',
    'asdadasdasdasdasd',
    'asdadasdasdasdasd',
    'asdadasdasdasdasd',
    'asdadasdasdasdasd',
    'asdadasdasdasdasd',
    'asdadasdasdasdasdasdadasdasdasdasd',
    'asdadasdasdasdasd',
    'asdadasdasdasdasd',
    'asdadasdasdasdasd',
    'asdadasdasdasdasd',
    'asdadasdasdasdasd',
    'asdadasdasdasdasd',
    'asdadasdasdasdasd',
    'asdadasdasdasdasd',
    'asdadasdasdasdasd',
    'asdadasdasdasdasd',
    'asdadasdasdasdasd',
    'asdadasdasdasdasd',
    'asdadasdasdasdasd',
    'asdadasdasdasdasd',
    'asdadasdasdasdasd'
]

teste4.splice(0, 1)
console.log(teste4) */

/* const numEmotes = {
    0: "0️⃣",
    1: "1️⃣",
    2: "2️⃣"
}

function numberConvertToEmote(number) {
    let numberConverting = ""
    number.split("").map(resp => numberConverting += numEmotes[resp])
    return numberConverting
}

console.log(numberConvertToEmote("120")) */
