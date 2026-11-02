-- Migration: Update user emails to official Gmail addresses for OTP and password recovery
-- Corresponding to the 11 Pra-PKL Teknolab team members in 'Informasi Proyek'

UPDATE users SET email = 'awangtgprofesional@gmail.com' WHERE username = 'dzakwan' OR user_id = 1;
UPDATE users SET email = 'damarmunajad7@gmail.com' WHERE username = 'damar' OR user_id = 2;
UPDATE users SET email = 'rzafahmi351@gmail.com' WHERE username = 'fahmi' OR user_id = 3;
UPDATE users SET email = 'faidatrismaamelia@gmail.com' WHERE username = 'faida' OR user_id = 4;
UPDATE users SET email = 'ilfnamufarika4@gmail.com' WHERE username = 'ilvina' OR user_id = 5;
UPDATE users SET email = 'c11anandadwisusanti@gmail.com' WHERE username = 'ananda' OR user_id = 6;
UPDATE users SET email = 'dikayogapratama18@gmail.com' WHERE username = 'dika' OR user_id = 7;
UPDATE users SET email = 'ahzizsaputra@gmail.com' WHERE username = 'aziz' OR user_id = 8;
UPDATE users SET email = 'arickferdiansyah@gmail.com' WHERE username = 'arik' OR user_id = 9;
UPDATE users SET email = 'wafianzaidan@gmail.com' WHERE username = 'wafian' OR user_id = 10;
UPDATE users SET email = 'rezatriwardana7@gmail.com' WHERE username = 'reza' OR user_id = 11;
