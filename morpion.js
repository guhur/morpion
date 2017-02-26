var tab = new Array();
var xml;
var html_output;
var Nlignes;
var Ncolonnes;
var prochainJoueur = 1;
var longueur; // longueur minimal pour gagner
var joueurs;
var difficulte = 1;// profondeur recherche ordinateur
var modeCPU = false;

function output(id){
    var xml_res = "";
    for(i = 0; i< Nlignes; i++) {
        xml_res += '&lt;ligne&gt;<br />';
        for(j = 0; j< Ncolonnes; j++) {
            xml_res += '     &lt;case&gt;' + tab[i][j] + '&lt;/case&gt;<br />';
        }
        xml_res += "&lt;/ligne&gt;<br />";
    }
    xml.innerHTML = "<pre><code class='html'>" + xml_res + "</code><pre>";

    var content = document.getElementById(id).innerHTML;
    content = content.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {   return '&#'+i.charCodeAt(0)+';'; });
    html_output.innerHTML = '<pre><code class="html">' + content + '</code></p  re>';
    hljs.highlightBlock(html_output);
    hljs.highlightBlock(xml);
    //
}

function createField(formid, id,xmlid, htmlid="html")  {
    var inputs = document.getElementById(formid).getElementsByTagName('input');
    Nlignes = inputs[0].value;
    Ncolonnes = inputs[1].value;
    var field = document.getElementById(id);
    tab = new Array(Nlignes);
    field.innerHTML = "";
    var plateau = "";
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
    var tous_joueurs = new Array("#337ab7", "#ce4844", "#8B008B", "#FF7F50", "#ADFF2F", "#FFDEAD", "#8B4513", "#2F4F4F", "#696969", "#FFF0F5");
    var Njoueur = inputs[2].value;
    if(Njoueur == 1) {
        modeCPU = true;
        joueurs = tous_joueurs.slice(0,2);
    } else {
        modeCPU = false;
        joueurs = tous_joueurs.slice(0,Njoueur);
    }
    prochainJoueur = 1;
    return plateau;
}



function update(i,j, id) {

    if (modeCPU && prochainJoueur == 2) {
        [i,j] = ordinateur();
    }
    if(tab[i][j] != 0) {
        return;
    }

    tab[i][j] = prochainJoueur;
    var btn = document.getElementById(id + '_' + i + '_' + j);
    btn.style.backgroundColor = joueurs[prochainJoueur-1];
    if (plusLongueRangee(prochainJoueur).length == longueur) {
        document.getElementById(id).innerHTML = "Joueur <span style='color:" + joueurs[prochainJoueur-1] +";'>" + prochainJoueur + "</span> a gagné !";
    }
    prochainJoueur = (prochainJoueur < joueurs.length) ? prochainJoueur+1 : 1;
    output(id);

    if (modeCPU && prochainJoueur == 2) {
        update(i,j, id);
    }

}


// mode ordinateur
// TODO recursivite pour chercher en profondeur
function ordinateur(tableau = null) {
    if (!tableau) tableau = tab;
    var ajouer = [];

    // pour toutes les cases ou le joueur a joué, on regarde dans les cases à côté s'il risque de gagner
    for(i = 0; i< Nlignes; i++)
        for (j=0;j <Ncolonnes;j++)
            if(coupPotentiel(tableau, 1, i, j))
                ajouer = [i, j];



    // est-ce qu'une case fait gagner l'ordinateur
    if (ajouer.length == 0)
        for(i = 0; i< Nlignes; i++)
            for (j=0;j <Ncolonnes;j++)
                if(coupPotentiel(tableau, 2, i, j))
                    ajouer = [i, j];


    // est-ce qu'une case augmente la plus longue rangee de l'ordinateur
    if (ajouer.length == 0) {
        actuel = plusLongueRangee(1).length;
        for(i = 0; i< Nlignes; i++)
            for (j=0;j <Ncolonnes;j++)
                if(coupPotentiel(tableau, 2, i, j, actuel))
                    ajouer = [i, j];
    }

    // on prend une case libre au hasard
    if (ajouer.length == 0)
        for(i = 0; i< Nlignes; i++)
            for (j=0; j<Ncolonnes; j++)
                if(estDansLeTableau([i,j]) && tableau[i][j] == 0)
                    ajouer = [i,j];

    return ajouer;
}

function estDansLeTableau(position) {
    return (position[0] >= 0 && position[0] < Nlignes && position[1] >= 0 && position[1] < Ncolonnes);
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
function plusLongueRangee(symbole, terrain = null) {
    if (!terrain) terrain = tab;
    var maxLong = 0;
    var positions = [];

    // check lignes
    for(var i = 0; i < Nlignes; i++) {
        var [max, argmax] = longueurMotif(terrain[i].join(""), symbole)
        if (max > maxLong) {
            positions = [];
            for(j = argmax;j<argmax+max;j++)
                positions.push([i,j])
            maxLong = max;
        }
    }


    // check colonnes
    for(var j = 0; j < Ncolonnes; j++) {
        var colonne = "";
        for(var i = 0; i < Nlignes; i++)
            colonne += terrain[i][j];
        var [max, argmax] = longueurMotif(colonne, symbole)
        if (max > maxLong) {
            var positions = [];
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
                diago += terrain[r][c];
                dposition.push([r,c]);
            }
            r -= 1;
            c += 1;
        }
        var [max, argmax] = longueurMotif(diago, symbole)
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
                diago += terrain[r][c];
                dposition.push([r,c]);
            }
            r -= 1;
            c -= 1;
        }
        var [max, argmax] = longueurMotif(diago, symbole)
        if (max > maxLong) {
            maxLong = max;
            positions = dposition.slice(argmax, argmax+max);
        }
    }

    return positions
}



// retourne vrai si le coup peut nous faire gagner (ou si ca nous donne une chaine plus longue que "actuel")
function coupPotentiel(tableau, symbole, i,j, actuel = null) {
    if(!actuel) actuel = longueur -1;
    if(estDansLeTableau([i,j]) && tableau[i][j] == 0) {
        var ctab = new Array(Nlignes);
        for(k = 0; k< Nlignes; k++) {
            ctab[k] = new Array(Ncolonnes);
            for(l = 0; l < Ncolonnes; l++) {
                ctab[k][l] = tab[k][l];
            }
        }
        ctab[i][j] = 1;
        return (plusLongueRangee(symbole,ctab).length > actuel);
    }
    return false;
}
