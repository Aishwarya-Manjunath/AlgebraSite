from flask import Flask, render_template,request,send_file
from werkzeug import secure_filename
import numpy as np
import json
import cmath
from io import BytesIO 
import matplotlib.pyplot as plt  
import os

UPLOAD_FOLDER = './static/OCR_img/'

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
 
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
    
@app.route("/")
def dashboard():
    return render_template("dashboard.html")

@app.route("/SolveEquations")
def SolveEquations():
    return render_template("SolveEquations.html")

@app.route('/solveLinear', methods = ['POST','GET'])
def Linear():
    data = request.json
    result = solve_linear(data)
    result = {"x":result[0],"y":result[1]}
    return json.dumps(result)

@app.route('/solveQuad', methods = ['POST','GET'])
def Quad():
    data = request.json
    result = solve_quad(data)
    result = {"x1":str(result[0]),"x2":str(result[1])}
    return json.dumps(result)


@app.route('/solvePlot', methods = ['POST','GET'])
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
def upload_file():
   if request.method == 'POST':
      f = request.files['file']
      fname = secure_filename(f.filename)
      f.save(UPLOAD_FOLDER+fname)
      return render_template('SolveEquations.html', filename="static/OCR_img/"+fname)
  
    
if __name__ == "__main__":
    app.run()