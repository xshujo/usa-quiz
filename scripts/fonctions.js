/*/////////////////////////////////////////////////////////////////////*/
/*///////////////////////// LES FONCTIONS /////////////////////////////*/
/*/////////////////////////////////////////////////////////////////////*/

/* Gestion du curseur
 * L'élément HTML qui agira comme curseur - SI on n'est pas sur un
 * périphérique mobile */
function gererCurseur() {
    //Récupérer le curseur*/
    leCurseur = d.querySelector(".curseur");

    if (!navigator.userAgent.includes("Mobile") && !navigator.userAgent.includes("Tablet")) {
        //On enlève l'affichage du curseur par défaut
        d.querySelector("body").style.cursor = "none";

        //Écouteur sur la fenêtre pour l'événement de souris "mousemove"
        window.addEventListener("mousemove", deplacerCurseur);
    } else {
        //On enlève le curseur de l'affichage
        leCurseur.style.display = "none";
    }
}

/* Fonction permettant de déplacer le curseur à l'endroit du
 * pointeur de la souris dans l'écran
 * @param {object} event Informations sur l'événement MouseEvent distribué */
function deplacerCurseur(event) {
    //Déplacer le curseur à l'endroit du pointeur de la souris
    leCurseur.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
}

/* Fonction permettant d'animer les lettres du mot QUIZ pour l'intro */
function animerIntro() {
    //On met le mot quiz dans l'interface en haut du pied de page
    //avec un délai cumulatif
    let elmDiv;
    let compteur = 0;
    for (uneLettre of "États-Unis") {
        elmDiv = document.createElement("div");
        elmDiv.innerText = uneLettre;
        elmDiv.classList.add("lettre");

        //Gestion du délai d'animation
        elmDiv.style.animationDelay = compteur + "s";
        compteur += 0.3;

        //Le footer
        let leFooter = d.querySelector("footer");
        let noeudParent = leFooter.parentNode;
        noeudParent.insertBefore(elmDiv, leFooter);
    }
}

/* Fonction pour enlever les éléments de l'intro */
function enleverIntro() {
    //On enlève le conteneur de l'intro
    let intro = d.querySelector("main.intro");
    intro.parentNode.removeChild(intro);

    //On enlève l'écouteur qui gère la fin de l'intro
    window.removeEventListener("click", enleverIntro);

    //On met le conteneur du quiz visible
    d.querySelector(".quiz").style.display = "flex";

    //On récupère la section du quiz
    laSection = d.querySelector("section");

    //On affiche la première question
    afficherQuestion(quiz.question1);
}

/* Fonction permettant d'afficher chaque question
 * @param {object} object Informations sur la question à afficher */
function afficherQuestion(question) {

    //On récupère les balises où seront affichées les infos
    let titreQuestion = d.querySelector("#titreQuestion");
    titreQuestion.innerHTML = question.texte;

    let lesChoixDeReponses = d.querySelectorAll(".choix");
    let nbReponses = lesChoixDeReponses.length;

    let elmDiv;

    for (let i = 0; i < nbReponses; i++) {
        lesChoixDeReponses[i].innerHTML = question.choix[i];

        //On affecte dynamiquement l'index à chaque choix
        lesChoixDeReponses[i].indexChoix = i;

        //On met un écouteur pour vérifier la réponse choisie
        lesChoixDeReponses[i].addEventListener("mousedown", verifierReponse);

        //On enlève les couleurs des choix de réponse précédents, s'il y a lieu
        lesChoixDeReponses[i].style.color = "whitesmoke";
    }

    //Modifier la valeur de la position de la section sur l'axe des Y
    //pour son animation
    positionY = 100;

    //Partir la première requête pour l'animation de la section
    requestAnimationFrame(animerSection);
}

/* Fonction permettant d'animer l'arrivée de la section */
function animerSection() {
    //On décrémente la position de 2
    positionY -= 2;
    laSection.style.transform = `translateY(${positionY}vh)`;

    //On part une autre requête  d'animation si la position finale n'est pas atteinte
    if (positionY > 0) {
        requestAnimationFrame(animerSection);
    }
}

/* Fonction permettant de vérifier la réponse choisie et de gérer la suite
 * @param {object} event Informations sur l'événement MouseEvent distribué */
