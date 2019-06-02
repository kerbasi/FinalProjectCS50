import requests
import urllib.parse

from cs50 import SQL
from flask import redirect, render_template, request, session


def takeTanksId():

    db = SQL("sqlite:///tanks.db")
    # Contact API
    try:
        response = requests.get(
            "https://api.worldoftanks.ru/wot/encyclopedia/vehicles/?application_id=19b782d8b0060bb61337725fda43e527&language=en")
        response.raise_for_status()
    except requests.RequestException:
        return None

    # Parse response
    try:
        quote = response.json()
        data = quote['data']
        # print(data)
        for d in data:
            if data[d]["short_name"]:
                if data[d]["prices_xp"] != None:
                    for i in data[d]["prices_xp"]:
                        prices_xp = (data[d]["prices_xp"][i])
                else:
                    prices_xp = 0
                if data[d]["is_premium"] == True:
                    is_premium = 1
                else:
                    is_premium = 0
                if data[d]["price_gold"] == None:
                    price_gold = 0
                else:
                    price_gold = data[d]["price_gold"]
                if data[d]["price_credit"] == None:
                    price_credit = 0
                else:
                    price_credit = data[d]["price_credit"]
                if data[d]["default_profile"]["siege"]:
                    is_siege = 1
                else:
                    is_siege = 0
                if data[d]["default_profile"]["rapid"]:
                    is_rapid = 1
                else:
                    is_rapid = 0
                if data[d]["default_profile"]["modules"]["turret_id"]:
                    turret_id = data[d]["default_profile"]["modules"]["turret_id"]
                else:
                    turret_id = 0
                    db.execute("INSERT INTO turretsWOID (id_tank, name, weight, view_range, hp, traverse_speed, traverse_right_arc, tier, traverse_left_arc) VALUES (:id_tank, :name, :weight, :view_range, :hp, :traverse_speed, :traverse_right_arc, :tier, :traverse_left_arc)",
                               id_tank=int(d), name=data[d]["default_profile"]["turret"]["name"], weight=data[d]["default_profile"]["turret"]["weight"], view_range=data[d]["default_profile"]["turret"]["view_range"], hp=data[d]["default_profile"]["turret"]["hp"], traverse_speed=data[d]["default_profile"]["turret"]["traverse_speed"], traverse_right_arc=data[d]["default_profile"]["turret"]["traverse_right_arc"], tier=data[d]["default_profile"]["turret"]["tier"], traverse_left_arc=data[d]["default_profile"]["turret"]["traverse_left_arc"])
                db.execute("INSERT INTO tanks (id_tank, name, lvl, nation, type, engines, guns, radios, suspensions, turrets, images, price_gold, price_credit, prices_xp, max_ammo, weight, hp, hull_hp, hull_weight, hull_armor_front, hull_armor_sides, hull_armor_rear, speed_forward, speed_backward, max_weight, provisions, description, is_premium, is_siege, is_rapid, gun_id, suspension_id, turret_id, radio_id, engine_id) VALUES (:id_tank, :name, :lvl, :nation, :typeIs, ':engines', ':guns', ':radios', ':suspensions', ':turrets', :images, :price_gold, :price_credit, :prices_xp, :max_ammo, :weight, :hp, :hull_hp, :hull_weight, :hull_armor_front, :hull_armor_sides, :hull_armor_rear, :speed_forward, :speed_backward, :max_weight, ':provisions', :description, :is_premium, :is_siege, :is_rapid, :gun_id, :suspension_id, :turret_id, :radio_id, :engine_id)",
                           id_tank=int(d), name=data[d]["name"], lvl=data[d]["tier"], nation=data[d]["nation"], typeIs=data[d]["type"], engines=data[d]["engines"], guns=data[d]["guns"], radios=data[d]["radios"], suspensions=data[d]["suspensions"], turrets=data[d]["turrets"], images=data[d]["images"]["big_icon"], price_gold=price_gold, price_credit=price_credit, prices_xp=prices_xp, max_ammo=data[d]["default_profile"]["max_ammo"], weight=data[d]["default_profile"]["weight"], hp=data[d]["default_profile"]["hp"], hull_hp=data[d]["default_profile"]["hull_hp"], hull_weight=data[d]["default_profile"]["hull_weight"], hull_armor_front=data[d]["default_profile"]["armor"]["hull"]["front"], hull_armor_sides=data[d]["default_profile"]["armor"]["hull"]["sides"], hull_armor_rear=data[d]["default_profile"]["armor"]["hull"]["rear"], speed_forward=data[d]["default_profile"]["speed_forward"], speed_backward=data[d]["default_profile"]["speed_backward"], max_weight=data[d]["default_profile"]["max_weight"], provisions=data[d]["provisions"], description=data[d]["description"], is_premium=is_premium, is_siege=is_siege, is_rapid=is_rapid, gun_id=data[d]["default_profile"]["modules"]["gun_id"], suspension_id=data[d]["default_profile"]["modules"]["suspension_id"], turret_id=turret_id, radio_id=data[d]["default_profile"]["modules"]["radio_id"], engine_id=data[d]["default_profile"]["modules"]["engine_id"])
                if is_siege:
                    db.execute("INSERT INTO siege (id_tank, suspension_traverse_speed, move_down_arc, switch_on_time, reload_time, move_up_arc, dispersion, switch_off_time, speed_backward, aim_time) VALUES (:id_tank, :suspension_traverse_speed, :move_down_arc, :switch_on_time, :reload_time, :move_up_arc, :dispersion, :switch_off_time, :speed_backward, :aim_time)",
                               id_tank=int(d), suspension_traverse_speed=float(data[d]["default_profile"]["siege"]["suspension_traverse_speed"]), move_down_arc=float(data[d]["default_profile"]["siege"]["move_down_arc"]), switch_on_time=data[d]["default_profile"]["siege"]["switch_on_time"], reload_time=data[d]["default_profile"]["siege"]["reload_time"], move_up_arc=float(data[d]["default_profile"]["siege"]["move_up_arc"]), dispersion=data[d]["default_profile"]["siege"]["dispersion"], switch_off_time=data[d]["default_profile"]["siege"]["switch_off_time"], speed_backward=float(data[d]["default_profile"]["siege"]["speed_backward"]), aim_time=data[d]["default_profile"]["siege"]["aim_time"])
                if is_rapid:
                    db.execute("INSERT INTO rapid (id_tank, speed_backward, switch_off_time, switch_on_time, speed_forward, suspension_steering_lock_angle) VALUES (:id_tank, :speed_backward, :switch_off_time, :switch_on_time, :speed_forward, :suspension_steering_lock_angle)",
                               id_tank=int(d), speed_backward=float(data[d]["default_profile"]["rapid"]["speed_backward"]), switch_off_time=float(data[d]["default_profile"]["rapid"]["switch_off_time"]), speed_forward=data[d]["default_profile"]["rapid"]["speed_forward"], switch_on_time=data[d]["default_profile"]["rapid"]["switch_on_time"], suspension_steering_lock_angle=float(data[d]["default_profile"]["rapid"]["suspension_steering_lock_angle"]))
                for c in data[d]["crew"]:
                    roles = ""
                    for r in c["roles"]:
                        roles += c["roles"][r] + ", "
                    roles = roles[:-2]
                    db.execute("INSERT INTO crew (id_tank, roles, member_id) VALUES (:id_tank, :roles, :member_id)",
                               id_tank=int(d), roles=roles, member_id=c["member_id"])
        return
    except (KeyError, TypeError, ValueError):
        return None


