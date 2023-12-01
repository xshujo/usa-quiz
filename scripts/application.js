/*/////////////////////////////////////////////////////////////////////*/
/*///////////////////////// LES VARIABLES /////////////////////////////*/
/*/////////////////////////////////////////////////////////////////////*/

//Référence au document...pour raccourcir les scripts
let d = document;

//Le curseur
let leCurseur = null;

//Variables du quiz
let noQuestion = 1; //Le numéro de la prochaine question

//Gestion de la barre qui affiche l'avancement du quiz
let largeurBarre = 0;
let largeurFinaleBarre = 0;

//La section du quiz et sa position sur l'axe des Y
let laSection = null;
let positionY = 100;

//Le score et le meilleur score
let score = 0;
let meilleureScore = 0;

/*/////////////////////////////////////////////////////////////////////*/
/*///////////////////////// DÉBUT DU QUIZ /////////////////////////////*/
/*/////////////////////////////////////////////////////////////////////*/

//Gérer l'apparence du curseur
gererCurseur();

//Partir l'animation de l'intro
animerIntro();

//Quand on clique dans l'écran, on enlève l'intro
window.addEventListener("click", enleverIntro);
