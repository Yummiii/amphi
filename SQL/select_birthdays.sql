use rede_social;

-- demonstrar os usuarios aniversariantes para adicionar na front
SELECT *  FROM `User` WHERE MONTH(birthdate) = MONTH(NOW()) AND DAY(birthdate) = DAY(NOW());