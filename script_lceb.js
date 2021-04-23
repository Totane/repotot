//#region CONSTANTES & VARIABLES
//###################################################################################################################


// CONSTANTES DE PLACEMENT GRAPHIQUE (RÉSOLUTION-DÉPENDANTES)


const ROULEAU_X = ["23px","66px","109px"];
const ROULEAU_Y = "56px";
const ROULEAU_L= 23;
const ROULEAU_H = 46;
const RUBAN_Y = [0,41,82,123,164,205,246,287,328,369,410];
const RUBAN_DECALAGE = 5;
const OPERANDE_X = ["10px","10px","15px","10px","10px","15px"];
const OPERANDE_Y = ["175px","262px","350px","437px","524px","611px"];
const OPERANDE_L = ["117px","92px","92px","92px","92px","92px"];
const OPERANDE_H = "69px";
const OPERATEUR_X = ["140px","220px","300px","379px"];
const OPERATEUR_Y = ["143px","148px","143px","154px"];
const OPERATEUR_L = "71px";
const OPERATEUR_H = ["85px","69px","85px","79px"];
const NOMBRE_Y = ["193px","281px","369px","456px","542px","631px"];
const NOMBRE_CENTRE_X = [95,45,73,42,55,73];
const SWITCH_ENTREE_X = "32px"; const SWITCH_ENTREE_Y = "0px"; const SWITCH_ENTREE_L = "87px"; const SWITCH_ENTREE_H = "39px";
const BOUTON_CORRECTION_X = "190px"; const BOUTON_CORRECTION_Y = "16px"; const BOUTON_CORRECTION_L = "66px"; const BOUTON_CORRECTION_H = "65px";
const BOUTON_REPONSE_X = "270px"; const BOUTON_REPONSE_Y = "35px"; const BOUTON_REPONSE_L = "56px"; const BOUTON_REPONSE_H = "57px";
const BOUTON_LANCER_X = "350px"; const BOUTON_LANCER_Y = "16px"; const BOUTON_LANCER_L = "66px"; const BOUTON_LANCER_H = "63px";
const BOUTON_GO_X = "230px"; const BOUTON_GO_Y = "55px"; const BOUTON_GO_L = "78px"; const BOUTON_GO_H = "66px";
const CALCULS_FONTSIZE = "32px";
const CALCULS_X = "150px";
const EPAISSEUR_TRAIT = "3px";
const RESULTAT_PADDING = "0px 12px 0px 12px";
const SAISIE_FONTSIZE = "26px"
const SAISIE_X = "140px";
const SAISIE_Y = "250px";
const SAISIE_L = "308px";
const BOUTON_SAISIE_X = ["0px", "178px"];
const BOUTON_SAISIE_Y = ["50px", "125px", "200px", "280px"];
const BOUTON_SAISIE_DECALAGE = 44;
const BOUTON_SAISIE_CIBLE_Y = "50px";
const ENTREE_SAISIE_CIBLE_Y = "55px";
const ENTREE_SAISIE_FONTSIZE = "40px"
var acceuilX = "130px";
var acceuilY = "230px";

// VARIABLES ANIMATION


var rubanY = [0, 0, 0];						
var dernierTour = [false, false, false];
var rouleauOK = [false, false, false];
var delai = 10;
var chrono;
var ancienChrono = 0;
var demandeAffichage;
var numerosRouleau = new Array(3);



// VARIABLES INTERFACE

const COULEUR_SELECTION = "rgb(0,201,138)"
const NOMBRES_INITIAUX = [1,2,3,4,5,6,7,8,9,10,25,50,75,100,1,2,3,4,5,6,7,8,9,10];
const OPERATEURS = ["+","−","×","÷"];
const IMPOSSIBLE = 937500001; 	// Valeur impossible a atteindre avec les opérandes de départ : 100 x 75 x 50 x 25 x 10 x 10 = 937 500 000
var cible;					  	// Le nombre a atteindre
var tirage = new Array(6); 	 	// 6 opérandes pour y arriver
var operandes = new Array(11);	// Les 6 opérandes de départ plus les 5 résultats de calcul devenant à leurs tours opérandes
var used = new Array(11);	  	// états des opérandes (sur l'interface) : libres (false) ou utilisés (true)
var gelOperandes = false;		// affichage de la réponse : permet de garder le look "actif" sur les opérandes non utilisés tout en gelant leur clic


// VARIABLES DE CALCUL

class Solution {
	constructor(valeur, chemin, filtre) {
		this.valeur = valeur;
		this.chemin = chemin;
		this.filtre = filtre;
	}
}

const lettres = ["u","d","t","q","c","s"];   // Codage du chemin vers la solution (opérande U n, D eux ... à S ix)
const masques = [1,2,4,8,16,32]				 // Stockage des opérandes utilisées (0) ou encore libre (1)
var LAsolution = new Solution(0,"",0);
var soluce = new Solution(0,"",0);
var ecart = 1000;
var solutions2 = new Array;					 // Stockage des combinaisons intermédiaires avec 2 termes utilisés
var solutions3 = new Array;					 //						  '					      3		    '	
var solutions4 = new Array;					 //						  '	 				      4         '
var solutions5 = new Array;					 //					      '					      5         '
//#endregion

//#region CALCUL

