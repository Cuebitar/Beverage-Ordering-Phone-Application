import sqlite3
db = sqlite3.connect('orderList.sqlite')


db.execute('DROP TABLE IF EXISTS orderList')

db.execute('''CREATE TABLE orderList(
    id integer PRIMARY KEY,
    userId integer NOT NULL,
    remark text NOT NULL,
    status text NOT NULL,
    FOREIGN KEY (userId) REFERENCES user (id)
)''')

cursor = db.cursor()

cursor.execute('''
    INSERT INTO orderList(userId, remark, status)
    VALUES(1, 'More ice', 'Preparing')
''')

db.commit()
db.close()

