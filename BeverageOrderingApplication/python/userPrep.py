import sqlite3
db = sqlite3.connect('user.sqlite')

db.execute('DROP TABLE IF EXISTS user')



db.execute('''CREATE TABLE user(
    id integer PRIMARY KEY,
    name text NOT NULL,
    phoneNumber integer NOT NULL,
    DOB text NOT NULL,
    securityQuestion integer NOT NULL,
    password text NOT NULL
)''')

cursor = db.cursor()



cursor.execute('''
    INSERT INTO user(name, phoneNumber, DOB, securityQuestion, password)
    VALUES('Admin', 0134526754, '8/10/2022', 040120052313, 'Shawn01')
''')

cursor.execute('''
    INSERT INTO user(name, phoneNumber, DOB, securityQuestion, password)
    VALUES('Shawn', 0134526754, '8/10/2022', 040120052313, 'Shawn01')
''')

db.commit()
db.close()