function calcule() {
	soluce = new Solution(0,"",0);
	ecart = 1000;
	solutions2 = new Array;
	solutions3 = new Array;
	solutions4 = new Array;
	solutions5 = new Array;
	solutions6 = new Array;
	var s = calcul2__1et1();
	if (s == null) { s = calcul3__2et1(); }
	if (s == null) { s = calcul4__3et1(); }
	if (s == null) { s = calcul4__2et2(); }
	if (s == null) { s = calcul5__4et1(); }
	if (s == null) { s = calcul5__3et2(); }
	if (s == null) { s = calcul6__5et1(); }
	if (s == null) { s = calcul6__4et2(); }
	if (s == null) { s = calcul6__3et3(); }
	if (s == null) { s = soluce; }
	boutonReponse.estActif = true;
	return s;
}
function calcul2__1et1() {

	var possible = 63 	// 0011 1111		les 6 opérandes utilisables
	
	var v1 = 0;
	var v2 = 0;
	var v3 = 0;
	var e = 0;
	var c = "";
	var f = 0;

	for (var i = 0; i < 5; i++) {
		for (var j = i+1; j < 6; j++) {
			v1 = tirage[i];
			v2 = tirage[j];
			f = (possible ^ masques[i]) ^ masques[j];

			// Addition

			v3 = v1+v2;
			c = "("+lettres[i]+OPERATEURS[0]+lettres[j]+")"			
			if (v3 == cible) { return (new Solution(v3,c,f)) }
			if (Math.abs(cible - v3) < ecart) { ecart = Math.abs(cible - v3); soluce = new Solution(v3,c,f) }
			solutions2.push(new Solution(v3,c,f));

			// Soustraction

			if (v1 > v2) {
				v3 = v1-v2;
				c = "("+lettres[i]+OPERATEURS[1]+lettres[j]+")"			
				if (v3 == cible) { return (new Solution(v3,c,f)) }
				if (Math.abs(cible - v3) < ecart) { ecart = Math.abs(cible - v3); soluce = new Solution(v3,c,f) }
				solutions2.push(new Solution(v3,c,f));
			} else if (v2 > v1) {
				v3 = v2-v1;
				c = "("+lettres[j]+OPERATEURS[1]+lettres[i]+")"			
				if (v3 == cible) { return (new Solution(v3,c,f)) }
				if (Math.abs(cible - v3) < ecart) { ecart = Math.abs(cible - v3); soluce = new Solution(v3,c,f) }
				solutions2.push(new Solution(v3,c,f));
			}

			// Multiplication

			v3 = v1*v2;
			c = "("+lettres[i]+OPERATEURS[2]+lettres[j]+")"			
			if (v3 == cible) { return (new Solution(v3,c,f)) }
			if (Math.abs(cible - v3) < ecart) { ecart = Math.abs(cible - v3); soluce = new Solution(v3,c,f) }
			solutions2.push(new Solution(v3,c,f));

			// Division
			if (v1 > v2) {
				if ((v1 % v2) == 0) {
					v3 = v1/v2;
					c = "("+lettres[i]+OPERATEURS[3]+lettres[j]+")"			
					if (v3 == cible) { return (new Solution(v3,c,f)) }
					if (Math.abs(cible - v3) < ecart) { ecart = Math.abs(cible - v3); soluce = new Solution(v3,c,f) }
					solutions2.push(new Solution(v3,c,f));
				}
			} else {
				if ((v2 % v1) == 0) {
					v3 = v2/v1;
					c = "("+lettres[j]+OPERATEURS[3]+lettres[i]+")"			
					if (v3 == cible) { return (new Solution(v3,c,f)) }
					if (Math.abs(cible - v3) < ecart) { ecart = Math.abs(cible - v3); soluce = new Solution(v3,c,f) }
					solutions2.push(new Solution(v3,c,f));
				}
			}
		}
	}
	return null;
}
function calcul3__2et1() { return AjouteUnNouveauTerme(solutions2, solutions3); }
function calcul4__3et1() { return AjouteUnNouveauTerme(solutions3, solutions4); }
function calcul4__2et2() {
	var v1 = 0;
	var v2 = 0;
	var v3 = 0;
	var c = "";
	var f = 0;

	for (var i = 0; i < solutions2.length - 1; i++) {
		for (var j = i + 1; j < solutions2.length; j++) {
			if ((solutions2[i].filtre | solutions2[j].filtre) == 63) {
				
				v1 = solutions2[i].valeur;
				v2 = solutions2[j].valeur;
				f = solutions2[i].filtre & solutions2[j].filtre;
	
				// Addition

				v3 = v1+v2;
				c = "("+solutions2[i].chemin+OPERATEURS[0]+solutions2[j].chemin+")"			
				if (v3 == cible) { return (new Solution(v3,c,f)) }
				if (Math.abs(cible - v3) < ecart) { ecart = Math.abs(cible - v3); soluce = new Solution(v3,c,f) }
				solutions4.push(new Solution(v3,c,f));

				// Soustraction

				if (v1 > v2) {
					v3 = v1-v2;
					c = "("+solutions2[i].chemin+OPERATEURS[1]+solutions2[j].chemin+")"			
					if (v3 == cible) { return (new Solution(v3,c,f)) }
					if (Math.abs(cible - v3) < ecart) { ecart = Math.abs(cible - v3); soluce = new Solution(v3,c,f) }
					solutions4.push(new Solution(v3,c,f));
				} else if (v2 > v1) {
					v3 = v2-v1;
					c = "("+solutions2[j].chemin+OPERATEURS[1]+solutions2[i].chemin+")"				
					if (v3 == cible) { return (new Solution(v3,c,f)) }
					if (Math.abs(cible - v3) < ecart) { ecart = Math.abs(cible - v3); soluce = new Solution(v3,c,f) }
					solutions4.push(new Solution(v3,c,f));
				}

				// Multiplication

				v3 = v1*v2;
				c = "("+solutions2[i].chemin+OPERATEURS[2]+solutions2[j].chemin+")"			
				if (v3 == cible) { return (new Solution(v3,c,f)) }
				if (Math.abs(cible - v3) < ecart) { ecart = Math.abs(cible - v3); soluce = new Solution(v3,c,f) }
				solutions4.push(new Solution(v3,c,f));

				// Division

				if (v1 > v2) {
					if ((v1 % v2) == 0) {
						v3 = v1/v2;
						c = "("+solutions2[i].chemin+OPERATEURS[3]+solutions2[j].chemin+")"	
						if (v3 == cible) { return (new Solution(v3,c,f)) }
						if (Math.abs(cible - v3) < ecart) { ecart = Math.abs(cible - v3); soluce = new Solution(v3,c,f) }
						solutions4.push(new Solution(v3,c,f));
					}
				} else {
					if ((v2 % v1) == 0) {
						v3 = v2/v1;
						c = "("+solutions2[j].chemin+OPERATEURS[3]+solutions2[i].chemin+")"		
						if (v3 == cible) { return (new Solution(v3,c,f)) }
						if (Math.abs(cible - v3) < ecart) { ecart = Math.abs(cible - v3); soluce = new Solution(v3,c,f) }
						solutions4.push(new Solution(v3,c,f));
					}
				}
			}
		}
	}
	return null;
}
function calcul5__4et1() { return AjouteUnNouveauTerme(solutions4, solutions5); }
function calcul5__3et2() {
	var v1 = 0;
	var v2 = 0;
	var v3 = 0;
	var c = "";
	var f = 0;

	for (var i = 0; i < solutions3.length; i++) {
		for (var j = 0; j < solutions2.length; j++) {
			if ((solutions3[i].filtre | solutions2[j].filtre) == 63) {
				
				v1 = solutions3[i].valeur;
				v2 = solutions2[j].valeur;
				f = solutions3[i].filtre & solutions2[j].filtre;
	
				// Addition

				v3 = v1+v2;
				c = "("+solutions3[i].chemin+OPERATEURS[0]+solutions2[j].chemin+")"			
				if (v3 == cible) { return (new Solution(v3,c,f)) }
				if (Math.abs(cible - v3) < ecart) { ecart = Math.abs(cible - v3); soluce = new Solution(v3,c,f) }
				solutions5.push(new Solution(v3,c,f));

				// Soustraction

				if (v1 > v2) {
					v3 = v1-v2;
					c = "("+solutions3[i].chemin+OPERATEURS[1]+solutions2[j].chemin+")"			
					if (v3 == cible) { return (new Solution(v3,c,f)) }
					if (Math.abs(cible - v3) < ecart) { ecart = Math.abs(cible - v3); soluce = new Solution(v3,c,f) }
					solutions5.push(new Solution(v3,c,f));
				} else if (v2 > v1) {
					v3 = v2-v1;
					c = "("+solutions2[j].chemin+OPERATEURS[1]+solutions3[i].chemin+")"			
					if (v3 == cible) { return (new Solution(v3,c,f)) }
					if (Math.abs(cible - v3) < ecart) { ecart = Math.abs(cible - v3); soluce = new Solution(v3,c,f) }
					solutions5.push(new Solution(v3,c,f));
				}

				// Multiplication

				v3 = v1*v2;
				c = "("+solutions3[i].chemin+OPERATEURS[2]+solutions2[j].chemin+")"			
				if (v3 == cible) { return (new Solution(v3,c,f)) }
				if (Math.abs(cible - v3) < ecart) { ecart = Math.abs(cible - v3); soluce = new Solution(v3,c,f) }
				solutions5.push(new Solution(v3,c,f));

				// Division

				if (v1 > v2) {
					if ((v1 % v2) == 0) {
						v3 = v1/v2;
						c = "("+solutions3[i].chemin+OPERATEURS[3]+solutions2[j].chemin+")"	
						if (v3 == cible) { return (new Solution(v3,c,f)) }
						if (Math.abs(cible - v3) < ecart) { ecart = Math.abs(cible - v3); soluce = new Solution(v3,c,f) }
						solutions5.push(new Solution(v3,c,f));
					}
				} else {
					if ((v2 % v1) == 0) {
						v3 = v2/v1;
						c = "("+solutions2[j].chemin+OPERATEURS[3]+solutions3[i].chemin+")"		
						if (v3 == cible) { return (new Solution(v3,c,f)) }
						if (Math.abs(cible - v3) < ecart) { ecart = Math.abs(cible - v3); soluce = new Solution(v3,c,f) }
						solutions5.push(new Solution(v3,c,f));
					}
				}
			}
		}
	}
	return null;
}
function calcul6__5et1() {

	var v1 = 0;
	var v2 = 0;
	var v3 = 0;
	var f = null;

	for (var i = 0; i < solutions5.length; i++) {
		for (var j = 0; j < 6; j++) {
			if ((solutions5[i].filtre & masques[j]) == masques[j]) {
				
				v1 = solutions5[i].valeur;
				v2 = tirage[j];
	
				// Addition

				v3 = v1+v2;		
				if (v3 == cible) { return (new Solution(v3,("("+solutions5[i].chemin+OPERATEURS[0]+lettres[j]+")"),f)) }
				if (Math.abs(cible - v3) < ecart) { ecart = Math.abs(cible - v3); soluce = new Solution(v3,("("+solutions5[i].chemin+OPERATEURS[0]+lettres[j]+")"),f) }

				// Soustraction

				if (v1 > v2) {
					v3 = v1-v2;
					if (v3 == cible) { return (new Solution(v3,("("+solutions5[i].chemin+OPERATEURS[1]+lettres[j]+")"),f)) }
					if (Math.abs(cible - v3) < ecart) { ecart = Math.abs(cible - v3); soluce = new Solution(v3,("("+solutions5[i].chemin+OPERATEURS[1]+lettres[j]+")"),f) }
				} else if (v2 > v1) {
					v3 = v2-v1;			
					if (v3 == cible) { return (new Solution(v3,("("+lettres[j]+OPERATEURS[1]+solutions5[i].chemin+")"),f)) }
					if (Math.abs(cible - v3) < ecart) { ecart = Math.abs(cible - v3); soluce = new Solution(v3, ("("+lettres[j]+OPERATEURS[1]+solutions5[i].chemin+")"),f) }
				}

				// Multiplication

				v3 = v1*v2;						
				if (v3 == cible) { return (new Solution(v3,("("+solutions5[i].chemin+OPERATEURS[2]+lettres[j]+")"),f)) }
				if (Math.abs(cible - v3) < ecart) { ecart = Math.abs(cible - v3); soluce = new Solution(v3,("("+solutions5[i].chemin+OPERATEURS[2]+lettres[j]+")"),f) }

				// Division

				if (v1 > v2) {
					if ((v1 % v2) == 0) {
						v3 = v1/v2;						
						if (v3 == cible) { return (new Solution(v3,("("+solutions5[i].chemin+OPERATEURS[3]+lettres[j]+")"),f)) }
						if (Math.abs(cible - v3) < ecart) { ecart = Math.abs(cible - v3); soluce = new Solution(v3,("("+solutions5[i].chemin+OPERATEURS[3]+lettres[j]+")"),f) }

					}
				} else {
					if ((v2 % v1) == 0) {
						v3 = v2/v1;						
						if (v3 == cible) { return (new Solution(v3,("("+solutions5[j]+OPERATEURS[3]+tSource[i].chemin+")"),f)) }
						if (Math.abs(cible - v3) < ecart) { ecart = Math.abs(cible - v3); soluce = new Solution(v3,("("+solutions5[j]+OPERATEURS[3]+tSource[i].chemin+")"),f) }

					}
				}
			}
		}
	}
	return null;	
}
function calcul6__4et2() {
	var v1 = 0;
	var v2 = 0;
	var v3 = 0;
	var f = null;

	for (var i = 0; i < solutions4.length; i++) {
		for (var j = 0; j < solutions2.length; j++) {
			if ((solutions4[i].filtre | solutions2[j].filtre) == 63) {
				
				v1 = solutions4[i].valeur;
				v2 = solutions2[j].valeur;
	
				// Addition

				v3 = v1+v2;						
				if (v3 == cible) { return (new Solution(v3,("("+solutions4[i].chemin+OPERATEURS[0]+solutions2[j].chemin+")"),f)) }
				if (Math.abs(cible - v3) < ecart) { ecart = Math.abs(cible - v3); soluce = new Solution(v3,("("+solutions4[i].chemin+OPERATEURS[0]+solutions2[j].chemin+")")	,f) }

				// Soustraction

				if (v1 > v2) {
					v3 = v1-v2;								
					if (v3 == cible) { return (new Solution(v3,("("+solutions4[i].chemin+OPERATEURS[1]+solutions2[j].chemin+")"),f)) }
					if (Math.abs(cible - v3) < ecart) { ecart = Math.abs(cible - v3); soluce = new Solution(v3,("("+solutions4[i].chemin+OPERATEURS[1]+solutions2[j].chemin+")"),f) }
				} else if (v2 > v1) {
					v3 = v2-v1;								
					if (v3 == cible) { return (new Solution(v3,("("+solutions2[j].chemin+OPERATEURS[1]+solutions4[i].chemin+")"),f)) }
					if (Math.abs(cible - v3) < ecart) { ecart = Math.abs(cible - v3); soluce = new Solution(v3,("("+solutions2[j].chemin+OPERATEURS[1]+solutions4[i].chemin+")"),f) }
				}

				// Multiplication

				v3 = v1*v2;						
				if (v3 == cible) { return (new Solution(v3,("("+solutions4[i].chemin+OPERATEURS[2]+solutions2[j].chemin+")")	,f)) }
				if (Math.abs(cible - v3) < ecart) { ecart = Math.abs(cible - v3); soluce = new Solution(v3,("("+solutions4[i].chemin+OPERATEURS[2]+solutions2[j].chemin+")"),f) }

				// Division

				if (v1 > v2) {
					if ((v1 % v2) == 0) {
						v3 = v1/v2;							
						if (v3 == cible) { return (new Solution(v3,("("+solutions4[i].chemin+OPERATEURS[3]+solutions2[j].chemin+")"),f)) }
						if (Math.abs(cible - v3) < ecart) { ecart = Math.abs(cible - v3); soluce = new Solution(v3,("("+solutions4[i].chemin+OPERATEURS[3]+solutions2[j].chemin+")"),f) }
					}
				} else {
					if ((v2 % v1) == 0) {
						v3 = v2/v1;								
						if (v3 == cible) { return (new Solution(v3,("("+solutions2[j].chemin+OPERATEURS[3]+solutions4[i].chemin+")"),f)) }
						if (Math.abs(cible - v3) < ecart) { ecart = Math.abs(cible - v3); soluce = new Solution(v3,("("+solutions2[j].chemin+OPERATEURS[3]+solutions4[i].chemin+")"),f) }
					}
				}
			}
		}
	}
	return null;	
}
function calcul6__3et3() {
	var v1 = 0;
	var v2 = 0;
	var v3 = 0;
	var f = null;

	for (var i = 0; i < solutions3.length - 1; i++) {
		for (var j = i + 1; j < solutions3.length; j++) {
			if ((solutions3[i].filtre | solutions3[j].filtre) == 63) {
				
				v1 = solutions3[i].valeur;
				v2 = solutions3[j].valeur;
	
				// Addition

				v3 = v1+v2;				
				if (v3 == cible) { return (new Solution(v3,("("+solutions3[i].chemin+OPERATEURS[0]+solutions3[j].chemin+")"),f)) }
				if (Math.abs(cible - v3) < ecart) { ecart = Math.abs(cible - v3); soluce = new Solution(v3,("("+solutions3[i].chemin+OPERATEURS[0]+solutions3[j].chemin+")"),f) }

				// Soustraction

				if (v1 > v2) {
					v3 = v1-v2;					
					if (v3 == cible) { return (new Solution(v3,("("+solutions3[i].chemin+OPERATEURS[1]+solutions3[j].chemin+")"),f)) }
					if (Math.abs(cible - v3) < ecart) { ecart = Math.abs(cible - v3); soluce = new Solution(v3,("("+solutions3[i].chemin+OPERATEURS[1]+solutions3[j].chemin+")"),f) }
				} else if (v2 > v1) {
					v3 = v2-v1;							
					if (v3 == cible) { return (new Solution(v3,("("+solutions3[j].chemin+OPERATEURS[1]+solutions3[i].chemin+")"),f)) }
					if (Math.abs(cible - v3) < ecart) { ecart = Math.abs(cible - v3); soluce = new Solution(v3,("("+solutions3[j].chemin+OPERATEURS[1]+solutions3[i].chemin+")"),f) }
				}

				// Multiplication

				v3 = v1*v2;					
				if (v3 == cible) { return (new Solution(v3,("("+solutions3[i].chemin+OPERATEURS[2]+solutions3[j].chemin+")"),f)) }
				if (Math.abs(cible - v3) < ecart) { ecart = Math.abs(cible - v3); soluce = new Solution(v3,("("+solutions3[i].chemin+OPERATEURS[2]+solutions3[j].chemin+")"),f) }

				// Division

				if (v1 > v2) {
					if ((v1 % v2) == 0) {
						v3 = v1/v2;						
						if (v3 == cible) { return (new Solution(v3,("("+solutions3[i].chemin+OPERATEURS[3]+solutions3[j].chemin+")"),f)) }
						if (Math.abs(cible - v3) < ecart) { ecart = Math.abs(cible - v3); soluce = new Solution(v3,("("+solutions3[i].chemin+OPERATEURS[3]+solutions3[j].chemin+")"),f) }
					}
				} else {
					if ((v2 % v1) == 0) {
						v3 = v2/v1;							
						if (v3 == cible) { return (new Solution(v3,("("+solutions3[j].chemin+OPERATEURS[3]+solutions3[i].chemin+")"),f)) }
						if (Math.abs(cible - v3) < ecart) { ecart = Math.abs(cible - v3); soluce = new Solution(v3,("("+solutions3[j].chemin+OPERATEURS[3]+solutions3[i].chemin+")"),f) }
					}
				}
			}
		}
	}
	return null;
}
function AjouteUnNouveauTerme(tSource,tCible) {

	var v1 = 0;
	var v2 = 0;
	var v3 = 0;
	var c = "";
	var f = 0;

	for (var i = 0; i < tSource.length; i++) {
		for (var j = 0; j < 6; j++) {
			if ((tSource[i].filtre & masques[j]) == masques[j]) {
				
				v1 = tSource[i].valeur;
				v2 = tirage[j];
				f = tSource[i].filtre ^ masques[j];
	
				// Addition

				v3 = v1+v2;
				c = "("+tSource[i].chemin+OPERATEURS[0]+lettres[j]+")"			
				if (v3 == cible) { return (new Solution(v3,c,f)) }
				if (Math.abs(cible - v3) < ecart) { ecart = Math.abs(cible - v3); soluce = new Solution(v3,c,f) }
				tCible.push(new Solution(v3,c,f));

				// Soustraction

				if (v1 > v2) {
					v3 = v1-v2;
					c = "("+tSource[i].chemin+OPERATEURS[1]+lettres[j]+")"			
					if (v3 == cible) { return (new Solution(v3,c,f)) }
					if (Math.abs(cible - v3) < ecart) { ecart = Math.abs(cible - v3); soluce = new Solution(v3,c,f) }
					tCible.push(new Solution(v3,c,f));
				} else if (v2 > v1) {
					v3 = v2-v1;
					c = "("+lettres[j]+OPERATEURS[1]+tSource[i].chemin+")"			
					if (v3 == cible) { return (new Solution(v3,c,f)) }
					if (Math.abs(cible - v3) < ecart) { ecart = Math.abs(cible - v3); soluce = new Solution(v3,c,f) }
					tCible.push(new Solution(v3,c,f));
				}

				// Multiplication

				v3 = v1*v2;
				c = "("+tSource[i].chemin+OPERATEURS[2]+lettres[j]+")"			
				if (v3 == cible) { return (new Solution(v3,c,f)) }
				if (Math.abs(cible - v3) < ecart) { ecart = Math.abs(cible - v3); soluce = new Solution(v3,c,f) }
				tCible.push(new Solution(v3,c,f));

				// Division

				if (v1 > v2) {
					if ((v1 % v2) == 0) {
						v3 = v1/v2;
						c = "("+tSource[i].chemin+OPERATEURS[3]+lettres[j]+")"	
						if (v3 == cible) { return (new Solution(v3,c,f)) }
						if (Math.abs(cible - v3) < ecart) { ecart = Math.abs(cible - v3); soluce = new Solution(v3,c,f) }
						tCible.push(new Solution(v3,c,f));
					}
				} else {
					if ((v2 % v1) == 0) {
						v3 = v2/v1;
						c = "("+lettres[j]+OPERATEURS[3]+tSource[i].chemin+")"		
						if (v3 == cible) { return (new Solution(v3,c,f)) }
						if (Math.abs(cible - v3) < ecart) { ecart = Math.abs(cible - v3); soluce = new Solution(v3,c,f) }
						tCible.push(new Solution(v3,c,f));
					}
				}
			}
		}
	}
	return null;	
}
//#endregion

