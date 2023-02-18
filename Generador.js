const conversion = Math.PI / 180;
const circunferencia = 2 * Math.PI;
const fps = 30;
const divisiones = 12;
//const Hora_Inicial=performance.now();
const diagonalIni = 1074;

const Lienzo = document.getElementById("idLienzo");
const pincel = Lienzo.getContext("2d");

var medidaTxt = [];
const fuente = "bold 14px Serif";
pincel.font="bold 14px Serif";
const texto = ["Amplitud ", "Periodo ", "Desfase ", "Formas de la onda", "Opciones",
    "A", "T", "\u03C8", "Restablecer escala", "Aumentar escala", "Disminuir escala", "Gráfica resultante"];

for (let i = 0; i < texto.length; i++) {
    medidaTxt[i] = (pincel.measureText(texto[i]).width);
}

const formas=["Por defecto","Senosoidal","Triangular","Cuadrada","Forma de sierra","Paquete de ondas"];
const detalles=["Crestas y valles","Elongación","Máximos y mínimos","Puntos nodales","Amplitud","Período","Frecuencia","Velocidad angular"];
const Resultante=["Posición vs tiempo","Velocidad vs tiempo","Aceleración vs tiempo","Velocidad y aceleración  ","Posición y velocidad","Posición y aceleración","Y vs V vs A"]
const CoefLineas = [1, 0.75, 0.5, 0.25, 0, -0.25, -0.5, -0.75, -1];
var NoCurvas = 12;
const NoDatos = 4;
const anchoLienzoInicial = 1824;//1297;//980;//1824;
const alturaLienzoInicial = 924;//627;//480;//924;
const Porcent = 105;
const scool1 = alturaLienzoInicial / Porcent;
//const scool2=anchoLienzoInicial/300;

var AmplitudMax = alturaLienzoInicial / scool1;
var PeriodoMax = 10;
var DesfaseMax = 90;
var Txycoeficiente=1.0;
var colorEscala1="white",colorEscala2="white",colorEscala3="white";

var CxyDesplazamiento = { x: 0, y: 0 }, CxyVelocidad = { x: 0, y: 0 }, CxyAceleracion = { x: 0, y: 0 }, CxyMenu = { x: 0, y: 0 };

const desplazamientoTrue = new Image();
desplazamientoTrue.src = "A.svg";
desplazamientoTrue.onload = function () {
}

const desplazamientoFalse = new Image();
desplazamientoFalse.src = "Afalse.svg";
desplazamientoFalse.onload = function () {
}
const velocidadTrue = new Image();
velocidadTrue.src = "T.svg";
velocidadTrue.onload = function () {
}

const velocidadFalse = new Image();
velocidadFalse.src = "Tfalse.svg";
velocidadFalse.onload = function () {
}

const aceleracionTrue = new Image();
aceleracionTrue.src = "d.svg";
aceleracionTrue.onload = function () {
}

const aceleracionFalse = new Image();
aceleracionFalse.src = "dfalse.svg";
aceleracionFalse.onload = function () {
}
//Inicializaciones para graficar y dibujar curvas
const espaciado = 5;
const PosX1 = (4 * espaciado);

var eje1_Y, eje2_Y;//ordenada=[];
var Ancho;
var over;
var InicioBarraHerramientas;
var Margen;
var CentroControl;
var factorX, factorY;

var AnimacionBsSalida = 0;
var seccion;//=Math.floor(Lienzo.height/12);
var Tclick = false;
var contador = 0;

var continuar = true;
var incremento = PosX1;
var BarraSuperiorVisible = true;
var BarraInferiorVisible = false;
var AnimacionBs = 0;
var vSJAmplitud = true, vSJPeriodo = false, vSJDesfase = false;
var curvaSeleccionada = false;
var curvaClick = [];
var Td = [];
var pMenuFormas=false,pMenu2=false,pMenu3=false, pFrecuencia,pVelocidadA;
var pdetalles="",pSobreXY=false,pMovimiento=false,pVdC=[true,false,false];
var OpcionesPeriodo;

var boton1 = true;
var parametro = [1.5, 5, 0, "green", 0, 5, 0, "red", 0,5, 0, "blue", 0, 5, 0, "#D35400", 0, 5, 0, "chartreuse", 0, 5, 0, "darkmagenta", 0, 5, 0, "darkred",
                 0, 5, 0, "lightgreen", 0, 5, 0, "khaki", 0, 5, 0, "lightsalmon", 0, 5, 0, "magenta", 0, 5, 0, "orange"];
var rParametro=[];
var rNoCurvas;

const EscalaReal=2;
const FcToPixeles=Porcent/2;
const FcToGr=2.0/1.5
for (let i = 0; i < NoCurvas; i++) {
    curvaClick[i] = false;
    Td[i] = 0;
    parametro[NoDatos*i]=parametro[NoDatos*i]*FcToPixeles;
}

const LineaBase = 65;//*factorY
const AnchoP = 25;//*factorY

const FactorEscala = (LineaBase - AnchoP);
var escala = [FactorEscala / AmplitudMax,
PeriodoMax / FactorEscala, DesfaseMax / FactorEscala];

var CoefAmplitud=1;
var RatonAbajo = false;
var CxyRaton;//Coordenadas del raton;
var CxyDesplazamiento = { x: 0, y: 0 }, CxyVelocidad = { x: 0, y: 0 }, CxyAceleracion = { x: 0, y: 0 }, CxyMenu = { x: 0, y: 0 };
var CxyMenu2 = { x: 20, y: 20 };
var CxyMenu3 = { x: 20, y: 20 };
var CxyLogo = { x: 0, y: 0 };

var sobre = [false, false, false, false];
const Title = ["A", "T", "f", "w"];
const SubTitle = [" cm", " s", " hz", " rad/s"];

var XRect = [], YRect = [];
var DesY1 = [];
var Altura = [];
var PeriodoXY=[],PeriodoVal=[true,false,false];

function onRoundRect(ctx, x, y, width, height, radius, txt, color1, color2) {
    ctx.strokeStyle = color1;
    ctx.fillStyle = color2;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y + radius);
    ctx.lineTo(x, y + height - radius);
    ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
    ctx.lineTo(x + width - radius, y + height);
    ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
    ctx.lineTo(x + width, y + radius);
    ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
    ctx.lineTo(x + radius, y);
    ctx.quadraticCurveTo(x, y, x, y + radius);
    ctx.fill();

    if (txt != "") {
        ctx.fillStyle = "white";
        ctx.font = fuente;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(txt, x + width / 2, y + height / 2);
    }
    ctx.stroke();
    ctx.closePath();
}

