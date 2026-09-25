"""Visible comments transcribed from the five user-supplied images; authors anonymized."""
from html import escape

evaluations = [
('evaluation-1', 'Une place dans l’équipage', 'Commentaire PNC rédacteur · date non visible', '''Florian connaît très bien sa fiche de poste. Il s’intéresse au produit et sais le mettre en valeur. Très attentionné avec la clientèle, il prend en compte les demandes et fait son maximum pour les satisfaire.

Disponible, avenant, il s’intègre parfaitement à l’équipage et s’enquiert du bien être des uns et des autres.

Je tiens donc à le féliciter pour son travail et son attitude exemplaire.''', 'Points forts visibles : Respect hiérarchie · Application des directives · Relation équipage · Solidarité partenaires sol/vol.'),
('evaluation-2', 'L’expérience d’une deuxième saison', 'Commentaire PNC rédacteur · date non visible', '''Monsieur Marchois, de part son expérience en tant que PCB l’année dernière, nous montre qu’il est parfaitement autonome dans sa fonction. Le port de l’uniforme est conforme aux standards, et porté avec élégance.

D’un naturel très agréable, souriant et positif, il est de fait un membre d’équipage très apprécié par les clients ainsi que par ses collaborateurs.

Il nous fait part de son souhait de revenir pour une troisième saison et nous ne pouvons que l’encourager vivement dans ce projet.''', ''),
('evaluation-3', 'Un retour après une rotation en Business', 'Chef de cabine (CC) · capture d’août 2025', '''Contexte :
Monsieur Marchois effectue son 3ème vol en cabine Business durant sa première saison PCB.

Dès l’arrivée à bord, nous constatons un vrai dynamisme dans son fonctionnement. Il n’hésite pas à proposer son aide aux différents PNC du vol, dans le périmètre de sa mission PCB.
L’embarquement est souriant et bienveillant, il se présente à nos clients et facilite leur installation à bord.

Nous constatons une réelle envie de bien faire et de délivrer un service de qualité. Monsieur Marchois met à profit les connaissances de son binôme (PNC P travaillant en J) et sollicite le feedback. Les conseils prodigués sont immédiatement mis en application.

Monsieur Marchois reste souriant, bienveillant et constant sur l’ensemble de la rotation, tant auprès des clients que de l’équipage. Il déploie une relation attentionnée avec gentillesse et nous constatons que ces échanges sont appréciés de nos clients.

Il s’inscrit pleinement dans les différentes démarches commerciales de l’entreprise et réalise, en toute autonomie, plusieurs ERC ainsi que de nombreux enrôlements Flying Blue. Les objectifs définis lors des briefings “satisfaction clients” sont intégrés et atteints.

Bien que n’ayant aucune fonction SV, Monsieur Marchois reste curieux durant tout le vol et n’hésite pas à faire remonter ses questions et observations. Il garde un regard attentif et impliqué tout au long de la mission.

La prise de congés est réalisée sur l’ensemble de la cabine, et nos échanges avec nos clients en fin de vol soulignent qu’ils ont apprécié sa gentillesse ainsi que son attitude souriante et positive.

Nous échangeons avec lui sur sa saison et notons qu’il porte avec fierté les valeurs de notre entreprise, tout en plébiscitant avec enthousiasme l’ensemble des missions qu’il a effectuées.

Sur cette rotation, Monsieur Marchois s’inscrit pleinement dans la dynamique d’une expérience client de haute qualité, empreinte de gentillesse et de bienveillance. Nous félicitons Monsieur Marchois pour le travail effectué sur cette rotation et l’encourageons à poursuivre dans cette attitude positive.''', ''),
('evaluation-4', 'Une lettre de félicitations', 'Chef de cabine (CC) · juillet 2025', '''Je tiens à féliciter M.MARCHOIS Florian pour l’excellente qualité de son travail lors de sa troisième rotation en tant que PCB.
Il fait preuve de nombreuses qualités au service de l’équipage et de nos clients.

Mobiliser à l’atteinte des résultats

* M.Marchois est fait preuve de disponibilité et d’envie dès le briefing. Il se porte volontaire pour effectuer le service en cabine business lors de son 3e vol en tant que PCB. Il est volontaire et démontre par ses actions l’envie d’apprendre et d’aider: réalisation des offres d’accueil au sol lorsque l’embarquement est terminé, prise de commande sur Cabinpad, prend connaissance en avance du déroulé de service.
* Il fait des remontées auprès de son chef de cabine et favorise le confort de nos clients en regroupant des couples séparés en cabine.
* Il participe pleinement à la satisfaction client en réalisant les offres en cabine business avec beaucoup d’aisance pour une première réalisation.

Développer les individus et le collectif

* Il est proactif et propose son aide à plusieurs reprises et demande à son chef de cabine des objectifs en terme d’actions à réaliser à bord.
* Il s’intègre pleinement à l’équipage et fait preuve de qualités humaines dans ses relations avec les autres (disponibilité, humilité, écoute)

Je remercie et je félicite à nouveau M. Marchois pour son travail. Un feedback a été réalisé à bord pour l’encourager à poursuivre cette dynamique très positive tout au long de sa saison.''', ''),
('evaluation-5', 'Le formulaire associé à la lettre', 'Chef de cabine (CC) · juillet 2025 · même occasion que la lettre', '''M.Marchois est fait preuve de disponibilité et d’envie dès le briefing. Il se porte volontaire pour effectuer le service en cabine business lors de son 3e vol en tant que PCB. Il est volontaire et démontre par ses actions l’envie d’apprendre et d’aider: réalisation des offres d’accueil au sol lorsque l’embarquement est terminé, prise de commande sur Cabinpad, prend connaissance en avance du déroulé de service. Il fait des remontées auprès de son chef de cabine et favorise le confort de nos clients en regroupant des couples séparés en cabine.''', 'Représentativité : conforme. Service au client : conforme ; disponibilité, aisance dans les contacts. Ponctualité : conforme. Travail en équipe : conforme ; respect hiérarchie, relation équipage.')
]

