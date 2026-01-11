# 🛠️ Na Podnośnik — System Rezerwacji Warsztatu Samoobsługowego

## 🔗 **Linki**
[Tablica Kanban](https://trello.com/b/GI6MYXNN/pbl)<br>

[Video aplikacji](https://drive.google.com/drive/folders/1QLhUJOOGh32pvv0GQUnnN3c4L74g3Nhy?usp=sharing)


## 📌 **Opis projektu**
*Na Podnośnik to aplikacja webowa umożliwiająca klientom rezerwację stanowisk warsztatowych (podnośników) wraz z dodatkowymi usługami (narzędzia, pomoc mechanika, diagnostyka itp.).*

## System umożliwia:

- tworzenie rezerwacji jako gość,
- założenie konta w trakcie rezerwacji,
- zarządzanie własnymi rezerwacjami po zalogowaniu,
- edycję danych profilu użytkownika.
      
## Aplikacja składa się z:
- frontend: React (SPA),
- backend: Node.js + Express,
- baza danych: PostgreSQL (Prisma ORM).

## 🎯 Główne funkcjonalności

*Rezerwacje*
- wybór zakresu dat i godzin,
- automatyczne sprawdzanie dostępności stanowisk,
- wybór usług dodatkowych (rozliczanych godzinowo lub ryczałtowo),
- obliczanie kosztu,
            
  zapis rezerwacji dla:
  - gościa,
  - użytkownika zalogowanego.
            
*Użytkownicy*
- rejestracja i logowanie,
- sesje JWT przechowywane w bazie,
- konto tworzone automatycznie przy rezerwacji,
- profil użytkownika (imię, nazwisko, telefon),
- dashboard z listą własnych rezerwacji.
      
*Panel użytkownika*
- lista wszystkich rezerwacji,
- podgląd usług, godzin i kosztów,
- informacja o metodzie płatności.

*Frontend komunikuje się z backendem przez REST API, a uwierzytelnianie odbywa się za pomocą tokenów JWT przechowywanych w tabeli session*

## 🗃️ Model danych
      [User]
            id
            email
            password (hash bcrypt)
            firstName
            lastName
            phone
      
      [Rezerwacja]
            id
            userId (nullable)
            podnosnikId
            imie
            nazwisko
            email
            od_ts
            do_ts
            sposob_platnosci
            uslugi_json
      
      [Session]
            token
            userId
            expiresAt

## 🔐 **Autoryzacja**
      JWT tokenów
      middleware auth i authOptional
      
      Dzięki temu:
            goście mogą tworzyć rezerwacje,
            zalogowani użytkownicy mają dostęp do /api/me i /api/me/rezerwacje.

## 🖥️ **Frontend Technologie:**
- React
- React Router
- Context API (AuthContext)
      
### Funkcje:
- formularz rezerwacji z walidacją,
- dropdown menu użytkownika,
- dynamiczne menu zależne od strony i zalogowania,
- dashboard,
- profil użytkownika.


## 🔧**Backend Technologie:**
- Node.js
- Express
- Prisma
- PostgreSQL
- bcrypt
- JWT

## **Główne endpointy:**

      POST   /api/auth/register
      POST   /api/auth/login
      GET    /api/auth/me
      
      POST   /api/rezerwacje
      GET    /api/me/rezerwacje
      GET    /api/availability
      GET    /api/podnosniki
      GET    /api/me
      PUT    /api/me

## ⚙️ **Instalacja lokalna**
### Backend
      cd backend
      npm install
      npx prisma migrate dev
      npm run dev
      
### Frontend
      cd frontend
      npm install
      npm run dev


*Aplikacja frontendowa:
http://localhost:5173*

*API backendu:
http://localhost:3001*
