import sqlite3
from flask import Flask, jsonify, request, abort
from argparse import ArgumentParser


DB = 'database.sqlite'

def get_user_row_as_dict(row):
    row_dict = {
        'id': row[0],
        'name': row[1],
        'phoneNumber': row[2],
        'DOB': row[3],
        'securityQuestion': row[4],
        'password': row[5],
    }

    return row_dict

def get_beverage_row_as_dict(row):
    row_dict = {
        'id': row[0],
        'name': row[1],
        'price': row[2],
        'description': row[3],
        'availability': row[4],
        'category': row[5],
    }

    return row_dict

def get_order_list_row_as_dict(row):
    row_dict = {
        'id': row[0],
        'status': row[1],
        'name': row[2],
    }

    return row_dict

def get_order_details_row_as_dict(row):
    row_dict = {
        'Orderid': row[0],
        'name': row[1],
        'status': row[2],
        'remark': row[3],
        'quantity': row[4],
        'sugerLevel': row[5],
        'iceLevel': row[6],
        'category': row[7],
        'price': row[8],
    }

    return row_dict

def get_order_list_for_user_row_as_dict(row):
    row_dict = {
        'id': row[0],
        'status': row[1]
    }

    return row_dict


app = Flask(__name__)


#read all data from user database
@app.route('/api/user', methods=['GET'])
def index_user():
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM user ORDER BY name')
    rows = cursor.fetchall()

    print(rows)

    db.close()

    rows_as_dict = []
    for row in rows:
        row_as_dict = get_user_row_as_dict(row)
        rows_as_dict.append(row_as_dict)

    return jsonify(rows_as_dict), 200

#read all data from beverage database
@app.route('/api/beverage', methods=['GET'])
def index_beverage():
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM beverage ORDER BY name')
    rows = cursor.fetchall()

    print(rows)

    db.close()

    rows_as_dict = []
    for row in rows:
        row_as_dict = get_beverage_row_as_dict(row)
        rows_as_dict.append(row_as_dict)

    return jsonify(rows_as_dict), 200

#read all data from orderList database for administration
@app.route('/api/orderList', methods=['GET'])
def index_orderListForAdmin():
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT od.id, od.status, us.name FROM orderList od INNER JOIN user us ON od.userId = us.id ORDER BY od.id')
    rows = cursor.fetchall()

    print(rows)

    db.close()

    rows_as_dict = []
    for row in rows:
        row_as_dict = get_order_list_row_as_dict(row)
        rows_as_dict.append(row_as_dict)

    return jsonify(rows_as_dict), 200

#read all data from orderList database for user based on userid
@app.route('/api/orderList/<int:userId>', methods=['GET'])
def index_orderListForUser(userId):
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT id, status FROM orderList where userId=?', (str(userId),))
    rows = cursor.fetchall()

    print(rows)

    db.close()

    rows_as_dict = []
    for row in rows:
        row_as_dict = get_order_list_for_user_row_as_dict(row)
        rows_as_dict.append(row_as_dict)

    return jsonify(rows_as_dict), 200

#read the latest data from orderList database 
@app.route('/api/orderId', methods=['GET'])
def index_latestOrder():
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT id, status FROM orderList ORDER BY id DESC LIMIT 1')
    row = cursor.fetchone()
    db.close()

    if row:
        row_as_dict = get_order_list_for_user_row_as_dict(row)
        return jsonify(row_as_dict), 200
    else:
        return jsonify(None), 200
    

#read a data from user database
@app.route('/api/user/<int:userId>', methods=['GET'])
def show_user(userId):
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM user WHERE id=?', (str(userId),))
    row = cursor.fetchone()
    db.close()

    if row:
        row_as_dict = get_user_row_as_dict(row)
        return jsonify(row_as_dict), 200
    else:
        return jsonify(None), 200

#read a data from beverage database
@app.route('/api/beverage/<int:beverage>', methods=['GET'])
def show_beverage(beverage):
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM beverage WHERE id=?', (str(beverage),))
    row = cursor.fetchone()
    db.close()

    if row:
        row_as_dict = get_beverage_row_as_dict(row)
        return jsonify(row_as_dict), 200
    else:
        return jsonify(None), 200

#read all order details of an order
@app.route('/api/order/<int:order>', methods=['GET'])
def show_order(order):
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT ol.id, bv.name, ol.status, ol.remark, ob.quantity, ob.sugerLevel, ob.iceLevel, bv.category, bv.price FROM orderBeverage ob JOIN orderList ol ON ob.orderId = ol.id JOIN beverage bv ON ob.beverageId = bv.id WHERE ol.id=?', (str(order),))
    rows = cursor.fetchall()
    db.close()

    rows_as_dict = []
    for row in rows:
        row_as_dict = get_order_details_row_as_dict(row)
        rows_as_dict.append(row_as_dict)

    return jsonify(rows_as_dict), 200


