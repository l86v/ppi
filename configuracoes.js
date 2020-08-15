// https://igorescobar.github.io/jQuery-Mask-Plugin/


// https://www.pontofrio.com.br/Informatica/Computadores/pc-gamer-roda-tudo-amd-a6-38ghz-placa-de-video-radeon-r5-2gb-hd-500gb-8gb-1500726926.html?IdSku=1500726926 sonho...
// https://www.pontofrio.com.br/Games/Playstation4/AcessoriosPlaystation4/Cambio-Logitech-Driving-Force-Shifter-para-Volantes-G29-e-G920-6695309.html?IdSku=6695309 com isso...
// https://www.americanas.com.br/produto/124527664/volante-logitech-gamer-g29-ps4-ps3-e-pc?pfm_carac=g29&pfm_page=search&pfm_pos=grid&pfm_type=search_page e pra finalizar... esse.


let random = require("randomatic")
let moment = require("moment")
var path = require("path")

process.env.TZ = "America/Sao_Paulo" // Paraná é bem melhor, só acho 🙃

module.exports.servidor = {
    titulo: "Proprimóvel",
    descricao: "Sem descrição.",
    porta: (process.env.PORT || 80),
    endereco: "http://localhost",
    ano: moment().format("YYYY"),
    sitegisul: "http://gisulcompany.com",
    arquivos: "http://ppi.gisulcompany.com",
    logo: "http://ppi.gisulcompany.com/logo.png",
    emailgisul: "contato@gisulcompany.com",
    segredo: `~AX,,IU,X-D1W,&C0B$X[&5Z]R8FG3_F,1%1%!Q6!9$RUJTK3S",L[#^(LZR{=FQE[2IVCS-}OP1F-9+1.$-6)RO1-0AA+]_NTTL=%K}]O][&+GI.9F53WB;Y{^N"I6LD^^B+)QPX3&GO,KILC@$^.L.(]S[Y86X;KV&MBC!8Y+#L5@1%=1OH)MMK358}J0EI8(O$NUA%$_[AR=#}V;Y&}XCBZ,W"M3=E{FG!9&R_U!&0!L@7)5B##T.DSY){E~@}8;CN@{BL[W&Y)GH&;AAG-F;CZI#7&]ZF#EB!YE70FY(1NOV+.X0XT$FDAYXCH~)FO_B-10!+NN7P,48XY00FY^!3MLVVV68TN_(G&)Z;7="=;WD8+U2{2HSL_R&HG];6!("AIZO4S+EAK~PP"`, // segredo do "express-session"
    token: `cacareco-hiperbolico-MBqA350ku-carrapato-biruta-0`,
    fraseinicial: "Hey, listen!",
    pastazero: path.dirname(require.main.filename)
}

module.exports.db = {
    usuario: "admin-proprimovel",
    senha: `UXe7P58EYD1xgUaZ2GukJz3lg3TAvLRXvXmxbH`,
    dominio: "ds049436",
    porta: "49436",
    nomedb: "projeto-proprimovel"
}

module.exports.email = {
    host: "smtp.mailtrap.io",
    port: 2525,
    secure: false,
    auth: {
        user: "835d342f2763a5",
        pass: "621386dac461f6"
    },
    css: `body,html{background-color:#fff;border:0;margin:0;padding:0;font-family:"Work Sans",sans-serif}.container{min-height:40vh;position:relative;display:grid;height:100vh;z-index:99}.margem{margin:4vh}.identificadorpedido{color:#28267c;font-size:1.75em;font-weight:600}.mensagemprincipal{color:#3d3e80;font-weight:300;font-size:1.25em}.produtos{display:grid;grid-template-columns:repeat(1,1fr);grid-gap:1vw}.produtos .produto{display:grid;grid-template-areas:"foto" "informacoes";grid-template-rows:repeat(2,1fr);box-shadow:0 0 .5rem .0085rem #e6e6e6}.produtos .produto .foto{display:grid;height:100%;overflow:hidden;opacity:1}.produtos .produto .foto img{height:90%;margin:auto}.produtos .produto .informacoes{padding:2vh}.produtos .produto .informacoes .tipo{text-transform:uppercase;color:#26274f;font-weight:300;font-size:.75em}.produtos .produto .informacoes .valor{font-weight:400;font-size:1em;color:#3d3e80}.entrega,.mensagemtexto{font-weight:400;font-size:1em;color:#3d3e80}.area{font-weight:600;font-size:1.25em;margin-top:1vh;margin-bottom:.5vh;color:#28267c}#verde{color:#3b804c}`
}

