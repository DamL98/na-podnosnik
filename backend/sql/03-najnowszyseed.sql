INSERT INTO podnosnik (nazwa, aktywny) VALUES
('Podnośnik #1', true),
('Podnośnik #2', true),
('Podnośnik #3', true);

INSERT INTO rezerwacje
(podnosnikid, "userId", imie, nazwisko, email, sposob_platnosci, od_ts, do_ts, uslugi_json)
VALUES
(
  1,
  '3f12c2f9-3d0f-4f1c-9d8b-991fa88e99aa',
  'Jan',
  'Kowalski',
  'jan.kowalski@example.com',
  'karta',
  '2024-07-01T10:00:00+02',
  '2024-07-01T12:00:00+02',
  '[
    {
      "uslugaId": 3,
      "nazwa": "Diagnostyka OBD",
      "typ": "FIX",
      "stawka": 40,
      "ilosc": 1,
      "koszt": 40
    },
    {
      "uslugaId": 1,
      "nazwa": "Podnośnik",
      "typ": "H",
      "stawka": 50,
      "ilosc": 2,
      "koszt": 100
    }
  ]'
);