use rede_social;

-- selecionar os posts com votos acima de 0
SELECT postId, userId FROM PostVote WHERE `value` >= 1;

-- selecionar os maiores posts do dia
SELECT postId from Post
JOIN PostVote
ON PostVote.postId = postId
WHERE MONTH(Post.createdAt) = MONTH(NOW()) and (DAY(Post.createdAt) = DAY(NOW())) and (YEAR(Post.createdAt) = YEAR(NOW()))
ORDER BY PostVote.value
;

-- selecionar os maiores posts do mes
SELECT postId from Post
JOIN PostVote
ON PostVote.postId = postId
WHERE (MONTH(Post.createdAt) = MONTH(NOW())) and (YEAR(Post.createdAt) = YEAR(NOW()))
ORDER BY PostVote.value
;


-- selecionar os maiores posts do ano
SELECT postId from Post
JOIN PostVote
ON PostVote.postId = postId
WHERE (YEAR(Post.createdAt) = YEAR(NOW()))
ORDER BY PostVote.value
;