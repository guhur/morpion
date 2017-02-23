var tab = new Array();
var xml;
var html_output;
var Nlignes;
var Ncolonnes;
var prochainJoueur = 1;

function output(id){
    xml_res = "";
    for(i = 0; i< Nlignes; i++) {
        xml_res += '&lt;ligne&gt;<br />';
        for(j = 0; j< Ncolonnes; j++) {
            xml_res += '     &lt;case&gt;' + tab[i][j] + '&lt;/case&gt;<br />';
        }
        xml_res += "&lt;/ligne&gt;<br />";
    }
    xml.innerHTML = "<pre><code class='html'>" + xml_res + "</code><pre>";

    content = document.getElementById(id).innerHTML;
    content = content.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {   return '&#'+i.charCodeAt(0)+';'; });
    html_output.innerHTML = '<pre><code class="html">' + content + '</code></pre>';
    hljs.highlightBlock(html_output);
    hljs.highlightBlock(xml);
    //
}

function createField(formid, id,xmlid, htmlid="html")  {
    inputs = document.getElementById(formid).getElementsByTagName('input');
    Nlignes = inputs[0].value;
    Ncolonnes = inputs[1].value;
    field = document.getElementById(id);
    tab = new Array(Nlignes);
    field.innerHTML = "";
    plateau = "";
    for(i = 0; i< Nlignes; i++) {
        tab[i] = new Array(Ncolonnes);
        plateau += '\n<div class="morpion-row">';
        for(j = 0; j< Ncolonnes; j++) {
            plateau += '<div class="morpion-button" type="text" onclick="update(' + i + ',' + j + ', \'' + id + '\')" id="' + id + '_' + i + '_' + j + '"> </div>';
            tab[i][j]  = "";
        }
        plateau += '\n</div>';
    }
    field.innerHTML = plateau;
    xml = document.getElementById(xmlid);
    html_output = document.getElementById(htmlid);
    output(id);
    return plateau;
}



function update(i,j, id) {
    field = document.getElementById(id);
    btn = document.getElementById(id + '_' + i + '_' + j);
    // if (input.value != prochainJoueur) {
    //     input.value = ""
    //     alert("Ce n'est pas à vous de jouer !");
    // } else {
    if (prochainJoueur == 1) {
            tab[i][j] = 1;
            prochainJoueur = 2;
            btn.style.backgroundColor = "#337ab7";
    } else if (prochainJoueur == 2)  {
            tab[i][j] = 2;
            prochainJoueur = 1;
            btn.style.backgroundColor = "#ce4844";
    }

    output(id);
    if (checkWin("1")) {
        alert("Joueur 1 a gagné");
    }
    else if (checkWin("2")) {
        alert("Joueur 2 a gagné");
    }
}


function checkWin(symbole) {
    if (tab[0][0]==tab[0][1] && tab[0][0]==tab[0][2] && tab[0][0]==symbole)
         return 1
     if (tab[1][0]==tab[1][1] && tab[1][0]==tab[1][2] && tab[1][0]==symbole)
         return 1
     if (tab[2][0]==tab[2][1] && tab[2][0]==tab[2][2] && tab[2][2]==symbole)
         return 1
     if (tab[0][0]==tab[1][0] && tab[0][0]==tab[2][0] && tab[0][0]==symbole)
         return 1
     if (tab[0][1]==tab[1][1] && tab[1][1]==tab[2][1] && tab[0][1]==symbole)
         return 1
     if (tab[0][2]==tab[1][2] && tab[1][2]==tab[2][2] && tab[0][2]==symbole)
         return 1
     if (tab[0][0]==tab[1][1] && tab[1][1]==tab[2][2] && tab[0][0]==symbole)
         return 1
     if (tab[0][2]==tab[1][1] && tab[2][0]==tab[0][2] && tab[0][2]==symbole)
         return 1
    return 0
}