function onRoundRectXY(ctx, x, y, width, height, radius, txt, color1, color2,color3) {
    ctx.strokeStyle = color1;
    ctx.fillStyle = color2;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y + radius);
    ctx.lineTo(x, y + height - radius);
    ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
    ctx.lineTo(x + width - radius, y + height);
    ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
    ctx.lineTo(x + width, y + radius);
    ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
    ctx.lineTo(x + radius, y);
    ctx.quadraticCurveTo(x, y, x, y + radius);
    ctx.fill();

    if (txt != "") {
        ctx.fillStyle = color3;
        ctx.font = "bold 24px Serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(txt, x + width / 2, y + height / 2);
    }
    ctx.stroke();
    ctx.closePath();
}
function onRedimensionar() {
    Lienzo.width = (0.95 * window.innerWidth);
    Lienzo.height = (0.95 * window.innerHeight);

    factorX = Lienzo.width / anchoLienzoInicial;
    factorY = Lienzo.height / alturaLienzoInicial;

    let Am = AmplitudMax;
    AmplitudMax = Lienzo.height / scool1;
    let Coef=AmplitudMax / Am;
    CoefAmplitud *=Coef;

    escala = [FactorEscala / AmplitudMax,
    PeriodoMax / FactorEscala, DesfaseMax / FactorEscala];

    for (let i = 0; i < NoCurvas; ++i) {
        parametro[NoDatos * i] = (parametro[NoDatos * i] * Coef);

    }

    eje1_Y = Lienzo.height / 3;
    eje2_Y = 2 * Lienzo.height / 3 + 75 * factorY;

    //let xPos=0.07*Lienzo.width;
    //PeriodoXY=[xPos-36,xPos-12,xPos+12,xPos+36];
    PeriodoXY=[Lienzo.width/2-36,Lienzo.width/2-12,Lienzo.width/2+12,Lienzo.width/2+36];
}

window.addEventListener("resize", onRedimensionar);

Lienzo.addEventListener("mousedown", function (evt) {
    RatonAbajo = true;
    if(contador==70){
        colorEscala1="gray";
        colorEscala2="white";
        colorEscala3="white";
    }
    else{
        if(contador==71){
            colorEscala1="white";
            colorEscala2="gray";
            colorEscala3="white";
        }
        else{
            if(contador==72){
                colorEscala1="white";
                colorEscala2="white";
                colorEscala3="gray";
            }
        }
    }
}, false);

Lienzo.addEventListener("mouseup", function (evt) {
    RatonAbajo = false;
    colorEscala1="white";
    colorEscala2="white";
    colorEscala3="white";
}, false);

