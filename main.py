from flask import Flask, render_template, request, send_file, jsonify, Response, redirect
from flask_login import LoginManager, UserMixin, login_required, login_user, logout_user
from functools import wraps
from flask_bootstrap import Bootstrap
from flask_pymongo import PyMongo
from werkzeug import secure_filename
import numpy as np
from random import randint
import json
import cmath
from io import BytesIO 
import matplotlib.pyplot as plt  
import os
import time
import pymongo
from quiz import select_questions

app = Flask(__name__)
app.config.update(
    DEBUG = True,
    SECRET_KEY = 'secret_xxx',
    UPLOAD_FOLDER = './static/OCR_img/',
    MONGO_DBNAME = 'algebrasite',
    MONGO_URI = 'mongodb://127.0.0.1:27017/algebrasite'
)

mongo = PyMongo(app)

username = None

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"

Bootstrap(app)

id_counter = 1

class User(UserMixin):

    def __init__(self, id):
        self.id = id
        self.name = "user" + str(id)
        self.password = self.name + "_secret"
        
    def __repr__(self):
        return "%d/%s/%s" % (self.id, self.name, self.password)

def solve_linear(data):
    a = np.array([[float(data["x1"]),float(data["x2"])],[float(data["x3"]),float(data["x4"])]])
    b = np.array([float(data["v1"]),float(data["v2"])])
    c = np.linalg.solve(a,b)
    return c
    
def solve_quad(data):
    a = float(data["x1"])
    b = float(data["x2"])
    c = float(data["x3"])
    delta = (b**2) - (4*a*c)
    solution1 = (-b-cmath.sqrt(delta))/(2*a)
    solution2 = (-b+cmath.sqrt(delta))/(2*a)
    return (solution1,solution2)

@app.route("/login", methods=['GET', 'POST'])
def login():
    global id_counter
    global username
    if request.method == 'POST' and request.form['login'] == '1':
       username = request.form['user']
       password = request.form['password']
       userd = mongo.db.users.find_one({'_id' : username})
       if userd != None :
          passwordd = userd['pass']
          if passwordd == password:
             id = id_counter
             id_counter += 1
             user = User(id)
             login_user(user)
             username = userd
             return redirect("/")
       else:
          return render_template("login.html") 
    elif request.method == 'POST' and request.form['login'] == '2':
       username = request.form['user']
       password = request.form['password']
       email = request.form['email']
       mongo.db.users.insert({ '_id' : username, 'pass' : password, 'email' : email})
       return render_template("login.html")
    else:
       return render_template("login.html")

@app.errorhandler(401)
def page_not_found(e):
    return render_template("login.html")
     
@login_manager.user_loader
def load_user(userid):
    return User(userid)


@app.route("/profile")
def profile():
    cursor = mongo.db.quiz.find({"username":username["_id"]}).sort("score",pymongo.DESCENDING)
    quiz_scores = []
    top_n = 0
    for document in cursor:
        if(top_n == 3):
          break
        quiz_scores.append(document)
        top_n += 1
    return render_template("profile.html",user = username["_id"],quiz_scores=quiz_scores)

@app.route("/logout")
@login_required
def logout():
    logout_user()
    return render_template("login.html")

@app.route("/")
@login_required
def dashboard():
    return render_template("dashboard.html")

@app.route("/memo", methods=['GET','POST'])
@login_required
def memo():
    global username
    text = "Scratch Pad!"
    entry = mongo.db.memo.find_one({'_id' : username})
    if entry != None:
        text = entry['text']
        text = "<br />".join(text.split("\n"))
    if request.method == 'POST' and username is not None:
        value = request.form["text"]
        print("CHECK", value)
        entry = mongo.db.memo.find_one({'_id' : username})
        mongo.db.memo.update({ '_id' : username}, {'text' : value}, upsert=True)
        text = "<br />".join(value.split("\n"))
    return render_template("memo.html", text=text)

@app.route("/SolveEquations")
@login_required
def SolveEquations():
    return render_template("SolveEquations.html")

@app.route('/solveLinear', methods = ['POST','GET'])
@login_required
def Linear():
    data = request.json
    result = solve_linear(data)
    result = {"x":result[0],"y":result[1]}
    return json.dumps(result)

@app.route('/solveQuad', methods = ['POST','GET'])
@login_required
def Quad():
    data = request.json
    result = solve_quad(data)
    result = {"x1":str(result[0]),"x2":str(result[1])}
    return json.dumps(result)


@app.route('/solvePlot', methods = ['POST','GET'])
@login_required
def plot_eqn():
    data = request.json
    formula = data["eqn"]
    x_range = range(-10, 11)
    x = np.array(x_range)  
    y = eval(formula)
    plt.plot(x, y)  
    plt.title("Plot for "+formula)
    plt.xlabel("x")
    plt.ylabel("y")
    buf = BytesIO()
    plt.savefig(buf, format="png")
    buf.seek(0)
    plt.close()
    #result = {"x1":str(result[0]),"x2":str(result[1])}
    #return json.dumps(result)
    return send_file(buf, mimetype="image/png")
 
@app.route('/uploader', methods = ['GET', 'POST'])
@login_required
def upload_file():
   if request.method == 'POST':
      f = request.files['file']
      fname = secure_filename(f.filename)
      f.save(UPLOAD_FOLDER+fname)
      return render_template('SolveEquations.html', filename="static/OCR_img/"+fname)

@app.route("/Quiz")
@login_required
def take_quiz():
    return render_template("quiz.html")


@app.route("/QuizStart",methods=['GET','POST'])
@login_required
def start_quiz():
    questions=select_questions()
    print(questions)
    return json.dumps(questions)

@app.route("/quiz_results",methods=['GET','POST'])
@login_required
def results_quiz():
    global username
    data = request.json
    print(data["wrong_quest"])
    mongo.db.quiz.insert_one({"username":username["_id"],"score":int(data["correct_ans"]),"timestamp":time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())})

    mongo.db.recommend.update({"username":username["_id"]},{"username":username["_id"],"questions":data["wrong_quest"]}, upsert=True)
    sizes = [int(data["correct_ans"]),5-int(data["correct_ans"])]
    print(sizes)
    labels = ["Correct = "+str(sizes[0]),"Wrong = "+str(sizes[1])]
    colors = ["green","red"]
    plt.pie(sizes, labels=labels, colors=colors)
    plt.title("Performance plot")
    buf = BytesIO()
    plt.savefig(buf, format="png")
    buf.seek(0)
    plt.close()
    return send_file(buf, mimetype="image/png")

@app.route("/edit_info",methods=['GET','POST'])
def Edit_Info():
    input_data = {"uni":"hi", "qual": "99", "bio":"mr"}
    return json.dumps(input_data)

@app.route("/save_info",methods=['GET','POST'])
def Save_Info():
    #input_data = {"email":"hi", "phone": "99", "add":"mr"}
    input_data1 = request.json
    print(input_data1)
    return json.dumps(input_data1)

if __name__ == "__main__":
    app.run()