//#region CLASSES DE BOUTONS
//###################################################################################################################

class Commutateur {
	constructor(nomFichier, X, Y, L, H) {

		this.conteneurHTML = document.getElementById(nomFichier);
		this.conteneurHTML.style.position = "absolute";
		this.conteneurHTML.style.left = X;		
		this.conteneurHTML.style.top = Y;
		this.conteneurHTML.style.width = L;
		this.conteneurHTML.style.height = H;

		this.conteneurHTML.imgSwitch = new Array(2);
		for (var i = 0; i < 2; i++) {
			this.conteneurHTML.imgSwitch[i] = document.createElement("img");
			this.conteneurHTML.imgSwitch[i].src = "images/" + nomFichier + "_" + i.toString() + ".png";
		}

		this.conteneurHTML.ON = false;
		this.conteneurHTML.appendChild(this.conteneurHTML.imgSwitch[0]);
	}
}
class Bouton {

	static OFF = 0;
	static ON = 1;
	static SURVOL = 2;

	constructor(nomFichier, X, Y, L, H, actif) {

		this.conteneurHTML = document.getElementById(nomFichier);
		this.conteneurHTML.style.position = "absolute";
		this.conteneurHTML.style.left = X;		
		this.conteneurHTML.style.top = Y;
		this.conteneurHTML.style.width = L;
		this.conteneurHTML.style.height = H;
		
		this.conteneurHTML.imagesDeFond = new Array(3);
		for (var i = 0; i < 3; i++) {
			this.conteneurHTML.imagesDeFond[i] = document.createElement("img");
			this.conteneurHTML.imagesDeFond[i].src = "images/" + nomFichier + "_" + ((i).toString()) + ".png";			
		}

		this.conteneurHTML.index = 0;
		this.conteneurHTML.estActif = actif;
		if (actif) {this.conteneurHTML.appendChild(this.conteneurHTML.imagesDeFond[Bouton.ON]);} else {this.conteneurHTML.appendChild(this.conteneurHTML.imagesDeFond[Bouton.OFF]);}		

		this.conteneurHTML.addEventListener("mouseenter", this.sourisEntre)
		this.conteneurHTML.addEventListener("mouseleave", this.sourisSort)
	}

