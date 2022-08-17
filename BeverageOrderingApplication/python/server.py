import sqlite3
from flask import Flask, jsonify, request, abort
from argparse import ArgumentParser


BeverageDB = 'beverage.sqlite'
OrderBeverageDB = 'orderBeverage.sqlite'
OrderListDB = 'orderList.sqlite'
UserDB = 'user.sqlite'

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
        'userId': row[1],
        'remark': row[2],
        'status': row[3],
    }

    return row_dict

def get_order_beverage_row_as_dict(row):
    row_dict = {
        'orderId': row[0],
        'beverageId': row[1],
        'quantity': row[2],
        'sugerLevel': row[3],
        'iceLevel': row[4],
    }

    return row_dict





app = Flask(__name__)


#read all data from user database
@app.route('/api/user', methods=['GET'])
def index_user():
    db = sqlite3.connect(UserDB)
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
    db = sqlite3.connect(BeverageDB)
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

#read all data from orderList database
@app.route('/api/orderList', methods=['GET'])
def index_orderList():
    db = sqlite3.connect(OrderListDB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM orderList ORDER BY name')
    rows = cursor.fetchall()

    print(rows)

    db.close()

    rows_as_dict = []
    for row in rows:
        row_as_dict = get_order_list_row_as_dict(row)
        rows_as_dict.append(row_as_dict)

    return jsonify(rows_as_dict), 200



#read a data from user database
@app.route('/api/user/<int:user>', methods=['GET'])
def show_user(userId):
    db = sqlite3.connect(UserDB)
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
    db = sqlite3.connect(BeverageDB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM beverage WHERE id=?', (str(beverage),))
    row = cursor.fetchone()
    db.close()

    if row:
        row_as_dict = get_beverage_row_as_dict(row)
        return jsonify(row_as_dict), 200
    else:
        return jsonify(None), 200

#read a data from order list database
@app.route('/api/orderList/<int:orderList>', methods=['GET'])
def show_orderList(orderList):
    db = sqlite3.connect(OrderListDB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM orderList WHERE id=?', (str(orderList),))
    row = cursor.fetchone()
    db.close()

    if row:
        row_as_dict = get_beverage_row_as_dict(row)
        return jsonify(row_as_dict), 200
    else:
        return jsonify(None), 200

#read a group of data of a order from order beverage database
@app.route('/api/orderBeverage/<int:orderId>', methods=['GET'])
def show_orderBeverage_oneKeys(orderId):
    db = sqlite3.connect(OrderBeverageDB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM orderBeverage WHERE orderId=?', (str(orderId),))
    rows = cursor.fetchall()
    db.close()

    rows_as_dict = []
    for row in rows:
        row_as_dict = get_order_list_row_as_dict(row)
        rows_as_dict.append(row_as_dict)

    return jsonify(rows_as_dict), 200

#read a data from order beverage database
@app.route('/api/orderBeverage/<int:orderId>/<int:beverageId>', methods=['GET'])
def show_orderBeverage_twoKeys(orderId, beverageId):
    db = sqlite3.connect(OrderBeverageDB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM orderBeverage WHERE orderId=? AND beverageId=?', (str(orderId),str(beverageId),))
    row = cursor.fetchone()
    db.close()

    if row:
        row_as_dict = get_beverage_row_as_dict(row)
        return jsonify(row_as_dict), 200
    else:
        return jsonify(None), 200


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

    db = sqlite3.connect(UserDB)
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

    db = sqlite3.connect(BeverageDB)
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

    db = sqlite3.connect(OrderListDB)
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
    if not request.json:
        abort(404)

    new_orderBeverage = (
        request.json['orderId'],
        request.json['beverageId'],
        request.json['quantity'],
        request.json['sugerLevel'],
        request.json['iceLevel'],
    )

    db = sqlite3.connect(OrderBeverageDB)
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


#update user details using ID
@app.route('/api/user/<int:user>', methods=['PUT'])
def update_User(user):
    if not request.json:
        abort(400)

    if 'id' not in request.json:
        abort(400)

    if int(request.json['id']) != user:
        abort(400)

    update_user = (
        request.json['name'],
        request.json['phoneNumber'],
        request.json['DOB'],
        request.json['securityQuestion'],
        request.json['password'],
        request.json['id'],
    )

    db = sqlite3.connect(UserDB)
    cursor = db.cursor()

    cursor.execute('''
        UPDATE user SET
            name=?,phoneNumber=?,DOB=?, securityQuestion=?, password=?
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

    db = sqlite3.connect(BeverageDB)
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
        request.json['remark'],
        request.json['status'],
        request.json['id'],
    )

    db = sqlite3.connect(OrderListDB)
    cursor = db.cursor()

    cursor.execute('''
        UPDATE orderList SET
            remark=?, status=?
        WHERE id=?
    ''', update_beverage)

    db.commit()

    response = {
        'id': orderList,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201

#update orderBeverage details using 2 ID
@app.route('/api/orderList/<int:orderId>/<int:beverageId>', methods=['PUT'])
def update_orderBeverage(orderId, beverageId):  
    if not request.json:
        abort(400)

    if 'id' not in request.json:
        abort(400)

    if int(request.json['orderId']) != orderId:
        abort(400)

    if int(request.json['beverageId']) != beverageId:
        abort(400)

    update_orderBeverage = (
        request.json['quantity'],
        request.json['sugerLevel'],
        request.json['iceLevel'],
        request.json['orderId'],
        request.json['beverageId'],
    )

    db = sqlite3.connect(OrderBeverageDB)
    cursor = db.cursor()

    cursor.execute('''
        UPDATE orderList SET
            quantity =?, sugerLevel =?, iceLevel =?,
        WHERE orderId=? AND beverageId=?
    ''', update_orderBeverage)

    db.commit()

    response = {
        'orderId': orderId,
        'beverageId': beverageId,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201


#delete user from user table
@app.route('/api/user/<int:user>', methods=['DELETE'])
def delete_user(user):
    if not request.json:
        abort(400)

    if 'id' not in request.json:
        abort(400)

    if int(request.json['id']) != user:
        abort(400)

    db = sqlite3.connect(UserDB)
    cursor = db.cursor()

    cursor.execute('DELETE FROM user WHERE id=?', (str(user)))

    db.commit()

    response = {
        'id': user,
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

    db = sqlite3.connect(BeverageDB)
    cursor = db.cursor()

    cursor.execute('DELETE FROM beverage WHERE id=?', (str(beverage)))

    db.commit()

    response = {
        'id': beverage,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201

#delete orderList from orderList
@app.route('/api/orderList/<int:orderList>', methods=['DELETE'])
def delete_orderList(orderList):
    if not request.json:
        abort(400)

    if 'id' not in request.json:
        abort(400)

    if int(request.json['id']) != orderList:
        abort(400)

    db = sqlite3.connect(OrderListDB)
    cursor = db.cursor()

    cursor.execute('DELETE FROM orderList WHERE id=?', (str(orderList)))

    db.commit()

    response = {
        'id': orderList,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201

#delete orderBeverage from orderBeverage
@app.route('/api/orderBeverage/<int:orderId>/<int:beverageId>', methods=['DELETE'])
def delete_orderBeverage(orderId, beverageId):
    if not request.json:
        abort(400)

    if 'id' not in request.json:
        abort(400)

    if int(request.json['id']) != orderId:
        abort(400)

    db = sqlite3.connect(OrderListDB)
    cursor = db.cursor()

    cursor.execute('DELETE FROM orderBeverage WHERE orderId=? AND beverageId=?', (str(orderId), str(beverageId)))

    db.commit()

    response = {
        'orderId': orderId,
        'beverageId': beverageId,
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