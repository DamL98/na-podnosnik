INSERT INTO podnosnik (nazwa) VALUES
    ('Podnośnik #1'),
    ('Podnośnik #2'),
    ('Podnośnik #3');

INSERT INTO uslugi (nazwa, typ_rozliczenia, stawka_zl) VALUES
    ('Diagnostyka komputerowa', 'H', 40.00),
    ('Pomoc mechanika', 'H', 100.00),
    ('Myjka cisnieniowa', 'H', 20.00),
    ('Zestaw czyszczący', 'FIX', 35.00),
    ('Zestaw smarujący', 'FIX', 60.00),
    ('Zestaw myjący', 'FIX', 30.00);

-- Przykładowa rezerwacja
INSERT INTO rezerwacje (podnosnikid, imie, nazwisko, email, sposob_platnosci, od_ts, do_ts, uslugi_json) VALUES
(
    1,
    'Jan',
    'Kowalski',
    'jan.kowalski@example.com',
    'karta',
    '2024-07-01 10:00:00+02',
    '2024-07-01 12:00:00+02',
    '[
        {"usluga_id": 1, "ilosc_godzin": 2},
        {"usluga_id": 5, "ilosc_godzin": 1}
    ]'::jsonb
);