module.exports.padroes = {
    pasta: "uploads",
    usuario: {
        nome: "Nautilus",
        foto: `${this.servidor.arquivos}/uploads/nautilus.jpg`
    },
    imovel: {
        tipos: [
            { "codigo": "cvp", "mensagem": "Casa em via pública" },
            { "codigo": "apt", "mensagem": "Apartamento" },
            { "codigo": "lft", "mensagem": "Loft" },
            { "codigo": "chc", "mensagem": "Chácara" },
            { "codigo": "sto", "mensagem": "Sítio" },
            { "codigo": "fzd", "mensagem": "Fazenda" },
            { "codigo": "csp", "mensagem": "Casa de praia" },
            { "codigo": "csc", "mensagem": "Casa em condomínio" },
            { "codigo": "bgl", "mensagem": "Bangalô" },
            { "codigo": "trn", "mensagem": "Terreno" },
            { "codigo": "rrl", "mensagem": "Rural" }].sort((a, b) => (a.mensagem > b.mensagem) ? 1 : -1),
        intencoes: [
            { "codigo": "ven", "mensagem": "Venda" },
            { "codigo": "tro", "mensagem": "Troca" },
            { "codigo": "loc", "mensagem": "Aluguel" },
            { "codigo": "tem", "mensagem": "Temporada" }].sort((a, b) => (a.mensagem > b.mensagem) ? 1 : -1)
    }

}

module.exports.mensagens = (codigo) => {
    switch (codigo) {
        // erros
        case "Er0": mensagem = "Um erro ocorreu durante o processamento dos dados."; break;
        case "Er1": mensagem = "Um erro ocorreu durante a tentativa de login."; break;
        case "Er2": mensagem = "Um erro ocorreu durante o cadastro de sua conta."; break;
        case "Er3": mensagem = "Um erro ocorreu durante a finalização da edição de sua conta."; break;
        case "Er4": mensagem = "Um erro ocorreu durante a finalização do cadastro do imóvel."; break;
        case "Er5": mensagem = "Um erro ocorreu durante a finalização da edição do imóvel."; break;

        // dados
        case "Da0": mensagem = "Nenhum dado foi encontrado."; break;
        case "Da1": mensagem = "Todos os dados foram encontrados."; break;

        // login
        case "Lo0": mensagem = `Esse e-mail não está cadastrado no ${this.servidor.titulo}.`; break;
        case "Lo1": mensagem = "Login realizado com sucesso. Olá! 🤙"; break;
        case "Lo2": mensagem = "Logout realizado com sucesso. Até mais! 👋"; break;
        case "Lo3": mensagem = "Por gentileza, faça o login novamente."; break;
        case "Lo4": mensagem = "A senha inserida está incorreta. 🔐"; break;

        // cadastro
        case "Ca0": mensagem = "O cadastro não pôde ser realizado."; break;
        case "Ca1": mensagem = "Seu cadastro acaba de ser realizado. Seja bem-vindo(a)!"; break;
        case "Ca2": mensagem = "O e-mail inserido já está sendo utilizado no momento."; break;
        case "Ca3": mensagem = "O CPF inserido já está sendo utilizado no momento."; break;
        case "Ca4": mensagem = "O imóvel foi cadastrado com sucesso!"; break;
        case "Ca5": mensagem = "Não foi possível cadastrar a solicitação de análise."; break;
        case "Ca6": mensagem = "A solicitação de análise foi cadastrada com sucesso."; break;
        case "Ca7": mensagem = "A solicitação de análise não pôde ser cadastrada."; break;
        case "Ca8": mensagem = "É necessário selecionar ao menos uma imobiliária para a análise."; break;
        case "Ca9": mensagem = "O cadastro da sua imobiliária foi realizado com sucesso! Faça login para começar."; break;
        case "Ca10": mensagem = "O cadastro do local de chaves foi realizado."; break;
        case "Ca11": mensagem = "O local de chaves já foi cadastrado anteriormente."; break;
        case "Ca12": mensagem = "O cadastro do local de chaves não pôde ser realizado."; break;
        case "Ca13": mensagem = "O cadastro da proposta foi realizado."; break;
        case "Ca14": mensagem = "Não foi possível realizar o cadastro da proposta."; break;
        case "Ca15": mensagem = "A proposta foi excluída com sucesso."; break;
        case "Ca16": mensagem = "A proposta não pôde ser excluída."; break;
        case "Ca17": mensagem = "A proposta foi atualizada com sucesso."; break;
        case "Ca18": mensagem = "A proposta não pôde ser atualizada."; break;
        case "Ca19": mensagem = "Nenhuma imobiliária/agência foi selecionada para a proposta."; break;

        // edição
        case "Ed0": mensagem = "Não foi possível editar as informações."; break;
        case "Ed1": mensagem = "A edição foi realizada com sucesso."; break;
        case "Ed2": mensagem = "A foto de perfil foi alterada com sucesso."; break;
        case "Ed3": mensagem = "As fotos do imóvel foram enviadas com sucesso."; break;
        case "Ed4": mensagem = "A logo foi alterada com sucesso."; break;
        case "Ed5": mensagem = "Não foi possível editar a foto de perfil."; break;
        case "Ed6": mensagem = "Não foi possível editar as fotos do imóvel."; break;
        case "Ed7": mensagem = "Não foi possível editar a logo."; break;

        // recuperação de acesso
        case "Re0": mensagem = "Não foi possível encontrar uma conta com esse e-mail."; break;
        case "Re1": mensagem = "Um link foi enviado para o e-mail indicado com o link para a redefinição de senha."; break;
        case "Re2": mensagem = "Esse link para recuperação de senha não é válido, está expirado ou não existe."; break;
        case "Re3": mensagem = "Sua senha foi redefinida com sucesso."; break;
        case "Re4": mensagem = "Link válido."; break;
        case "Re5": mensagem = "Sua senha não pôde ser redefinida."; break;

        case "Ag0": mensagem = "Não foi possível agendar a visita."; break;
        case "Ag1": mensagem = "A visita foi agendada com sucesso."; break;

        // sem mensagem
        default: mensagem = "Ops. Um erro desconhecido ocorreu."; break;
    }
    return mensagem
}