#add a new user to the user database
@app.route('/api/user', methods=['POST'])
def store_user():
    if not request.json:
        abort(404)

    new_user = (
        request.json['name'],
        request.json['phoneNumber'],
        request.json['DOB'],
        request.json['securityQuestion'],
        request.json['password'],
    )

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('''
        INSERT INTO user(name, phoneNumber, DOB, securityQuestion, password)
        VALUES(?,?,?,?,?)
    ''', new_user)

    user_id = cursor.lastrowid

    db.commit()

    response = {
        'id': user_id,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201

#add a new beverage to the beverage database
@app.route('/api/beverage', methods=['POST'])
def store_beverage():
    if not request.json:
        abort(404)

    new_beverage = (
        request.json['name'],
        request.json['price'],
        request.json['description'],
        request.json['availability'],
        request.json['category'],
    )

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('''
        INSERT INTO beverage(name, price, description, availability, category)
        VALUES(?,?,?,?,?)
    ''', new_beverage)

    beverage_id = cursor.lastrowid

    db.commit()

    response = {
        'id': beverage_id,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201

#add a new order list to the orderList database
@app.route('/api/orderList', methods=['POST'])
def store_order():
    if not request.json:
        abort(404)

    new_order = (
        request.json['userId'],
        request.json['remark'],
        request.json['status'],
    )

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('''
        INSERT INTO orderList(userId, remark, status)
        VALUES(?,?,?)
    ''', new_order)

    orderList_id = cursor.lastrowid

    db.commit()

    response = {
        'id': orderList_id,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201

#add a new order beverage to the orderBeverage database
@app.route('/api/orderBeverage', methods=['POST'])
def store_orderBeverage():
    print("hi")
    if not request.json:
        abort(404)

    new_orderBeverage = (
        request.json['orderId'],
        request.json['beverageId'],
        request.json['quantity'],
        request.json['sugerLevel'],
        request.json['iceLevel'],
    )
    print("hi")
    print(request.json)
    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('''
        INSERT INTO orderBeverage(orderId, beverageId, quantity, sugerLevel, iceLevel)
        VALUES(?,?,?,?,?)
    ''', new_orderBeverage)

    orderBeverage_id = cursor.lastrowid

    db.commit()

    response = {
        'id': orderBeverage_id,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201


# update user details using ID
@app.route('/api/user/<int:user>', methods=['PUT'])
def update_User(user):
    if not request.json:
        abort(400)

    if 'id' not in request.json:
        abort(400)

    if int(request.json['id']) != user:
        abort(400)

    update_user = (
        request.json['password'],
        request.json['id'],
    )

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('''
        UPDATE user SET
        password=?
        WHERE id=?
    ''', update_user)

    db.commit()

    response = {
        'id': user,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201


#update beverage details using ID
@app.route('/api/beverage/<int:beverage>', methods=['PUT'])
def update_Beverage(beverage):
    if not request.json:
        abort(400)

    if 'id' not in request.json:
        abort(400)

    if int(request.json['id']) != beverage:
        abort(400)

    update_beverage = (
        request.json['name'],
        request.json['price'],
        request.json['description'],
        request.json['availability'],
        request.json['id'],
    )

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('''
        UPDATE beverage SET
            name=?,price=?,description=?,availability=?
        WHERE id=?
    ''', update_beverage)

    db.commit()

    response = {
        'id': beverage,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201

#update orderList details using ID
@app.route('/api/orderList/<int:orderList>', methods=['PUT'])
def update_order(orderList):
    if not request.json:
        abort(400)

    if 'id' not in request.json:
        abort(400)

    if int(request.json['id']) != orderList:
        abort(400)

    update_beverage = (
        request.json['status'],
        request.json['id'],
    )

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('''
        UPDATE orderList SET
            status=?
        WHERE id=?
    ''', update_beverage)

    db.commit()

    response = {
        'id': orderList,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201



#delete beverage from beverage table
@app.route('/api/beverage/<int:beverage>', methods=['DELETE'])
def delete_beverage(beverage):
    if not request.json:
        abort(400)

    if 'id' not in request.json:
        abort(400)

    if int(request.json['id']) != beverage:
        abort(400)

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('DELETE FROM beverage WHERE id=?', (str(beverage)))

    db.commit()

    response = {
        'id': beverage,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201


if __name__ == '__main__':
    parser = ArgumentParser()
    parser.add_argument('-p', '--port', default=5002, type=int, help='port to listen on')
    args = parser.parse_args()
    port = args.port

    app.run(host='0.0.0.0', port=port)