def takeGuns():
    db = SQL("sqlite:///tanks.db")
    try:
        response = requests.get(
            "https://api.worldoftanks.ru/wot/encyclopedia/modules/?application_id=19b782d8b0060bb61337725fda43e527&extra=default_profile&type=vehicleGun&language=en")
        response.raise_for_status()
    except requests.RequestException:
        return None
    # Parse response
    try:
        quote = response.json()
        data = quote['data']
        for d in data:
            if data[d]["default_profile"]:
                ammo1_penetration = data[d]["default_profile"]["gun"]["ammo"][0]["penetration"]
                ammo1_damage = data[d]["default_profile"]["gun"]["ammo"][0]["damage"]
                ammo1_type = data[d]["default_profile"]["gun"]["ammo"][0]["type"]
                if data[d]["default_profile"]["gun"]["ammo"][0]["stun"]:
                    ammo1_stun = data[d]["default_profile"]["gun"]["ammo"][0]["stun"]["duration"]
                else:
                    ammo1_stun = 0
                if len(data[d]["default_profile"]["gun"]["ammo"]) > 1:
                    ammo2_penetration = data[d]["default_profile"]["gun"]["ammo"][1]["penetration"]
                    ammo2_damage = data[d]["default_profile"]["gun"]["ammo"][1]["damage"]
                    ammo2_type = data[d]["default_profile"]["gun"]["ammo"][1]["type"]
                    if data[d]["default_profile"]["gun"]["ammo"][1]["stun"]:
                        ammo2_stun = data[d]["default_profile"]["gun"]["ammo"][1]["stun"]["duration"]
                    else:
                        ammo2_stun = 0
                else:
                    ammo2_penetration = 0
                    ammo2_damage = 0
                    ammo2_type = 0
                    ammo2_stun = 0
                if len(data[d]["default_profile"]["gun"]["ammo"]) > 2:
                    ammo3_penetration = data[d]["default_profile"]["gun"]["ammo"][2]["penetration"]
                    ammo3_damage = data[d]["default_profile"]["gun"]["ammo"][2]["damage"]
                    ammo3_type = data[d]["default_profile"]["gun"]["ammo"][2]["type"]
                    if data[d]["default_profile"]["gun"]["ammo"][2]["stun"]:
                        ammo3_stun = data[d]["default_profile"]["gun"]["ammo"][2]["stun"]["duration"]
                    else:
                        ammo3_stun = 0
                else:
                    ammo3_penetration = 0
                    ammo3_damage = 0
                    ammo3_type = 0
                    ammo3_stun = 0

                db.execute("INSERT INTO guns (module_id, weight, name, image, price_credit, tier, move_down_arc, max_ammo, reload_time, move_up_arc, fire_rate, dispersion, traverse_speed, aim_time, ammo1_penetration, ammo1_damage, ammo1_type, ammo1_stun, ammo2_penetration, ammo2_damage, ammo2_type, ammo2_stun, ammo3_penetration, ammo3_damage, ammo3_type, ammo3_stun) VALUES (:module_id, :weight, :name, :image, :price_credit, :tier, :move_down_arc, :max_ammo, :reload_time, :move_up_arc, :fire_rate, :dispersion, :traverse_speed, :aim_time, ':ammo1_penetration', ':ammo1_damage', :ammo1_type, ':ammo1_stun', ':ammo2_penetration', ':ammo2_damage', :ammo2_type, ':ammo2_stun', ':ammo3_penetration', ':ammo3_damage', :ammo3_type, ':ammo3_stun')",
                           module_id=data[d]["module_id"], weight=data[d]["weight"], name=data[d]["name"], image=data[d]["image"], price_credit=data[d]["price_credit"], tier=data[d]["tier"], move_down_arc=data[d]["default_profile"]["gun"]["move_down_arc"], max_ammo=data[d]["default_profile"]["gun"]["max_ammo"], reload_time=data[d]["default_profile"]["gun"]["reload_time"], move_up_arc=data[d]["default_profile"]["gun"]["move_up_arc"], fire_rate=data[d]["default_profile"]["gun"]["fire_rate"], dispersion=data[d]["default_profile"]["gun"]["dispersion"], traverse_speed=data[d]["default_profile"]["gun"]["traverse_speed"], aim_time=data[d]["default_profile"]["gun"]["aim_time"], ammo1_penetration=ammo1_penetration, ammo1_damage=ammo1_damage, ammo1_type=ammo1_type, ammo1_stun=ammo1_stun, ammo2_penetration=ammo2_penetration, ammo2_damage=ammo2_damage, ammo2_type=ammo2_type, ammo2_stun=ammo2_stun, ammo3_penetration=ammo3_penetration, ammo3_damage=ammo3_damage, ammo3_type=ammo3_type, ammo3_stun=ammo3_stun)
        return 1
    except (KeyError, TypeError, ValueError):
        return None


