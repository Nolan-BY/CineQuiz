
function adjustValue(input) {
    // Vérifier si la valeur saisie est inférieure à la valeur minimale
    if (parseInt(input.value) < parseInt(input.min)) {
        // Ajuster la valeur à la valeur minimale
        input.value = input.min;
    }
    // Vérifier si la valeur saisie dépasse la valeur maximale
    else if (parseInt(input.value) > parseInt(input.max)) {
        // Ajuster la valeur à la valeur maximale
        input.value = input.max;
    }
}




document.addEventListener("DOMContentLoaded", function() {
    let keystrokes = {}; // Touches associées à chaque joueur
    let playerColors = {};

    document.querySelectorAll(".player-keystroke-cell").forEach(player_keystroke => {
        // Écouteur d'événements de clic à chaque élément
        player_keystroke.addEventListener("click", function() {
            // Nom du joueur est renseigné ?
            const playerNameInput = this.parentNode.querySelector('input[name="player-name"]');
            const playerName = playerNameInput.value.trim();
            if (!playerName) {
                showErrorMessage(this, "Nom requis");
                return;
            } else {
                this.classList.remove("error");
                this.textContent = "Appuyez sur une touche...";
            }

            // Touche déjà utilisée par un autre joueur ?
            const existingKeystroke = Object.values(keystrokes).find(keystroke => keystroke === event.key);
            if (existingKeystroke && Object.keys(keystrokes).find(name => keystrokes[name] === event.key) !== playerName) {
                showErrorMessage(this, "Touche déjà utilisée");
                return;
            } else {
                this.classList.remove("error");
            }

            // En cours de sélection
            this.classList.add("selecting-key");
            // Nom du joueur requis
            playerNameInput.disabled = true;
            playerNameInput.placeholder = "Nom requis";

            // Écoute événement pression de touche
            document.addEventListener("keydown", keydownListener);
        });
    });

    function keydownListener(event) {
        const selectedKeystrokeCell = document.querySelector(".selecting-key");
        if (selectedKeystrokeCell) {
            const playerNameInput = selectedKeystrokeCell.parentNode.querySelector('input[name="player-name"]');
            const playerName = playerNameInput.value.trim();
            const keystroke = event.key;
            
            // Touche déjà utilisée par un autre joueur ?
            const keystrokesValues = Object.values(keystrokes);
            if (keystrokesValues.includes(keystroke)) {
                const usedByPlayer = Object.keys(keystrokes).find(name => keystrokes[name] === keystroke);
                if (usedByPlayer !== playerName) {
                    showErrorMessage(selectedKeystrokeCell, "Touche déjà utilisée");
                    return;
                }
            }
            
            // Update touche associée au joueur
            keystrokes[playerName] = keystroke;
            selectedKeystrokeCell.textContent = keystroke;
            selectedKeystrokeCell.classList.remove("selecting-key");
            // Réinitialiser styles
            playerNameInput.disabled = true; // Désactiver champ nom du joueur
            playerNameInput.placeholder = "";
            // Générer une couleur aléatoire pour le joueur -- TO REMOVE
            const playerColor = getRandomColor();
            playerColors[playerName] = playerColor;
            selectedKeystrokeCell.style.backgroundColor = playerColor;
            document.removeEventListener("keydown", keydownListener);
        }
    }
    

    // Afficher message d'erreur
    function showErrorMessage(element, message) {
        element.textContent = message;
        element.classList.add("error");
        setTimeout(() => {
            element.classList.remove("error");
            element.textContent = "Cliquer pour définir la touche";
        }, 1500);
    }

    // Générer couleur aléatoire -- TO REMOVE
    function getRandomColor() {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // Écoute événements clavier sur le document
    document.addEventListener("keydown", function(event) {
        // Touche enregistrée pressée ?
        const playerName = Object.keys(keystrokes).find(name => keystrokes[name] === event.key);
        if (playerName) {
            // Changez couleur de fond de page -- TO REMOVE
            document.body.style.backgroundColor = playerColors[playerName];
        }
    });

    // Écoute événements clavier sur le document
    document.addEventListener("keyup", function(event) {
        // Rétablir couleur de fond
        document.body.style.backgroundColor = "";
    });
});