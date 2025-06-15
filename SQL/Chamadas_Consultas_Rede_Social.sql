select * from num_users;

select Comment_By_User('550e8400-e29b-41d4-a716-446655440007') as Num_Comment;

select Post_By_User('550e8400-e29b-41d4-a716-44665544002E') as Num_Post;

call getInfoUser('julia');

select Count_Reply('c0000009-0000-0000-0000-000000000009') as Num_Reply;