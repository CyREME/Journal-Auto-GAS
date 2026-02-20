# 🚀 Automation Journal de Bord - Google Apps Script

## 📝 Description
Ce projet vise à automatiser la gestion quotidienne du journal de bord de stage au sein de l'organisation **Cotrans Automobile**. Développé en **Google Apps Script**, il permet de générer automatiquement une structure de page datée et de maintenir un sommaire interactif trié par mois et par semaine.

L'objectif principal est de réduire le temps consacré aux tâches administratives répétitives tout en garantissant une mise en page rigoureuse et une navigation fluide pour le maître de stage.

## ✨ Fonctionnalités
- **Génération Automatique** : Création d'une nouvelle section avec la date du jour, incluant les parties "Matin" et "Après-midi" avec formatage automatique.
- **Sommaire Dynamique** : Mise à jour en temps réel d'un sommaire avec des liens hypertextes (Signets/Bookmarks) pointant vers chaque journée.
- **Organisation Intelligente** : Tri automatique des entrées par mois et par numéro de semaine avec indentation automatique.
- **Contrôle de Période** : Le script vérifie la date actuelle par rapport aux dates de début et de fin de stage configurées.
- **Exclusion de Jours** : Possibilité de définir des jours spécifiques (ex: week-ends ou jours de cours) où le script ne doit pas s'exécuter.

## 🛠️ Installation & Configuration

### 1. Intégration du code
1. Ouvrez votre document Google Docs.
2. Allez dans **Extensions** > **Apps Script**.
3. Copiez le code du fichier `main.gs` de ce dépôt dans l'éditeur.

### 2. Paramétrage
Modifiez l'objet `CONFIG` au début du script pour l'adapter à votre période de stage :

```javascript
const CONFIG = {
  dateDebut : new Date("2026-01-05"), // Date de début du stage
  dateFin : new Date("2026-02-20"),   // Date de fin du stage
  joursExclus : [0, 6]               // 0 = Dimanche, 6 = Samedi
}
```
### 3. Automatisation (Trigger)
Pour que le journal se crée tout seul chaque matin :

1. Dans l'interface Apps Script, cliquez sur l'icône **Déclencheurs** (icône Réveil).
2. Cliquez sur le bouton **Ajouter un déclencheur**.
3. Configurez les paramètres suivants :
    * **Fonction à exécuter** : `main`
    * **Source de l'événement** : `Déclencheur horaire`
    * **Type de déclencheur** : `Sélectionner l'heure du jour`
    * **Heure** : Choisissez un créneau (ex: entre 7h et 8h).

## 🚀 Utilisation
Une fois le document ouvert, un menu personnalisé **"⭐ Mes Outils"** apparaît dans la barre d'outils. Il permet de :

* **Lancer manuellement** la création d'une journée complète.
* **Forcer uniquement** la mise à jour du sommaire.
* **Créer uniquement** la structure de la page sans impacter le sommaire.

## 🧰 Technologies utilisées

* **Langage** : Google Apps Script (JavaScript).
* **API DocumentApp** : Manipulation de la structure documentaire (Tabs, Body, Paragraphs).
* **Versionnage** : GitHub avec l'extension *Google Apps Script GitHub Assistant*.

## 👨‍💻 Auteur

**Emeric Cellier** - Candidat au BTS Services Informatiques aux Organisations.  
Session 2026.