function verifierReponse(event) {

    //Animer la barre qui va illustrer l'avancement du quiz
    largeurFinaleBarre = (noQuestion / quiz.nbQuestions) * 100;

    //Partir la première requête d'animation
    requestAnimationFrame(animerBarreAvancement);

    if (event.target.indexChoix == quiz["question" + noQuestion].bonneReponse) {
        //On met le choix en vert et on incrémente le score
        event.target.style.color = "green";
        score += 10;
    } else {
        //On met le choix en rouge
        event.target.style.color = "red";
    }

    //On enlève les écouteurs sur les choix de réponse
    let lesChoixDeReponses = d.querySelectorAll(".choix");
    let nbReponses = lesChoixDeReponses.length;

    for (let i = 0; i < nbReponses; i++) {
        lesChoixDeReponses[i].removeEventListener("mousedown", verifierReponse);
    }
}

/* Fonction permettant d'animer la barre d'avancement */
function animerBarreAvancement() {
    //Récupérer la barre
    let laBarre = d.querySelector(".barreAvancement");

    //Incrémenter la valeur pour la largeur et affecter la valeur
    //à la largeur de la barre
    largeurBarre += 0.5;
    laBarre.style.width = largeurBarre + "vw";

    //On part une autre requête  d'animation si la largeur illustrant l'avancement n'est pas atteinte
    if (largeurBarre < largeurFinaleBarre) {
        requestAnimationFrame(animerBarreAvancement);
    } else { //Sinon on passe à la question suivante
        gererProchaineQuestion();
    }
}

/* Fonction permettant de gérer l'affichage de la prochaine question */
function gererProchaineQuestion() {
    //On incrémente le no de la prochaine question à afficher
    noQuestion++;

    //S'il reste une question on l'affiche, sinon c'est la fin du jeu...
    if (noQuestion <= quiz.nbQuestions) {
        //On identifie la prochaine question et on l'affiche
        let prochaineQuestion = quiz["question" + noQuestion];
        afficherQuestion(prochaineQuestion)
    } else {
        afficherFinJeu();
    }
}

/* Fonction permettant d'afficher l'interface de la fin du jeu */
function afficherFinJeu() {
    //On enlève le quiz de l'affichage
    d.querySelector(".quiz").style.display = "none";
    //On affiche la fin du jeu avec le score actuel et le meilleur score
    d.querySelector(".fin").style.display = "flex";

    //Récupérer s'il y a lieu le meilleure score
    meilleureScore = localStorage.getItem("scoreQuiz") || 0;
    //Comparer le score actuel au meilleur score enregistré
    meilleureScore = Math.max(score, meilleureScore);
    //Et sauvegarder le meilleur score
    localStorage.setItem("scoreQuiz", meilleureScore);

    //Créer et afficher le texte pour le résultat
    let leResultat = d.createElement("div");
    leResultat.innerHTML = "<h1>Le quiz est terminé</h1><br>";
    leResultat.innerHTML += `<p>Votre score: ${score}%</p>`;

    leResultat.innerHTML += `<p>Votre meilleur score: ${meilleureScore}%</p><br>`;
    leResultat.innerHTML += "<h1>Cliquer pour rejouer...</h1>";

    d.querySelector(".fin").appendChild(leResultat);

    //Gestionnaire d'événement sur la fenêtre pour refaire le quiz
    window.addEventListener("click", recommencerQuiz);
}

/* Fonction permettant de recommencer le quiz */
function recommencerQuiz() {
    //Enlever le gestionnaire d'événement sur la fenêtre
    window.removeEventListener("click", recommencerQuiz);

    //Enlever l'interface de la fin du quiz et ses enfants
    d.querySelector(".fin").style.display = "none";;
    d.querySelector(".fin").innerHTML = "";

    //Afficher l'interface du quiz
    d.querySelector(".quiz").style.display = "flex";

    //Ré-initialiser les variables du quiz
    score = 0;
    noQuestion = 1;
    //Ajuster la argeur de la barre d'avancement
    let laBarre = d.querySelector(".barreAvancement");
    largeurBarre = 0;
    laBarre.style.width = largeurBarre + "vw";

    //Afficher la premièere question
    afficherQuestion(quiz.question1);
}
