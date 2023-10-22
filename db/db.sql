use app_delivery;
//crear user
create table users(
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(180) NOT NULL UNIQUE,
    name VARCHAR(90) NOT NULL,
    lastname VARCHAR (90)NOT NULL,
    phone VARCHAR(90) NOT NULL UNIQUE,
    image VARCHAR(255) NULL,
    password VARCHAR(90) NOT NULL,
    created_at TIMESTAMP(0) NOT NULL,
    updated_at TIMESTAMP(0) NOT NULL
);
//user role 

use app_delivery;
CREATE TABLE roles(
id BIGINT PRIMARY KEY auto_increment,
name varchar(90) not null unique,
image varchar(255) null,
route varchar(180) not null,
created_at timestamp(0) NOT NULL,
updated_at timestamp(0) not null
);

insert into roles(
	
	name,
    route,
    created_at,
    updated_at
)
values (
	'administrador',
    '/administrador/orders/list',
    '2023-07-23',
    '2023-07-23'
);
insert into roles(

	name,
    route,
    created_at,
    updated_at
)
values (
	'repartidor',
    '/delivery/orders/list',
    '2023-07-23',
    '2023-07-23'
);
insert into roles(

	name,
    route,
    created_at,
    updated_at
)
values (
	'cliente',
    '/client/products/list',
    '2023-07-23',
    '2023-07-23'
    );
    
create table user_has_roles(
	id_user bigint not null,
    id_rol bigint not null,
    created_at timestamp(0) NOT NULL,
	updated_at timestamp(0) not null,
    foreign key(id_user) references users(id) on update cascade on delete cascade,
    foreign key(id_rol) references roles(id) on update cascade on delete cascade,
    primary key (id_user, id_rol)
	
);

CREATE TABLE categories(
    id BIGINT PRIMARY key AUTO_INCREMENT,
    name VARCHAR(180) NOT NULL,
    description text not null,
    image varchar(255) null,
    created_at timestamp(0) not null,
    updated_at timestamp(0)not null
)
create table products(
	id bigint primary key auto_increment,
    name varchar (180) not null unique,
    description text not null,
    price DOUBLE PRECISION not null,
    image1 varchar(255) not null,
    image2 varchar(255) not null,
    image3 varchar(255) not null,
    id_category bigint not null,
    created_at timestamp(0) not null,
    updated_at timestamp(0) not null,
    foreign key(id_category) references categories(id) on update cascade on delete cascade 
    
    
)
CREATE TABLE address(
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
    address VARCHAR(255) NOT NULL,
    neighborhood VARCHAR(180) NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMP(0) NOT NULL,
    updated_at TIMESTAMP(0) NOT NULL,
    id_user BIGINT NOT NULL,
    FOREIGN KEY(id_user) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);