	get estActif() {
		return this.conteneurHTML.estActif;
	}
	set estActif(donnee) {
		// Modifie l'image du bouton (Actif ou Inactif) et conditionne la réponse au clic
		if (this.conteneurHTML.estActif != donnee) {
			this.conteneurHTML.estActif = donnee;
			while (this.conteneurHTML.firstChild) {this.conteneurHTML.removeChild(this.conteneurHTML.lastChild)}
			if (donnee) {this.conteneurHTML.appendChild(this.conteneurHTML.imagesDeFond[Bouton.ON])} else {this.conteneurHTML.appendChild(this.conteneurHTML.imagesDeFond[Bouton.OFF])}		
		}		
	}

	sourisEntre() {
		if (this.estActif) {
			if (this.lastChild) {this.lastChild.remove()}
			this.appendChild(this.imagesDeFond[Bouton.SURVOL]);
			this.style.zIndex = 1;
		}
	}
	sourisSort() {
		if (this.estActif) {
			if (this.lastChild) {this.lastChild.remove()}
			this.appendChild(this.imagesDeFond[Bouton.ON]);
			this.style.zIndex = 1;
		}
	}
}
class CadreOperande {

	constructor(nomFichier, X, Y, L, H, actif) {

		this.conteneurHTML = document.getElementById(nomFichier);
		this.conteneurHTML.style.position = "absolute";
		this.conteneurHTML.style.left = X;		
		this.conteneurHTML.style.top = Y;
		this.conteneurHTML.style.width = L;
		this.conteneurHTML.style.height = H;
		
		var img= document.createElement("img");
		img.src = "images/" + nomFichier + ".png";
		this.conteneurHTML.appendChild(img);

		this.conteneurHTML.index = 0;
		this.conteneurHTML.clefImage = 0;
		this.conteneurHTML.estActif = actif;

		this.conteneurHTML.addEventListener("mouseenter", this.sourisEntre)
		this.conteneurHTML.addEventListener("mouseleave", this.sourisSort)
		this.conteneurHTML.addEventListener("click", boutonsOperandes_click);
	}

	get estActif() {
		return this.conteneurHTML.estActif;
	}
	set estActif(donnee) {
		// Modifie la couleur du nombre, noir (Actif) ou gris (Inactif) et conditionne la réponse au clic et au survol
		if (this.conteneurHTML.estActif != donnee) {
			this.conteneurHTML.estActif = donnee;
			if (this.conteneurHTML.clefImage != 0) {
				var nbre = divNombres[this.conteneurHTML.index]
				while (nbre.firstChild) {nbre.removeChild(nbre.lastChild)}
				if (donnee) {nbre.appendChild(imgNombres[this.conteneurHTML.clefImage])} else {nbre.appendChild(imgNombres[this.conteneurHTML.clefImage-1000])}	
				this.conteneurHTML.style.zIndex = 1;			
			}
		}		
	}

	sourisEntre() {
		if ((this.estActif) && (this.clefImage != 0)) {
			var nbre = divNombres[this.index]
			while (nbre.firstChild) {nbre.removeChild(nbre.lastChild)}
			nbre.appendChild(imgNombres[this.clefImage+1000])
			this.style.zIndex = 1;
		}
	}
	sourisSort() {
		if ((this.estActif) && (this.clefImage != 0)) {
			var nbre = divNombres[this.index]
			while (nbre.firstChild) {nbre.removeChild(nbre.lastChild)}
			nbre.appendChild(imgNombres[this.clefImage])
			this.style.zIndex = 1;
		}
	}
}
class CadreResultat {

	constructor(nomFichier, idx) {

		this.conteneurHTML = document.getElementById(nomFichier);
		this.conteneurHTML.style.fontSize= CALCULS_FONTSIZE;		
		this.conteneurHTML.style.borderWidth = EPAISSEUR_TRAIT;
		this.conteneurHTML.style.cursor = "default";
		this.conteneurHTML.style.visibility = "hidden";
		this.conteneurHTML.style.padding = RESULTAT_PADDING;
		this.conteneurHTML.index = idx;
		this.conteneurHTML.clefImage = 0;
		this.conteneurHTML.estActif = true;
		this._texte = "";


		this.conteneurHTML.addEventListener("mouseenter", this.sourisEntre)
		this.conteneurHTML.addEventListener("mouseleave", this.sourisSort)
		this.conteneurHTML.addEventListener("click", boutonsOperandes_click);
	}

	get texte() {
		return this._texte;
	}
	set texte(donnee) {
		if (donnee != this._texte) {			
			if (donnee == ""){
				this.conteneurHTML.style.visibility="hidden";
			} else {
				this.conteneurHTML.style.visibility="visible";
			}
			this._texte = donnee;
			this.conteneurHTML.innerHTML = donnee;
		}
	}

