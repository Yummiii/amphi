use rede_social;

-- selecionar os posts com votos acima de 0
SELECT distinct(postId) FROM PostVote WHERE `value` >= 1;

-- selecionar os maiores posts do dia
SELECT Post.id, sum(PostVote.value) as totalVotes
from Post
JOIN PostVote ON PostVote.postId = Post.id
WHERE MONTH(Post.createdAt) = MONTH(NOW()) and (DAY(Post.createdAt) = DAY(NOW())) and (YEAR(Post.createdAt) = YEAR(NOW()))
group by Post.id
ORDER BY totalVotes desc
;

-- selecionar os maiores posts do mes
SELECT Post.id, sum(PostVote.value) as totalVotes
from Post
JOIN PostVote ON PostVote.postId = Post.id
WHERE (MONTH(Post.createdAt) = MONTH(NOW())) and (YEAR(Post.createdAt) = YEAR(NOW()))
group by Post.id
ORDER BY totalVotes desc
;


-- selecionar os maiores posts do ano
SELECT Post.id, sum(PostVote.value) as totalVotes
from Post
JOIN PostVote ON PostVote.postId = Post.id
WHERE (YEAR(Post.createdAt) = YEAR(NOW()))
group by Post.id
ORDER BY totalVotes desc
;