module.exports.intencoes = (codigo) => {
    switch (codigo) {
        // mensagens
        case "ven": mensagem = "Venda"; break;
        case "tro": mensagem = "Troca"; break;
        case "loc": mensagem = "Aluguel"; break;
        case "tem": mensagem = "Temporada"; break;

        // sem mensagem
        default: mensagem = "Intenção inválida"; break;
    }
    return mensagem
}

module.exports.imoveis = (codigo) => {
    switch (codigo) {
        // mensagens
        case "cvp": mensagem = "Casa em via pública"; break;
        case "apt": mensagem = "Apartamento"; break;
        case "lft": mensagem = "Loft"; break;
        case "chc": mensagem = "Chácara"; break;
        case "sto": mensagem = "Sítio"; break;
        case "fzd": mensagem = "Fazenda"; break;
        case "csp": mensagem = "Casa de praia"; break;
        case "csc": mensagem = "Casa em condomínio"; break;
        case "bgl": mensagem = "Bangalô"; break;
        case "trn": mensagem = "Terreno"; break;
        case "rrl": mensagem = "Rural"; break;

        // sem mensagem
        default: mensagem = "Categoria inválida"; break;
    }
    return mensagem
}

module.exports.dormir = function (tempo) {
    return new Promise((resolve) => setTimeout(resolve, tempo))
}

module.exports.verificartoken = (token) => {
    return (this.aplicativo.token === token) ? true : false
}

module.exports.gerarlinkrecuperacaosenha = () => {
    return `${random("A0a", 9)}-${random("A0", 2)}`
}

module.exports.agora = (formato) => {
    return (formato === "completo") ? moment().format("DD/MM/YYYY-HH:mm:ss") : (formato === "data") ? moment().format("DD/MM/YYYY") : (formato === "hora") ? moment().format("HH:mm:ss") : (formato === "ms") ? { milissegundos: String(new Date(`${moment().format("YYYY")}-${moment().format("MM")}-${moment().format("DD")}T${moment().format("HH:mm:ss")}-0300`).getTime()) } : (formato === "debug") ? moment().format("(DD-MM-YYYY)-(HH)-(mm)-(ss)") : null
}

module.exports.numeros = (string) => {
    return (string.match(/\d/g) != null && (typeof string != "number")) ? string.match(/\d/g).join("") : null
}

