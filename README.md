# Projektarchitektur

## Frontend Architektur

### 1. Registrierungsseite (Registration Page)
**Funktionen:**
- Spielerregistrierung
- Eindeutigkeit des Nutzernamens (Nickname) überprüfen
- Passwort festlegen

**Dateipfad:** `./frontend/src/app/registration/`

### 2. Login-Seite (Login Page)
**Funktionen:**
- Benutzeranmeldung

**Dateipfad:** `./frontend/src/app/login/`

### 3. Startseite (Home Page)
**Funktionen:**
- "Jetzt Spielen"-Button
- Anzeige der aktuellen Elo-Zahl des Spielers (Beginn mit 1000)
- Navigation zu anderen Seiten

**Dateipfad:** `./frontend/src/app/startseite/`

### 4. Matchmaking-Queue Seite (Matchmaking Queue Page)
**Funktionen:**
- Anzeige des Wartestatus
- Automatisches Matchmaking, wenn ein anderer Spieler in die Queue eintritt
- Starten des Spiels, sobald zwei passende Spieler gefunden sind (Elo-Differenz < 200)
- Cancel Button

**Dateipfad:** `./frontend/src/app/matchmaking-queue/`

### 5. Spielseite (Game Page)
**Funktionen:**
- Spieleraktionen und Spiellogik
- Zufällige Bestimmung des Startspielers
- Echtzeit-Feedback und Ergebnisermittlung
- Anzeige der aktuellen Elo-Zahl
- Anzeige der Gegnerprofile (inkl. Profilbild und Elo-Zahl)

**Dateipfad:** `./frontend/src/app/spielseite/`

### 6. Profilseite (Profile Page)
**Funktionen:**
- Anzeige der Spielerstatistik (gewonnene und verlorene Spiele)
- Spielhistorie (Gegner und Ergebnisse)
- Passwort ändern
- Profilbild hochladen
- Elo-Zahl ansehen

**Dateipfad:** `./frontend/src/app/profilseite/`

### 7. Admin-Seite (Admin Page)
**Funktionen:**
- Übersicht aller Spielerdaten
- Einsicht in laufende Spiele
- Einsicht in die Matchmaking-Queue

**Dateipfad:** `./frontend/src/app/admin/`

### 8. Ergebnis-Seite nach Spielende (Result Page)
**Funktionen:**
- Anzeige des Spielergebnisses
- Aktualisierte Elo-Zahlen nach Spielende

**Dateipfad:** `./frontend/src/app/resultat/`

## Backend-Komponenten

### Benutzerverwaltung (User Management)
**Funktionen:**
- Registrierung neuer Benutzer
- Authentifizierung und Autorisierung (Login/Logout)
- Verwaltung von Benutzerdaten (Nickname, Passwort, Profilbild)
- Überprüfung der Eindeutigkeit von Nicknames
- Passwortänderung

**Dateipfad:** `./src/users/`

### Matchmaking-System
**Funktionen:**
- Hinzufügen von Spielern zur Matchmaking-Queue
- Suche nach passenden Gegnern basierend auf Elo-Zahl (Unterschied < 200)
- Erstellen von Spielen, wenn ein passendes Paar gefunden wird

**Dateipfad:** `./src/match/`

### Spielverwaltung (Game Management)
**Funktionen:**
- Erstellen und Verwalten von Spielen
- Bestimmen des startenden Spielers (zufällig)
- Spiellogik und Echtzeit-Interaktion
- Berechnung und Aktualisierung der Spielergebnisse
- Anpassung der Elo-Zahlen nach Spielende

**Dateipfad:** `./src/game/`

### Statistik- und Historienverwaltung (Statistics and History Management)
**Funktionen:**
- Speichern und Abrufen der Spielergebnisse
- Verwaltung der Spielhistorie (gegen wen gespielt, Ergebnis)
- Bereitstellung der gewonnenen und verlorenen Spiele

**Dateipfad:** `./src/profile/`

### Admin-Management
**Funktionen:**
- Einsicht und Verwaltung aller Spielerdaten
- Überwachung aller laufenden Spiele
- Einsicht in die Matchmaking-Queue

**Dateipfad:** `./src/admin/`

### Elo-Berechnungsservice (Elo Calculation Service)
**Funktionen:**
- Berechnung der neuen Elo-Zahlen basierend auf den Spielergebnissen
- Initialisierung der Elo-Zahl auf 1000 für neue Spieler
- Bereitstellung der aktuellen Elo-Zahlen für die Anzeige

**Dateipfad:** `./src/game/`
