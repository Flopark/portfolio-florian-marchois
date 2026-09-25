"""Progressive immersive layer over the original portfolio and its verified content."""
import re
from testimonials import full_feedback
from project_scenes import chanel_scene, boscha_scene

def stage(kind='journey'):
 label={'blade':'FLEXION / ILLUSTRATION PÉDAGOGIQUE','air':'AIRBUS A350-900 / AIR FRANCE','flow':'DISTRIBUTION / SCHÉMA ABSTRAIT','capacity':'ATELIER / INTERDÉPENDANCES'}.get(kind,'MATIÈRE / SYSTÈMES / COLLECTIF')
 fallback='<div class="scene-fallback aircraft-fallback" aria-hidden="true"><svg viewBox="0 0 700 360"><path d="M55 190 Q35 180 55 170 L285 165 L400 50 L440 50 L370 168 L585 173 L640 100 L663 100 L635 180 L670 190 L635 200 L655 225 L630 225 L592 204 L370 202 L440 315 L400 315 L285 203Z" fill="#f5f7fb" stroke="#8395a7"/><text x="105" y="185" fill="#173451" font-size="16" font-family="Arial">AIRFRANCE</text><path d="M603 172 L640 113 L650 113 L621 176" fill="#e52740"/></svg></div>' if kind=='air' else '<div class="scene-fallback" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>'
 return f'''<div class="scene-shell" data-scene="{kind}">{fallback}<div class="scene-label"><span>{label}</span><span class="scene-index">{'01 — 04' if kind in ['hero','journey'] else 'EXPLORATION'}</span></div></div>'''

chapters=[
 ('LA MATIÈRE','Comprendre ce qui vibre.','De la physique aux Arts et Métiers. Transformer un phénomène en modèle, puis confronter le calcul à une mesure.','compositeauphone.html','Explorer le Compositeauphone'),
 ('LE MODÈLE','Ouvrir les possibilités.','1 024 empilements étudiés sous Python. Une lame fabriquée, puis accordée par la mesure. Le modèle guide ; l’expérience tranche.','compositeauphone.html#resultats','Voir le résultat mesuré'),
 ('LES FLUX','Relier les décisions.','Stocks, capacités, implantation : regarder le système dans son ensemble. Avec Chanel et Boscha, passer du diagnostic aux scénarios industriels.','boscha.html','Entrer dans l’atelier'),
 ('LE COLLECTIF','Trouver sa place à bord.','Deux saisons PCB chez Air France. Un autre terrain pour apprendre, communiquer et contribuer à une équipe.','air-france.html#retours','Lire les retours professionnels')
]

def journey():
 return '<section class="journey" id="traversee" aria-label="De la matière au collectif"><div class="journey-stage">'+stage()+'</div><div class="journey-chapters">'+''.join(f'<article class="story-step" id="chapitre-{i+1}" data-step="{i}"><span class="eyebrow">0{i+1} / {k}</span><h2>{t}</h2><p>{p}</p><a class="text-link" href="{url}">{link} ↗</a></article>' for i,(k,t,p,url,link) in enumerate(chapters))+'</div></section>'

proofs=[
 ('collectif','Le collectif','« il s’intègre parfaitement à l’équipage »','Disponibilité et attention aux autres sont relevées dans le commentaire de l’évaluation.','Évaluation professionnelle PCB'),
 ('apprentissage','Apprendre et ajuster','« Les conseils prodigués sont immédiatement mis en application. »','Le retour décrit une demande de feedback auprès du binôme, suivie d’une mise en pratique immédiate.','Évaluation professionnelle PCB · première saison'),
 ('autonomie','L’autonomie','« parfaitement autonome dans sa fonction »','Le commentaire relie explicitement cette autonomie à l’expérience acquise lors de la saison précédente.','Évaluation professionnelle PCB · deuxième saison'),
 ('initiative','L’initiative','« Il est proactif et propose son aide à plusieurs reprises »','Se porter volontaire, préparer le service et demander des objectifs : des actions observées à bord.','Lettre de félicitations · juillet 2025'),
 ('client','L’attention au client','« il prend en compte les demandes et fait son maximum pour les satisfaire. »','Une attention aux demandes des passagers, également décrite dans les autres commentaires transmis.','Évaluation professionnelle PCB'),
 ('rigueur','La rigueur au quotidien','« Application des directives »','Ce critère figure parmi les points forts cochés. La ponctualité est également évaluée conforme dans un autre formulaire.','Critère du formulaire PCB · extrait du libellé')
]

def feedback():
 return full_feedback(stage)

def laboratory():
 return '''<section class="section blade-lab" id="lame-3d"><div class="lab-heading"><p class="eyebrow">LABORATOIRE VISUEL / FLEXION</p><h2>Une lame.<br>Plusieurs façons de vibrer.</h2><p>Explorez une représentation pédagogique de la flexion. Le mouvement est volontairement ralenti et amplifié pour rendre la déformation lisible.</p></div>'''+stage('blade')+'''<div class="lab-controls"><label>Déformée illustrée<select id="blade-mode"><option value="1">Flexion fondamentale</option><option value="2">Flexion d’ordre supérieur</option></select></label><label>Aspect du matériau<select id="blade-material"><option value="composite">Composite</option><option value="aluminium">Aluminium</option><option value="bois">Bois</option></select></label><button class="button secondary" id="blade-play" aria-pressed="false">Animer la lame</button></div><p class="source-note">Illustration qualitative, et non résultat Abaqus. Changer l’aspect ne recalcule pas la fréquence : celle-ci dépend de la géométrie, de la rigidité et de la masse. Les simulations et les mesures du projet sont présentées ci-dessous.</p></section>'''