	get estActif() {
		return this.conteneurHTML.estActif;
	}
	set estActif(donnee) {
		// Modifie la couleur du nombre, noir (Actif) ou gris (Inactif) et conditionne la réponse au clic et au survol
		if (this.conteneurHTML.estActif != donnee) {
			this.conteneurHTML.estActif = donnee;
			if (donnee) {this.conteneurHTML.style.color = "black";} else {this.conteneurHTML.style.color = "rgb(198,198,198)";}
		}		
	}

	sourisEntre() {
		if (this.estActif) {
			this.style.color = COULEUR_SELECTION;
		}
	}
	sourisSort() {
		if (this.estActif) {
			this.style.color = "black";
		}
	}
}
class ListeDeroulante {

	static membres = new Array(6);

	constructor(idElement, X, Y) {

		

		this.conteneurHTML = document.getElementById(idElement);
		this.conteneurHTML.evenementValeurSaisie = new Event("onvaleursaisie");
		this.conteneurHTML.listeDeroulante  = this;
		

		this.conteneurHTML.style.position = "absolute";
		this.conteneurHTML.style.left = X;		
		this.conteneurHTML.style.top = Y;

		this.index = parseInt(idElement.substring(idElement.length-1)) - 1;	
		ListeDeroulante.membres[this.index] = this;
		this._valeur = 0;
		this.aLeFocus = false;

		var nomFichier = idElement.substring(0,idElement.length-1);

		this.conteneurHTML.imagesDeFond = [document.createElement("img"), document.createElement("img"), document.createElement("img")];
		for (var i = 0; i < 3; i++) {
			this.conteneurHTML.imagesDeFond[i].src = "images/" + nomFichier + this.conteneurHTML.dataset.colonne + "_" + i.toString() + ".png";
			this.conteneurHTML.imagesDeFond[i].classList.toggle("exitDeroulant");
			this.conteneurHTML.imagesDeFond[i].style.position = "absolute"; // Rend effectif le Z-Order
		}

		
		this.conteneurHTML.appendChild(this.conteneurHTML.imagesDeFond[0]);

		this.conteneurHTML.addEventListener("mouseenter", this.sourisEntre);
		this.conteneurHTML.addEventListener("mouseleave", this.sourisSort);
		this.conteneurHTML.addEventListener("click", this.clicBouton);

		// Liste déroulante disparait si clic extérieur
		window.onclick = function(event) {
			if (!event.target.matches(".exitDeroulant")) {
				var liste = document.getElementById("contenuDeroulant");
				if (liste) {
					if (liste.style.display == "block") {
						liste.style.display = "none";
						ListeDeroulante.retireFocus();
					}					
				}
			}
		} 
	}

	get valeur() {
		return this._valeur;
	}
	set valeur(donnee) { 
		if (donnee != this._valeur) {
			this._valeur = donnee;
			while (this.conteneurHTML.firstChild) {this.conteneurHTML.removeChild(this.conteneurHTML.lastChild)}
			
			if (this._valeur != 0) {

				// Détermine si la même image n'est pas déjà présente.
				var clef = this._valeur;
				for (var i = 0; i < 6; i++) {
					if (this._valeur == ListeDeroulante.membres[i]._valeur) {
						if (i != this.index) {
							if (ListeDeroulante.membres[i].conteneurHTML.firstChild === imgNombres[clef]) {
								clef = clef + 100;
							}
						}
					}
				}

				var img = imgNombres[clef];	
				var elm = this.conteneurHTML;			
				img.style.position = "absolute";
				img.style.top = ((elm.imagesDeFond[0].height - img.height) / 2).toString() + "px";
				var gauche = (elm.imagesDeFond[0].width - BOUTON_SAISIE_DECALAGE - img.width) /2;
				if (elm.dataset.colonne == "G") {gauche = gauche + BOUTON_SAISIE_DECALAGE;}
				img.style.left = gauche.toString() + "px";
				this.conteneurHTML.appendChild(img);
			}
			this.conteneurHTML.appendChild(this.conteneurHTML.imagesDeFond[0]);		
			this.conteneurHTML.dispatchEvent(this.conteneurHTML.evenementValeurSaisie);	
		}
	}

	static afficheImage(indexBouton, indexImage) {

		// Affiche l'image de fond voulue en préservant l'image de la valeur contenue
		var elm = ListeDeroulante.membres[indexBouton].conteneurHTML;
		var imgValeur;
		while (elm.firstChild) {
			if (elm.lastChild.matches(".imgNombres")) {imgValeur = elm.lastChild}
			elm.removeChild(elm.lastChild)
		}
		if (imgValeur) {elm.appendChild(imgValeur);}
		elm.appendChild(elm.imagesDeFond[indexImage]);
	}

	static retireFocus() {
		for (var i = 0; i < 6; i++) {
			if (ListeDeroulante.membres[i].aLeFocus) {
				ListeDeroulante.membres[i].aLeFocus = false;
				ListeDeroulante.afficheImage(i,0);
			}
		}
	}

	sourisEntre() {
		if (!this.listeDeroulante.aLeFocus) {
			ListeDeroulante.afficheImage(this.listeDeroulante.index, 2);
		}
	}
	sourisSort() {
		if (!this.listeDeroulante.aLeFocus) {
			ListeDeroulante.afficheImage(this.listeDeroulante.index, 0);
		}
	}
	clicBouton() {
		if (!this.listeDeroulante.aLeFocus) {

			// Change le focus			
			ListeDeroulante.retireFocus();
			this.listeDeroulante.aLeFocus = true;
			ListeDeroulante.afficheImage(this.listeDeroulante.index, 1);

			// Crée la liste et la peuple
			var liste = document.getElementById("contenuDeroulant");
			while (liste.firstChild) {
				liste.lastChild.removeEventListener("click", ListeDeroulante.clicOption);
				liste.removeChild(liste.lastChild)
			}
			for (var i = 0; i < 14; i++) {
				var nbre = NOMBRES_INITIAUX[i];
				var quantite = 0;
				for (var j = 0; j < 6; j++) {
					if (ListeDeroulante.membres[j]._valeur == NOMBRES_INITIAUX[i]) { quantite++; }					
				}
				if (((i < 10) && (quantite < 2)) || ((i > 9) && (quantite < 1))) {
					var dv = document.createElement("div");
					dv.classList.toggle("optionDeroulante");
					dv.innerHTML = "&ensp;" + NOMBRES_INITIAUX[i].toString() + "&ensp;";
					liste.appendChild(dv);
					dv.addEventListener("click", ListeDeroulante.clicOption);
				}
			}

			// Affiche la liste préparée
			liste.style.display = "block"; // Doit être visible AVANT d'être mesurée (sinon renvoit 0)
			liste.style.zIndex = 1;
			liste.style.top = (parseInt(this.style.top,10) - ((liste.clientHeight - this.imagesDeFond[0].height) /2)).toString() + "px";
			if (this.dataset.colonne == "G") {
				liste.style.left= (parseInt(this.style.left,10) + BOUTON_SAISIE_DECALAGE).toString() + "px";
			} else {
				liste.style.left= (parseInt(this.style.left,10) + parseInt(this.imagesDeFond[0].width,10) - BOUTON_SAISIE_DECALAGE - parseInt(liste.offsetWidth,10)).toString() + "px";
			}
		}		
	}
	static clicOption() {

		var valeurChoisie = parseInt(this.innerHTML,10);
		var boutonCible;
		for (var i = 0; i < 6; i++) { if (ListeDeroulante.membres[i].aLeFocus) { boutonCible =ListeDeroulante.membres[i]; i=6; }}
		boutonCible.valeur = valeurChoisie;
		console.log("Bt N° " + boutonCible.index.toString() + ", valeur : " + this.innerHTML);
	}

}
class InputFocus { // HOCUS POCUS, ... HANNAL NASSRAR, OURVASS BESSETH, DORIEL TIEMBÉ !