def takeRadio():
    db = SQL("sqlite:///tanks.db")
    try:
        response = requests.get(
            "https://api.worldoftanks.ru/wot/encyclopedia/modules/?application_id=19b782d8b0060bb61337725fda43e527&type=vehicleRadio&language=en&extra=default_profile")
        response.raise_for_status()
    except requests.RequestException:
        return None
    # Parse response
    try:
        quote = response.json()
        data = quote['data']
        for d in data:
            if data[d]["name"]:
                db.execute("INSERT INTO radios (module_id, name, weight, image, price_credit, tier, signal_range) VALUES (:module_id, :name, :weight, :image, :price_credit, :tier, :signal_range)",
                           module_id=data[d]["module_id"], name=data[d]["name"], weight=data[d]["weight"], image=data[d]["image"], price_credit=data[d]["price_credit"], tier=data[d]["tier"], signal_range=data[d]["default_profile"]["radio"]["signal_range"])
    except (KeyError, TypeError, ValueError):
        return None


def takeEngines():
    db = SQL("sqlite:///tanks.db")
    try:
        response = requests.get(
            "https://api.worldoftanks.ru/wot/encyclopedia/modules/?application_id=19b782d8b0060bb61337725fda43e527&type=vehicleEngine&language=en&extra=default_profile")
        response.raise_for_status()
    except requests.RequestException:
        return None
    # Parse response
    try:
        quote = response.json()
        data = quote['data']
        for d in data:
            if data[d]["name"]:
                db.execute("INSERT INTO engines (module_id, name, weight, image, price_credit, tier, fire_chance, power) VALUES (:module_id, :name, :weight, :image, :price_credit, :tier, :fire_chance, :power)",
                           module_id=data[d]["module_id"], name=data[d]["name"], weight=data[d]["weight"], image=data[d]["image"], price_credit=data[d]["price_credit"], tier=data[d]["tier"], fire_chance=data[d]["default_profile"]["engine"]["fire_chance"], power=data[d]["default_profile"]["engine"]["power"])
    except (KeyError, TypeError, ValueError):
        return None


