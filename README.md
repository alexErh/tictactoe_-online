# Projektarchitektur

Das **TicTacToe-Projekt** besteht aus zwei Hauptkomponenten: **Frontend** und **Backend**. In diesem Abschnitt wird die Frontend-Architektur detailliert beschrieben.

## Frontend Architektur

Das Frontend des Projekts ist modular aufgebaut und enthält verschiedene Seiten, die jeweils spezifische Funktionen bereitstellen. Die Navigation zwischen den Seiten wird durch eine gemeinsame Navigationskomponente ermöglicht, die in mehreren Bereichen der Anwendung genutzt wird. Die Kommunikation mit dem Backend erfolgt über dedizierte Service-Dateien.

### 1. Registrierungsseite (Registration Page)
**Funktionen:**
- Spielerregistrierung
- Überprüfung der Eindeutigkeit des Nutzernamens
- Passwort festlegen und validieren

**Dateipfad:** `./frontend/src/app/registration/`

### 2. Login-Seite (Login Page)
**Funktionen:**
- Spieleranmeldung
- Validierung von Benutzername und Passwort

**Dateipfad:** `./frontend/src/app/login/`

### 3. Startseite (Home Page)
**Funktionen:**
- "Jetzt Spielen"-Button zum Beitritt in die Matchmaking-Queue
- Anzeige der aktuellen Elo-Zahl des Spielers (Beginn bei 1000)
- Navigation zu anderen Seiten, wie Profil und Spielhistorie

**Dateipfad:** `./frontend/src/app/startseite/`

### 4. Matchmaking-Queue Seite (Matchmaking Queue Page)
**Funktionen:**
- Anzeige des Wartestatus (Queue)
- Automatisches Matchmaking, sobald ein anderer Spieler in die Queue eintritt
- Spielstart, sobald zwei Spieler mit ähnlicher Elo-Zahl gefunden sind (Elo-Differenz < 200)
- Möglichkeit, die Teilnahme an der Warteschlange abzubrechen (Cancel-Button)

**Dateipfad:** `./frontend/src/app/matchmaking-queue/`

### 5. Spielseite (Game Page)
**Funktionen:**
- Darstellung des Spielfelds und der Spieleraktionen
- Zufällige Bestimmung, welcher Spieler das Spiel beginnt
- Echtzeit-Feedback zum Spielverlauf und Ergebnisermittlung
- Anzeige der aktuellen Elo-Zahl und Profilinformationen des Gegners (inkl. Profilbild und Elo-Zahl)

**Dateipfad:** `./frontend/src/app/spielseite/`

### 6. Profilseite (Profile Page)
**Funktionen:**
- Anzeige der Spielerstatistik (gewonnene und verlorene Spiele)
- Einsicht in die Spielhistorie (Gegner, Ergebnisse und Datum)
- Möglichkeit, das Passwort zu ändern und ein neues Profilbild hochzuladen
- Anzeige der aktuellen Elo-Zahl

**Dateipfad:** `./frontend/src/app/profilseite/`

### 7. Admin-Seite (Admin Page)
**Funktionen:**
- Verwaltung und Einsicht aller Spielerstatistiken
- Monitoring von laufenden Spielen und der aktuellen Matchmaking-Queue
- Verwaltung von Nutzerdaten (z.B. Sperren von Spielern)

**Dateipfad:** `./frontend/src/app/admin/`

### 8. Ergebnis-Seite nach Spielende (Result Page)
**Funktionen:**
- Anzeige des Spielergebnisses nach Spielende
- Aktualisierte Elo-Zahlen für beide Spieler
- Möglichkeit, zur Startseite oder zur Spielhistorie zu navigieren

**Dateipfad:** `./frontend/src/app/resultat/`

### 9. Navigationskomponente
Eine **Navigationskomponente** ist in mehreren Seiten eingebettet, wie in der Startseite, Profilseite, Ergebnisseite und Adminseite. Diese Komponente ermöglicht eine einfache Navigation zwischen den verschiedenen Bereichen der Anwendung.

**Dateipfad:** `./frontend/src/app/navigation/`

### 10. Service-Dateien
Die Service-Datei stellt die Verbindung zwischen dem Frontend und dem Backend her. Sie ermöglichen die Kommunikation mit der Datenbank und enthalten die benötigten Logiken für Authentifizierung, Spielverlauf und weitere Operationen. Zu den wichtigsten Services gehören:

- `admin.service`: Verwalten der Admin-Operationen (Spielüberwachung, Nutzerverwaltung)
- `auth.service`: Authentifizierung und Verwaltung von Sitzungen
- `game.service`: Spielverlauf und Spiellogik
- `matchmaking-queue.service`: Handhabung der Warteschlange für das Matchmaking
- `profil.service`: Verwaltung der Profildaten des Spielers
- `registration.service`: Abwicklung der Registrierung neuer Spieler
- `result.service`: Berechnung und Anzeige der Spielergebnisse

**Dateipfad:** `./frontend/src/app/services/`


### 11. Helpers-Datei mit Guards
In der **helpers**-Datei werden **Guards** über das Quarts-Framework verwendet, um den Zugriff auf bestimmte Seiten oder Funktionen zu beschränken. Es gibt zwei Haupt-Guards, die verwendet werden:

1. **auth.guard**:
    - Dieser Guard wird verwendet, um sicherzustellen, dass nur authentifizierte Benutzer auf bestimmte Seiten zugreifen können. Beispiel: Startseite, Profilseite, Matchmaking-Queue und Spielseite.
    - Der Guard überprüft, ob der Benutzer eingeloggt ist, bevor er Zugriff auf die geschützte Route gewährt.

   **Dateipfad:** `./frontend/src/app/helpers/guards/auth.guard`

