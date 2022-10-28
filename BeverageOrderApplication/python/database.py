import sqlite3
db = sqlite3.connect('database.sqlite')

db.execute('DROP TABLE IF EXISTS user')
db.execute('DROP TABLE IF EXISTS beverage')
db.execute('DROP TABLE IF EXISTS orderList')
db.execute('DROP TABLE IF EXISTS orderBeverage')

db.execute('''CREATE TABLE user(
    id integer PRIMARY KEY,
    name text NOT NULL,
    phoneNumber integer NOT NULL,
    DOB text NOT NULL,
    securityQuestion integer NOT NULL,
    password text NOT NULL
)''')

db.execute('''CREATE TABLE beverage(
    id integer PRIMARY KEY,
    name text NOT NULL,
    price real NOT NULL,
    description text NOT NULL,
    availability text NOT NULL,
    category text NOT NULL
)''')

db.execute('''CREATE TABLE orderList(
    id integer PRIMARY KEY,
    userId integer NOT NULL,
    remark text NOT NULL,
    status text NOT NULL,
    FOREIGN KEY (userId) REFERENCES user (id)
)''')

db.execute('''CREATE TABLE orderBeverage(
    id integer PRIMARY KEY,
    orderId integer NOT NULL,
    beverageId integer NOT NULL,
    quantity integer NOT NULL,
    sugerLevel text NOT NULL,
    iceLevel text NOT NULL,
    CONSTRAINT fk_order
        FOREIGN KEY (orderId)
        REFERENCES orderList(id),
    CONSTRAINT fk_beverage
        FOREIGN KEY (beverageId)
        REFERENCES beverage(id)
)''')
cursor = db.cursor()

cursor.execute('''
    INSERT INTO user(name, phoneNumber, DOB, securityQuestion, password)
    VALUES('Admin', 0123456789, '8/10/2022', 991210103133, 'Shawn01')
''')

cursor.execute('''
    INSERT INTO user(name, phoneNumber, DOB, securityQuestion, password)
    VALUES('Shawn', 0134526754, '8/10/2022', 991201103131, 'Shawn01')
''')

cursor.execute('''
    INSERT INTO beverage(name, price, description, availability, category)
    VALUES('Bubble Milk Tea', 18, 'Handmade milk tea with rich sugar pearl in a cup.', 'true', '01')
''')

cursor.execute('''
    INSERT INTO beverage(name, price, description, availability, category)
    VALUES('Grass Jelly Milk Tea', 15, 'Handmade milk tea with in house grass jelly in a cup.', 'true', '01')
''')

cursor.execute('''
    INSERT INTO beverage(name, price, description, availability, category)
    VALUES('Hazelnut Milk Tea', 18, 'Handmade hazelnut milk tea in a cup.', 'true', '01')
''')

cursor.execute('''
    INSERT INTO beverage(name, price, description, availability, category)
    VALUES('Bubble Coffee', 18, 'Handmade coffee with rich sugar pearl in a cup.', 'true', '02')
''')

cursor.execute('''
    INSERT INTO beverage(name, price, description, availability, category)
    VALUES('Latte', 15, 'Handmade coffee with low fat milk in a cup.', 'true', '02')
''')

cursor.execute('''
    INSERT INTO beverage(name, price, description, availability, category)
    VALUES('Hazelnut Coffee', 18, 'Handmade hazelnut coffee in a cup', 'true', '02')
''')

cursor.execute('''
    INSERT INTO orderList(userId, remark, status)
    VALUES(1, 'More ice', '01')
''')

cursor.execute('''
    INSERT INTO orderBeverage(orderId, beverageId, quantity, sugerLevel, iceLevel)
    VALUES(1, 1, 2, '100%', 'normal')
''')

cursor.execute('''
    INSERT INTO orderList(userId, remark, status)
    VALUES(1, 'More ice', '01')
''')

cursor.execute('''
    INSERT INTO orderBeverage(orderId, beverageId, quantity, sugerLevel, iceLevel)
    VALUES(1, 4, 1, '100%', 'normal')
''')

cursor.execute('''
    INSERT INTO orderList(userId, remark, status)
    VALUES(2, 'More ice', '01')
''')

cursor.execute('''
    INSERT INTO orderBeverage(orderId, beverageId, quantity, sugerLevel, iceLevel)
    VALUES(2, 3, 1, '100%', 'normal')
''')

cursor.execute('''
    INSERT INTO orderBeverage(orderId, beverageId, quantity, sugerLevel, iceLevel)
    VALUES(2, 5, 1, '100%', 'normal')
''')

cursor.execute('''
    INSERT INTO orderBeverage(orderId, beverageId, quantity, sugerLevel, iceLevel)
    VALUES(3, 3, 2, '100%', 'normal')
''')


db.commit()
db.close()