def takeSuspensions():
    db = SQL("sqlite:///tanks.db")
    try:
        response = requests.get(
            "https://api.worldoftanks.ru/wot/encyclopedia/modules/?application_id=19b782d8b0060bb61337725fda43e527&type=vehicleChassis&language=en&extra=default_profile")
        response.raise_for_status()
    except requests.RequestException:
        return None
    # Parse response
    try:
        quote = response.json()
        data = quote['data']
        for d in data:
            if data[d]["name"]:
                db.execute("INSERT INTO suspensions (module_id, name, weight, image, price_credit, tier, load_limit, traverse_speed) VALUES (:module_id, :name, :weight, :image, :price_credit, :tier, :load_limit, :traverse_speed)",
                           module_id=data[d]["module_id"], name=data[d]["name"], weight=data[d]["weight"], image=data[d]["image"], price_credit=data[d]["price_credit"], tier=data[d]["tier"], load_limit=data[d]["default_profile"]["suspension"]["load_limit"], traverse_speed=data[d]["default_profile"]["suspension"]["traverse_speed"])
    except (KeyError, TypeError, ValueError):
        return None


def takeTurrets():
    db = SQL("sqlite:///tanks.db")
    try:
        response = requests.get(
            "https://api.worldoftanks.ru/wot/encyclopedia/modules/?application_id=19b782d8b0060bb61337725fda43e527&type=vehicleTurret&language=en&extra=default_profile")
        response.raise_for_status()
    except requests.RequestException:
        return None
    # Parse response
    try:
        quote = response.json()
        data = quote['data']
        for d in data:
            if data[d]["name"]:
                db.execute("INSERT INTO turrets (module_id, name, weight, image, price_credit, tier, view_range, hp, armor_front, traverse_speed, armor_rear, armor_sides) VALUES (:module_id, :name, :weight, :image, :price_credit, :tier, :view_range, :hp, :armor_front, :traverse_speed, :armor_rear, :armor_sides)",
                           module_id=data[d]["module_id"], name=data[d]["name"], weight=data[d]["weight"], image=data[d]["image"], price_credit=data[d]["price_credit"], tier=data[d]["tier"], view_range=data[d]["default_profile"]["turret"]["view_range"], hp=data[d]["default_profile"]["turret"]["hp"], armor_front=data[d]["default_profile"]["turret"]["armor_front"], traverse_speed=data[d]["default_profile"]["turret"]["traverse_speed"], armor_rear=data[d]["default_profile"]["turret"]["armor_rear"], armor_sides=data[d]["default_profile"]["turret"]["armor_sides"])
    except (KeyError, TypeError, ValueError):
        return None


def takeProfileIds():
    db = SQL("sqlite:///tanks.db")
    tanks = db.execute("SELECT id_tank FROM tanks")
    for t in tanks:
        try:
            response = requests.get(
                f"https://api.worldoftanks.ru/wot/encyclopedia/vehicleprofiles/?application_id=19b782d8b0060bb61337725fda43e527&tank_id={t['id_tank']}&language=en")
            response.raise_for_status()
        except requests.RequestException:
            return None
        # Parse response
        try:
            quote = response.json()
            data = quote['data']
            for d in data:
                for i in data[d]:
                    if i["profile_id"]:
                        db.execute("INSERT INTO profile_ids (profile_id, tank_id) VALUES (:profile_id, :tank_id)",
                                   profile_id=i["profile_id"], tank_id=t['id_tank'])
        except (KeyError, TypeError, ValueError):
            return None


