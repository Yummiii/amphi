create view num_users as
select count(distinct(id)) as Num_users
from `User`;

create function Count_Comment(_authorId char(50))
returns int
deterministic
reads sql data
return(
	select count((`Comment`.id)) as num_Comment_User
	from `Comment`
	where `Comment`.authorId = _authorId
);

create function Count_Post(_authorId char(50))
returns int
deterministic
reads sql data
return(
	select count((Post.id)) as num_Post_User
	from Post
	where Post.authorId = _authorId
);

delimiter //

create procedure getInfoUser(in _username char(20))
begin
	select username, avatar, email, birthdate, createdAt
    from `User`
    where username = _username;
end;

//

delimiter ;

create function Count_Reply(_commentId char(50))
returns int
deterministic
reads sql data
return(
	select count(*)
    from `Comment`
    where replyId = _commentId
);