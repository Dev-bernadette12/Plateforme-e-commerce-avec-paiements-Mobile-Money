// Fonctions de validation globales

/**
 * Valide un numéro de téléphone (format 10 chiffres)
 */
function validerNumero(phone) {
    if (!phone) return false;
    
    // Supprimer les espaces et caractères spéciaux
    const phoneClean = phone.replace(/\s+/g, '');
    
    // Vérifier que c'est uniquement des chiffres et fait 10 caractères
    return /^\d{10}$/.test(phoneClean);
}

/**
 * Valide un code PIN (4 chiffres)
 */
function validerPIN(pin) {
    if (!pin) return false;
    return /^\d{4}$/.test(pin);
}

/**
 * Valide un email
 */
function validerEmail(email) {
    if (!email) return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Formate un numéro de téléphone pour l'affichage
 */
function formaterNumero(phone) {
    if (!phone) return '';
    const cleaned = phone.replace(/\s+/g, '');
    const match = cleaned.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);
    if (match) {
        return `+225 ${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`;
    }
    return phone;
}

/**
 * Valide un montant (doit être positif)
 */
function validerMontant(montant) {
    const num = parseFloat(montant);
    return !isNaN(num) && num > 0;
}

/**
 * Échappe les caractères HTML pour éviter les injections XSS
 */
function echapperHTML(texte) {
    const div = document.createElement('div');
    div.textContent = texte;
    return div.innerHTML;
}

/**
 * Affiche une erreur de validation sur un champ
 */
function afficherErreurValidation(champId, message) {
    const champ = document.getElementById(champId);
    if (!champ) return;
    
    // Supprimer l'erreur précédente
    const erreurExistante = champ.parentNode.querySelector('.invalid-feedback');
    if (erreurExistante) {
        erreurExistante.remove();
    }
    
    // Ajouter la classe d'erreur
    champ.classList.add('is-invalid');
    
    // Créer le message d'erreur
    const erreur = document.createElement('div');
    erreur.className = 'invalid-feedback';
    erreur.textContent = message;
    
    champ.parentNode.appendChild(erreur);
}

/**
 * Réinitialiser les erreurs de validation
 */
function reinitialiserErreurs() {
    document.querySelectorAll('.is-invalid').forEach(champ => {
        champ.classList.remove('is-invalid');
    });
    document.querySelectorAll('.invalid-feedback').forEach(erreur => {
        erreur.remove();
    });
}

// Exporter les fonctions pour utilisation dans d'autres fichiers
window.validerNumero = validerNumero;
window.validerPIN = validerPIN;
window.validerEmail = validerEmail;
window.formaterNumero = formaterNumero;
window.validerMontant = validerMontant;
window.echapperHTML = echapperHTML;
window.afficherErreurValidation = afficherErreurValidation;
window.reinitialiserErreurs = reinitialiserErreurs;