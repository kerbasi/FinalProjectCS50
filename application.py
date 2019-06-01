from apscheduler.schedulers.background import BackgroundScheduler

from cs50 import SQL
from flask import Flask, redirect, render_template, request, session, jsonify
from flask_session import Session
from tempfile import mkdtemp


from helpers import takeTanksId, takeGuns, takeProfile, checkVersion

def sensor():
    checkVersion()

sched = BackgroundScheduler(daemon=True)
sched.add_job(sensor,'interval',hours=4)
sched.start()

# Configure application
app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Ensure responses aren't cached
@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_FILE_DIR"] = mkdtemp()
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

db = SQL("sqlite:///tanks.db")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/params", methods=["GET", "POST"])
def params():
    if request.method == "POST":
        #tankInfo = []
        name = request.form.get("selectTank")
        tanks = db.execute("SELECT name, lvl, nation FROM tanks")
        tankInfo = db.execute("SELECT nation, lvl, type, price_credit, hp, hull_hp, guns FROM tanks WHERE name = :name", name=name)
        guns = tankInfo[0]['guns'].rstrip(',')
        return render_template("params.html", tanks=tanks, tankInfo=tankInfo)
    else:
        tanks = db.execute("SELECT name, lvl, nation, is_premium FROM tanks ORDER BY lvl")
        return render_template("params.html", tanks=tanks)

@app.route("/stats")
def stats():
    return render_template("stats.html")

@app.route("/conf")
def conf():
    takeTanksId()
    return

@app.route("/conf2")
def conf2():
    takeGuns()
    return

@app.route("/load", methods=["GET"])
def load():
    """in JSON format"""
    name = request.args.get('tank')
    print(1)
    answer = db.execute("SELECT * FROM tanks WHERE name = :name", name=name)
    crew = db.execute("SELECT * FROM crew WHERE id_tank = :id_tank", id_tank=answer[0]['id_tank'])
    engines_id = answer[0]['engines']
    engines_id = engines_id.rsplit(", ")
    radios_id = answer[0]['radios']
    radios_id = radios_id.rsplit(", ")
    guns_id = answer[0]['guns']
    guns_id = guns_id.rsplit(", ")
    suspensions_id = answer[0]['suspensions']
    suspensions_id = suspensions_id.rsplit(", ")
    turrets_id = answer[0]['turrets']
    turrets_id = turrets_id.rsplit(", ")
    engines = []
    print(engines_id)
    for e in engines_id:
        engines.append(db.execute("SELECT * FROM engines WHERE module_id = :module_id", module_id=e)[0])
    radios = []
    for e in radios_id:
        radios.append(db.execute("SELECT * FROM radios WHERE module_id = :module_id", module_id=e)[0])
    guns = []
    for e in guns_id:
        guns.append(db.execute("SELECT * FROM guns WHERE module_id = :module_id", module_id=e)[0])
    suspensions = []
    for e in suspensions_id:
        suspensions.append(db.execute("SELECT * FROM suspensions WHERE module_id = :module_id", module_id=e)[0])
    turrets = []
    if len(turrets_id[0]) > 0:
        for e in turrets_id:
            turrets.append(db.execute("SELECT * FROM turrets WHERE module_id = :module_id", module_id=e)[0])
    else:
        turrets.append(db.execute("SELECT * FROM turretsWOID WHERE id_tank = :id_tank", id_tank=answer[0]['id_tank'])[0])
    answer[0]['crew'] = crew
    answer[0]['engines'] = engines
    answer[0]['radios'] = radios
    answer[0]['guns'] = guns
    answer[0]['suspensions'] = suspensions
    answer[0]['turrets'] = turrets
    print(answer[0])
    return jsonify(answer[0])


@app.route("/loadlist", methods=["GET"])
def loadlist():
    """in JSON format"""
    lvl = request.args.get('lvl')
    if lvl == 'all':
        lvl = 0
        lvl2 = 10
    else:
        lvl2 = lvl
    tankType = request.args.get('type')
    if tankType == 'all':
        tankType = 'AT-SPG'
        tankType2 = 'AT'
        tankType3 = 'mediumTank'
        tankType4 = 'lightTank'
        tankType5 = 'heavyTank'
    else:
        tankType2 = tankType3 = tankType4 = tankType5 = tankType
    nation = request.args.get('nation')
    if nation == 'all':
        nation = 'ussr'
        nation2 = 'usa'
        nation3 = 'germany'
        nation4 = 'japan'
        nation5 = 'uk'
        nation6 = 'czech'
        nation7 = 'italy'
        nation8 = 'china'
        nation9 = 'france'
    else:
        nation9 = nation8 = nation7 = nation6 = nation5 = nation4 = nation3 = nation2 = nation
    answer = db.execute("SELECT name, lvl, nation, is_premium FROM tanks WHERE (lvl >= :lvl AND lvl <= :lvl2) AND (type = :tankType OR type = :tankType2 OR type = :tankType3 OR type = :tankType4 OR type = :tankType5) AND (nation = :nation OR nation = :nation2 OR nation = :nation3 OR nation = :nation4 OR nation = :nation5 OR nation = :nation6 OR nation = :nation7 OR nation = :nation8 OR nation = :nation9) ORDER BY lvl",
                         lvl=lvl, lvl2=lvl2, tankType=tankType, tankType2=tankType2, tankType3=tankType3, tankType4=tankType4, tankType5=tankType5, nation=nation, nation2=nation2, nation3=nation3, nation4=nation4, nation5=nation5, nation6=nation6, nation7=nation7, nation8=nation8, nation9=nation9)
    print(answer)
    return jsonify(answer)

@app.route("/getprofile", methods=["GET"])
def getprofile():
    tank_id = request.args.get('tank_id')
    gun_id = request.args.get('gun_id')
    suspension_id = request.args.get('suspension_id')
    turret_id = request.args.get('turret_id')
    radio_id = request.args.get('radio_id')
    engine_id = request.args.get('engine_id')
    profile_id =""
    profiles_var = db.execute("SELECT profile_id FROM profile_ids WHERE tank_id = :tank_id", tank_id=tank_id)
    for v in profiles_var:
        if (turret_id != 0):
            if (gun_id in v["profile_id"]) & (suspension_id in v["profile_id"]) & (radio_id in v["profile_id"]) & (engine_id in v["profile_id"]):
                profile_id = v["profile_id"]
                break
        else:
            if (gun_id in v["profile_id"]) & (suspension_id in v["profile_id"]) & (turret_id in v["profile_id"]) & (radio_id in v["profile_id"]) & (engine_id in v["profile_id"]):
                profile_id = v["profile_id"]
                break
    print(profile_id)
    if len(profile_id) == 0:
        return jsonify("None")
    return jsonify(takeProfile(tank_id, profile_id))

    if __name__ == '__main__':
        app.run(debug=True)