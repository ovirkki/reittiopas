Backend: nodejs
Frontend: html, jquery, javascript

Käyttöohje:
Käynnistä serveri "node <polku main.js tiedostoon>"
Avaa page.html
  - Syötä lähtöpaikka ja määränpää
  - Paina "Etsi reitti" -nappia
  - Alle tulee linjat ja pysäkinvälit

Ratkaisu:
Rekursiivinen funktio, joka etsii jokaiselta lähtöpaikan viereisestä pysäkiltä, jonne menee joku linja, reittiä määränpäähän. Kun siihen asti nopein reitti määränpäähän löytyy se talletetaan globaaliin muuttujaan (yikes). Ennen funktion kutsumista uudelle pysäkille tsekataan muutama exit, jotta homma ei leviä käsiin: 1) Onko uudella pysäkillä jo käyty tällä reitillä, 2) Verrataan jo kuljettua aikaa tähän asti nopeimpaan löydettyyn reittiin ja jos mennyt jo pidempi aika, niin ei jatketa, 3) Ollaanko jo saapumassa määränpäähän, jolloin talletetaan uusin nopein aika eikä jatketa eteenpäin.

Ei aika tai motivaatio riittänyt optimoimaan pidemmälle tai tehdä ulkoasua hienommaksi, edes linjojen värien mukaisilla fonteilla tai sisennyksillä :)

