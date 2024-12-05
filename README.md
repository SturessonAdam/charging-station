Examineringsuppgift i Battery Management Services, ett frontned som kommunicerar med en lokal backend i Pyhton.
Programmet simulerar en elbil som står och laddar vid sitt hushåll i 24h, programmet räknar sedan ut de bästa timmarna för bilen att ladda på
och sätter på/stänger av laddningen vid de optimala tiderna baserat på hushållets elförbrukning och elens prissättning i elområde 3, Sverige.
Batteriet startar på 20% och laddas upp till ca 80%.

Backenden simulerar ett dygn där 1h motsvarar 4 sekunder i reel tid.
Backend: https://github.com/SturessonAdam/py-chargingsimulation.