2. **admin.guard**:
    - Dieser Guard beschränkt den Zugriff auf die Admin-Seite. Nur Benutzer mit Administratorrechten können auf die Admin-Funktionen zugreifen.
    - Der Guard prüft, ob der Benutzer die entsprechenden Administratorrechte besitzt, bevor der Zugriff erlaubt wird.

   **Dateipfad:** `./frontend/src/app/helpers/guards/admin.guard`

Die Guards spielen eine wichtige Rolle, um sicherzustellen, dass nur berechtigte Benutzer auf sensible Bereiche der Anwendung zugreifen können, und tragen zur allgemeinen Sicherheit des Systems bei.


## Backend-Architektur

Das Backend des Projekts ist modular aufgebaut und verwendet verschiedene Services, Controller und Guards. Es gibt mehrere Module, die die Logik für Benutzerverwaltung, Matchmaking, Spielverwaltung und Elo-Berechnungen abdecken. Data Transfer Objects (DTO) werden zur Validierung von Daten verwendet. Zudem werden Guards für Authentifizierung und Admin-Rechte eingesetzt.

### 1. Benutzerverwaltung (User Management)
**Funktionen:**
- Registrierung neuer Benutzer
- Authentifizierung und Autorisierung (Login/Logout)
- Überprüfung der Eindeutigkeit von Nicknames
- Verwaltung von Benutzerdaten (Nickname, Passwort, Profilbild)
- Passwortänderung

**Dateipfad:**
- `./src/auth/` (für Authentifizierung und Autorisierung)
- `./src/users/` (für die Verwaltung der Benutzerdaten)

### 2. Matchmaking-System
**Funktionen:**
- Hinzufügen von Spielern zur Matchmaking-Queue
- Suche nach passenden Gegnern basierend auf Elo-Zahl (Unterschied < 200)
- Erstellen von Spielen, wenn ein passendes Paar gefunden wird

**Dateipfad:**
- `./src/match/`

### 3. Spielverwaltung (Game Management)
**Funktionen:**
- Erstellen und Verwalten von Spielen
- Zufällige Bestimmung des startenden Spielers
- Spiellogik und Echtzeit-Interaktionen
- Berechnung und Aktualisierung der Spielergebnisse
- Anpassung der Elo-Zahlen nach Spielende
- Speichern und Abrufen der Spielergebnisse

**Dateipfad:**
- `./src/game/`

### 4. Spielhistorie und Statistiken
**Funktionen:**
- Verwaltung der Spielhistorie (gegen wen gespielt, Ergebnis)
- Bereitstellung von Statistiken zu gewonnenen und verlorenen Spielen

**Dateipfad:**
- `./src/game/`

### 5. Admin-Management
**Funktionen:**
- Einsicht und Verwaltung aller Spielerdaten
- Überwachung aller laufenden Spiele
- Einsicht in die Matchmaking-Queue

**Dateipfad:**
- `./src/game/`
- `./src/users/`


### 6. Elo-Berechnungsservice
**Funktionen:**
- Berechnung der neuen Elo-Zahlen basierend auf den Spielergebnissen
- Initialisierung der Elo-Zahl auf 1000 für neue Spieler
- Bereitstellung der aktuellen Elo-Zahlen für die Anzeige im Frontend

**Dateipfad:**
- `./src/game/`

## 7. Guards
Im Backend wurden zwei Guards implementiert, um den Zugriff auf bestimmte Routen zu sichern:

1. **auth.guard**:
   - Sichert Routen, die nur für authentifizierte Benutzer zugänglich sind, wie z.B. Spielverwaltung und Profilverwaltung.

2. **admin.guard**:
   - Beschränkt den Zugriff auf Administratorfunktionen und ermöglicht nur Benutzern mit Admin-Rechten den Zugriff auf bestimmte Routen, z.B. Admin-Management.

**Dateipfad:**
- `./src/helpers/guards/`

## 8. Datenbank
Die Backend-Komponenten greifen auf die Datenbank zu, um die benötigten Informationen zu speichern und abzurufen. Zwei zentrale Tabellen werden verwendet:

1. **Game-Entity**: Verwaltung der Spieldaten.
2. **User-Entity**: Verwaltung der Benutzerdaten.

**Dateipfad:**
- `./src/database/tables/`

## 9. Module, Services und Controller

Das Backend verwendet die **Modularisierung**, um verschiedene Aspekte der Anwendung zu trennen. Jedes Modul besteht aus zugehörigen Services, Controllern und DTOs.

- **Module**: Die verschiedenen Funktionen (wie Benutzer, Matchmaking, Spiel) sind in separaten Modulen organisiert, um eine klare Trennung und Wiederverwendbarkeit zu gewährleisten.
- **Services**: Enthalten die Geschäftslogik, die für die jeweiligen Komponenten benötigt wird, z.B. Authentifizierungsservice, Matchmaking-Service, Spielverwaltung.
- **Controller**: Zuständig für die Definition der Endpunkte und die Interaktion mit den Frontend-Anfragen.
- **DTO (Data Transfer Objects)**: Werden verwendet, um die Datenvalidierung und -übertragung zwischen Frontend und Backend sicherzustellen. Beispiele sind Login-DTOs, Registrierungs-DTOs und Game-DTOs.

---

Mit dieser Architektur stellt das Backend eine robuste und skalierbare Lösung bereit, die die verschiedenen Anforderungen an Authentifizierung, Matchmaking, Spielverwaltung und Elo-Berechnung effizient abdeckt. Guards sorgen für Sicherheit, während die Services und Controller die Geschäftslogik kapseln und die Anwendungsstruktur klar definieren.
