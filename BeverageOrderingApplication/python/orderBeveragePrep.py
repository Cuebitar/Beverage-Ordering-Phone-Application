import sqlite3
db = sqlite3.connect('orderBeverage.sqlite')


db.execute('DROP TABLE IF EXISTS orderBeverage')

db.execute('''CREATE TABLE orderBeverage(
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
    INSERT INTO orderBeverage(orderId, beverageId, quantity, sugerLevel, iceLevel)
    VALUES(1, 1, 2, '100%', 'normal')
''')
db.commit()
db.close()