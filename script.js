const doc = DocumentApp.getActiveDocument();

function dicIdTab() {

  let dict = {}
  let list = doc.getTabs();

  for (let numOnglet = 0; numOnglet < list.length; numOnglet++) {
    let tab = list[numOnglet];
    dict[tab.getTitle()] = tab;
  }

  return dict;
}


function onOpen() {
  DocumentApp.getUi()
    .createMenu('⭐ Mes Outils')
    // Le bouton principal lance maintenant MAIN (Création + Sommaire)
    .addItem('🚀 Nouvelle Journée (Complet)', 'main')
    .addSeparator()
    // Tes boutons manuels en cas de besoin spécifique
    .addItem('🔧 Juste créer la page', 'creerOngletDate')
    .addItem('🔄 Juste maj Sommaire', 'creationSommaire')
    .addToUi();
}

function creerOngletDate() {

  // Création d'un saut de page avec texte centré et formaté contenant la date du jour
  let body = dicIdTab()["Journal"].asDocumentTab().getBody();


  var date = Utilities.formatDate(new Date(),
    Session.getScriptTimeZone(),
    "dd/MM/yyyy")

  body.appendPageBreak();

  const timeSection = [date, "Matin :", "Après-Midi :"];

  for (let numSection = 0; numSection < 3; numSection++) {
    var para = body.appendParagraph(timeSection[numSection]);

    if (numSection == 0) {
      para.setHeading(DocumentApp.ParagraphHeading.HEADING1);
      para.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    } else {
      para.setHeading(DocumentApp.ParagraphHeading.HEADING3);
      para.setAlignment(DocumentApp.HorizontalAlignment.LEFT);
      body.appendParagraph("");
    }

  }
}

function creationSommaire() {

  const tabJournal = dicIdTab()["Journal"];
  const tabSommaire = dicIdTab()["Sommaire"];

  if (!tabJournal || !tabSommaire) return;

  const docTabJournal = tabJournal.asDocumentTab();

  const bodyJournal = tabJournal.asDocumentTab().getBody();
  const bodySommaire = tabSommaire.asDocumentTab().getBody();

  // Nettoyage du sommaire
  while (bodySommaire.getNumChildren() > 2) {
    bodySommaire.removeChild(bodySommaire.getChild(1));
  }

  const signetsExistant = docTabJournal.getBookmarks();

  for (let nbMark = 0 ; nbMark < signetsExistant.length ; nbMark++) {
    signetsExistant[nbMark].remove();
  }


  // récupération des dates dans le journal
  let parasJournal = bodyJournal.getParagraphs();

  let listeJanvier = [];
  let listeFevrier = [];

  for (let numPara = 0; numPara < parasJournal.length; numPara++) {
    if (parasJournal[numPara].getHeading() == DocumentApp.ParagraphHeading.HEADING1 &&
      parasJournal[numPara].getText().trim().length > 0) {

      let para = parasJournal[numPara];
      let date = para.getText();

      // Création d'un lien vers la date
      let urlBase = "https://docs.google.com/document/d/" + doc.getId() + "/edit";
      let idOnglet = tabJournal.getId();
      let position = docTabJournal.newPosition(para, 0);
      let signet = docTabJournal.addBookmark(position);
      let idSignet = signet.getId();

      let urlComplete = urlBase + "?tab=" + idOnglet + "#bookmark=" + idSignet;


      let infoDate = { "titre": date, "lien": urlComplete };

      if (date.indexOf("/01/") !== -1) {
        listeJanvier.push(infoDate);
      } else if (date.indexOf("/02/") !== -1) {
        listeFevrier.push(infoDate);
      }
    }
  }



  // Partie présente sur la page Sommaire
  var titre = bodySommaire.getParagraphs()[0];
  titre.setText("Sommaire")
  titre.setHeading(DocumentApp.ParagraphHeading.HEADING1);
  titre.setAlignment(DocumentApp.HorizontalAlignment.CENTER);


  // Ajout de Janvier et de Février dans le sommaire
  let dicListe = {
    "Janvier": listeJanvier,
    "Février": listeFevrier
  }

  // Initialisation
  let semaine = 1;
  let jour = 1; 

  // Constante pour le retrait du titre "Semaine" (36 points)
  const RETRAIT_TITRE = 36;

  Object.entries(dicListe).forEach(([mois, listeDates]) => {

    if (listeDates.length > 0) {
      
      // 1. LE MOIS (Collé à gauche)
      bodySommaire.appendParagraph(mois)
                  .setHeading(DocumentApp.ParagraphHeading.HEADING2)
                  .setIndentStart(0)
                  .setIndentFirstLine(0);

      for (let numDate = 0; numDate < listeDates.length; numDate++) {
        
        // 2. LA SEMAINE (Paragraphe -> On utilise l'indentation manuelle)
        if (jour === 1) {
           let paraSemaine = bodySommaire.appendParagraph("Semaine " + semaine);
           paraSemaine.setHeading(DocumentApp.ParagraphHeading.HEADING3);
           
           // TRUC : Il faut définir Start ET FirstLine pour que tout le bloc bouge
           paraSemaine.setIndentStart(RETRAIT_TITRE);
           paraSemaine.setIndentFirstLine(RETRAIT_TITRE);
        }

        // 3. LA LISTE DES JOURS (ListItem -> On utilise le NestingLevel)
        let item = bodySommaire.appendListItem(listeDates[numDate]["titre"]);
        
        item.setGlyphType(DocumentApp.GlyphType.BULLET)
            .setLinkUrl(listeDates[numDate]["lien"]);
            
        // C'est ICI la différence : 
        // Niveau 0 = Alignement gauche
        // Niveau 1 = Première indentation (automatique Google Docs)
        // Niveau 2 = Deuxième indentation...
        item.setNestingLevel(1); 


        // Gestion du compteur
        if (jour === 5) {
          jour = 1;
          semaine++;
        } else {
          jour++;
        }
      }
    }
  });

  bodySommaire.removeChild(bodySommaire.getChild(1));

  bodySommaire.appendParagraph("");
}



function main() {
  let dt = new Date().getDay();

  if (dt == 0 || dt == 6){
    return ;
  }
  
  creerOngletDate();
  creationSommaire();
}
