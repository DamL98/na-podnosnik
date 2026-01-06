CREATE TABLE podnosnik (
  id           SERIAL PRIMARY KEY,
  nazwa        TEXT NOT NULL UNIQUE,
  aktywny      BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE uslugi (
  id              SERIAL PRIMARY KEY,
  nazwa           TEXT NOT NULL UNIQUE,
  typ_rozliczenia TEXT NOT NULL CHECK (typ_rozliczenia IN ('H','FIX')),
  stawka_zl       NUMERIC(10,2) NOT NULL CHECK (stawka_zl >= 0)
);

CREATE TABLE rezerwacje (
  id               BIGSERIAL PRIMARY KEY,

  podnosnikid     INT NOT NULL REFERENCES podnosnik(id),

  -- Klient
  imie             TEXT NOT NULL CHECK (length(trim(imie)) > 0),
  nazwisko         TEXT NOT NULL CHECK (length(trim(nazwisko)) > 0),
  email            TEXT NOT NULL CHECK (email ~* '^[A-Z0-9.%+-]+@[A-Z0-9.-]+.[A-Z]{2,}$'),

  -- płatność
  sposob_platnosci TEXT NOT NULL CHECK (sposob_platnosci IN ('karta','gotowka')),

  -- termin rezerwacji
  od_ts            TIMESTAMPTZ NOT NULL,
  do_ts            TIMESTAMPTZ NOT NULL,
  CHECK (do_ts > od_ts),

  -- uslugi
  uslugi_json      JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- zakres czasu
  zakres           TSTZRANGE GENERATED ALWAYS AS (tstzrange(od_ts, do_ts, '[)')) STORED
);