def takeProfile(tank_id, profile_id):
    db = SQL("sqlite:///tanks.db")
    try:
        response = requests.get(
            f"https://api.worldoftanks.ru/wot/encyclopedia/vehicleprofile/?application_id=19b782d8b0060bb61337725fda43e527&profile_id={profile_id}&language=en&tank_id={tank_id}")
        response.raise_for_status()
    except requests.RequestException:
        return None
    # Parse response
    try:
        quote = response.json()
        data = quote['data'][tank_id]
        provisionsIDs = db.execute(
            "SELECT provisions FROM tanks WHERE id_tank=:id_tank", id_tank=tank_id)
        provisionsIDs = (provisionsIDs[0]["provisions"].split(", "))
        provisions = db.execute(
            "SELECT * FROM provisions WHERE provision_id in (:provision_id)", provision_id=provisionsIDs)
        data["provisions"] = provisions
        #print (data)
        return data
    except (KeyError, TypeError, ValueError):
        return None


def takeProvisions():
    db = SQL("sqlite:///tanks.db")
    try:
        response = requests.get(
            f"https://api.worldoftanks.ru/wot/encyclopedia/provisions/?application_id=19b782d8b0060bb61337725fda43e527&language=en")
        response.raise_for_status()
    except requests.RequestException:
        return None
        # Parse response
    try:
        quote = response.json()
        data = quote['data']
        for d in data:
            if data[d]["name"]:
                db.execute("INSERT INTO provisions (provision_id, name, price_gold, image, tag, weight, price_credit, description, type) VALUES (:provision_id, :name, :price_gold, :image, :tag, :weight, :price_credit, :description, :typeProvision)",
                           provision_id=data[d]["provision_id"], name=data[d]["name"], price_gold=data[d]["price_gold"], image=data[d]["image"], tag=data[d]["tag"], weight=data[d]["weight"], price_credit=data[d]["price_credit"], description=data[d]["description"], typeProvision=data[d]["type"])
    except (KeyError, TypeError, ValueError):
        return None


def tanks_updated_at():
    db = SQL("sqlite:///tanks.db")
    try:
        response = requests.get(
            "https://api.worldoftanks.ru/wot/encyclopedia/info/?application_id=19b782d8b0060bb61337725fda43e527")
        response.raise_for_status()
    except requests.RequestException:
        return None
        # Parse response
    try:
        quote = response.json()
        data = quote['data']
        if data["tanks_updated_at"]:
            db.execute("INSERT INTO tanks_updated_at (tanks_updated_at) VALUES (:tanks_updated_at)",
                       tanks_updated_at=data["tanks_updated_at"])
    except (KeyError, TypeError, ValueError):
        return None


def checkVersion():
    db = SQL("sqlite:///tanks.db")
    try:
        response = requests.get(
            "https://api.worldoftanks.ru/wot/encyclopedia/info/?application_id=19b782d8b0060bb61337725fda43e527")
        response.raise_for_status()
    except requests.RequestException:
        return None
        # Parse response
    try:
        quote = response.json()
        data = quote['data']
        new_tanks_updated_at = 0
        if data["tanks_updated_at"]:
            new_tanks_updated_at = data["tanks_updated_at"]
        #print(new_tanks_updated_at, db.execute("SELECT tanks_updated_at FROM tanks_updated_at")[0]["tanks_updated_at"])
        if (new_tanks_updated_at != 0) and (new_tanks_updated_at != db.execute("SELECT tanks_updated_at FROM tanks_updated_at")[0]["tanks_updated_at"]):
            db.execute("DELETE FROM crew")
            db.execute("DELETE FROM engines")
            db.execute("DELETE FROM guns")
            db.execute("DELETE FROM profile_ids")
            db.execute("DELETE FROM provisions")
            db.execute("DELETE FROM radios")
            db.execute("DELETE FROM rapid")
            db.execute("DELETE FROM siege")
            db.execute("DELETE FROM suspensions")
            db.execute("DELETE FROM tanks")
            db.execute("DELETE FROM tanks_updated_at")
            db.execute("DELETE FROM turrets")
            db.execute("DELETE FROM turretsWOID")
            takeTanksId()
            takeGuns()
            takeRadio()
            takeEngines()
            takeSuspensions()
            takeTurrets()
            takeProfileIds()
            takeProvisions()
            tanks_updated_at()
    except (KeyError, TypeError, ValueError):
        return None


if __name__ == "__main__":
    checkVersion()
    # takeTanksId()
    # takeGuns()
    # takeRadio()
    # takeEngines()
    # takeSuspensions()
    # takeTurrets()
    # takeProfileIds()
    # takeProvisions()
    # tanks_updated_at()
