drop database if exists rede_social;

create database rede_social;

use rede_social;

create table Tag(
	id char(50) primary key unique not null,
    `name` char(50) not null,
    createdAt timestamp not null
);

create table `User`(
	id char(50) primary key unique not null,
    email char(50) unique not null,
    username char(20) unique not null,
    birthdate date not null,
    avatar char(100),
    createdAt timestamp not null
);

create table TagUser(
	tagId char(50) not null,
    userId char(50) not null,
    
    foreign key (tagId) references Tag (id) on delete cascade on update cascade,
    foreign key (userId) references `User` (id) on delete cascade on update cascade,
    
    primary key(tagId, userId),
    
    createdId timestamp not null
);

create table Board(
	id char(50) primary key unique not null,
    `name` char(50) not null,
    `description` char(254),
    image char(100),
    createdAt timestamp not null
);

create table BoardMember(
	userId char(50) not null,
    boardId char(50) not null,
    
    foreign key (userId) references `User` (id) on delete cascade on update cascade,
    foreign key (boardId) references Board (id) on delete cascade on update cascade,
    
    primary key(userId, boardId),
    
    createdAt timestamp not null,
    `role` int not null
);

create table Post(
	id char(50) primary key unique not null,
    
    authorId char(50) not null,
    foreign key (authorId) references `User` (id) on delete cascade on update cascade,
    
    content char(254) not null,
    attchament char(50) not null,
    
    boardId char(50) not null,
    foreign key (boardId) references Board(id) on delete cascade on update cascade,
    
    createdAt timestamp not null
);

create table PostVote(
	postId char(50) not null,
    userId char(50) not null,
    
    createdAt timestamp not null,
    `value` int not null,
    
    foreign key (postId) references Post (id) on delete cascade on update cascade,
    foreign key (userId) references `User` (id) on delete cascade on update cascade,
    
    primary key(postId, userId)
); 

create table `Comment`(
	id char(50) primary key unique not null,
    content char(254) not null,
    
    postId char(50) not null,
    foreign key (postId) references Post(id) on delete cascade on update cascade,
    
    `level` int not null,
    
    authorId char(50) not null,
    foreign key (authorId) references `User` (id) on delete cascade on update cascade,
    
    createdAt timestamp not null,
    
    replyId char(50),
    foreign key (replyId) references `Comment` (id) on delete cascade on update cascade
);

create table CommentVote(
	commentId char(50) not null,
    userId char(50) not null,
    
    createdAt timestamp not null,
    value int not null,
    
    foreign key (commentId) references `Comment` (id) on delete cascade on update cascade,
    foreign key (userId) references `User` (id) on delete cascade on update cascade,
    
    primary key(commentId, userId)
);