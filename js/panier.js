// Classe de gestion du panier
class Panier {
    constructor() {
        this.articles = this.chargerPanier();
    }
    
    // Charger le panier depuis localStorage
    chargerPanier() {
        const panierStocke = localStorage.getItem('panier');
        return panierStocke ? JSON.parse(panierStocke) : [];
    }
    
    // Sauvegarder le panier dans localStorage
    sauvegarderPanier() {
        localStorage.setItem('panier', JSON.stringify(this.articles));
        this.mettreAJourAffichage();
    }
    
    // Ajouter un article au panier
    ajouterArticle(id, nom, prix, image) {
        const articleExistant = this.articles.find(article => article.id === id);
        
        if (articleExistant) {
            articleExistant.quantite += 1;
            this.afficherNotification('Quantité mise à jour', 'info');
        } else {
            this.articles.push({
                id: id,
                nom: nom,
                prix: prix,
                image: image,
                quantite: 1
            });
            this.afficherNotification('Article ajouté au panier', 'success');
        }
        
        this.sauvegarderPanier();
    }
    
    // Supprimer un article du panier
    supprimerArticle(id) {
        this.articles = this.articles.filter(article => article.id !== id);
        this.sauvegarderPanier();
        this.afficherNotification('Article retiré du panier', 'warning');
    }
    
    // Modifier la quantité d'un article
    modifierQuantite(id, nouvelleQuantite) {
        const article = this.articles.find(article => article.id === id);
        
        if (article) {
            if (nouvelleQuantite <= 0) {
                this.supprimerArticle(id);
            } else {
                article.quantite = nouvelleQuantite;
                this.sauvegarderPanier();
            }
        }
    }
    
    // Vider le panier
    viderPanier() {
        this.articles = [];
        this.sauvegarderPanier();
        this.afficherNotification('Panier vidé', 'info');
    }
    
    // Calculer le sous-total
    getSousTotal() {
        return this.articles.reduce((total, article) => 
            total + (article.prix * article.quantite), 0);
    }
    
    // Calculer les frais de service (1% du sous-total)
    getFraisService() {
        return Math.round(this.getSousTotal() * 0.01);
    }
    
    // Calculer le total
    getTotal() {
        return this.getSousTotal() + this.getFraisService();
    }
    
    // Compter le nombre total d'articles
    getNombreArticles() {
        return this.articles.reduce((total, article) => total + article.quantite, 0);
    }
    
    // Afficher une notification
    afficherNotification(message, type = 'info') {
        // Créer l'élément de notification
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = `
            top: 20px;
            right: 20px;
            z-index: 9999;
            max-width: 300px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        `;
        notification.innerHTML = `
            ${message}
            <button type="button" class="close" data-dismiss="alert">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-supprimer après 3 secondes
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    // Mettre à jour l'affichage du compteur de panier
    mettreAJourCompteur() {
        const compteurs = document.querySelectorAll('#cartCount');
        compteurs.forEach(compteur => {
            compteur.textContent = this.getNombreArticles();
            
            // Animation
            compteur.style.transform = 'scale(1.2)';
            setTimeout(() => {
                compteur.style.transform = 'scale(1)';
            }, 200);
        });
    }
    
    // Mettre à jour l'affichage du panier
    mettreAJourAffichage() {
        this.mettreAJourCompteur();
        
        // Si on est sur la page panier, mettre à jour la liste
        if (document.getElementById('cartItems')) {
            this.afficherPanier();
        }
    }
    
    // Afficher le contenu du panier (pour la page panier.html)
    afficherPanier() {
        const cartItems = document.getElementById('cartItems');
        const emptyMessage = document.getElementById('emptyCartMessage');
        
        if (!cartItems) return;
        
        if (this.articles.length === 0) {
            cartItems.innerHTML = '';
            emptyMessage.style.display = 'block';
        } else {
            emptyMessage.style.display = 'none';
            
            let html = '';
            this.articles.forEach(article => {
                html += `
                    <div class="cart-item d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                        <div class="d-flex align-items-center">
                            <img src="${article.image}" alt="${article.nom}" 
                                 class="cart-item-image" 
                                 onerror="this.src='https://via.placeholder.com/80'">
                            <div>
                                <h6 class="mb-0">${article.nom}</h6>
                                <small class="text-muted">${article.prix.toLocaleString()} FCFA</small>
                            </div>
                        </div>
                        <div class="d-flex align-items-center">
                            <div class="input-group mr-3" style="width: 120px;">
                                <div class="input-group-prepend">
                                    <button class="btn btn-outline-secondary btn-sm" 
                                            onclick="panier.modifierQuantite(${article.id}, ${article.quantite - 1})">
                                        <i class="fas fa-minus"></i>
                                    </button>
                                </div>
                                <input type="text" class="form-control form-control-sm text-center quantity-input" 
                                       value="${article.quantite}" readonly>
                                <div class="input-group-append">
                                    <button class="btn btn-outline-secondary btn-sm" 
                                            onclick="panier.modifierQuantite(${article.id}, ${article.quantite + 1})">
                                        <i class="fas fa-plus"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="text-right mr-3" style="width: 100px;">
                                <strong>${(article.prix * article.quantite).toLocaleString()} FCFA</strong>
                            </div>
                            <button class="btn btn-sm btn-outline-danger" 
                                    onclick="panier.supprimerArticle(${article.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
            });
            
            cartItems.innerHTML = html;
        }
        
        // Mettre à jour les totaux
        this.mettreAJourTotaux();
        
        // Activer/désactiver le bouton de paiement
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            if (this.articles.length === 0) {
                checkoutBtn.classList.add('disabled');
                checkoutBtn.removeAttribute('href');
            } else {
                checkoutBtn.classList.remove('disabled');
                checkoutBtn.href = 'paiement.html';
            }
        }
    }
    
    // Mettre à jour l'affichage des totaux
    mettreAJourTotaux() {
        const subtotalEl = document.getElementById('subtotal');
        const serviceFeeEl = document.getElementById('serviceFee');
        const totalEl = document.getElementById('total');
        const montantTotalEl = document.getElementById('montantTotal');
        
        const sousTotal = this.getSousTotal();
        const fraisService = this.getFraisService();
        const total = this.getTotal();
        
        if (subtotalEl) subtotalEl.textContent = sousTotal.toLocaleString() + ' FCFA';
        if (serviceFeeEl) serviceFeeEl.textContent = fraisService.toLocaleString() + ' FCFA';
        if (totalEl) totalEl.textContent = total.toLocaleString() + ' FCFA';
        if (montantTotalEl) montantTotalEl.textContent = total.toLocaleString() + ' FCFA';
        
        // Stocker le total pour la page de paiement
        sessionStorage.setItem('montantTotal', total);
    }
}

// Initialisation globale
const panier = new Panier();

// Fonctions globales pour être appelées depuis le HTML
function ajouterAuPanier(id, nom, prix, image) {
    panier.ajouterArticle(id, nom, prix, image);
}

function mettreAJourCompteurPanier() {
    panier.mettreAJourCompteur();
}

function afficherPanier() {
    panier.afficherPanier();
}

// Exporter pour utilisation dans d'autres fichiers
window.panier = panier;
window.ajouterAuPanier = ajouterAuPanier;
window.mettreAJourCompteurPanier = mettreAJourCompteurPanier;
window.afficherPanier = afficherPanier;