def full_feedback(stage):
 cards=[]
 anchors={0:['collectif','client','rigueur'],1:['autonomie'],2:['apprentissage'],3:['initiative']}
 for i,(key,title,source,content,criteria) in enumerate(evaluations):
  aliases=''.join(f'<span id="preuve-{a}" class="proof-anchor"></span>' for a in anchors.get(i,[]))
  paragraphs=''.join('<p>'+escape(p).replace('\n','<br>')+'</p>' for p in content.split('\n\n'))
  cards.append(f'<article class="letter-card" id="{key}" data-step="{i}">{aliases}<header><span class="letter-number">0{i+1}</span><div><p class="eyebrow">LE MOT DE L’ENCADREMENT</p><h3>{title}</h3><p class="letter-byline">{source}</p></div></header><blockquote>{paragraphs}</blockquote>'+ (f'<div class="letter-criteria"><strong>Appréciations du formulaire</strong><p>{escape(criteria)}</p></div>' if criteria else '')+'<footer>À propos de Florian Marchois · Personnel Complémentaire de Bord</footer></article>')
 return '<section class="feedback-section full-letters" id="retours"><div class="feedback-intro wrap"><p class="eyebrow">ILS ONT TRAVAILLÉ AVEC MOI</p><h2>Leurs mots.<br>Mon travail à bord.</h2><p>Les commentaires complets visibles dans les cinq documents transmis, conservés dans leur formulation d’origine. Parce qu’une appréciation prend tout son sens quand on la lit jusqu’au bout.</p><nav class="letter-nav" aria-label="Accès aux évaluations">'+''.join(f'<a href="#{e[0]}">0{i+1} · {"Lettre" if i==3 else "Évaluation"}</a>' for i,e in enumerate(evaluations))+'</nav></div><div class="feedback-layout"><div class="feedback-stage">'+stage('air')+'<p class="network-caption">Air France<br><span>Une expérience humaine, avant tout.</span></p></div><div class="feedback-cards">'+''.join(cards)+'</div></div><p class="wrap source-note">Transcriptions des commentaires visibles : orthographe et formulations conservées, mise en page adaptée. Les noms des rédacteurs, matricules et références de vol sont retirés. Les fonctions sont indiquées uniquement lorsqu’elles sont lisibles. La lettre et le dernier formulaire correspondent à la même occasion. Les deux premières captures ne montrent pas la date ; aucune chronologie supplémentaire n’est supposée.</p></section>'
