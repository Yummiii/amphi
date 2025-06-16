delimiter //
create trigger before_insert_tag
before insert on `Tag`
for each row
begin
	set new.`name` = lower(new.`name`);
end//
delimiter ;

delimiter //
create trigger before_insert_user
before insert on `User`
for each row
begin
	declare age int;
    
    set age = timestampdiff(year, new.birthdate, curdate());
    
    if age < 13 or age > 100 then
		signal sqlstate '45000'
        set message_text = 'Invalid age: user age has to be between 13 and 100';
	end if;
end//

delimiter ;
