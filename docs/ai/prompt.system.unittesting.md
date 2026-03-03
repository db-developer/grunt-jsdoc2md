# Testkonzept und -struktur (Projektkonvention)

Dieses Dokument beschreibt das im Projekt verwendete Testkonzept, die Struktur der Tests sowie die impliziten Konventionen, die sich aus den vorhandenen Testdateien ergeben. Ziel ist es, auf dieser Basis eigenständig weiteren Test-Code zu erzeugen, der konsistent zu den bestehenden Tests ist, ohne vorhandene Implementierungen zu verändern oder zu kommentieren.

---

## 1. Testziel und Rolle der Tests

Die Tests dienen nicht nur der funktionalen Verifikation einzelner Module, sondern auch:

- der **Validierung der Laufzeitumgebung**
- der **Absicherung externer Abhängigkeiten**
- der **Überprüfung von Modul-APIs (Existenz, Typen, Aufrufbarkeit)**
- der **Validierung definierter Fehlerszenarien**

Tests werden bewusst **explizit und defensiv** formuliert. Implizites Verhalten oder „magisches“ Setup wird vermieden.
Testbeschreibungen und Kommentare nutzen [en-US] Englisch, um die internationale Verständlichkeit zu gewährleisten.

---

## 2. Testframeworks und Assertion-Strategie

### 2.1 Test Runner

- **Mocha** wird als Test Runner verwendet.
- Die Tests werden über **grunt-nyc-mocha** ausgeführt.
- Tests laufen in einer **Node.js-Umgebung ≥ 20**.

### 2.2 Assertion Libraries

Es werden **zwei Assertion-Stile parallel** eingesetzt:

1. **Node.js Standard Assertions (`assert`)**
   - Wird primär für grundlegende Existenz- und Verfügbarkeitsprüfungen verwendet.
   - Besonders geeignet für:
     - `doesNotThrow`
     - elementare Preconditions

2. **expect.js**
   - Wird für semantisch reichere Assertions eingesetzt.
   - Einsatzgebiete:
     - Typprüfungen
     - API-Oberflächen
     - Rückgabewerte
     - Exceptions inkl. Fehlermeldungen

Die Wahl der Assertion Library ist **bewusst kontextabhängig**, nicht zufällig.

---

## 3. Dateistruktur und Benennung

### 3.1 Verzeichnisstruktur

- Alle Tests liegen unter  
  `src/test/any/`
- Die Struktur ist **linear nummeriert**, nicht hierarchisch verschachtelt.

### 3.2 Dateinamen

Dateinamen folgen strikt dem Schema:

`<zweistellige Phase>.<zweistellige Unterphase>.<inhaltliche Beschreibung>.spec.js`

Das Pattern `<inhaltliche Beschreibung>` setzt sich zusammen aus: `<src code folder>.<functionname>`, wobei `<src code folder>` der relative Pfad zum getesteten Modul ist (ohne `src/` und ohne `.js`), und `<functionname>` die spezifische Funktion oder API, die getestet wird.


Beispiele für Phasen:
- `00.xx` → Initialisierung & Voraussetzungen
- `01.xx` → Options-/API-Tests
- Höhere Nummern → weiterführende Funktionalität

Die Nummerierung definiert **logische Reihenfolge**, nicht technische Abhängigkeiten.
Die Nummerierung dient dazu, die Tests in einer **bestimmten Reihenfolge** auszuführen, insbesondere um sicherzustellen, dass die Initialisierungstests (Phase 00) vor den API-Tests (Phase 01) ausgeführt werden. Es gibt jedoch keine impliziten Abhängigkeiten zwischen den Tests, außer dass die Initialisierungstests erfolgreich sein müssen, damit die API-Tests sinnvoll ausgeführt werden können.

Der Name der Testdatei wird vom Äußeren `describe`-Block übernommen, um die Testausgabe lesbar und nachvollziehbar zu gestalten.

---

## 4. Initiale Prerequisite-Tests (Phase 00)

### 4.1 Zweck

Phase-00-Tests stellen sicher, dass:

- alle benötigten **externen Abhängigkeiten installiert**
- und zur Laufzeit **require-bar** sind

Diese Tests fungieren als **frühe Fehlerbarriere**, bevor komplexere Tests ausgeführt werden.

### 4.2 Eigenschaften

- Keine Abhängigkeit von Projektcode
- Keine Grunt-Initialisierung
- Keine Seiteneffekte
- Fokus ausschließlich auf `require()`-Erfolg

Fehlermeldungen sind **präzise benannt**, um fehlende Pakete sofort identifizieren zu können.

---

## 5. Gemeinsame Testumgebung (`constants`)

### 5.1 Zweck

Eine zentrale Hilfsdatei erzeugt eine **kontrollierte Grunt-Testumgebung**, die:

- einen realen Grunt-Kontext verwendet
- Tasks tatsächlich registriert und ausführt
- für nachfolgende Tests wiederverwendbar ist

### 5.2 Charakteristika

- Asynchrone Initialisierung über `Promise`
- Exportiert ein Objekt mit:
  - `grunt` (laufende Grunt-Instanz)
  - `task` (aktueller MultiTask-Kontext)
  - `name` (Taskname aus zentralen Konstanten)

