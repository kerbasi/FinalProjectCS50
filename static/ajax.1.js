//
"use strict";

let tankInfo;
let tankProfile;
let baseTankProfile;
let baseGun;
let baseTurret;
let baseSuspension;
let baseEngine;
let baseRadio;

function changeActive(e) {
    $(`#${$(e).attr("class").split(' ')[1]} a`).removeClass('active');
    $(e).addClass('active');
    createInfo(false);
}

function selectPerk(e) {
    if ($(e).is(".checked")){
        $(e).removeClass("checked");
    }
    else {
        $(e).addClass("checked");
    }
    createInfo(false);
}

function loadTank(name) {
    if (name === "")
        return;

    let aj = new XMLHttpRequest();

    aj.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            tankInfo = JSON.parse(this.responseText);
            createInfo(true);
        }
    };

    aj.open("GET", "/load?tank=" + name, true);
    aj.send();
}

function insertRow(idTable, rHeader, rData) {
    $(`#${idTable} tbody`).append(`<tr>
                                        <th scope="row">
                                            ${rHeader}
                                        </th>
                                        <td>
                                            ${rData}
                                        </td>
                                    </tr>`);
}

function createInfo(firstLoad) {

    if (firstLoad)
    {
        $('.perks').removeClass("checked");
    }

    let currentGun;
    let currentTurret;
    let currentSuspension;
    let currentEngine;
    let currentRadio;
    let currentAmmo;
    let comanderLvl = Number($('#crewRange').val());
    let brothers = 0;
    let eagle = 1;
    let boffin = 1;
    let ace = 1;
    let master = 1;
    let sonar = 1;

    if (comanderLvl < 100) {
        $('p.perks').text('You only can use Perks when your crew are 100 or higher!');
        $('a.perks').removeAttr('onclick');
        $('img.perks').css('opacity', '0.2');
    }
    else {
        $('p.perks').text('');
        $('a.perks').attr('onclick', "selectPerk(this);");
        $('img.perks').css('opacity', '1');
    }

    if ($('#brothers').is(".checked")) {
        brothers = 5;
    }
    if ($('#eagle').is(".checked")) {
        eagle = 1.02;
    }


    let crewLvl = comanderLvl + 5 + (0.1 * (comanderLvl + brothers - 50)) + brothers;
    let crewLvlMul = 0.875 / (0.00375 * crewLvl + 0.5);
    let comanderLvlMul = 0.875 / (0.00375 * (comanderLvl + brothers) + 0.5);
    let gunnerMul;
    let loaderMul;
    let radiomanMul;
    let driverMul;
    let gunnerMulBase;
    let loaderMulBase;
    let radiomanMulBase;
    let driverMulBase;

    if (tankInfo.crew[0].roles.search("Gunner") != -1){
        gunnerMul = comanderLvlMul;
        gunnerMulBase = 1;
    }
    else {
        gunnerMul = crewLvlMul;
        gunnerMulBase = 1.043;
    }
    if (tankInfo.crew[0].roles.search("Loader") != -1){
        loaderMul = comanderLvlMul;
        loaderMulBase = 1;
    }
    else {
        loaderMul = crewLvlMul;
        loaderMulBase = 1.043;
    }
    if (tankInfo.crew[0].roles.search("Radio Operator") != -1){
        radiomanMul = comanderLvlMul;
        radiomanMulBase = 1;
        if ($('#boffin').is(".checked")) {
            boffin = 1 + (0.002 * (comanderLvl + brothers));
        }
        if ($('#sonar').is(".checked")) {
            sonar = 1 + (0.0003 * (comanderLvl + brothers));
        }
    }
    else {
        radiomanMul = crewLvlMul;
        radiomanMulBase = 1.043;
        if ($('#boffin').is(".checked")) {
            boffin = 1 + (0.002 * crewLvl);
        }
        if ($('#sonar').is(".checked")) {
            sonar = 1 + (0.0003 * crewLvl);
        }
    }

    if (tankInfo.crew[0].roles.search("Driver") != -1){
        driverMul = comanderLvlMul;
        driverMulBase = 1;
        if ($('#ace').is(".checked")) {
            ace = 1 + (0.0005 * (comanderLvl + brothers));
        }
        if ($('#master').is(".checked")) {
            master = 1 + (0.0004358 * (comanderLvl + brothers));
        }
    }
    else {
        driverMul = crewLvlMul;
        driverMulBase = 1.043;
        if ($('#ace').is(".checked")) {
            ace = 1 + (0.0005 * crewLvl);
        }
        if ($('#master').is(".checked")) {
            master = 1 + (0.0004358 * crewLvl);
        }
    }
    $('#crewLvl').text(`Comander level: ${comanderLvl + brothers} Crew level: ${crewLvl.toFixed(0)}`);

    //Dropdown guns
    if (firstLoad)
    {
        $('#guns').html("");
        tankInfo.guns.sort(function(a, b){return a.tier - b.tier});
        for (let i in tankInfo.guns){
            if (tankInfo.guns[i].module_id === tankInfo.gun_id){
                $('#guns').append(`<a class="dropdown-item guns active" href="#guns" onclick=changeActive(this);>${tankInfo.guns[i].name} | ${tankInfo.guns[i].tier} lvl</a>`);
            }
            else
            {
                $('#guns').append(`<a class="dropdown-item guns" href="#guns" onclick=changeActive(this);>${tankInfo.guns[i].name} | ${tankInfo.guns[i].tier} lvl</a>`);
            }
        }
    }

    for (let i in tankInfo.guns)
    {
        if (tankInfo.guns[i].name === $('a.guns.active').text().split(' | ')[0])
        {
            currentGun = tankInfo.guns[i];
        }
    }

    //Dropdown turrets
    if (firstLoad)
    {
        $('#turrets').html("");
        tankInfo.turrets.sort(function(a, b){return a.tier - b.tier});
        for (let i in tankInfo.turrets){
            if ((tankInfo.turret_id === 0) || (tankInfo.turrets[i].module_id === tankInfo.turret_id))
            {
                $('#turrets').append(`<a class="dropdown-item turrets active" href="#turrets" onclick=changeActive(this);>${tankInfo.turrets[i].name} | ${tankInfo.turrets[i].tier} lvl</a>`);
                baseTurret = tankInfo.turrets[i];
            }
            else
            {
                $('#turrets').append(`<a class="dropdown-item turrets" href="#turrets" onclick=changeActive(this);>${tankInfo.turrets[i].name} | ${tankInfo.turrets[i].tier} lvl</a>`);
            }
        }
    }

    for (let i in tankInfo.turrets)
    {
        if (tankInfo.turrets[i].name === $('a.turrets.active').text().split(' | ')[0])
        {
            currentTurret = tankInfo.turrets[i];
        }
    }

    //Dropdown suspensions
    if (firstLoad)
    {
        $('#suspensions').html("");
        tankInfo.suspensions.sort(function(a, b){return a.tier - b.tier});
        for (let i in tankInfo.suspensions){
            if (tankInfo.suspensions[i].module_id === tankInfo.suspension_id)
            {
                $('#suspensions').append(`<a class="dropdown-item suspensions active" href="#suspensions" onclick=changeActive(this);>${tankInfo.suspensions[i].name} | ${tankInfo.suspensions[i].tier} lvl</a>`);
            }
            else
            {
                $('#suspensions').append(`<a class="dropdown-item suspensions" href="#suspensions" onclick=changeActive(this);>${tankInfo.suspensions[i].name} | ${tankInfo.suspensions[i].tier} lvl</a>`);
            }
        }
    }

    for (let i in tankInfo.suspensions)
    {
        if (tankInfo.suspensions[i].name === $('a.suspensions.active').text().split(' | ')[0])
        {
            currentSuspension = tankInfo.suspensions[i];

        }
    }

    //Dropdown engines
    if (firstLoad)
    {
        $('#engines').html("");
        tankInfo.engines.sort(function(a, b){return a.tier - b.tier});
        for (let i in tankInfo.engines){
            if (tankInfo.engines[i].module_id === tankInfo.engine_id){
                $('#engines').append(`<a class="dropdown-item engines active" href="#engines" onclick=changeActive(this);>${tankInfo.engines[i].name} | ${tankInfo.engines[i].tier} lvl</a>`);
            }
            else
            {
                $('#engines').append(`<a class="dropdown-item engines" href="#engines" onclick=changeActive(this);>${tankInfo.engines[i].name} | ${tankInfo.engines[i].tier} lvl</a>`);
            }
        }
    }

    for (let i in tankInfo.engines)
    {
        if (tankInfo.engines[i].name === $('a.engines.active').text().split(' | ')[0])
        {
            currentEngine = tankInfo.engines[i];

        }
    }

    //Dropdown radios
    if (firstLoad)
    {
        $('#radios').html("");
        for (let i in tankInfo.radios){
            if (tankInfo.radios[i].module_id === tankInfo.radio_id){
                $('#radios').append(`<a class="dropdown-item radios active" href="#radios" onclick=changeActive(this);>${tankInfo.radios[i].name} | ${tankInfo.radios[i].tier} lvl</a>`);
            }
            else
            {
                $('#radios').append(`<a class="dropdown-item radios" href="#radios" onclick=changeActive(this);>${tankInfo.radios[i].name} | ${tankInfo.radios[i].tier} lvl</a>`);
            }
        }
    }

    for (let i in tankInfo.radios)
    {
        if (tankInfo.radios[i].name === $('a.radios.active').text().split(' | ')[0])
        {
            currentRadio = tankInfo.radios[i];
        }
    }

    let aj = new XMLHttpRequest();

    aj.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            tankProfile = JSON.parse(this.responseText);

            if (tankProfile === "None") {
                alert("You cannot create this build! Please try another.")
                createInfo(true);
                return;
            }

            if (tankProfile.is_default){
                baseTankProfile = tankProfile;
            }

            let avrDmg = tankProfile.ammo[0].damage;
            let avrPen = tankProfile.ammo[0].penetration;


            $('#gunCol1').html(`<div class="text-left font-weight-bold">${tankProfile.gun.name}</div>
                                <div class="text-left"><span class="bold">Tier:</span> ${tankProfile.gun.tier} lvl</div>
                                <div class="text-left"><span class="bold">Damage (min/avg/max):</span> </div>
                                <div class="text-left">${avrDmg[0]}/${avrDmg[1]}/${avrDmg[2]} HP</div>
                                <div class="text-left"><span class="bold">Penetration (min/avg/max):</span> </div>
                                <div class="text-left">${avrPen[0]}/${avrPen[1]}/${avrPen[2]} mm</div>
                                <div class="text-left"><span class="bold">Weight:</span> ${tankProfile.gun.weight} kg</div>`);

            if (tankInfo.turret_id === 0)
            {
                $('#turretCol1').html(`<div class="text-left font-weight-bold">${tankProfile.turret.name}</div>
                                    <div class="text-left"><span class="bold">Tier:</span> ${tankProfile.turret.tier} lvl</div>
                                    <div class="text-left"><span class="bold">View range:</span> ${tankProfile.turret.view_range} m</div>
                                    <div class="text-left"><span class="bold">Weight:</span> ${tankProfile.turret.weight} kg</div>`);
            }
            else
            {
                $('#turretCol1').html(`<div class="text-left font-weight-bold">${tankProfile.turret.name}</div>
                                    <div class="text-left"><span class="bold">Tier:</span> ${tankProfile.turret.tier} lvl</div>
                                    <div class="text-left"><span class="bold">View range:</span> ${tankProfile.turret.view_range} m</div>
                                    <div class="text-left"><span class="bold">Armor (front/sides/rear):</span> </div>
                                    <div class="text-left">${tankProfile.armor.turret.front}/${tankProfile.armor.turret.sides}/${tankProfile.armor.turret.rear} mm</div>
                                    <div class="text-left"><span class="bold">Weight:</span> ${tankProfile.turret.weight} kg</div>`);
            }

            $('#suspensionCol1').html(`<div class="text-left font-weight-bold">${tankProfile.suspension.name}</div>
                                <div class="text-left"><span class="bold">Tier:</span> ${tankProfile.suspension.tier} lvl</div>
                                <div class="text-left"><span class="bold">Traverse speed:</span> ${tankProfile.suspension.traverse_speed} deg/s</div>
                                <div class="text-left"><span class="bold">Load limit:</span> ${tankProfile.suspension.load_limit} kg</div>
                                <div class="text-left"><span class="bold">Weight:</span> ${tankProfile.suspension.weight} kg</div>`);

            $('#engineCol1').html(`<div class="text-left font-weight-bold">${tankProfile.engine.name}</div>
                                <div class="text-left"><span class="bold">Tier:</span> ${tankProfile.engine.tier} lvl</div>
                                <div class="text-left"><span class="bold">Power:</span> ${tankProfile.engine.power} h.p.</div>
                                <div class="text-left"><span class="bold">Fire chance:</span> ${tankProfile.engine.fire_chance * 100} %</div>
                                <div class="text-left"><span class="bold">Weight:</span> ${tankProfile.engine.weight} kg</div>`);

            $('#radioCol1').html(`<div class="text-left font-weight-bold">${tankProfile.radio.name}</div>
                                <div class="text-left"><span class="bold">Tier:</span> ${tankProfile.radio.tier} lvl</div>
                                <div class="text-left"><span class="bold">Signal range:</span> ${tankProfile.radio.signal_range} m</div>
                                <div class="text-left"><span class="bold">Weight:</span> ${tankProfile.radio.weight} kg</div>`);

            //Creating info
            $('#tankParams h1').text(tankInfo.name);
            //$('#tankParams img').attr('src', tankInfo.images);
            $('.description').text(tankInfo.description);
            $('#gunImg').attr('src', "http://api.worldoftanks.ru/static/2.65.3/wot/encyclopedia/module/ico-guns.gif");
            $('#turretImg').attr('src', "http://api.worldoftanks.ru/static/2.65.0/wot/encyclopedia/module/ico-head.gif");
            $('#susImg').attr('src', "http://api.worldoftanks.ru/static/2.65.0/wot/encyclopedia/module/ico-transm.gif");
            $('#engineImg').attr('src', "http://api.worldoftanks.ru/static/2.65.0/wot/encyclopedia/module/ico-engine.gif");
            $('#radioImg').attr('src', "http://api.worldoftanks.ru/static/2.65.0/wot/encyclopedia/module/ico-radio.gif");

            //Creating table
            //Common info
            $('#tableCommon thead').html('');
            $('#tableCommon thead').append(`
                                            <tr>
                                                <th colspan="2">Common info</th>
                                            </tr>`);

            $('#tableCommon tbody').html('');
            if (tankInfo.nation[0] == "u"){
                insertRow("tableCommon", "Nation", tankInfo.nation.toUpperCase());
            }
            else {
                insertRow("tableCommon", "Nation", tankInfo.nation[0].toUpperCase() + tankInfo.nation.slice(1));
            }
            if (tankInfo.is_premium) {
                insertRow("tableCommon", "Tier", `${tankInfo.lvl} lvl <span class="premium">Premium tank</span>`);
            }
            else {
                insertRow("tableCommon", "Tier", `${tankInfo.lvl} lvl`);
            }
            if (tankInfo.type.indexOf("Tank") === -1) {
                insertRow("tableCommon", "Type", tankInfo.type[0].toUpperCase() + tankInfo.type.slice(1));
            }
            else {
                insertRow("tableCommon", "Type", tankInfo.type[0].toUpperCase() + tankInfo.type.slice(1, tankInfo.type.indexOf("Tank")) + " " + tankInfo.type.slice(tankInfo.type.indexOf("T")).toLowerCase());
            }
            if (tankInfo.price_credit != 0) {
                insertRow("tableCommon", "Price credit", tankInfo.price_credit);
            }
            else if (tankInfo.price_gold != 0) {
                insertRow("tableCommon", "Price gold", tankInfo.price_gold);
            }
            if (tankInfo.prices_xp != 0) {
                insertRow("tableCommon", "Price experience", tankInfo.prices_xp);
            }

            $('#tableCommon tbody').append(`<tr id="crewRow">
                                                <th rowspan="${tankInfo.crew.length}" scope="row" style="vertical-align: middle;">
                                                    Crew (${tankInfo.crew.length})
                                                </th><td>${tankInfo.crew[0].roles}</td></tr>`);
            for (let i in tankInfo.crew){
                if (i != 0) {
                    $('#crewRow').after(`<tr><td class="crewRow">${tankInfo.crew[i].roles}</td></tr>`);
                }
            }
            $('#tableCommon tbody').append(`</td></tr>`);

            //Firepower info
            $('#tableFirepower thead').html('');
            $('#tableFirepower thead').append(`
                                            <tr>
                                                <th colspan="2">Firepower</th>
                                            </tr>`);

            $('#tableSurvivability thead').html('');
            $('#tableSurvivability thead').append(`
                                            <tr>
                                                <th colspan="2">Survivability</th>
                                            </tr>`);

            $('#tableMobility thead').html('');
            $('#tableMobility thead').append(`
                                            <tr>
                                                <th colspan="2">Mobility</th>
                                            </tr>`);

            $('#tableSpotting thead').html('');
            $('#tableSpotting thead').append(`
                                            <tr>
                                                <th colspan="2">Spotting</th>
                                            </tr>`);

            $('#tableFirepower tbody').html('');
            $('#tableSurvivability tbody').html('');
            $('#tableMobility tbody').html('');
            $('#tableSpotting tbody').html('');

            insertRow("tableFirepower", "Avg. dmg. per shot", `${avrDmg[1]} HP`);
            insertRow("tableFirepower", "Avg. penetration", `${avrPen[1]} mm`);
            if (currentGun.ammo1_stun != 0) {
                insertRow("tableFirepower", "Min. stun duration", `${currentGun.ammo1_stun.split(',')[0]} s`);
                insertRow("tableFirepower", "Max. stun duration", `${currentGun.ammo1_stun.split(',')[1]} s`);
            }

            let rateFire = (tankProfile.gun.fire_rate / loaderMul).toFixed(2);
            insertRow("tableFirepower", "Rate on fire", `${rateFire} <span id="notBaseROF"></span> rounds/min`);
            insertRow("tableFirepower", "Reload time", `${(tankProfile.gun.reload_time * loaderMul).toFixed(2)} <span id="notBaseReload"></span> s`);
            if (tankInfo.turret_id === 0) {
                insertRow("tableFirepower", "Gun traverse speed", `${(tankProfile.gun.traverse_speed / gunnerMul).toFixed(2)} <span id="notBaseGunTraverse"></span> deg/s`);
            }
            else {
                insertRow("tableFirepower", "Gun traverse speed", `${(tankProfile.turret.traverse_speed / gunnerMul).toFixed(2)} <span id="notBaseGunTraverse"></span> deg/s`);
            }
            insertRow("tableFirepower", "Gun depression/elevation angle", `-${tankProfile.gun.move_down_arc}/${tankProfile.gun.move_up_arc} <span id=""></span> deg`);
            insertRow("tableFirepower", "Aiming time", `${(tankProfile.gun.aim_time * gunnerMul).toFixed(2)} <span id="notBaseAim"></span> s`);
            insertRow("tableFirepower", "Dispersion at 100 m", `${(tankProfile.gun.dispersion * gunnerMul).toFixed(2)} <span id="notBaseDispersion"></span> m`);
            insertRow("tableFirepower", "Average damage per minute", `${(avrDmg[1] * rateFire).toFixed(0)} <span id="notBaseDPM"></span> HP/min`);

            insertRow("tableSurvivability", "Hit points", `${tankProfile.turret.hp + tankProfile.hull_hp} <span id=""></span> HP`);
            insertRow("tableSurvivability", "Hull armor", `${tankProfile.armor.hull.front}/${tankProfile.armor.hull.sides}/${tankProfile.armor.hull.rear} <span id=""></span> front/sides/rear mm`);
            if (tankInfo.turret_id != 0) {
                insertRow("tableSurvivability", "Turret armor", `${tankProfile.armor.turret.front}/${tankProfile.armor.turret.sides}/${tankProfile.armor.turret.rear} <span id=""></span> front/sides/rear mm`);
            }

            let tankWeight = tankProfile.weight / 1000;
            insertRow("tableMobility", "Weight", `${tankWeight.toFixed(2)} t`);
            insertRow("tableMobility", "Load limit", `${(tankProfile.max_weight / 1000).toFixed(2)} t`);
            insertRow("tableMobility", "Engine power", `${tankProfile.engine.power} h.p.`);
            insertRow("tableMobility", "Specific power", `${(tankProfile.engine.power / tankWeight).toFixed(2)} h.p.`);
            insertRow("tableMobility", "Top speed/reverse speed", `${tankProfile.speed_forward}/${tankProfile.speed_backward} km/h`);
            insertRow("tableMobility", "Traverce speed", `${(tankProfile.suspension.traverse_speed * ace * master / driverMul).toFixed(2)} <span id="notBaseTraverse"></span> deg/s`);

            insertRow("tableSpotting", "View range", `${(tankProfile.turret.view_range * eagle * sonar / comanderLvlMul).toFixed(2)} <span id="notBaseView"></span> m`);
            insertRow("tableSpotting", "Signal range", `${(tankProfile.radio.signal_range * boffin / radiomanMul).toFixed(2)} <span id="notBaseSignal"></span> m`);

            if ((comanderLvl != 100) || (brothers != 0)) {
                let sum = ((tankProfile.gun.fire_rate / loaderMul) - (tankProfile.gun.fire_rate * loaderMulBase)).toFixed(2);
                if (sum >= 0) {
                    $('#notBaseROF').css("color", "green");
                    $('#notBaseROF').text(`(+${sum})`);
                }
                else {
                    $('#notBaseROF').css("color", "red");
                    $('#notBaseROF').text(`(${sum})`);
                }
                sum = ((tankProfile.gun.reload_time * loaderMul) - (tankProfile.gun.reload_time / loaderMulBase)).toFixed(2);
                if (sum >= 0) {
                    $('#notBaseReload').css("color", "red");
                    $('#notBaseReload').text(`(+${sum})`);
                }
                else {
                    $('#notBaseReload').css("color", "green");
                    $('#notBaseReload').text(`(${sum})`);
                }
                sum = ((tankProfile.gun.aim_time * gunnerMul) - (tankProfile.gun.aim_time / gunnerMulBase)).toFixed(2);
                if (sum >= 0) {
                    $('#notBaseAim').css("color", "red");
                    $('#notBaseAim').text(`(+${sum})`);
                }
                else {
                    $('#notBaseAim').css("color", "green");
                    $('#notBaseAim').text(`(${sum})`);
                }
                sum = ((tankProfile.gun.dispersion * gunnerMul) - (tankProfile.gun.dispersion / gunnerMulBase)).toFixed(2);
                if (sum >= 0) {
                    $('#notBaseDispersion').css("color", "red");
                    $('#notBaseDispersion').text(`(+${sum})`);
                }
                else {
                    $('#notBaseDispersion').css("color", "green");
                    $('#notBaseDispersion').text(`(${sum})`);
                }
                sum = ((avrDmg[1] * tankProfile.gun.fire_rate / loaderMul) - (avrDmg[1] * tankProfile.gun.fire_rate * loaderMulBase)).toFixed(2);
                if (sum >= 0) {
                    $('#notBaseDPM').css("color", "green");
                    $('#notBaseDPM').text(`(+${sum})`);
                }
                else {
                    $('#notBaseDPM').css("color", "red");
                    $('#notBaseDPM').text(`(${sum})`);
                }
                if (tankInfo.turret_id === 0) {
                    sum = ((tankProfile.gun.traverse_speed / gunnerMul) - (tankProfile.gun.traverse_speed * gunnerMulBase)).toFixed(2);
                }
                else {
                    sum = ((tankProfile.turret.traverse_speed / gunnerMul) - (tankProfile.turret.traverse_speed * gunnerMulBase)).toFixed(2);
                }
                if (sum >= 0) {
                    $('#notBaseGunTraverse').css("color", "green");
                    $('#notBaseGunTraverse').text(`(+${sum})`);
                }
                else {
                    $('#notBaseGunTraverse').css("color", "red");
                    $('#notBaseGunTraverse').text(`(${sum})`);
                }
                sum = ((tankProfile.suspension.traverse_speed / driverMul) - (tankProfile.suspension.traverse_speed * driverMulBase)).toFixed(2);
                if (sum >= 0) {
                    $('#notBaseTraverse').css("color", "green");
                    $('#notBaseTraverse').text(`(+${sum})`);
                }
                else {
                    $('#notBaseTraverse').css("color", "red");
                    $('#notBaseTraverse').text(`(${sum})`);
                }
            }

            if ((comanderLvl != 100) || (brothers != 0) || (eagle != 1)) {
                let sum = ((tankProfile.turret.view_range / comanderLvlMul * eagle) - tankProfile.turret.view_range).toFixed(2);
                if (sum >= 0) {
                    $('#notBaseView').css("color", "green");
                    $('#notBaseView').text(`(+${sum})`);
                }
                else {
                    $('#notBaseView').css("color", "red");
                    $('#notBaseView').text(`(${sum})`);
                }
            }

            if ((comanderLvl != 100) || (brothers != 0) || (boffin != 1)) {
                let sum = ((tankProfile.radio.signal_range * boffin / radiomanMul) - tankProfile.radio.signal_range * radiomanMulBase).toFixed(2);
                if (sum >= 0) {
                    $('#notBaseSignal').css("color", "green");
                    $('#notBaseSignal').text(`(+${sum})`);
                }
                else {
                    $('#notBaseSignal').css("color", "red");
                    $('#notBaseSignal').text(`(${sum})`);
                }
            }

            /*$
            $('#rowCommon3 th').text("Max HP");
            $('#rowCommon3 td').text(tankInfo.hp);
            $('#rowCommon4 th').text("Base HP");
            $('#rowCommon4 td').text(tankInfo.hull_hp);
            $('#rowCommon5 th').text("Crew");
            $('#rowCommon5 td').html("<span>||</span> ");
            for (let c in tankInfo.crew){
                $('#rowCommon5 td').append(tankInfo.crew[c].roles + " <span>||</span> ");
            }
            $('#rowCommon6 th').text("Engine power");
            $('#rowCommon6 td').text(currentEngine.power + ' h.p.');
            $('#rowCommon7 th').text("Fire chance");
            $('#rowCommon7 td').text(currentEngine.fire_chance * 100 + '%');
            $('#rowCommon8 th').text("Circular view range");
            $('#rowCommon8 td').text(currentTurret.view_range + ' (' + (currentTurret.view_range - baseTurret.view_range) + ')');
            $('#rowCommon9 th').text("Weight");
            $('#rowCommon9 td').text(tankInfo.weight);
            $('#rowCommon10 th').text("Weight limit");
            $('#rowCommon10 td').text(currentSuspension.load_limit);
            $('#rowCommon11 th').text("Radio distance");
            $('#rowCommon11 td').text(currentRadio.signal_range);
            $('#rowCommon12 th').text("Chassis rotation speed");
            $('#rowCommon12 td').text(currentSuspension.traverse_speed);
            $('#rowCommon13 th').text("Turret rotation speed");
            $('#rowCommon13 td').text(currentTurret.traverse_speed);
            $('#rowCommon14 th').text("Speed limit");
            $('#rowCommon14 td').text(tankInfo.speed_forward);
            $('#rowCommon15 th').text("Max reverse speed");
            $('#rowCommon15 td').text(tankInfo.speed_backward);

            //Table Defence
            $('#rowDefence0 th').text("Front armor");
            $('#rowDefence0 td').text(tankInfo.hull_armor_front);
            $('#rowDefence1 th').text("Side armour");
            $('#rowDefence1 td').text(tankInfo.hull_armor_sides);
            $('#rowDefence2 th').text("Back armour");
            $('#rowDefence2 td').text(tankInfo.hull_armor_rear);
            if (currentTurret.armor_sides)
            {
                $('#rowDefence3 th').text("Turret front armour");
                $('#rowDefence3 td').text(currentTurret.armor_front);
                $('#rowDefence4 th').text("Turret side armour");
                $('#rowDefence4 td').text(currentTurret.armor_sides);
                $('#rowDefence5 th').text("Turret back armour");
                $('#rowDefence5 td').text(currentTurret.armor_rear);
            }
            else
            {
                $('#rowDefence3 th').text("Turret front armour");
                $('#rowDefence3 th').css({"text-decoration": "line-through"});
                $('#rowDefence3 td').text("No");
                $('#rowDefence4 th').text("Turret side armour");
                $('#rowDefence4 th').css({"text-decoration": "line-through"});
                $('#rowDefence4 td').text("No");
                $('#rowDefence5 th').text("Turret back armour");
                $('#rowDefence5 th').css({"text-decoration": "line-through"});
                $('#rowDefence5 td').text("No");
            }*/
            $('#tankParams').css("visibility" , "visible");
        }
    };

    aj.open("GET", "/getprofile?tank_id=" + tankInfo.id_tank + "&gun_id=" + currentGun.module_id + "&suspension_id=" + currentSuspension.module_id + "&turret_id=" + currentTurret.module_id + "&radio_id=" + currentRadio.module_id + "&engine_id=" + currentEngine.module_id, true);
    aj.send();
}

//
function loadTankList() {

    let aj = new XMLHttpRequest();

    aj.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let tankList = JSON.parse(this.responseText);
            $('#selectTank').html('<option selected value="None">Select</option>');
            for (let tanks in tankList){
                if (tankList[tanks].is_premium){
                    $('#selectTank').append(`<option value="${tankList[tanks].name}">${tankList[tanks].lvl} | ${tankList[tanks].name} ★ </option>`);
                }
                else{
                    $('#selectTank').append(`<option value="${tankList[tanks].name}">${tankList[tanks].lvl} | ${tankList[tanks].name}</option>`);
                }
            }
        }
    };

    let lvl = $('#selectLvl').val();
    let type = $('#selectType').val();
    let nation = $('#selectNation').val();

    aj.open("GET", "/loadlist?lvl=" + lvl + "&type=" + type + "&nation=" + nation, true);
    aj.send();
}

