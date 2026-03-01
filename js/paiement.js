// Gestionnaire de paiement
class PaiementHandler {
    constructor() {
        this.form = document.getElementById('paymentForm');
        this.messageArea = document.getElementById('messageArea');
        this.payBtn = document.getElementById('payBtn');
        
        if (this.form) {
            this.initialiser();
        }
    }
    
    initialiser() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.traiterPaiement();
        });
        
        // Charger le montant total depuis le panier
        this.chargerMontant();
        
        // Animation sur le champ téléphone
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
            });
        }
        
        // Afficher le champ PIN si l'opérateur est sélectionné
        const operatorSelect = document.getElementById('operator');
        if (operatorSelect) {
            operatorSelect.addEventListener('change', (e) => {
                const pinGroup = document.getElementById('pinGroup');
                if (e.target.value) {
                    pinGroup.style.display = 'block';
                } else {
                    pinGroup.style.display = 'none';
                }
            });
        }
    }
    
    chargerMontant() {
        const montantTotal = sessionStorage.getItem('montantTotal') || 
                           document.getElementById('montantTotal')?.textContent || 
                           '250000';
        
        const montantInput = document.getElementById('amount');
        const montantSpan = document.getElementById('montantTotal');
        
        if (montantInput) montantInput.value = montantTotal;
        if (montantSpan) montantSpan.textContent = parseInt(montantTotal).toLocaleString() + ' FCFA';
        
        return montantTotal;
    }
    
    traiterPaiement() {
        // Récupérer les données du formulaire
        const operator = document.getElementById('operator').value;
        const phone = document.getElementById('phone').value;
        const pin = document.getElementById('pin')?.value || '';
        const amount = this.chargerMontant();
        
        // Valider les entrées
        if (!this.validerFormulaire(operator, phone)) {
            return;
        }
        
        // Désactiver le bouton pendant le traitement
        this.payBtn.disabled = true;
        this.payBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Traitement en cours...';
        
        // Afficher un message d'attente
        this.afficherMessage('info', 'Demande de paiement en cours... Veuillez patienter.');
        
        // Simuler un délai de traitement
        setTimeout(() => {
            this.simulerReponsePaiement(operator, phone, amount, pin);
        }, 2000);
    }
    
    validerFormulaire(operator, phone) {
        if (!operator) {
            this.afficherMessage('danger', 'Veuillez sélectionner un opérateur');
            return false;
        }
        
        if (!window.validerNumero(phone)) {
            this.afficherMessage('danger', 'Numéro de téléphone invalide (10 chiffres requis)');
            return false;
        }
        
        return true;
    }
    
    simulerReponsePaiement(operator, phone, amount, pin) {
        // Générer une réponse aléatoire pour la simulation
        const random = Math.random();
        
        // Noms des opérateurs pour l'affichage
        const operatorNames = {
            'orange': 'Orange Money',
            'mtn': 'MTN Mobile Money',
            'moov': 'Moov Money',
            'wave': 'Wave'
        };
        
        const operatorName = operatorNames[operator] || operator;
        
        // Paramètres pour la redirection
        const params = new URLSearchParams({
            phone: phone,
            amount: amount,
            operator: operatorName
        });
        
        // Simulation des différents cas
        if (random < 0.7) { // 70% de chance : succès
            this.afficherMessage('success', 
                '✅ Paiement initié ! Redirection vers la confirmation...');
            
            setTimeout(() => {
                params.set('status', 'success');
                window.location.href = `client/confirmation.html?${params.toString()}`;
            }, 1000);
            
        } else if (random < 0.85) { // 15% de chance : échec (solde)
            params.set('status', 'failed');
            params.set('error', 'Solde insuffisant. Veuillez recharger votre compte Mobile Money.');
            window.location.href = `client/confirmation.html?${params.toString()}`;
            
        } else if (random < 0.95) { // 10% de chance : échec (numéro invalide)
            params.set('status', 'failed');
            params.set('error', 'Numéro de téléphone invalide ou non inscrit au service Mobile Money.');
            window.location.href = `client/confirmation.html?${params.toString()}`;
            
        } else { // 5% de chance : attente de confirmation
            params.set('status', 'pending');
            window.location.href = `client/confirmation.html?${params.toString()}`;
        }
        
        // Réactiver le bouton (ne sera pas exécuté si on redirige)
        this.payBtn.disabled = false;
        this.payBtn.innerHTML = '<i class="fas fa-check"></i> Payer maintenant';
    }
    
    afficherMessage(type, texte) {
        if (!this.messageArea) return;
        
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${texte}
            <button type="button" class="close" data-dismiss="alert">&times;</button>
        `;
        
        this.messageArea.innerHTML = '';
        this.messageArea.appendChild(alertDiv);
        
        // Faire défiler jusqu'au message
        alertDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('paymentForm')) {
        window.paiementHandler = new PaiementHandler();
    }
});