module.exports.data = (string) => {
    string = String(string).trim()
    if (string.includes("Ms+") || string.includes("Ms-")) {
        return (string.includes("Ms+")) ? { data: moment(`${Number(string.slice(3))}`, "x").format("DD/MM/YYYY-HH:mm:ss") } : (string.includes("Ms-")) ? { milissegundos: new Date(`${string.slice(9, 13)}-${string.slice(6, 8)}-${string.slice(3, 5)}T${string.slice(14, 19)}:00-0300`).getTime() } : null
    }

    descobrirmes = (mes) => {
        switch (mes) {
            case "01": mesformatado = "janeiro"; break; case "02": mesformatado = "fevereiro"; break; case "03": mesformatado = "março"; break; case "04": mesformatado = "abril"; break; case "05": mesformatado = "maio"; break; case "06": mesformatado = "junho"; break; case "07": mesformatado = "julho"; break; case "08": mesformatado = "agosto"; break; case "09": mesformatado = "setembro"; break; case "10": mesformatado = "outubro"; break; case "11": mesformatado = "novembro"; break; case "12": mesformatado = "dezembro"; break
        }
        return {
            mesformatado: mesformatado
        }
    }

    descobrirdiasemana = (ano, mes, dia) => {
        dia = (moment(ano + "-" + mes + "-" + dia)).day()
        switch (dia) {
            case 0: dianominal = "domingo"; break; case 1: dianominal = "segunda-feira"; break; case 2: dianominal = "terça-feira"; break; case 3: dianominal = "quarta-feira"; break; case 4: dianominal = "quinta-feira"; break; case 5: dianominal = "sexta-feira"; break; case 6: dianominal = "sábado"; break;
        }
        return {
            dianominal: dianominal
        }
    }

    possuidata = ((string.split("-")) && string.split("-").length === 2 && (string.includes("/") === true)) ? string.split("-")[0] : (string.split("-").length === 1 && (string.includes(":") === false) && (string.includes("/") === true)) ? string.split("-")[0] : false
    possuihorario = ((string.includes("-") === true ? string.split("-")[1] : false))
    parecehorario = (string.includes(":") === true) ? string.split(":") : false
    data = (possuidata != false) ? possuidata : "00/00/0000"
    horario = (possuihorario != false) ? possuihorario : "00:00:00"
    horas = (possuihorario != false) ? (possuihorario.split(":")[0]) : (parecehorario != false) ? parecehorario[0] : "00"
    minutos = (possuihorario != false) ? (possuihorario.split(":")[1]) : (parecehorario != false) ? parecehorario[1] : "00"
    segundos = (string.split(":")[2] != undefined || (string.split(":")[2] != null)) ? (string.split(":")[2]) : (parecehorario != false && parecehorario[2] != undefined) ? parecehorario[2] : "00"
    dia = (possuidata != false) ? String(data.slice(0, 2)) : "00"
    mes = (possuidata != false) ? String(data.slice(3, 5)) : "00"
    ano = (possuidata != false) ? String(data.slice(6, 10)) : "0000"
    mesformatado = (mes != "00") ? descobrirmes(mes)["mesformatado"] : "indefinido"
    milissegundos = (possuidata != false && possuihorario != false) ? new Date(ano + "-" + mes + "-" + dia + "T" + horas + ":" + minutos + ":" + segundos + "-0300").getTime() : null
    diasemana = (possuidata != false) ? descobrirdiasemana(ano, mes, dia)["dianominal"] : null

    return {
        data: data,
        horario: horario,
        dia: dia,
        mesnominal: mesformatado,
        mesnumeral: mes,
        ano: ano,
        diasemana: diasemana,
        horas: horas,
        minutos: minutos,
        segundos: segundos,
        milissegundos: milissegundos
    }
}