	constructor(idConteneurImage, X1, Y1, idZoneTexte, X2, Y2) {

		this.conteneurHTML = document.getElementById(idConteneurImage);
		this.conteneurHTML.inputFocus = this;
		this.conteneurHTML.style.position = "absolute";
		this.conteneurHTML.style.left = X1;		
		this.conteneurHTML.style.top = Y1;		
		
		this.conteneurHTML.imagesDeFond = [document.createElement("img"), document.createElement("img")];
		this.conteneurHTML.imagesDeFond[0].src = "images/" + idConteneurImage + "_0.png";			
		this.conteneurHTML.imagesDeFond[1].src = "images/" + idConteneurImage + "_1.png";	
		
		this.conteneurHTML.appendChild(this.conteneurHTML.imagesDeFond[0]);

		this.zoneTexte = document.getElementById(idZoneTexte);
		this.zoneTexte.inputFocus = this;
		this.zoneTexte.style.position = "absolute";
		this.zoneTexte.style.left = X2;		
		this.zoneTexte.style.top = Y2;	
		this.zoneTexte.style.fontSize = ENTREE_SAISIE_FONTSIZE;

		this.conteneurHTML.imagesDeFond[0].onload = function() {
			var zoneTxt = this.parentNode.inputFocus.zoneTexte;
			zoneTxt.style.width = ((this.width - parseInt(zoneTxt.style.left,10))*0.9).toString() + "px";
		}

		this.conteneurHTML.addEventListener("mouseenter", this.sourisEntre);
		this.conteneurHTML.addEventListener("mouseleave", this.sourisSort);
		this.conteneurHTML.addEventListener("click", this.clicConteneur);
		this.zoneTexte.addEventListener("mouseenter", this.sourisEntre);
		this.zoneTexte.addEventListener("mouseleave", this.sourisSort);
		this.zoneTexte.addEventListener("focusin",this.focusIn);
		this.zoneTexte.addEventListener("focusout",this.focusOut);
	}

	clicConteneur() {
		this.inputFocus.zoneTexte.focus();
	}
	sourisEntre() {
		var hocusPocus = this.inputFocus;
		if (!(hocusPocus.zoneTexte === document.activeElement)){
			while (hocusPocus.conteneurHTML.firstChild) {hocusPocus.conteneurHTML.removeChild(hocusPocus.conteneurHTML.lastChild);}
			hocusPocus.conteneurHTML.appendChild(hocusPocus.conteneurHTML.imagesDeFond[1]);
		}
	}
	sourisSort() {
		var hocusPocus = this.inputFocus;
		if (!(hocusPocus.zoneTexte === document.activeElement)){
			while (hocusPocus.conteneurHTML.firstChild) {hocusPocus.conteneurHTML.removeChild(hocusPocus.conteneurHTML.lastChild);}
			hocusPocus.conteneurHTML.appendChild(hocusPocus.conteneurHTML.imagesDeFond[0]);
		}
	}
	focusIn() {
		var conteneur = this.inputFocus.conteneurHTML;
		while (conteneur.firstChild) {conteneur.removeChild(conteneur.lastChild);}
		conteneur.appendChild(conteneur.imagesDeFond[1]);
	}
	focusOut() {
		var conteneur = this.inputFocus.conteneurHTML;
		while (conteneur.firstChild) {conteneur.removeChild(conteneur.lastChild);}
		conteneur.appendChild(conteneur.imagesDeFond[0]);
	}
}
//#endregion

//#region INSTANCIATION DES ÉLÉMENTS DE LA PAGE
//###################################################################################################################


// VARIABLES CSS


var racineCSS = document.querySelector(':root');
racineCSS.style.setProperty("--epaisseur-trait", EPAISSEUR_TRAIT);


// CHARGEMENT DES IMAGES


var imgFond = document.createElement("img");  	// L'image de fond
imgFond.src = "images/fond_lceb.png"
imgFond.onload = function() {document.body.style.width = imgFond.width.toString() + "px";}

var imgAcceuil = document.createElement("img");  // L'image qui n'apparaît qu'à l'acceuil
imgAcceuil.src = "images/panneauAcceuil.png";
var acceuil = document.getElementById("panneauAcceuil");
acceuil.style.position = "absolute";
acceuil.style.left = acceuilX;
acceuil.style.top = acceuilY;
acceuil.appendChild(imgAcceuil);

var imgRuban = document.createElement("img");  	// Le Ruban de 0 à 9, pour l'animation du rouleau
imgRuban.src = "images/ruban_chiffres.png";
imgRuban.onload = function() { for (var i = 0; i < 3; i++) {ctxRouleaux[i].drawImage(imgRuban, 0, RUBAN_Y[0], ROULEAU_L, ROULEAU_H, 0, 0, ROULEAU_L, ROULEAU_H);} }

var imgNombres = {};  							// Les nombres initiaux dans un dictionnaire
for (var i = 0; i < 24; i++) {
	for (var j = 0; j < 3; j++) {
		var img = document.createElement("img");
		img.src = "images/nombre" + (NOMBRES_INITIAUX[i].toString()) + "_" + j.toString() +  ".png";
		var clef = NOMBRES_INITIAUX[i];
		if (i > 13) {clef = clef + 100}
		clef = clef + (1000 * (j-1))
		imgNombres[clef] = img;
		imgNombres[clef].classList.toggle("imgNombres");
	}
}



// IMAGE DE FOND


var fond = document.getElementById("fond_lceb");
fond.style.position = "relative"; //permet au parent de servir d'origine aux coordonnées "absolute" de ses enfants


// BOUTONS

boutonSwitch = new Commutateur("switchEntree",SWITCH_ENTREE_X, SWITCH_ENTREE_Y, SWITCH_ENTREE_L, SWITCH_ENTREE_H);
boutonSwitch.conteneurHTML.addEventListener("click", boutonSwitch_click);

boutonCorrection = new Bouton("boutonCorrection",BOUTON_CORRECTION_X, BOUTON_CORRECTION_Y, BOUTON_CORRECTION_L, BOUTON_CORRECTION_H, false);
boutonCorrection.conteneurHTML.addEventListener("click", boutonCorrection_click);

boutonReponse = new Bouton("boutonReponse",BOUTON_REPONSE_X, BOUTON_REPONSE_Y, BOUTON_REPONSE_L, BOUTON_REPONSE_H, false);
boutonReponse.conteneurHTML.addEventListener("click", boutonReponse_click);

boutonLancer = new Bouton("boutonLancer",BOUTON_LANCER_X, BOUTON_LANCER_Y, BOUTON_LANCER_L, BOUTON_LANCER_H, true);
boutonLancer.conteneurHTML.addEventListener("click", boutonLancer_click);

boutonEntrer = new Bouton("boutonEntrer",BOUTON_LANCER_X, BOUTON_LANCER_Y, BOUTON_LANCER_L, BOUTON_LANCER_H, true);
boutonEntrer.conteneurHTML.addEventListener("click", boutonEntrer_click);
boutonEntrer.conteneurHTML.style.visibility = "hidden";

var boutonsOperateurs = new Array(4);
for (var i = 0; i < 4; i++) {
	boutonsOperateurs[i] = new Bouton("boutonOperateur" + (i+1).toString(), OPERATEUR_X[i], OPERATEUR_Y[i], OPERATEUR_L, OPERATEUR_H[i], false);
	boutonsOperateurs[i].conteneurHTML.index = i;
	boutonsOperateurs[i].conteneurHTML.addEventListener("click", boutonsOperateurs_click);
}

var boutonsOperandes = new Array(11);
for (var i = 0; i < 6; i++) {
	boutonsOperandes[i] = new CadreOperande("cadreOperande" + (i+1).toString(), OPERANDE_X[i], OPERANDE_Y[i], OPERANDE_L[i], OPERANDE_H, false);
	boutonsOperandes[i].conteneurHTML.index = i;
}
for (var i = 6; i < 11; i++) {
	boutonsOperandes[i] = new CadreResultat("resultat" + (i-5).toString(), i);
}

var switchEntree = document.getElementById("switchEntree");
var imgSwitch = []

// CANVAS ET CONTEXTE ANIM DU ROULEAU


var ctxRouleaux = new Array(3);
for (var i = 0; i < 3; i++) {
	var cnv = document.getElementById("canvasRouleau"+(i+1).toString());
	cnv.style.position = "absolute";
	cnv.style.top = ROULEAU_Y;
	cnv.style.left = ROULEAU_X[i];
	cnv.width = ROULEAU_L;
	cnv.height = ROULEAU_H;
	ctxRouleaux[i] = cnv.getContext("2d");
}


// CONTENEURS DES 6 NOMBRES VARIANTS SOUS LES BOUTONS OPÉRATEURS


var divNombres = new Array(6);
for (var i = 0; i < 6; i++) {
	divNombres[i] = document.getElementById("nombre"+(i+1).toString());
	divNombres[i].style.position = "absolute";
	divNombres[i].style.top = NOMBRE_Y[i];
}


// ZONE DE CALCUL


var zoneCalcul = document.getElementById("zoneCalcul");
zoneCalcul.style.position = "absolute";
zoneCalcul.style.top = OPERANDE_Y[1];
zoneCalcul.style.left = CALCULS_X;
zoneCalcul.style.padding = "0px";
var calculs = new Array(5);
for (var i = 0; i < 5; i++) {
	calculs[i] = document.getElementById("calcul" + (i+1).toString());
	calculs[i].style.fontSize= CALCULS_FONTSIZE;
}
var calculenCours = 0;


// ZONE DE SAISIE