def enhance(file,html):
 from pathlib import Path
 for asset in (Path(__file__).parent/'dist/assets').glob('*.webp'):
  html=html.replace(f'src="assets/{asset.stem}.jpg"',f'src="assets/{asset.name}"')
 html=html.replace('<body>', f'<body data-page="{file[:-5]}">')
 html=html.replace('</head>','<link rel="stylesheet" href="assets/immersive.css"><script type="module" src="assets/immersive.js"></script><link rel="stylesheet" href="assets/project-scenes.css"><script type="module" src="assets/project-scenes.js"></script></head>')
 html=html.replace('</nav></header>','</nav></header><button class="motion-preference" aria-pressed="false" title="Activer une présentation sans mouvements 3D">Réduire les animations</button>')
 if file=='index.html':
  html=html.replace('<h1>Comprendre.<br>Modéliser.<br><em>Faire avancer.</em></h1>','<h1>Florian<br><em>Marchois.</em></h1>')
  html=html.replace('Je suis Florian Marchois. De la vibration d’une lame à l’organisation d’un atelier, je relie l’analyse scientifique aux décisions industrielles.','Gestion industrielle / Supply Chain.<br>Comprendre. Modéliser. Faire avancer.')
  start=html.index('<div class="hero-visual">')
  end=html.index('</section>',start)
  original=html[start:end]
  html=html[:start]+'<div class="hero-sculpture">'+stage('hero')+'<span class="sculpture-caption">DE LA MATIÈRE AUX SYSTÈMES</span></div>'+html[end:]
  html=html.replace('<div class="intro-band wrap">', '<a class="scroll-cue" href="#traversee">TRAVERSER MON PARCOURS <span>↓</span></a>'+journey()+'<div class="intro-band wrap">')
  html=html.replace('<section id="projets"','<section class="section signal-interlude"><div><p class="eyebrow">COMPRENDRE. MODÉLISER. FAIRE AVANCER.</p><h2>Un modèle<br>qui s’écoute.</h2><p>La science prend une autre dimension lorsqu’on peut entendre son résultat.</p></div>'+original+'</section><section id="projets"')
 elif file=='compositeauphone.html':
  html=html.replace('<section id="enjeu"',laboratory()+'<section id="enjeu"')
 elif file=='chanel.html':
  html=re.sub(r'<section class="section wide-panel">.*?</section>',lambda m:chanel_scene(),html,count=1,flags=re.S)
 elif file=='boscha.html':
  html=html.replace('<section id="scenarios"',boscha_scene()+'<section id="scenarios"')
 elif file=='air-france.html':
  html=html.replace('<div class="wrap air-statement">','<div class="air-arrival">'+stage('air')+'</div><div class="wrap air-statement">')
  html=html.replace('<section id="regard"',feedback()+'<section id="regard"')
  html=html.replace('Je peux revenir sur ces deux saisons et sur les situations vécues à l’occasion d’un échange.','Écouter le feedback, transmettre une observation, appliquer des directives et proposer son aide : ces comportements documentés à bord nourrissent aussi ma façon de travailler en projet. Ils constituent des points de rencontre entre mon expérience opérationnelle et ma formation d’ingénieur.')
 elif file=='competences.html':
  links=''.join(f'<a class="skill-proof" href="air-france.html#preuve-{k}"><span>{t}</span><span>Lire le commentaire complet ↗</span></a>' for k,t,*_ in proofs)
  html=html.replace('</main>','<section class="section"><p class="eyebrow">COMPÉTENCES OBSERVÉES EN SITUATION</p><h2>Des faits.<br>Et des retours.</h2><div class="skill-proofs">'+links+'</div></section></main>')
 if file=='index.html':
  html=html.replace('src="assets/fabrication.webp" alt="Drapage d’une lame composite dans son moule"','src="assets/cover-compositeauphone.webp" alt="Lames de xylophone en trois matériaux — illustration générée"').replace('DU MODÈLE AU PROTOTYPE','ILLUSTRATION DU PROJET · IA')
  covers=[('mini-flow','chanel','Cosmétiques et entrepôt de distribution','02'),('mini-capacity','boscha','Atelier d’usinage et organisation des postes','03'),('mini-data','data','Bobines toriques et mesure électrique','04')]
  for cls,key,alt,num in covers:
   pattern=r'<div class="card-visual '+cls+r'">.*?</div>(?=<div class="card-copy">)'
   replacement=f'<div class="card-visual photo"><img src="assets/cover-{key}.webp" alt="{alt} — illustration générée" width="1536" height="1024" loading="lazy"><span class="card-number">{num}</span><span class="visual-caption">ILLUSTRATION DU PROJET · IA</span></div>'
   html=re.sub(pattern,lambda m:replacement,html,flags=re.S)
 if file in ['chanel.html','boscha.html','data.html']:
  key=file[:-5]
  cover=f'<figure class="project-cover wrap"><img src="assets/cover-{key}.webp" alt="Illustration générée du domaine du projet {key}" width="1536" height="1024" loading="lazy"><figcaption>Illustration générée pour présenter le sujet du projet. Les données et livrables réels sont présentés dans la suite.</figcaption></figure>'
  end=html.index('</section>',html.index('<main'))+len('</section>')
  html=html[:end]+cover+html[end:]
 return html
