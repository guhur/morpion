var tab = new Array();
var xml;
var html_output;
var Nlignes;
var Ncolonnes;
var prochainJoueur = 1;
var longueur; // longueur minimal pour gagner
var joueurs;

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
    html_output.innerHTML = '<pre><code class="html">' + content + '</code></p  re>';
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
        plateau += '\n<div class="morpion-row">\n';
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
    longueur = Math.min(Ncolonnes, Nlignes, 5);
    tous_joueurs = new Array("#337ab7", "#ce4844", "#8B008B", "#FF7F50", "#ADFF2F", "#FFDEAD", "#8B4513", "#2F4F4F", "#696969", "#FFF0F5");
    joueurs = tous_joueurs.slice(0,inputs[2].value)
    return plateau;
}



function update(i,j, id) {
    field = document.getElementById(id);
    btn = document.getElementById(id + '_' + i + '_' + j);

    if(tab[i][j] != 0) {
        return;
    }

    tab[i][j] = prochainJoueur;
    btn.style.backgroundColor = joueurs[prochainJoueur-1];
    if (checkWin(prochainJoueur)) {
        field.innerHTML = "Joueur <span style='color:" + joueurs[prochainJoueur-1] +";'>" + prochainJoueur + "</span> a gagné !";
    }
    prochainJoueur = (prochainJoueur < joueurs.length) ? prochainJoueur+1 : 1;
    output(id);
}


function checkWin(symbole) {
    motif = symbole.toString().repeat(longueur);

    // check lignes
    for(i = 0; i < Nlignes; i++) {
        ligne = tab[i].join("")
        if (ligne.indexOf(motif) != -1)
            return 1;
    }


    // check colonnes
    for(j = 0; j < Ncolonnes; j++) {
        colonne = "";
        for(i = 0; i < Nlignes; i++)
            colonne += tab[i][j];
        if (colonne.indexOf(motif) != -1)
            return 1;
    }

    // check diagonales gauche/haut -> droite/bas
    for (var n = longueur - 1; n < Ncolonnes + Nlignes - 1 - longueur; n ++) {
        var r = n;
        var c = 0;
        var diago = '';
        while (r >= 0 && c < Ncolonnes) {
            if (r < Nlignes)
                diago += tab[r][c];
            r -= 1;
            c += 1;
        }
        if (diago.indexOf(motif) != -1)
            return 1;
    }

    // check diagonales gauche/haut <- droite/bas
    for (var n =  Nlignes - 1; n >= -Ncolonnes+1; n--) {
        var r = 0;
        var c = 0;
        var diago = '';
        while (r < Nlignes && c < Ncolonnes) {
            if (r >= 0)
                diago += tab[r][c];
            r += 1;
            c += 1;
        }
        if (diago.indexOf(motif) != -1)
            return 1;
    }
    //
    //
    //
    // if (tab[0][0]==tab[0][1] && tab[0][0]==tab[0][2] && tab[0][0]==symbole)
    //      return 1
    //  if (tab[1][0]==tab[1][1] && tab[1][0]==tab[1][2] && tab[1][0]==symbole)
    //      return 1
    //  if (tab[2][0]==tab[2][1] && tab[2][0]==tab[2][2] && tab[2][2]==symbole)
    //      return 1
    //  if (tab[0][0]==tab[1][0] && tab[0][0]==tab[2][0] && tab[0][0]==symbole)
    //      return 1
    //  if (tab[0][1]==tab[1][1] && tab[1][1]==tab[2][1] && tab[0][1]==symbole)
    //      return 1
    //  if (tab[0][2]==tab[1][2] && tab[1][2]==tab[2][2] && tab[0][2]==symbole)
    //      return 1
    //  if (tab[0][0]==tab[1][1] && tab[1][1]==tab[2][2] && tab[0][0]==symbole)
    //      return 1
    //  if (tab[0][2]==tab[1][1] && tab[2][0]==tab[0][2] && tab[0][2]==symbole)
    //      return 1
    return 0;
}
