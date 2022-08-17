import sqlite3
db = sqlite3.connect('beverage.sqlite')

db.execute('DROP TABLE IF EXISTS beverage')

db.execute('''CREATE TABLE beverage(
    id integer PRIMARY KEY,
    name text NOT NULL,
    price real NOT NULL,
    description text NOT NULL,
    availability text NOT NULL,
    category text NOT NULL
)''')


cursor = db.cursor()



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

db.commit()
db.close()