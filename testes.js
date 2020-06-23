let horariovisitas = [
    { "horario": "08:00:00", visitas: [] },
    { "horario": "09:00:00", visitas: [] },
    { "horario": "10:00:00", visitas: [] },
    { "horario": "11:00:00", visitas: [] },
    { "horario": "12:00:00", visitas: [] },
    { "horario": "13:00:00", visitas: [] },
    { "horario": "14:00:00", visitas: [] },
    { "horario": "15:00:00", visitas: [] },
    { "horario": "16:00:00", visitas: [] },
    { "horario": "17:00:00", visitas: [] },
    { "horario": "18:00:00", visitas: [] },
    { "horario": "19:00:00", visitas: [] },
    { "horario": "20:00:00", visitas: [] }
]

let visitas = [
    { id: 'abc12', imovel: "CA0001", dataagendadaformatada: "08/06/2020-14:00:00" },
    { id: 'abc18', imovel: "CA0001", dataagendadaformatada: "08/06/2020-18:00:00" },
    { id: 'fge03', imovel: "CA0001", dataagendadaformatada: "08/06/2020-08:00:00" },
    { id: 'def93', imovel: "LO3002", dataagendadaformatada: "08/06/2020-13:00:00" },
    { id: 'fna08', imovel: "LO3002", dataagendadaformatada: "09/06/2020-13:00:00" }
]

let dia = "08/06/2020"

visitas.forEach(registro => {
    return registro.adicionado = false
})

let visitas_dia_unico = horariovisitas.forEach(horario => {
    visitas.forEach(visita => {
        if (visita.adicionado === false) {
            if (visita.dataagendadaformatada.includes(dia) === true) {
                if ((visita.dataagendadaformatada).includes(horario.horario) === true) {
                    horario.visitas.push(visita)
                    return visita.adicionado = true
                }
            }
            else {
                return visita.adicionado = true
            }
        }
    })
})

console.log(horariovisitas)
