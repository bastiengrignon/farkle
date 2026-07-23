import { Tolgee, DevTools, FormatSimple } from "@tolgee/web";

export const tolgee = Tolgee()
  .use(DevTools())
  .use(FormatSimple())
  .init({
    apiUrl: import.meta.env.VITE_TOLGEE_API_URL || "http://localhost:4000",
    apiKey: import.meta.env.VITE_TOLGEE_API_KEY || "",
    defaultLanguage: "en",
    fallbackLanguage: "en",
    staticData: {
      en: {
        // Home page
        "home.title": "Farkle Game",
        "home.subtitle": "Roll the dice and score big!",
        "home.play_now": "Play Now",
        "home.settings": "Settings",
        "home.leaderboard": "Leaderboard",
        "home.rules": "How to Play",
        
        // Game page
        "game.current_player": "Current Player: {player}",
        "game.roll": "Roll",
        "game.bank": "Bank Score",
        "game.end_turn": "End Turn",
        "game.score": "Score: {score}",
        "game.turn_score": "Turn Score: {score}",
        "game.rolls_remaining": "Rolls: {count}",
        "game.game_over": "Game Over!",
        "game.winner": "Winner: {player}",
        "game.new_game": "New Game",
        
        // Settings
        "settings.title": "Settings",
        "settings.language": "Language",
        "settings.theme": "Theme",
        "settings.dark": "Dark",
        "settings.light": "Light",
        "settings.system": "System",
        "settings.save": "Save",
        
        // Leaderboard
        "leaderboard.title": "Leaderboard",
        "leaderboard.rank": "Rank",
        "leaderboard.player": "Player",
        "leaderboard.score": "Score",
        "leaderboard.wins": "Wins",
        
        // Rules
        "rules.title": "How to Play Farkle",
        "rules.objective": "Objective",
        "rules.objective_desc": "Be the first player to reach 10,000 points.",
        "rules.scoring": "Scoring",
        "rules.ones": "Ones: 100 points each",
        "rules.fives": "Fives: 50 points each",
        "rules.three_of_a_kind": "Three of a kind: 100x the number (e.g., three 4s = 400)",
        "rules.four_of_a_kind": "Four of a kind: 2x three of a kind",
        "rules.five_of_a_kind": "Five of a kind: 3x three of a kind",
        "rules.six_of_a_kind": "Six of a kind: 4x three of a kind",
        "rules.straight": "Straight (1-5 or 2-6): 1500 points",
        "rules.full_house": "Full house: 1500 points",
        
        // Common
        "common.back": "Back",
        "common.start_game": "Start Game",
        "common.players": "Players",
        "common.add_player": "Add Player",
        "common.remove_player": "Remove Player",
      },
      fr: {
        // Home page
        "home.title": "Jeu Farkle",
        "home.subtitle": "Lancez les dés et marquez gros !",
        "home.play_now": "Jouer Maintenant",
        "home.settings": "Paramètres",
        "home.leaderboard": "Classement",
        "home.rules": "Comment Jouer",
        
        // Game page
        "game.current_player": "Joueur actuel : {player}",
        "game.roll": "Lancer",
        "game.bank": "Encaisser",
        "game.end_turn": "Fin de tour",
        "game.score": "Score : {score}",
        "game.turn_score": "Score du tour : {score}",
        "game.rolls_remaining": "Lancers restants : {count}",
        "game.game_over": "Partie terminée !",
        "game.winner": "Gagnant : {player}",
        "game.new_game": "Nouvelle Partie",
        
        // Settings
        "settings.title": "Paramètres",
        "settings.language": "Langue",
        "settings.theme": "Thème",
        "settings.dark": "Sombre",
        "settings.light": "Clair",
        "settings.system": "Système",
        "settings.save": "Sauvegarder",
        
        // Leaderboard
        "leaderboard.title": "Classement",
        "leaderboard.rank": "Rang",
        "leaderboard.player": "Joueur",
        "leaderboard.score": "Score",
        "leaderboard.wins": "Victoires",
        
        // Rules
        "rules.title": "Comment Jouer à Farkle",
        "rules.objective": "Objectif",
        "rules.objective_desc": "Soyez le premier joueur à atteindre 10 000 points.",
        "rules.scoring": "Marquage",
        "rules.ones": "As : 100 points chacun",
        "rules.fives": "Cinq : 50 points chacun",
        "rules.three_of_a_kind": "Brelan : 100x le numéro (ex: trois 4 = 400)",
        "rules.four_of_a_kind": "Carré : 2x le brelan",
        "rules.five_of_a_kind": "Quinté : 3x le brelan",
        "rules.six_of_a_kind": "Sextuplé : 4x le brelan",
        "rules.straight": "Suite (1-5 ou 2-6) : 1500 points",
        "rules.full_house": "Full : 1500 points",
        
        // Common
        "common.back": "Retour",
        "common.start_game": "Commencer la partie",
        "common.players": "Joueurs",
        "common.add_player": "Ajouter un joueur",
        "common.remove_player": "Retirer un joueur",
      },
      es: {
        // Home page
        "home.title": "Juego Farkle",
        "home.subtitle": "¡Tira los dados y marca puntos!",
        "home.play_now": "Jugar Ahora",
        "home.settings": "Configuración",
        "home.leaderboard": "Tabla de Líderes",
        "home.rules": "Cómo Jugar",
        
        // Game page
        "game.current_player": "Jugador actual: {player}",
        "game.roll": "Tirar",
        "game.bank": "Guardar Puntos",
        "game.end_turn": "Fin de Turno",
        "game.score": "Puntuación: {score}",
        "game.turn_score": "Puntuación del turno: {score}",
        "game.rolls_remaining": "Tiros restantes: {count}",
        "game.game_over": "¡Juego terminado!",
        "game.winner": "Ganador: {player}",
        "game.new_game": "Nuevo Juego",
        
        // Settings
        "settings.title": "Configuración",
        "settings.language": "Idioma",
        "settings.theme": "Tema",
        "settings.dark": "Oscuro",
        "settings.light": "Claro",
        "settings.system": "Sistema",
        "settings.save": "Guardar",
        
        // Leaderboard
        "leaderboard.title": "Tabla de Líderes",
        "leaderboard.rank": "Posición",
        "leaderboard.player": "Jugador",
        "leaderboard.score": "Puntuación",
        "leaderboard.wins": "Victorias",
        
        // Rules
        "rules.title": "Cómo Jugar Farkle",
        "rules.objective": "Objetivo",
        "rules.objective_desc": "Sé el primer jugador en alcanzar 10,000 puntos.",
        "rules.scoring": "Puntuación",
        "rules.ones": "Unos: 100 puntos cada uno",
        "rules.fives": "Cincos: 50 puntos cada uno",
        "rules.three_of_a_kind": "Trío: 100x el número (ej: tres 4 = 400)",
        "rules.four_of_a_kind": "Póker: 2x el trío",
        "rules.five_of_a_kind": "Quintilla: 3x el trío",
        "rules.six_of_a_kind": "Sextilla: 4x el trío",
        "rules.straight": "Escalera (1-5 o 2-6): 1500 puntos",
        "rules.full_house": "Full: 1500 puntos",
        
        // Common
        "common.back": "Atrás",
        "common.start_game": "Empezar Juego",
        "common.players": "Jugadores",
        "common.add_player": "Añadir Jugador",
        "common.remove_player": "Eliminar Jugador",
      },
    },
    ns: ["common", "home", "game", "settings", "leaderboard", "rules"],
  },
});

export default tolgee;