Lienzo.addEventListener("click", function () {
    if (contador < 7) {
        switch (contador) {
            case 0:
                pMenuFormas=false;
                pMenu2=false;
                pMenu3=false;
                if(pSobreXY){
                    continuar=continuar?false:true;
                }
                break
            case 1:
                if (!vSJAmplitud) {
                    vSJAmplitud = true;
                    vSJPeriodo = false;
                    vSJDesfase = false;
                }

                break;
            case 2:
                if (!vSJPeriodo) {
                    vSJAmplitud = false;
                    vSJPeriodo = true;
                    vSJDesfase = false;
                }
                break;
            case 3:
                if (!vSJDesfase) {
                    vSJAmplitud = false;
                    vSJPeriodo = false;
                    vSJDesfase = true;
                }
                break;
            case 4:
                if(pMenuFormas){
                    pMenuFormas=false;
                }
                else{
                    pMenuFormas=true;
                    rNoCurvas=NoCurvas;
                    rParametro=parametro.slice();
                }
                break;
            case 5:
                pMenu2=pMenu2?false:true;
                break;
            case 6:
                pMenu3=pMenu3?false:true;
                break;
        }
    }
    else {
        if (!(contador < 20)&&(contador<32)) {
            curvaClick[contador - 20] = curvaClick[contador - 20] ? false : true;
            curvaSeleccionada = false;
            continuar=true;
            for (let i = 0; i < NoCurvas; i++) {
                if (curvaClick[i]) {
                    curvaSeleccionada = true;
                }
            }
            if(!curvaSeleccionada){
                //pMenuFormas=true;
                pdetalles="";
                pMovimiento=false;
                pFrecuencia=false;
                pVelocidadA=false;
                pVdC=[true,false,false]
                               
            }
            else{
                //pMenuFormas=false;
                pMovimiento=true;
                incremento=0;
                //pVdC=[false,true,true]; 
            }    
        }
        else {
            if(!(contador < 32)&&(contador<40)){
                switch(contador-32){
                    case 0:
                        onFormaDefault();
                        break;
                    case 1:
                        onFormaSenoidal();
                        break;
                    case 2:
                        onFormaTriangulo();
                        break;
                    case 3:
                        onFormaCuadrada();
                        break;
                    case 4:
                        onFormaSierra();
                        break;
                    case 5:
                        onFormaPaquete();
                        break;
                }
                pMenuFormas=false;
                contador=0;
            }
            else{
                if(!(contador < 40)&&(contador<50)){
                    incremento=PosX1;
                    continuar=true;
                    pMenu2=false;
                    pMenu3=false;
                    pFrecuencia=false;
                    pVelocidadA=false;
                    PeriodoVal=[true,false,false];
                    switch(contador-40){
                        case 0:
                            pdetalles="pCrestas";
                            break;
                        case 1:
                            pdetalles="pElongacion";
                            break;
                        case 2:
                            pdetalles="pMaxMin";
                            break;
                        case 3:
                            pdetalles="pNodos";
                            break;
                        case 4:
                            pdetalles="pAmplitud";
                            break;
                        case 5:
                            pdetalles="pPeriodo";
                            OpcionesPeriodo=1;
                            break;
                        case 6:
                            pdetalles="pFrecuencia";
                            break;
                        case 7:
                            pdetalles="pVelocidad";
                            break;
                    }
                }
                else{
                    if(!(contador < 50)&&(contador<54)){
                        incremento=0;
                        continuar=true;
                        PeriodoVal=[false,false,false,false];
                        PeriodoVal[contador-50]=true;
                    }
                    else{
                        if(!(contador < 60)&&(contador<67)){
                            incremento=0;
                            continuar=true;
                            pMenu3=false;
                            switch(contador-60){
                                case 0:
                                    pVdC=[true,false,false];
                                    break;
                                case 1:
                                    pVdC=[false,true,false];
                                    break;
                                case 2:
                                    pVdC=[false,false,true];
                                    break;
                                case 3:
                                    pVdC=[false,true,true];
                                    break;
                                case 4:
                                    pVdC=[true,true,false];
                                    break;
                                case 5:
                                    pVdC=[true,false,true];
                                    break;
                                case 6:
                                    pVdC=[true,true,true];
                                    break;
                            }
                        }
                        else{
                            if(contador==70){
                                if(Txycoeficiente>0.05){
                                    Txycoeficiente -= 0.05;
                                }
                            }
                            else{
                                if(contador==71){
                                    Txycoeficiente +=0.05;
                                }
                                else{
                                    if(contador==72){
                                        Txycoeficiente =1;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}, false);

Lienzo.addEventListener("mousemove", function (evt) {
    contador = 0;
    if (onArea(Lienzo, evt, CxyDesplazamiento.x, CxyDesplazamiento.y, seccion / 2)) {
        contador = 1;
    }
    else {
        if (onArea(Lienzo, evt, CxyVelocidad.x, CxyVelocidad.y, seccion / 2)) {
            contador = 2;
        }
        else {
            if (onArea(Lienzo, evt, CxyAceleracion.x, CxyAceleracion.y, seccion / 2)) {
                contador = 3;
            }
            else {
                if (onArea(Lienzo, evt, CxyMenu.x, CxyMenu.y, 3 * over)){;// && !curvaSeleccionada) {
                    contador=(pMenu2 || pMenu3)?0:4;
                }
                else {
                    if (onArea(Lienzo, evt, CxyMenu2.x, CxyMenu2.y, 3 * over)) {
                        contador=(pMenu3)?0:5;
                    }
                    else {
                        if (onArea(Lienzo, evt, CxyMenu3.x, CxyMenu3.y, 3 * over)) {
                            contador=(pMenu2)?0:6;
                        }
                        else {
                            if(pMenuFormas){
                                let A=CxyMenu.x+10;
                                let B=CxyMenu.y+40;
                                for(let i=0;i<formas.length;++i){
                                    if(onAreaXY(Lienzo,evt,A+pincel.measureText(formas[i]).width/2,B+25*i,pincel.measureText(formas[i]).width/2,7)){
                                        contador=32+i;
                                        break;
                                    }
                                }
                            }
                            else{
                                pSobreXY= onAreaXY(Lienzo, evt, Lienzo.width/2, eje1_Y,Lienzo.width/2 ,AmplitudMax)?true:false;
                                if(pMenu2){
                                    let A=CxyMenu2.x-140;
                                    let B=CxyMenu2.y+40;
                                    for(let i=0;i<detalles.length;++i){
                                        if(onAreaXY(Lienzo,evt,A+pincel.measureText(detalles[i]).width/2,B+25*i,pincel.measureText(detalles[i]).width/2,7)){
                                            contador=40+i;
                                            break;
                                        }
                                    }
                                }
                                else{
                                    if(pMenu3){
                                        let A=CxyMenu3.x-140;
                                        let B=CxyMenu3.y+40;
                                        for(let i=0;i<Resultante.length;++i){
                                            if(onAreaXY(Lienzo,evt,A+pincel.measureText(Resultante[i]).width/2,B+25*i,pincel.measureText(Resultante[i]).width/2,7)){
                                                contador=60+i;
                                                break;
                                            }
                                        }
                                    }
                                    else{
                                        for (let i = 0; i < NoCurvas; ++i) {
                                            if (onArea(Lienzo, evt, XRect[i], DesY1[i], 2*over)) {
                                                if (!curvaSeleccionada || curvaClick[i]) {
                                                    contador = 7 + i;
                                                    if (RatonAbajo) {
                                                        Altura[i] = LineaBase - CxyRaton.y;//reducido y sin escalar
                                                        if (vSJAmplitud) {
                                                            Altura[i] = Altura[i] <= -FactorEscala ? -FactorEscala : (Altura[i] > FactorEscala ? FactorEscala : Altura[i]);
                                                            parametro[NoDatos * i] = (Altura[i] / escala[0]);
                                                        }
                                                        else {
                                                            if (vSJPeriodo) {
                                                                let periodo=escala[1] *Altura[i];
                                                                periodo = periodo < 1 ? 1 : (Altura[i] > FactorEscala ? escala[1]*FactorEscala : escala[1]*Altura[i]);
                                                                parametro[NoDatos * i + 1] = Math.round(periodo) ;
                                                            }
                                                            else {
                                                                if (vSJDesfase) {
                                                                    Altura[i] = Altura[i] <= -FactorEscala ? -FactorEscala : (Altura[i] > FactorEscala ? FactorEscala : Altura[i]);
                                                                    parametro[NoDatos * i + 2] = (escala[2] * Altura[i]);
                                                                }
                                                            }
                                                            Td[i] = parametro[NoDatos * i + 2] * conversion * parametro[NoDatos * i + 1] / (2 * Math.PI);
                                                        }
                                                        break;
                                                    }
                                                }
                                            }
                                            else {
                                                if (onArea(Lienzo, evt, XRect[i], AnchoP / 2, over)) {
                                                    contador = 20 + i;
                                                    break;
                                                }
                                                else{
                                                }
                                            }
                                        }
                                    }
                                    if(pdetalles=="pPeriodo"){
                                        let y=eje1_Y+AmplitudMax+13;
                                        for(let i=0;i<4;i++){
                                            if(!PeriodoVal[i]){
                                                if (onArea(Lienzo, evt, PeriodoXY[i],y , over)){
                                                    contador=50+i;
                                                }
                                            }
                                        }
                                    }
                                    //else{
                                    let PosX2 = Lienzo.width - PosX1;
                                    if(onArea(Lienzo,evt,PosX2-40,eje2_Y+AmplitudMax+20,over)){
                                        contador=70;
                                    }
                                    else{
                                        if(onArea(Lienzo,evt,PosX2-10,eje2_Y+AmplitudMax+20,over)){
                                            contador=71;
                                        }
                                        else{
                                            if(onArea(Lienzo,evt,PosX2-70,eje2_Y+AmplitudMax+20,over)){
                                                contador=72;
                                            }
                                        }
                                    }
                                    //}
                                }
                            }    
                        }
                    }
                }
            }
        }
    }
    Lienzo.style.cursor = contador > 0? "pointer":"default";
}, false);

Lienzo.addEventListener("mouseout", function (evt) {
    //RatonAbajoA=false;
    Lienzo.style.cursor = "default";
    contador = 0;
}, false);

function onArea(Lienzo, evt, Cx, Cy, espacio) {
    CxyRaton = oMousePos(Lienzo, evt);
    return ((CxyRaton.x > (Cx - espacio) && CxyRaton.x < (Cx + espacio))
        && (CxyRaton.y > (Cy - espacio) && CxyRaton.y < (Cy + espacio))
        ? true : false);
}

function onAreaXY(Lienzo, evt, Cx, Cy, espacioX,espacioY) {
    CxyRaton = oMousePos(Lienzo, evt);
    return ((CxyRaton.x > (Cx - espacioX) && CxyRaton.x < (Cx + espacioX))
        && (CxyRaton.y > (Cy - espacioY) && CxyRaton.y < (Cy + espacioY))
        ? true : false);
}

function oMousePos(pLienzo, evt) {
    var rect = pLienzo.getBoundingClientRect();
    return { // devuelve un objeto
        x: Math.round(evt.clientX - rect.left),
        y: Math.round(evt.clientY - rect.top)
    }
}
function onBarraSuperior(Base) {
    for (let i = 0; i < NoCurvas; i++) {
        if (vSJAmplitud) {
            Altura[i] = parametro[NoDatos * i] * escala[0];
        }
        else {
            if (vSJPeriodo) {
                Altura[i] = parametro[NoDatos * i + 1] / escala[1];
            }
            else {
                if (vSJDesfase) {
                    Altura[i] = parametro[NoDatos * i + 2] / escala[2];
                }

            }
        }
    }

    Ancho = (60 * factorX);
    Margen = Ancho / 2;//(50*factorX);
    CentroControl = ((NoCurvas * Ancho + (NoCurvas - 1) * Margen) / 2);
    AnchoGrafico = (Lienzo.width / 2);
    InicioBarraHerramientas = AnchoGrafico - CentroControl;

    XRect = [InicioBarraHerramientas + Ancho, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 1; i < NoCurvas; ++i) {
        XRect[i] = XRect[i - 1] + Ancho + Margen;
    }

    let Anchor = XRect[NoCurvas - 1] + Ancho - InicioBarraHerramientas;

    pincel.lineWidth = 3;
    pincel.beginPath();
    onRoundRect(pincel, InicioBarraHerramientas, AnchoP,
        Anchor, Base - AnchoP, 0, "", "black", "rgba(255,255,255,0.7)");
    pincel.closePath();

    pincel.lineWidth = 1;
    for (let i = 0; i < NoCurvas; ++i) {
        DesY1[i] = Base - Altura[i];
        let color1 = "gray", color2 = "white", color3 = "black", color4 = parametro[NoDatos * i + 3];
        
        pincel.beginPath();

        if (curvaClick[i]) {
            color2 = parametro[NoDatos * i + 3];

        }
        else {
            if (curvaSeleccionada) {
                color3 = "black";
                color4 = "rgba(255,255,255,0.7)";
            }

        }
        onRoundRect(pincel, XRect[i] - 5, Base - 60, 10, 10, 0, "", color1, color2);
        onRoundRect(pincel, XRect[i] - Ancho / 2, DesY1[i], Ancho, Altura[i], 0, "", color3, color4);
        pincel.closePath();

        if(vSJAmplitud){
            onRoundRect(pincel,XRect[i]-0.6*Ancho/2,DesY1[i] -4,0.6*Ancho,8,3,"","black","#FCF3CF");
        }
        else{
            if(vSJPeriodo){
                pincel.beginPath();
                pincel.fillStyle = "black";
                pincel.arc(XRect[i], DesY1[i], over, 0, circunferencia);
                pincel.stroke()
                pincel.fill();
                pincel.closePath();
            }
            else{
                onRoundRect(pincel,XRect[i]-0.6*Ancho/2,DesY1[i] -4,0.6*Ancho,8,3,"","black","#ABEBC6");
                pincel.beginPath();
                pincel.fillStyle = "red";
                pincel.arc(XRect[i], DesY1[i], over, 0, circunferencia);
                pincel.stroke()
                pincel.fill();
                pincel.closePath();

            }
        }
    }
}

function onBarraBotones() {
    seccion = (Lienzo.height / divisiones);
    AltoY = Lienzo.height/2+20;//(divisiones - 1) * seccion-35;
    seccion=0.7*seccion;
    let Margen = seccion / 2;
    let DtM=Lienzo.width/2;

    pincel.beginPath();
    CxyDesplazamiento = { x: DtM , y: AltoY };//+ seccion / 2 };
    if (vSJAmplitud) {
        pincel.drawImage(desplazamientoTrue, CxyDesplazamiento.x - seccion / 2, CxyDesplazamiento.y - seccion / 2, seccion,seccion);
    }
    else {
        pincel.drawImage(desplazamientoFalse, CxyDesplazamiento.x - seccion / 2 , CxyDesplazamiento.y - seccion / 2, seccion, seccion);
    }

    CxyVelocidad = { x: DtM - (Margen + seccion), y: AltoY};
    if (vSJPeriodo) {
        pincel.drawImage(velocidadTrue, CxyVelocidad.x - seccion / 2, CxyVelocidad.y - seccion / 2, seccion, seccion);
    }
    else {
        pincel.drawImage(velocidadFalse, CxyVelocidad.x - seccion / 2, CxyVelocidad.y - seccion / 2, seccion, seccion);
    }

    CxyAceleracion = { x: DtM + Margen + seccion, y: AltoY };
    if (vSJDesfase) {
        pincel.drawImage(aceleracionTrue, CxyAceleracion.x - seccion / 2, CxyAceleracion.y - seccion / 2, seccion, seccion);
    }
    else {
        pincel.drawImage(aceleracionFalse, CxyAceleracion.x - seccion / 2 , CxyAceleracion.y - seccion / 2 , seccion, seccion);
    }
    pincel.closePath();
}
function fDibujarCurvas() {
    var PosX2 = Lienzo.width - PosX1;
    let angular, frecuencia, j, JPdTa;
    let abscisa = [];
    let ordenada = [];
    let xFinal=[PosX1,PosX1,PosX1],yFinal=[]; 
        
    let t,EdTr,PaAc,DdTa,SdTa,MdTa, colorCurva,profundidad=eje1_Y+AmplitudMax+10,txt;
        
    for (let j = 0; j < NoCurvas; j++) {
        abscisa[j] = PosX1;
        ordenada[j] = eje1_Y - parametro[NoDatos * j] * Math.sin(parametro[NoDatos * j + 2] * conversion);
    }
    let A=(pMovimiento)?incremento:PosX2;
    for ( t = PosX1; t <= A; t += 3) {
        j = (t - PosX1) / fps;
        JPdTa = 0;
        PaAc=0;
        EdTr=0;
        for (let q = 0; q < NoCurvas; q++) {
            pincel.beginPath();
            if (parametro[NoDatos * q] != 0 && parametro[NoDatos * q+1] != 0) {
                frecuencia=1/parametro[NoDatos * q + 1];
                angular = 2 * Math.PI*frecuencia;// / parametro[NoDatos * q + 1];
                
                if ((contador > 6 && contador <20)) {
                    if (contador == q + 7 || pMenuFormas) {
                        pincel.lineWidth = 3;
                        colorCurva = parametro[NoDatos * q + 3];
                    }
                    else {
                        pincel.lineWidth = 0.7;
                        colorCurva = "silver";//parametro[NoDatos * q + 3];
                    }
                }
                else{
                    if(curvaSeleccionada){
                        if (curvaClick[q]) {
                            pincel.lineWidth = 3;
                            colorCurva = parametro[NoDatos * q + 3];
                        }
                        else {
                            pincel.lineWidth = 0.5;
                            colorCurva = parametro[NoDatos * q + 3];
                        }
                    }
                    else{
                        pincel.lineWidth = 2;
                        colorCurva = parametro[NoDatos * q + 3];
                    }
                }
                
                let desfase=angular * j + parametro[NoDatos * q + 2] * conversion;
                SdTa = (parametro[NoDatos * q] * Math.sin(desfase));
                DdTa = (parametro[NoDatos * q] * angular * Math.cos(desfase));
                MdTa = -(parametro[NoDatos * q] * Math.pow(angular,2) * Math.sin(desfase));
                JPdTa += SdTa;
                PaAc += DdTa;
                EdTr += MdTa;
                SdTa = (eje1_Y - SdTa);
                pincel.moveTo(abscisa[q], ordenada[q]);
                pincel.lineTo(t, SdTa);
                pincel.strokeStyle = colorCurva;
                abscisa[q] = t;
                ordenada[q] = SdTa;
            }
            pincel.stroke();
            pincel.closePath();
        }
        
        let pVr=[Txycoeficiente*JPdTa,Txycoeficiente*PaAc,Txycoeficiente*EdTr];
        let color=["#F39C12","indigo","#B22222"]
        pincel.lineWidth = 3;
        for(let i=0;i<3;i++){
            pincel.beginPath();
            if(pVdC[i]){
                pVr[i]=eje2_Y-pVr[i];
                if(t==PosX1){
                    yFinal[i]=pVr[i];
                }
                pincel.moveTo(xFinal[i], yFinal[i]);
                pincel.lineTo(t, pVr[i]);
                pincel.strokeStyle = color[i];
                xFinal[i] = t;
                yFinal[i] = pVr[i];
            }
            pincel.stroke();
            pincel.closePath();
        }
    }

    if(pFrecuencia || pVelocidadA){
        txt="";
        for (let q = 0; q < NoCurvas; q++) {
            frecuencia=1/parametro[NoDatos * q + 1];
            angular = 2 * Math.PI*frecuencia;
            if (curvaClick[q] && parametro[NoDatos * q+1] != 0){
                let A= pFrecuencia?"\u0192":"\u03C9";
                let B= pFrecuencia?"= "+frecuencia.toFixed(2)+" hz    ":"= "+angular.toFixed(2)+" rad/s    ";
                txt += A +(q+1) + B;
            }
        }
        pincel.font = "bold 16px Serif";
        pincel.fillStyle = "gray";
        pincel.textAlign = "center";
        pincel.textBaseline = "middle";
        pincel.fillText(txt, Lienzo.width/2, profundidad);
    }
}
function onMaximosMinimos() {
    //var PosX2 = Lienzo.width - PosX1;
    var fuente = "bold 12px Serif";

    for (let q = 0; q < NoCurvas; q++) {
        if (curvaClick[q] && parametro[NoDatos * q+1] != 0) {
            let j = parametro[NoDatos * q + 1] / 4;
            let angular = 2 * Math.PI / parametro[NoDatos * q + 1];
            let SdTa, t = j - Td[q], A = t * fps + PosX1;

            while (A < incremento) {
                SdTa = (parametro[NoDatos * q] * Math.sin(angular * t + parametro[NoDatos * q + 2] * conversion));
                let B = eje1_Y - SdTa;
                pincel.beginPath()
                pincel.fillStyle = parametro[NoDatos * q + 3];
                pincel.strokeStyle = "white";
                pincel.arc(A, B, 3, 0, circunferencia);
                pincel.stroke();
                pincel.fill();
                pincel.closePath();

                if(pdetalles=="pAmplitud"){
                    pincel.beginPath();
                    pincel.moveTo(A,eje1_Y);
                    pincel.lineTo(A,B);
                    pincel.strokeStyle=SdTa>0?"black":"red";
                    pincel.stroke();
                    pincel.closePath();
                }

                let txt = t.toFixed(2) + " , " + (2 *parametro[NoDatos * q] / AmplitudMax).toFixed(2);
                B = SdTa < 0 ? B + 15 : B - 15;

                pincel.beginPath()
                pincel.fillStyle = "gray";
                pincel.font = fuente;
                pincel.textAlign = "center";
                pincel.textBaseline = "middle";
                pincel.fillText(txt, A, B);
                pincel.closePath();

                j += parametro[NoDatos * q + 1] / 2;
                t = j - Td[q];
                A = t * fps + PosX1;
            }
        }
    }
}
function onNodos() {
    //var PosX2 = Lienzo.width - PosX1;
    var fuente = "bold 12px Serif";
    let j;
    for (let q = 0; q < NoCurvas; q++) {
        j=0;
        if (curvaClick[q] && parametro[NoDatos * q+1] != 0) {
            j= j - Td[q]<=0?parametro[NoDatos * q + 1] / 2:0;
            let t = j - Td[q], A = t * fps + PosX1;

            while (A < incremento) {
                let B = eje1_Y;
                pincel.beginPath()
                pincel.fillStyle = parametro[NoDatos * q + 3];
                pincel.strokeStyle = "white";
                pincel.arc(A, B, 3, 0, circunferencia);
                pincel.stroke();
                pincel.fill();
                pincel.closePath();

                let txt = t.toFixed(1) + " , " + "0";
                B = B + 15;
                pincel.beginPath()
                pincel.fillStyle = "gray";
                pincel.font = fuente;
                pincel.textAlign = "center";
                pincel.textBaseline = "middle";
                pincel.fillText(txt, A, B);
                pincel.closePath();
                j += parametro[NoDatos * q + 1] / 2;
                t = j - Td[q];
                A = t * fps + PosX1;
            }
        }
    }
}
function onMenuFormas(){
    var fuente = "bold 16px Serif";
    var AnchoMenu=150,AltoMenu=170;
            
    onRoundRect(pincel,CxyMenu.x,CxyMenu.y+20,AnchoMenu,AltoMenu,3,"","lightgray","white");
    
    pincel.beginPath()
    pincel.font = fuente;
    pincel.textAlign = "left";
    pincel.textBaseline = "middle";
    for(let i=0;i<formas.length;i++){
        pincel.fillStyle = "gray";
        if(!(contador<32)){
            if(i==contador-32){
                pincel.fillStyle ="black";
                switch(i){
                    case 0:
                        onFormaDefault();
                        break;
                    case 1:
                        onFormaSenoidal();
                        break;
                    case 2:
                        onFormaTriangulo();
                        break;
                    case 3:
                        onFormaCuadrada();
                        break;
                    case 4:
                        onFormaSierra();
                        break;
                    case 5:
                        onFormaPaquete();
                        break;
                }
            }
        }
        else{
            NoCurvas=rNoCurvas;
            parametro=rParametro.slice();
        }
        pincel.fillText(formas[i], CxyMenu.x+10, CxyMenu.y+40+25*i);
    }
    pincel.closePath();
}
function onBotonXY(C,D,E,colorMenu){
    pincel.beginPath();
        for (let i = 0; i < 3; i++) {
            pincel.fillStyle = colorMenu[i];
            pincel.fillRect(C[i], D, 6, E[i]);
        }
    pincel.closePath();
}
function onBotonFormas(){
    let C = [], D, E = [15, 20, 15], colorMenu = [];
    colorMenu = ["blue", "red", "green"];
    C = [23, 33, 43];
    D = 12;
    onBotonXY(C,D,E,colorMenu);
}
function onMenu2(){
    let C = [], D, E = [15, 20, 15], colorMenu = [];
    colorMenu = ["black", "green", "black"];
    C = [CxyMenu2.x- 13, CxyMenu2.x - 3, CxyMenu2.x+7];
    D = eje1_Y-AmplitudMax+ 12;
    onBotonXY(C,D,E,colorMenu);
}
function onMenu3(){
    let C = [], D, E = [15, 20, 15], colorMenu = [];
    colorMenu = ["green", "black", "green"];
    C = [CxyMenu3.x- 13, CxyMenu3.x - 3, CxyMenu3.x+7];
    D = eje2_Y -AmplitudMax+ 12;
    onBotonXY(C,D,E,colorMenu);
}
function onMenu2XY(){
    var fuente = "bold 16px Serif";
    var AnchoMenu=165,AltoMenu=215;
            
    onRoundRect(pincel,CxyMenu2.x-AnchoMenu,CxyMenu2.y+20,AnchoMenu,AltoMenu,3,"","lightgray","white");
    pincel.beginPath()
    pincel.font = fuente;
    pincel.textAlign = "left";
    pincel.textBaseline = "middle";
    for(let i=0;i<detalles.length;i++){
        pincel.fillStyle = "gray";
        if(i==contador-40){
            pincel.fillStyle ="black";
        }
        pincel.fillText(detalles[i], CxyMenu2.x-AnchoMenu+10, CxyMenu2.y+40+25*i);
    }
    pincel.closePath();
}
function onMenu3XY(){
    var fuente = "bold 16px Serif";
    var AnchoMenu=180,AltoMenu=190;
            
    onRoundRect(pincel,CxyMenu3.x-AnchoMenu,CxyMenu3.y+20,AnchoMenu,AltoMenu,3,"","lightgray","white");
    pincel.beginPath()
    pincel.font = fuente;
    pincel.textAlign = "left";
    pincel.textBaseline = "middle";
    for(let i=0;i<Resultante.length;i++){
        pincel.fillStyle = "gray";
        if(i==contador-60){
            pincel.fillStyle ="black";
        }
        pincel.fillText(Resultante[i], CxyMenu3.x-AnchoMenu+10, CxyMenu3.y+40+25*i);
    }
    pincel.closePath();
}
function onFormaDefault(){
    //NoCurvas=11;
    parametro = [1.5, 5, 0, "green", -1.0, 5, 0, "red", 1.0,5, 0, "blue", 0, 5, 0, "#D35400", 0, 5, 0, "chartreuse", 0, 5, 0, "darkmagenta", 0, 5, 0, "darkred",
                0, 5, 0, "lightgreen", 0, 5, 0, "khaki", 0, 5, 0, "lightsalmon", 0, 5, 0, "magenta", 0, 5, 0, "orange"];
                for (let i = 0; i < NoCurvas; i++) {
                    parametro[NoDatos*i]=CoefAmplitud*parametro[NoDatos*i]*FcToPixeles;
                }
}
function onFormaSenoidal(){
    //NoCurvas=11;
    parametro = [1.7, 5, 0, "green", 0, 0, 0, "red", 0,0, 0, "blue", 0, 0, 0, "#D35400", 0, 0, 0, "chartreuse", 0, 0, 0, "darkmagenta", 0, 0, 0, "darkred",
                0, 0, 0, "lightgreen", 0, 0, 0, "khaki", 0, 0, 0, "lightsalmon", 0, 0, 0, "magenta", 0, 0, 0, "orange"];
                for (let i = 0; i < NoCurvas; i++) {
                    parametro[NoDatos*i]=CoefAmplitud*parametro[NoDatos*i]*FcToPixeles;
                }
}
function onFormaCuadrada(){
    //NoCurvas=11;
    parametro = [1.27, 10, 0, "green", 0, 5, 0, "red", 0.42, 10/3, 0, "blue", 0, 5, 0, "#D35400", 0.25, 10/5, 0, "chartreuse", 0, 5, 0, "darkmagenta",
                0.18, 10/7, 0, "darkred", 0, 5, 0, "lightgreen", 0.14, 10/9, 0, "khaki", 0, 5, 0, "lightsalmon", 0.12, 10/11, 0, "magenta", 0, 5, 0, "orange"];
                for (let i = 0; i < NoCurvas; i++) {
                    parametro[NoDatos*i]=CoefAmplitud*FcToGr*parametro[NoDatos*i]*FcToPixeles;
                }
}
function onFormaSierra(){
    //NoCurvas=11;
    parametro = [0.64, 10, 0, "green", -0.32, 10/2, 0, "red", 0.21, 10/3, 0, "blue", -0.16, 10/4, 0, "#D35400", 0.13, 10/5, 0, "chartreuse", -0.11, 10/6, 0, "darkmagenta",
                0.09, 10/7, 0, "darkred", -0.08, 10/8, 0, "lightgreen", 0.07, 10/9, 0, "khaki", -0.06, 10/10, 0, "lightsalmon", 0.06, 10/11, 0, "magenta", 0, 0, 0, "orange"];
                for (let i = 0; i < NoCurvas; i++) {
                    parametro[NoDatos*i]=CoefAmplitud*2.0*FcToGr*parametro[NoDatos*i]*FcToPixeles;
                }
}
function onFormaTriangulo(){
    //NoCurvas=11;
    parametro = [0.81, 10, 0, "green", 0, 0, 0, "red", -0.09, 10/3, 0, "blue", 0, 0, 0, "#D35400", 0.03, 10/5, 0, "chartreuse", 0, 0, 0, "darkmagenta",
                -0.02, 10/7, 0, "darkred", 0, 0, 0, "lightgreen", 0.01, 10/9, 0, "khaki", 0, 0, 0, "lightsalmon", -0.01, 10/11, 0, "magenta", 0, 0, 0, "orange"];
                let cont=1;
                for (let i = 0; i < NoCurvas; i++) {
                    cont=i>0?1.5:1.5;
                    parametro[NoDatos*i]=cont*CoefAmplitud*FcToGr*parametro[NoDatos*i]*FcToPixeles;
                }
}
function onFormaPaquete(){
    //NoCurvas=11;
    parametro = [0.08, 10, 0, "green", 0.19, 10/2, 0, "red", 0.39, 10/3, 0, "blue", 0.66, 10/4, 0, "#D35400", 0.80, 10/5, 0, "chartreuse", 0.90, 10/6, 0, "darkmagenta",
                0.80, 10/7, 0, "darkred", 0.66, 10/8, 0, "lightgreen", 0.39, 10/9, 0, "khaki", 0.19, 10/10, 0, "lightsalmon", 0.08, 10/11, 0, "magenta", 0, 0, 0, "orange"];
                for (let i = 0; i < NoCurvas; i++) {
                    parametro[NoDatos*i]=CoefAmplitud*parametro[NoDatos*i]*FcToPixeles;
                }
}
function onCrestas(PosX2){
    let SdTa,angular, j, JPdTa;
    for (let t = PosX1; t < PosX2; t += 3) {
        j = (t - PosX1) / fps;
        for (let q = 0; q < NoCurvas; q++) {
            if (curvaClick[q]) {
                angular = 2 * Math.PI / parametro[NoDatos * q + 1];
                SdTa = (parametro[NoDatos * q] * Math.sin(angular * j + parametro[NoDatos * q + 2] * conversion));
                JPdTa=eje1_Y - SdTa;
                //pincel.setLineDash([2,2]);
                pincel.beginPath();
                pincel.lineWidth = 1;
                pincel.strokeStyle =SdTa>0?"#3498DB":"#F1948A";
                pincel.moveTo(t,eje1_Y);
                pincel.lineTo(t,JPdTa);
                pincel.stroke();
                pincel.closePath();
            }
        }
    }
}
function onElongacion(PosX){
    let SdTa,angular, j, JPdTa;
    var fuente = "bold 12px Serif";
    let t=PosX;
    j = (t - PosX1) / fps;
    for (let q = 0; q < NoCurvas; q++) {
        if (curvaClick[q]) {
            angular = 2 * Math.PI / parametro[NoDatos * q + 1];
            SdTa = (parametro[NoDatos * q] * Math.sin(angular * j + parametro[NoDatos * q + 2] * conversion));
            JPdTa=eje1_Y - SdTa;
                
            pincel.lineWidth = 3;
            pincel.beginPath();
            pincel.strokeStyle =SdTa>0?"black":"red";
            pincel.moveTo(t,eje1_Y);
            pincel.lineTo(t,JPdTa);
            pincel.arc(t,JPdTa,3,0,circunferencia);
            pincel.stroke();
            pincel.closePath();

            if(!continuar){
                let txt = "Elongación= "+ (2*SdTa/AmplitudMax).toFixed(1);
                pincel.fillStyle = "black";
                pincel.font = fuente;
                pincel.textAlign = "center";
                pincel.textBaseline = "middle";
                let MdTa;
                if(SdTa>0){
                    MdTa=JPdTa-15;
                }
                else{
                    MdTa=JPdTa+15;
                }
                pincel.fillText(txt, t, MdTa);
                pincel.strokeStyle ="gray";
                pincel.lineWidth = 0.5;
                pincel.beginPath();
                pincel.moveTo(t,JPdTa);
                pincel.lineTo(PosX1,JPdTa);
                pincel.stroke();
                pincel.closePath();
            }
            
        }
    }
}
function onPeriodo1(){
    var fuente = "bold 12px Serif";
    for (let q = 0; q < NoCurvas; q++) {
        if (curvaClick[q] && parametro[NoDatos * q+1] != 0) {
            let j = parametro[NoDatos * q + 1] / 4;
            let angular = 2 * Math.PI / parametro[NoDatos * q + 1];
            let SdTa, t = j - Td[q], A = t * fps + PosX1;
            let E=10;
            while (A < incremento) {
                SdTa = (parametro[NoDatos * q] * Math.sin(angular * t + parametro[NoDatos * q + 2] * conversion));
                if(SdTa>0){
                    let B = eje1_Y - SdTa;
                    pincel.beginPath()
                    pincel.fillStyle = parametro[NoDatos * q + 3];
                    let C=A+parametro[NoDatos*q+1]*fps;
                    let D=B-E;
                    if(!(C>incremento)){
                        pincel.strokeStyle = E>0?"black":"#FF00FF";
                        pincel.moveTo(A,D);
                        pincel.arc(A, D, 2, 0, circunferencia);
                        pincel.lineTo(C,D);
                        pincel.arc(C, D, 2, 0, circunferencia);
                    
                        let txt = "T="+ parametro[NoDatos * q+1].toFixed(1)+" s";
                        pincel.fillStyle = "gray";
                        pincel.font = fuente;
                        pincel.textAlign = "center";
                        pincel.textBaseline = "middle";
                        pincel.fillText(txt, (A+C)/2, B);

                        pincel.stroke();
                        pincel.fill();
                        pincel.closePath();
                        E=-E;
                    }
                }
                j += parametro[NoDatos * q + 1] / 2;
                t = j - Td[q];
                A = t * fps + PosX1;
            }
        }
    }
}
function onPeriodo2(){
    var fuente = "bold 12px Serif";
    for (let q = 0; q < NoCurvas; q++) {
        if (curvaClick[q] && parametro[NoDatos * q+1] != 0) {
            let j = parametro[NoDatos * q + 1] / 4;
            let angular = 2 * Math.PI / parametro[NoDatos * q + 1];
            let SdTa, t = j - Td[q], A = t * fps + PosX1;
            let E=-10;
            
            while (A < incremento) {
                SdTa = (parametro[NoDatos * q] * Math.sin(angular * t + parametro[NoDatos * q + 2] * conversion));
                if(SdTa<0){
                    let B = eje1_Y - SdTa;
                    pincel.beginPath()
                    pincel.fillStyle = parametro[NoDatos * q + 3];
                    let C=A+parametro[NoDatos*q+1]*fps;
                    let D=B-E;
                    if(!(C>incremento)){
                        pincel.strokeStyle = E>0?"black":"#FF00FF";
                        pincel.moveTo(A,D);
                        pincel.arc(A, D, 2, 0, circunferencia);
                        pincel.lineTo(C,D);
                        pincel.arc(C, D, 2, 0, circunferencia);
                    
                        let txt = "T="+ parametro[NoDatos * q+1].toFixed(1)+" s";
                        pincel.fillStyle = "gray";
                        pincel.font = fuente;
                        pincel.textAlign = "center";
                        pincel.textBaseline = "middle";
                        pincel.fillText(txt, (A+C)/2, B);

                        pincel.stroke();
                        pincel.fill();
                        pincel.closePath();
                        E=-E;
                    }
                }
                j += parametro[NoDatos * q + 1] / 2;
                t = j - Td[q];
                A = t * fps + PosX1;
            }
        }
    }

}
function onPeriodo3(){
    var fuente = "bold 12px Serif";
    let j;
    for (let q = 0; q < NoCurvas; q++) {
        j=0;
        if (curvaClick[q] && parametro[NoDatos * q+1] != 0) {
            j= j - Td[q]<0? parametro[NoDatos * q + 1] / 2:0
            let t = j - Td[q], A = t * fps + PosX1;
            let E=-10;
            while (A < incremento) {
                E=-E;
                let B = eje1_Y;
                pincel.beginPath()
                pincel.fillStyle = parametro[NoDatos * q + 3];
                //pincel.strokeStyle = "white";
                
                let C=A+parametro[NoDatos*q+1]*fps;
                let D=B-E;
                if(C<incremento){
                    pincel.arc(A, D, 2, 0, circunferencia);
                    pincel.moveTo(A,D);
                    pincel.lineTo(C,D);
                    pincel.arc(C, D, 2, 0, circunferencia);
                
                    let txt = "T="+ parametro[NoDatos * q+1].toFixed(1)+" s";
                    pincel.fillStyle = "black";
                    pincel.font = fuente;
                    pincel.textAlign = "center";
                    pincel.textBaseline = "middle";
                    pincel.fillText(txt, (A+C)/2, B=B<D?B+20:B-20);

                    pincel.stroke();
                    pincel.fill();
                    pincel.closePath();
                }
                

                j += parametro[NoDatos * q + 1];
                t = j - Td[q];
                A = t * fps + PosX1;
            }
            
        }
    }
}
function onPeriodo4(){
    var fuente = "bold 12px Serif";
    var SdTa;
    for (let q = 0; q < NoCurvas; q++) {
        if (curvaClick[q] && parametro[NoDatos * q+1] != 0) {
            let j = parametro[NoDatos * q + 1] / 8;
            let angular = 2 * Math.PI / parametro[NoDatos * q + 1];
            t = j - Td[q], A = t * fps + PosX1;
            let E=10;
            while (A < incremento) {
                SdTa = (parametro[NoDatos * q] * Math.sin(angular * t + parametro[NoDatos * q + 2] * conversion));    
                let C=A+parametro[NoDatos*q+1]*fps;
                let B = eje1_Y-SdTa;            
                let D=B-E;
                if(!(C>incremento)){
                    pincel.beginPath()
                    pincel.fillStyle = parametro[NoDatos * q + 3];
                    pincel.strokeStyle = "black"; 
                    pincel.moveTo(A,B);
                    pincel.arc(A, B, 2, 0, circunferencia);
                    pincel.lineTo(C,B);
                    pincel.arc(C, B, 2, 0, circunferencia);
                    
                    let txt = "T="+ parametro[NoDatos * q+1].toFixed(1)+" s";
                    pincel.fillStyle = "gray";
                    pincel.font = fuente;
                    pincel.textAlign = "center";
                    pincel.textBaseline = "middle";
                    pincel.fillText(txt, (A+C)/2, D);

                    pincel.stroke();
                    pincel.fill();
                    pincel.closePath();
                    //E=-E;
                }
                
                if(SdTa>0){
                    j += parametro[NoDatos * q + 1] / 2;
                    E=-E 
                    //pincel.strokeStyle = "black";                   
                }
                else{
                    j += 3*parametro[NoDatos * q + 1]/2;
                    //pincel.strokeStyle = "#FF00FF";
                }
                
                t = j - Td[q];
                A = t * fps + PosX1;
            }
        }
    }
}
function graficar() {
    over = (7 * factorX);//radio de los circulos y distancia entre ellos
    var PosX2 = Lienzo.width - PosX1;
    var fuente = "bold 14px Serif";
    var txt1 ="Gráfico de Posición vs tiempo";
    var txt2 ="Superposición de armónicos";

    //Borra la lienzo
    pincel.clearRect(0, 0, Lienzo.width, Lienzo.height);

    //Define los ejes del M.A.S

    pincel.beginPath();

    pincel.fillStyle = "gray";
    pincel.font = fuente;
    pincel.textAlign = "center";
    pincel.textBaseline = "middle";
    pincel.fillText(txt1, Lienzo.width/2, eje1_Y-AmplitudMax-10);
    pincel.fillText(txt2, Lienzo.width/2, eje2_Y-AmplitudMax-10);

    pincel.font = "bold 12px Serif";
    pincel.lineWidth = 0.5;
    for (let i = 0; i < 9; i++) {
        let txt = 2.0 -i*0.5;
        pincel.fillText(txt, PosX1-10, eje1_Y - CoefLineas[i] * AmplitudMax);
        pincel.moveTo(PosX1, eje1_Y - CoefLineas[i] * AmplitudMax);
        pincel.lineTo(PosX2, eje1_Y - CoefLineas[i] * AmplitudMax);
    }
    pincel.strokeStyle = "lightgray";
    pincel.stroke();
    pincel.closePath();

    pincel.beginPath();
    pincel.lineWidth = 1.0;
    pincel.moveTo(PosX1, eje1_Y);
    pincel.lineTo(PosX2, eje1_Y);
    pincel.strokeStyle = "black";
    pincel.stroke();
    pincel.closePath();

    pincel.beginPath();
    pincel.lineWidth = 0.5;
    pincel.font = "bold 12px Serif";

    let div2= EscalaReal/(Txycoeficiente*4); 
    for (let i = 0; i < 9; i++) {
        let txt =(EscalaReal/Txycoeficiente -i*div2);
        pincel.fillText(txt.toFixed(1), PosX1-10, eje2_Y - CoefLineas[i] * AmplitudMax);
        pincel.moveTo(PosX1, eje2_Y - CoefLineas[i] * AmplitudMax);
        pincel.lineTo(PosX2, eje2_Y - CoefLineas[i] * AmplitudMax);
    }
    pincel.strokeStyle = "lightgray";
    pincel.stroke(); 
    pincel.closePath();

    pincel.beginPath();
    pincel.lineWidth = 1.0;
    pincel.moveTo(PosX1, eje2_Y);
    pincel.lineTo(PosX2, eje2_Y);
    pincel.strokeStyle = "black";
    pincel.stroke();
    pincel.closePath();
    
    onRoundRectXY(pincel,PosX2-20,eje2_Y+AmplitudMax+10,20,20,2,"+","gray",colorEscala2,"black");
    onRoundRectXY(pincel,PosX2-50,eje2_Y+AmplitudMax+10,20,20,2,"-","gray",colorEscala1,"black");
    onRoundRectXY(pincel,PosX2-80,eje2_Y+AmplitudMax+10,20,20,2,"r","gray",colorEscala3,"black");

    onBarraSuperior(LineaBase);
     
    CxyMenu = { x: 30, y: 22 };
    onBotonFormas();
    if(pMenuFormas){
        onMenuFormas();
    }
    //Fin del primer Menú
    if (curvaSeleccionada) {
        CxyMenu2={ x: Lienzo.width - 50, y: eje1_Y-AmplitudMax+22 };
        CxyMenu3={ x: Lienzo.width - 50, y: eje2_Y-AmplitudMax+22 };
        onMenu2(); //dibuja el menú 2
        onMenu3(); //dibuja el menú 3
        if(pdetalles!=""){
            switch (pdetalles){
                case "pCrestas":
                    onCrestas(incremento=incremento<PosX2?incremento:PosX1);
                    //incremento = continuar ? incremento +=3 : incremento;
                    break;
                case "pElongacion":
                    onElongacion(incremento=incremento<PosX2?incremento:PosX1);
                    //incremento = continuar ? incremento +=3 : incremento;
                    break;
                case "pMaxMin":
                    onMaximosMinimos();
                    break;
                case "pNodos":
                    onNodos();
                    break;
                case "pAmplitud":
                    onMaximosMinimos();
                    break;
                case "pPeriodo":
                    let y=eje1_Y+AmplitudMax+7;
                    for(let i=0;i<4;i++){
                        if(PeriodoVal[i]){
                            onRoundRect(pincel,PeriodoXY[i]-6,y,12,12,2,"","black","black");
                            switch (i+1){
                                case 1:
                                    onPeriodo1();
                                    break;
                                case 2:
                                    onPeriodo2();
                                    break;
                                case 3:
                                    onPeriodo3();
                                    break;
                                case 4:
                                    onPeriodo4();
                                    break;
                            }
                        }
                        else{
                            onRoundRect(pincel,PeriodoXY[i]-6,y,12,12,2,"","gray","white");
                        }
                    }
                    break;
                case "pFrecuencia":
                    pFrecuencia=true;
                    break;
                case "pVelocidad":
                    pVelocidadA=true;
                    break;
            }
        }
        
        if(pMovimiento){
            //incremento = continuar ? incremento +=3 : incremento;
            incremento=incremento<PosX2? (continuar ? incremento +=3 : incremento):PosX1
            
        }
        if(pMenu2){
            onMenu2XY();
        }
        else{
            if(pMenu3){
                onMenu3XY();
            }
        }
    }
    else{
        //Primer Menú
    //CxyMenu = { x: 30, y: 22 };
    //onBotonFormas();

    }
    
    fDibujarCurvas();  
    onBarraBotones();
       
    if (contador > 0) {
        let AltoSeccion=20;
        let descuento = seccion/2+AltoSeccion/2+15;
        let TipX = [CxyDesplazamiento.x, CxyVelocidad.x, CxyAceleracion.x, CxyMenu.x, CxyMenu2.x,CxyMenu3.x ];
        let TipY = [CxyDesplazamiento.y - descuento, CxyVelocidad.y - descuento, CxyAceleracion.y - descuento, CxyMenu.y -15, CxyMenu2.y + 30,CxyMenu3.y + 30];

        let j = contador - 1;
        let q = j;
        
        let B = TipY[j];
        let Amp = "";
        pincel.font=fuente;
        let C= pincel.measureText(texto[q]).width + 20;
        let A = TipX[j] - C/2;
        
        if (contador > 3) {
            switch (contador) {
                case 4:
                    A = TipX[j]+30;
                    B=TipY[j]+30;
                    break;
                case 5:
                    A = TipX[j] - C;
                    B=TipY[j]-70;
                    break;
                case 6:
                    q=11;
                    C= pincel.measureText(texto[q]).width + 20;
                    A = TipX[j] - C;
                    B=TipY[j]-70;
                    break;
                case 70:
                    q=10;
                    C= pincel.measureText(texto[q]).width + 20;
                    A=PosX2-40- C;
                    B=eje2_Y+AmplitudMax+40;
                    break;
                case 71:
                    q=9;
                    C= pincel.measureText(texto[q]).width + 20;
                    A=PosX2-10- C;
                    B=eje2_Y+AmplitudMax+40;
                    break;
                case 72:
                    //Amp="";
                    q=8;
                    C= pincel.measureText(texto[q]).width + 20;
                    A=PosX2-70- C;
                    B=eje2_Y+AmplitudMax+40;
                    break;
                default:
                    q = contador - 7;
                    B = (LineaBase-DesY1[q])>0? LineaBase + 10:LineaBase-30;
                    A = XRect[q];
                    //pincel.font=fuente;
                    if (vSJAmplitud) {
                        Amp = q + 1 + "=" +(2 * parametro[NoDatos * q] / AmplitudMax).toFixed(2);
                        q = 5;
                    }
                    else {
                        if (vSJPeriodo) {
                            Amp = q + 1 + "=" + Math.round(parametro[NoDatos * q + 1]) + "s";
                            q = 6;
                        }
                        else {
                            if (vSJDesfase) {
                                Amp = q + 1 + "=" + Math.round(parametro[NoDatos * q + 2]) + "\u00B0";
                                q = 7;
                            }
                        }
                    }
                    C = pincel.measureText(texto[q]).width + pincel.measureText(Amp).width+20;
                    A -= C / 2;
                    break;
            }
        }
        onRoundRect(pincel, A, B, C,AltoSeccion, 3, texto[q] + Amp, "blue", "blue");
    }
}

function Dibujo() {
    graficar();
    //incremento = continuar ? ++incremento : incremento;
    setTimeout(
        function () {
            //let idIntervalo = 
            window.requestAnimationFrame(Dibujo);
        }, 1000 / fps);
}

function onInicio() {
    onRedimensionar();
    Dibujo();
}