var zoneSaisie = document.getElementById("zoneSaisie");
zoneSaisie.style.position = "absolute";
zoneSaisie.style.top = SAISIE_Y;
zoneSaisie.style.left = SAISIE_X;
zoneSaisie.style.width = SAISIE_L;
zoneSaisie.style.fontSize = SAISIE_FONTSIZE;

var boutonsSaisies = new Array(6);
for (var x = 0; x < 2; x++) { for (var y = 0; y < 3; y++) {
	var index = (y+1)+(3*x);
	boutonsSaisies[index-1] = new ListeDeroulante("boutonSaisie" + index.toString(), BOUTON_SAISIE_X[x], BOUTON_SAISIE_Y[y]);
	boutonsSaisies[index-1].conteneurHTML.addEventListener("onvaleursaisie", verifieSaisie);
}}

document.getElementById("nombreCible").style.top = BOUTON_SAISIE_Y[3];
document.getElementById("nombreCible").style.width = SAISIE_L;

var boutonSaisieCible = new InputFocus("boutonSaisieCible", "0px", BOUTON_SAISIE_CIBLE_Y, "entreeCible", BOUTON_SAISIE_DECALAGE.toString() + "px", ENTREE_SAISIE_CIBLE_Y);
boutonSaisieCible.zoneTexte.addEventListener("keydown", boutonSaisieCible_keyDown);
boutonSaisieCible.zoneTexte.addEventListener("keyup", verifieSaisie);

var boutonGo = new Bouton("boutonGo",BOUTON_GO_X,BOUTON_GO_Y,BOUTON_GO_L,BOUTON_GO_H);
boutonGo.conteneurHTML.addEventListener("click", boutonGo_click);

//#endregion

//#region FONCTIONS TIRAGE
//###################################################################################################################


function lanceTirage(nombreCible, operandes) {

	// Nettoie la zone de calcul
	for (var i = 0; i < 5; i++) { calculs[i].innerHTML = ""; boutonsOperandes[i+6].texte = ""; boutonsOperandes[i+6].estActif = true; }
	for (var i = 1; i < 5; i++) { calculs[i].style.display = "inline"; boutonsOperandes[i+6].conteneurHTML.style.display = "inline";}
	calculenCours = 0;
	gelOperandes = false;

	// Initialise les variables pour l'anim
	dernierTour = [false, false, false];
	rouleauOK = [false, false, false];
	ancienChrono = 0;
	demandeAffichage = new Date().getTime() + 100;

	if (nombreCible == 0) {
		// Génère aléatoirement la cible 
		cible = Math.floor(Math.random() * (999 - 100 +1)) + 100; // nombre aléatoire appartenant à [100;999]

		// Génère aléatoirement les nombres
		tirage = [-1,-1,-1,-1,-1,-1];
		for (var i = 0; i < 6; i++) {
			do {
				var nombre = Math.floor(Math.random() * (23 - 0 +1)) + 0; // nombre aléatoire appartenant à [0;23]
				var unique = true;
				for (var j = i - 1; j > -1; j--) {
					if (tirage[j] == nombre) {unique = false}
				}
				if (unique) { tirage[i] = nombre }
			} while (tirage[i] == -1);
		}
		for (var i = 0; i < 6; i++) { 
			tirage[i] = NOMBRES_INITIAUX[tirage[i]];
		}
	} else {
		// Prend les nombres entrés manuellement
		cible = nombreCible;
		tirage = operandes;
	}

	// TEST
	// cible = 356; tirage = [1,5,3,1,6,5]; // TEST
	// FIN TEST

	var s = cible.toString();
	numerosRouleau = [parseInt(s.substr(0,1)), parseInt(s.substr(1,1)), parseInt(s.substr(2,1))];



	window.requestAnimationFrame(animeRouleaux);
	
}
function animeRouleaux() {
	chrono = new Date().getTime();
	if (chrono > (ancienChrono + delai)) {
		ancienChrono = chrono;
		for (var i = 0; i < 3; i++) {
			if (!rouleauOK[i]) {

				rubanY[i] = rubanY[i] + RUBAN_DECALAGE;
				if (rubanY[i] >= RUBAN_Y[10]) {
					rubanY[i] = rubanY[i] - RUBAN_Y[10];
					if (chrono > demandeAffichage) {
						dernierTour[i] = true;
					}
				}
				if (dernierTour[i] && (rubanY[i] >= RUBAN_Y[numerosRouleau[i]])) {
					ctxRouleaux[i].drawImage(imgRuban, 0, RUBAN_Y[numerosRouleau[i]], ROULEAU_L,
				 ROULEAU_H, 0, 0, ROULEAU_L,
				 ROULEAU_H);
					rouleauOK[i] = true;
				} else {
					ctxRouleaux[i].drawImage(imgRuban, 0, rubanY[i], ROULEAU_L,
				 ROULEAU_H, 0, 0, ROULEAU_L,
				 ROULEAU_H);	
				}
			}
		}
	}
	if (rouleauOK[0] && rouleauOK[1] && rouleauOK[2]) {
		afficheNombres();
		
		
		return;
	} else {
		window.requestAnimationFrame(animeRouleaux);
	}
}
function afficheNombres() {

	// Classe les nombres (croissant) pour s'adapter à l'affichage
	tirage = tirage.sort(function (a, b) {  return a - b;  });
	// Emplacement 5 : Le seul pouvant acceuillir 100
	var ordreAffichage = new Array(6)
	ordreAffichage[4] = tirage[5];
	// Emplacement 1 et 4 assez large pour 10 max
	ordreAffichage[0] = tirage[1];
	ordreAffichage[3] = tirage[0];
	// Emplacement 2,3 et 6 avec ce qui reste
	ordreAffichage[1] = tirage[4];
	ordreAffichage[2] = tirage[2];	
	ordreAffichage[5] = tirage[3];	
	for (var i = 0; i < 6; i++) { 
		tirage[i] = ordreAffichage[i];
		operandes[i] = tirage[i];
		used[i] = false;
	}
	for (var i = 6; i < 11; i++) { operandes[i] = -1; used[i] = false; }

	for (i = 0; i < 6; i++) {
		while (divNombres[i].firstChild) {divNombres[i].removeChild(divNombres[i].lastChild)}
		// Détermine si la même image n'est pas déjà présente.
		var clef = tirage[i]
		for (var j = i - 1; j > -1; j--) { if (tirage[j] == clef) {clef = clef + 100}}
		// Attribue la nouvelle image.
		imgNombres[clef].style.position = "static";
		divNombres[i].style.left = (NOMBRE_CENTRE_X[i] - (imgNombres[clef].width / 2)).toString() + "px";
		divNombres[i].appendChild(imgNombres[clef]);
		boutonsOperandes[i].estActif = true;
		boutonsOperandes[i].conteneurHTML.clefImage = clef;
		boutonsOperandes[i].conteneurHTML.style.zIndex = 1;
	}
	for (i = 0; i < 4; i++) { boutonsOperateurs[i].estActif = true; }
	LAsolution = calcule();
}
//#endregion

//#region GESTIONNAIRES D'EVENEMENTS
//###################################################################################################################