### 5.3 Fehlerbehandlung

- Fehler in der Initialisierung werden **explizit über `grunt.fail.warn` signalisiert**
- Tests verlassen sich darauf, dass ein fehlgeschlagenes Setup den Testlauf korrekt stoppt

---

## 6. Asynchrones Testlayout

- Jede Testdatei ist in eine **sofort ausgeführte async-Funktion** gekapselt
- `await` wird auf Modulebene verwendet, nicht innerhalb einzelner Tests
- Dadurch:
  - sauberes Setup vor `describe`
  - keine impliziten Race Conditions
  - deterministischer Teststart

---

## 7. Struktur innerhalb der Tests

### 7.1 Describe-Hierarchie

Tests sind strikt hierarchisch aufgebaut:

1. Dateiebene (`describe` mit Dateinamen)
2. Themenebene (z. B. „Testing exports of module …“)
3. Funktions- oder Verhaltensebene

Diese Struktur ist **beschreibend**, nicht technisch motiviert.

### 7.2 Testfälle (`it`)

Ein einzelner Testfall prüft **genau einen Aspekt**:

- Existenz
- Typ
- Aufrufbarkeit
- Rückgabewert
- Fehlverhalten

Kombinierte Assertions sind erlaubt, sofern sie **denselben Sachverhalt** betreffen.

---

## 8. API-Tests: Philosophie

### 8.1 Export-Tests

Für jedes öffentlich exportierte API-Element wird geprüft:

- Existiert es?
- Ist es nicht `null`?
- Hat es den erwarteten Typ?

### 8.2 Aufruf-Tests

Für Funktionen werden systematisch getestet:

- Aufruf **ohne Argumente**
- Aufruf **mit minimal gültigen Argumenten**
- Rückgabewert:
  - Existenz
  - Typ
  - strukturelle Eigenschaften

### 8.3 Fehlerverhalten

Fehler sind **Teil der Spezifikation**:

- Erwartete Exceptions werden explizit getestet
- Sowohl Exception-Typ als auch **Fehlermeldung** sind relevant
- Abweichungen zwischen Node-Versionen (z. B. Error-Messages) werden berücksichtigt

---

## 9. Defensive Testgestaltung

- Tests gehen **nicht von impliziten Defaults** aus
- Rückgabewerte werden immer validiert
- `undefined` und `null` werden explizit ausgeschlossen
- Arrays werden zusätzlich auf:
  - tatsächliche Array-Eigenschaft
  - erwartete Länge
  geprüft

---

## 10. Abgrenzung und bewusste Testentscheidungen

Die Tests folgen klaren Abgrenzungen, verzichten jedoch **nicht grundsätzlich** auf bestimmte Techniken, sondern setzen sie **gezielt und kontrolliert** ein.

- **Mocking von Grunt ist möglich und vorgesehen**  
  Unter `src/test/any/__mocks__` existiert ein Mock für `grunt`, der es erlaubt, Grunt-abhängige Funktionen isoliert zu testen, ohne eine echte Grunt-Laufzeitumgebung zu initialisieren.

- **Stubbing von Grunt wird bewusst eingesetzt**  
  Tests können fallabhängig entscheiden, ob:
  - das gemockte Grunt verwendet wird (für isolierte, schnelle, deterministische Tests), oder
  - eine reale Grunt-Instanz zum Einsatz kommt (für Integrations- und Verhaltenstests).
  
  Beide Varianten sind gleichwertige, explizit gewählte Teststrategien.

- **Reihenfolgenabhängigkeit ist vorhanden und intentional**  
  Innerhalb einzelner Testdateien besteht eine logische Reihenfolge der Tests.  
  Diese Reihenfolge dient **nicht der technischen Abhängigkeit**, sondern der **diagnostischen Lesbarkeit**:
  - Frühe Tests prüfen elementare Voraussetzungen wie Exporte und Typen.
  - Schlagen diese fehl, ist unmittelbar erkennbar, dass nachfolgende Funktionstests zwangsläufig nicht valide sein können.

- **Keine versteckten oder impliziten Testabhängigkeiten**  
  Auch bei vorhandener Reihenfolge gilt:
  - Tests bauen nicht funktional aufeinander auf
  - Es gibt keine verdeckten Seiteneffekte zwischen Tests
  - Fehler werden möglichst früh und lokal sichtbar gemacht

- **Keine Snapshot-Tests**  
  Tests validieren Verhalten, Typen und Strukturen explizit und nachvollziehbar, nicht über implizite Momentaufnahmen.

Jede Testdatei ist damit **konzeptionell in sich geschlossen**, kann jedoch bewusst auf:
- gemeinsame Mocks
- geteilte Initialisierung
- oder eine diagnostisch sinnvolle Testreihenfolge  
zurückgreifen, um die Wartbarkeit und Interpretierbarkeit der Testergebnisse zu erhöhen.

---

## 11. Zielkonsequenz

Ein neu geschriebener Test nach diesen Vorgaben soll:

- deterministisch
- reproduzierbar
- explizit
- fehlertolerant gegenüber Laufzeitunterschieden
- und semantisch lesbar

sein.

Die Tests fungieren damit gleichzeitig als **ausführbare Spezifikation** der öffentlichen Projekt-APIs.
