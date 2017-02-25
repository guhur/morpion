var tab = new Array();
var xml;
var html_output;
var Nlignes;
var Ncolonnes;
var prochainJoueur = 1;
var longueur; // longueur minimal pour gagner
var joueurs;
var profondeur = 1;// profondeur recherche ordinateur

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
            tab[i][j]  = 0;
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
    if (plusLongueRangee(prochainJoueur).length == longueur) {
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

    return 0;
}

function ordinateur() {
    // trouver la rangée la plus longue

    // pour toutes les cases ou le joueur a joué, on regarde dans les cases à côté s'il risque de gagner
    for(i = 0; i< Nlignes; i++) {
        for(j = 0; j< Ncolonnes; j++) {
            if(tab[i][j] == 1) {
                ctab = JSON.parse(JSON.stringify(tab));
                checkPotentialWin(i,j);
            }
        }
    }
}

// retourne la taille et l'indice de la plus longue chaine continue de [symbole]
function longueurMotif(string, symbole) {
    regex = new RegExp(symbole + "+", "g");
    motifs = string.match(regex)
    if (motifs === null) { motifs = [];}
    max = Math.max.apply(null, motifs.map(w => w.length))
    if (max < 0) max = 0;
    return [max, string.indexOf(symbole.toString().repeat(max))]
}

// retourne un tableau de positions avec la plus longue chaine continue de [symbole] depuis tab
function plusLongueRangee(symbole) {
    maxLong = 0;
    positions = [];

    // check lignes
    for(i = 0; i < Nlignes; i++) {
        [max, argmax] = longueurMotif(tab[i].join(""), symbole)
        if (max > maxLong) {
            positions = [];
            for(j = argmax;j<argmax+max;j++)
                positions.push([i,j])
            maxLong = max;
        }
    }


    // check colonnes
    for(j = 0; j < Ncolonnes; j++) {
        colonne = "";
        for(i = 0; i < Nlignes; i++)
            colonne += tab[i][j];
        [max, argmax] = longueurMotif(colonne, symbole)
        if (max > maxLong) {
            positions = [];
            maxLong = max;
            for(i = argmax;i<argmax+max;i++)
                positions.push([i,j])
        }
    }

    // check diagonales gauche/haut -> droite/bas
    for (var n = longueur - 1; n < Ncolonnes + Nlignes - 1 - longueur; n ++) {
        var r = n;
        var c = 0;
        var diago = '';
        var dposition = [];
        while (r >= 0 && c < Ncolonnes) {
            if (r < Nlignes) {
                diago += tab[r][c];
                dposition.push([r,c]);
            }
            r -= 1;
            c += 1;
        }
        [max, argmax] = longueurMotif(diago, symbole)
        if (max > maxLong) {
            maxLong = max;
            positions = dposition.slice(argmax, argmax+max);
        }
    }

    // check diagonales gauche/haut <- droite/bas
    for (var n =  Ncolonnes + Nlignes - 1; n >= 00; n--) {
        var r = n;
        var c = Ncolonnes-1;
        var diago = '';
        var dposition = [];
        while (r >= 0 && c >= 0) {
            if (r < Ncolonnes) {
                diago += tab[r][c];
                dposition.push([r,c]);
            }
            r -= 1;
            c -= 1;
        }
        [max, argmax] = longueurMotif(diago, symbole)
        if (max > maxLong) {
            maxLong = max;
            positions = dposition.slice(argmax, argmax+max);
        }
    }

    return positions
}



function checkPotentialWin(tab, i,j) {

}