function boutonSwitch_click() {

	// Commute valeur (ON ou OFF) et image
	this.ON = !this.ON;
	while (this.firstChild) {this.removeChild(this.lastChild)}
	this.appendChild(this.imgSwitch[this.ON ? 1 : 0]);
	
	// Commute les boutons entre "entrée manuelle"/"lance au hasard"
	boutonLancer.conteneurHTML.style.visibility = (this.ON ? "hidden" : "visible");
	boutonEntrer.conteneurHTML.style.visibility = (this.ON ? "visible" : "hidden");	
}
function boutonCorrection_click() {
	if (boutonCorrection.estActif) {

		if (calculenCours > 4) {
			calculenCours--;
			boutonCorrection_click();
		} else if (calculs[calculenCours].innerHTML.length == 0) {
			calculenCours--;
			boutonCorrection_click();
		} else {

			// Dégèle tous les opérandes de la ligne
			var s = calculs[calculenCours].innerHTML;
			if (s.includes("=")) { s = s.replace("="," ") }
			var t = [s];
			for (var i = 0; i < 4; i++) { 
				if (s.includes(OPERATEURS[i])) { t = s.split(OPERATEURS[i]); break; }
			}
			for (var i = 0; i < t.length; i++) {
				if (t[i].trim() != "") {
					for (j = 0; j < 11; j++) { 
						if ((operandes[j] == parseInt(t[i].trim())) && (!boutonsOperandes[j].estActif) && (j != (calculenCours+6))) { 
							boutonsOperandes[j].estActif = true; 
							break; 
						}
					}
				}
			}

			// Efface la ligne
			calculs[calculenCours].innerHTML = "";
			boutonsOperandes[calculenCours + 6].texte = "";
			boutonsOperandes[calculenCours + 6].estActif = true;
			
			
			// Gèle le bouton correction s'il n'y a plus rien à corriger
			if (calculenCours == 0) {
				boutonCorrection.estActif = false;
			}

		}
	}
}
function boutonReponse_click() {
	if (boutonReponse.estActif) {
		// Nettoie la zone de calcul
		for (var i = 0; i < 6; i++) { boutonsOperandes[i].estActif = true; }
		for (var i = 0; i < 5; i++) { calculs[i].innerHTML = ""; boutonsOperandes[i+6].texte = ""; boutonsOperandes[i+6].estActif = true; }
		for (var i = 1; i < 5; i++) { calculs[i].style.display = "none"; boutonsOperandes[i+6].conteneurHTML.style.display = "none";}
		boutonCorrection.estActif = false;
		boutonReponse.estActif = false;
		gelOperandes = true;

		var s = LAsolution.chemin
		for (var i = 0; i < 6; i++) { 
			if (s.includes(lettres[i])) {
				s = s.replace(lettres[i], tirage[i]) 
				boutonsOperandes[i].estActif = false;
			}
		}
		var explication = "";

		var pFerme = s.indexOf(")");
		while (pFerme > -1) {
			var pOuvre = s.lastIndexOf("(", pFerme);
			var expression = s.substring(pOuvre + 1, pFerme);
			var operation;
			var termes;
			var valeur;
			switch (true) {
				case (expression.includes(OPERATEURS[0])) : operation = 0; termes = expression.split(OPERATEURS[0]); valeur = parseInt(termes[0]) + parseInt(termes[1]); break;
				case (expression.includes(OPERATEURS[1])) : operation = 1; termes = expression.split(OPERATEURS[1]); valeur = parseInt(termes[0]) - parseInt(termes[1]); break;
				case (expression.includes(OPERATEURS[2])) : operation = 2; termes = expression.split(OPERATEURS[2]); valeur = parseInt(termes[0]) * parseInt(termes[1]); break;
				case (expression.includes(OPERATEURS[3])) : operation = 3; termes = expression.split(OPERATEURS[3]); valeur = parseInt(termes[0]) / parseInt(termes[1]); break;				
			}
			explication = explication + termes[0] + " " + OPERATEURS[operation] + " " + termes[1] + " = " + valeur.toString() +  "<br>";
			s = s.substring(0, pOuvre) + valeur.toString() + s.substring(pFerme + 1);
			pFerme = s.indexOf(")");
		}
		if (LAsolution.valeur == cible) {
			explication = "Trouvé ! :<br>" + explication;
		} else {
			explication = "Pas mieux que :<br>" + explication;
		}

		calculs[0].innerHTML = explication;
	}
}
function boutonLancer_click() {

	if (acceuil) {
		acceuil.style.display = "none";
		acceuil = null;
		imgAcceuil = null;
		acceuilX = null;
		acceuilY = null;
	}

	boutonCorrection.estActif = false;
	boutonReponse.estActif = false;
	document.getElementById("zoneCalcul").style.display = "block";
	document.getElementById("zoneSaisie").style.display = "none";
	for (var i = 0; i < 4; i++) { boutonsOperateurs[i].estActif = false; }
	for (var i = 0; i < 6; i++) { while (divNombres[i].firstChild) {divNombres[i].removeChild(divNombres[i].lastChild)} boutonsOperandes[i].conteneurHTML.clefImage = 0; }
	lanceTirage(0,null);

}
function boutonsOperandes_click() {
	if ((this.estActif) && (!gelOperandes)) {
		var newOpd= operandes[this.index];
		var chaineCalcul = calculs[calculenCours].innerHTML;
		var oldOpd = parseInt(chaineCalcul.substring(0, chaineCalcul.length - 1));
		var dernierCaractere = chaineCalcul.substring(chaineCalcul.length - 1);
		var resultat = 0;

		switch (true) {	
			
			// User entre une addition
			case (dernierCaractere == OPERATEURS[0]) : 				
				resultat = oldOpd + newOpd; break;

			// User tente une soustraction
			case (dernierCaractere == OPERATEURS[1]) : 
				resultat = oldOpd - newOpd;
				if (resultat < 0) { 
					var temp = oldOpd; oldOpd = newOpd; newOpd = temp; resultat = resultat * -1
				} else if (resultat == 0) {
					alert("Cette opération, franchement ... c'est vraiment zéro.");
					resultat = IMPOSSIBLE;
				} break;
			
			// User entre une multiplication
			case (dernierCaractere == OPERATEURS[2]) : 
				resultat = oldOpd * newOpd; break;

			// User tente une division
			case (dernierCaractere == OPERATEURS[3]) : 
				if (oldOpd % newOpd != 0) { 
					alert("Opération impossible !\n" + oldOpd.toString() + " n'est pas divisible par " + newOpd.toString() + " !");
					resultat = IMPOSSIBLE;
				} else {
					resultat = oldOpd / newOpd;
				}break;

			// User clic deux fois d'affilée sur un opérande : changement de premier opérande	
			case (chaineCalcul.length != 0) :
				oldOpd = parseInt(chaineCalcul);
				chaineCalcul = "";
				// Dévérouille le bouton oldOpd désormais à nouveaux utilisable				
				for (i = 0; i < 11; i++) { 
					if ((operandes[i] == oldOpd) && (!boutonsOperandes[i].estActif)) { 
						boutonsOperandes[i].estActif = true; 
						break; 
					}
				}
		}

		if (resultat != IMPOSSIBLE){
			if (resultat == 0) {
				calculs[calculenCours].innerHTML = newOpd.toString();
				boutonCorrection.estActif = true;
			} else {
				calculs[calculenCours].innerHTML = oldOpd + " " + dernierCaractere + " " + newOpd + " = ";
				boutonsOperandes[calculenCours + 6].texte =  resultat.toString();
				operandes[calculenCours + 6] = resultat;
				calculenCours++;
			}
			boutonsOperandes[this.index].estActif = false;
		}
	}
}
function boutonsOperateurs_click() {
	var bt = boutonsOperateurs[this.index];
	if ((bt.estActif) && (!gelOperandes)) {
		var chaineCalcul = calculs[calculenCours].innerHTML;
		// Un calcul commence par un opérande et non un opérateur
		if (chaineCalcul.length != 0) {
			var dernierCaractere = chaineCalcul.substring(chaineCalcul.length -1);
			switch (dernierCaractere) {
				case OPERATEURS[0] :
				case OPERATEURS[1] :
				case OPERATEURS[2] :
				case OPERATEURS[3] :
					// User substitue l'opérateur déjà entré
					calculs[calculenCours].innerHTML = chaineCalcul.substring(0,chaineCalcul.length-1) + OPERATEURS[this.index];
					break;

				default :
					// User Entre un opérateur
					calculs[calculenCours].innerHTML = chaineCalcul + " " + OPERATEURS[this.index];
			}
		}
		
	}
}
function boutonEntrer_click() {

	if (acceuil) {
		acceuil.style.display = "none";
		acceuil = null;
		imgAcceuil = null;
		acceuilX = null;
		acceuilY = null;
	}

	boutonCorrection.estActif = false;
	boutonReponse.estActif = false;
	document.getElementById("zoneCalcul").style.display = "none";
	document.getElementById("zoneSaisie").style.display = "block";
	for (var i = 0; i < 4; i++) { boutonsOperateurs[i].estActif = false; }	
	for (var i = 0; i < 6; i++) { 
		while (divNombres[i].firstChild) {divNombres[i].removeChild(divNombres[i].lastChild)} boutonsOperandes[i].conteneurHTML.clefImage = 0; 
		boutonsSaisies[i].valeur = 0;
	}
	boutonSaisieCible.zoneTexte.value = "";
	boutonGo.estActif = false;
}
function boutonGo_click() {

	var nbreDepart = new Array(6);
	for (var i = 0; i < 6; i++) { nbreDepart[i] = boutonsSaisies[i].valeur;	}
	var nbreCible = parseInt(document.getElementById("boutonSaisieCible").inputFocus.zoneTexte.value,10);
	document.getElementById("zoneCalcul").style.display = "block";
	document.getElementById("zoneSaisie").style.display = "none";
	lanceTirage(nbreCible, nbreDepart);

}
function boutonSaisieCible_keyDown(ev) {
	if (!((ev.keyCode == 8) || ("0123456789".includes(ev.key)))) { ev.returnValue = false; }
}
function boutonSaisieCible_keyUp(ev) {
	verifieSaisie();
}
function verifieSaisie() {
	var pret = true;
	for (var i = 0; i < 6; i++) { if (boutonsSaisies[i].valeur == 0) { pret = false; i = 6; }}
	var cible = parseInt(boutonSaisieCible.zoneTexte.value,10);

	if (isNaN(cible)) {
		pret = false;
	} else {
		if (!((cible > 99) && (cible < 1000))) {pret = false;}
	}
	boutonGo.estActif = pret;	
}
//#endregion