module.exports.estado = (item) => {
    if (item.length === 2) {
        switch (String(item).trim()) {
            case "AC": estado = "Acre"; break; case "AL": estado = "Alagoas"; break; case "AP": estado = "Amapá"; break; case "AM": estado = "Amazonas"; break; case "BA": estado = "Bahia"; break; case "CE": estado = "Ceará"; break; case "DF": estado = "Distrito Federal"; break; case "ES": estado = "Espírito Santo"; break; case "GO": estado = "Goiás"; break; case "MA": estado = "Maranhão"; break; case "MT": estado = "Mato Grosso"; break; case "MS": estado = "Mato Grosso do Sul"; break; case "MG": estado = "Minas Gerais"; break; case "PA": estado = "Pará"; break; case "PB": estado = "Paraíba"; break; case "PR": estado = "Paraná"; break; case "PE": estado = "Pernambuco"; break; case "PI": estado = "Piauí"; break; case "RJ": estado = "Rio de Janeiro"; break; case "RN": estado = "Rio Grande do Norte"; break; case "RS": estado = "Rio Grande do Sul"; break; case "RO": estado = "Rondônia"; break; case "RR": estado = "Roraima"; break; case "SC": estado = "Santa Catarina"; break; case "SP": estado = "São Paulo"; break; case "SE": estado = "Sergipe"; break; case "TO": estado = "Tocantins"; break;
        }
    }
    else {
        switch (String(item).trim()) {
            case "Acre": estado = "AC"; break; case "Alagoas": estado = "AL"; break; case "Amapá": estado = "AP"; break; case "Amazonas": estado = "AM"; break; case "Bahia": estado = "BA"; break; case "Ceará": estado = "CE"; break; case "Distrito Federal": estado = "DF"; break; case "Espírito Santo": estado = "ES"; break; case "Goiás": estado = "GO"; break; case "Maranhão": estado = "MA"; break; case "Mato Grosso": estado = "MT"; break; case "Mato Grosso do Sul": estado = "MS"; break; case "Minas Gerais": estado = "MG"; break; case "Pará": estado = "PA"; break; case "Paraíba": estado = "PB"; break; case "Paraná": estado = "PR"; break; case "Pernambuco": estado = "PE"; break; case "Piauí": estado = "PI"; break; case "Rio de Janeiro": estado = "RJ"; break; case "Rio Grande do Norte": estado = "RN"; break; case "Rio Grande do Sul": estado = "RS"; break; case "Rondônia": estado = "RO"; break; case "Roraima": estado = "RR"; break; case "Santa Catarina": estado = "SC"; break; case "São Paulo": estado = "SP"; break; case "Sergipe": estado = "SE"; break; case "Tocantins": estado = "TO"; break;
        }
    }
    return estado
}

module.exports.formatacao = (texto, tipo) => {
    let string = String(texto)
    switch (tipo) {
        case "telefone": return `(${string.slice(0, 2)}) ${(String(string)).slice(2, 6)}-${(String(string)).slice(6, 12)}`; break;
        case "celular": return `(${string.slice(0, 2)}) ${String(string)[2]} ${(String(string)).slice(3, 7)}-${(String(string)).slice(7, 12)}`; break;
        case "cep": return `${(string).slice(0, 2)}.${(string).slice(2, 5)}-${(string).slice(5, 9)}`; break;
        case "cnpj": return `${(string).slice(0, 2)}.${(string).slice(2, 5)}.${(string).slice(5, 8)}/${(string).slice(8, 12)}-${(string).slice(12, 14)}`; break;
        case "preco": return `R$ ${(Number(string).toFixed(2)).replace(".", ",")}`; break;
        case "k": return Math.abs(Number(string)) > 999 ? Math.sign(Number(string)) * ((Math.abs(Number(string)) / 1000).toFixed(1)) + "k" : Math.sign(Number(string)) * Math.abs(Number(string)); break;
        default: return "zero";
    }
}

module.exports.conversao_valores = (valor, tipo) => {
    if (tipo === "dinheiro") {
        x = 0;
        if (valor < 0) {
            valor = Math.abs(valor)
            x = 1
        }
        if (isNaN(valor)) valor = "0"
        centavos = Math.floor((valor * 100 + 0.5) % 100)
        valor = Math.floor((valor * 100 + 0.5) / 100).toString()
        if (centavos < 10) centavos = "0" + centavos
        for (var i = 0; i < Math.floor((valor.length - (1 + i)) / 3); i++) {
            valor = valor.substring(0, valor.length - (4 * i + 3)) + "." + valor.substring(valor.length - (4 * i + 3))
        }
        resultado = valor + "," + centavos
        if (x == 1) resultado = " - " + resultado; return "R$ " + resultado
    }
    if (tipo === "plano") {
        valor = valor.replace("R$", "")
        valor = valor.replace(".", "")
        valor = valor.replace(",", ".")
        return parseFloat(valor)
    }
    else {
        return null
    }
}

module.exports.fuse = {
    shouldSort: true,
    includeScore: true,
    tokenize: true,
    matchAllTokens: true,
    threshold: 0.1,
    location: 0,
    distance: 100,
    maxPatternLength: 64,
    minMatchCharLength: 1
}