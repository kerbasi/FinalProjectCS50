//
"use strict";

let tankInfo;
let tankProfile;

let tankMaxWeight;
let tankWeight;
let currentGun;
let currentTurret;
let currentSuspension;
let currentEngine;
let currentRadio;
let currentAmmo;
let optionalDeviceSlots;
let consumableSlots;

function loadTankList() {
  let aj = new XMLHttpRequest();

  aj.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      let tankList = JSON.parse(this.responseText);
      $("#selectTank").html('<option selected value="None">Select</option>');
      for (let tanks in tankList) {
        if (tankList[tanks].is_premium) {
          $("#selectTank").append(
            `<option value="${tankList[tanks].name}">${tankList[tanks].lvl} | ${
              tankList[tanks].name
            } ★ </option>`
          );
        } else {
          $("#selectTank").append(
            `<option value="${tankList[tanks].name}">${tankList[tanks].lvl} | ${
              tankList[tanks].name
            }</option>`
          );
        }
      }
    }
  };

  let lvl = $("#selectLvl").val();
  let type = $("#selectType").val();
  let nation = $("#selectNation").val();

  aj.open(
    "GET",
    "/loadlist?lvl=" + lvl + "&type=" + type + "&nation=" + nation,
    true
  );
  aj.send();
}

function loadTank(name) {
  if (name === "") return;

  let aj = new XMLHttpRequest();

  aj.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      tankInfo = JSON.parse(this.responseText);
      createDropdown();
    }
  };
  $("#tankParams").css("visibility", "hidden");
  aj.open("GET", "/load?tank=" + name, true);
  aj.send();
}

function createDropdown() {
  //Dropdown guns
  $("#guns").html("");
  tankInfo.guns.sort(function(a, b) {
    return a.tier - b.tier;
  });
  for (let i in tankInfo.guns) {
    if (tankInfo.guns[i].module_id === tankInfo.gun_id) {
      $("#guns").append(
        `<a class="dropdown-item guns active" href="#guns" onclick=changeActive(this);>${
          tankInfo.guns[i].name
        } | ${tankInfo.guns[i].tier} lvl</a>`
      );
    } else {
      $("#guns").append(
        `<a class="dropdown-item guns" href="#guns" onclick=changeActive(this);>${
          tankInfo.guns[i].name
        } | ${tankInfo.guns[i].tier} lvl</a>`
      );
    }
  }

  //Dropdown turrets
  $("#turrets").html("");
  tankInfo.turrets.sort(function(a, b) {
    return a.tier - b.tier;
  });
  for (let i in tankInfo.turrets) {
    if (
      tankInfo.turret_id === 0 ||
      tankInfo.turrets[i].module_id === tankInfo.turret_id
    ) {
      $("#turrets").append(
        `<a class="dropdown-item turrets active" href="#turrets" onclick=changeActive(this);>${
          tankInfo.turrets[i].name
        } | ${tankInfo.turrets[i].tier} lvl</a>`
      );
    } else {
      $("#turrets").append(
        `<a class="dropdown-item turrets" href="#turrets" onclick=changeActive(this);>${
          tankInfo.turrets[i].name
        } | ${tankInfo.turrets[i].tier} lvl</a>`
      );
    }
  }

  //Dropdown suspensions
  $("#suspensions").html("");
  tankInfo.suspensions.sort(function(a, b) {
    return a.tier - b.tier;
  });
  for (let i in tankInfo.suspensions) {
    if (tankInfo.suspensions[i].module_id === tankInfo.suspension_id) {
      $("#suspensions").append(
        `<a class="dropdown-item suspensions active" href="#suspensions" onclick=changeActive(this);>${
          tankInfo.suspensions[i].name
        } | ${tankInfo.suspensions[i].tier} lvl</a>`
      );
    } else {
      $("#suspensions").append(
        `<a class="dropdown-item suspensions" href="#suspensions" onclick=changeActive(this);>${
          tankInfo.suspensions[i].name
        } | ${tankInfo.suspensions[i].tier} lvl</a>`
      );
    }
  }

  //Dropdown engines
  $("#engines").html("");
  tankInfo.engines.sort(function(a, b) {
    return a.tier - b.tier;
  });
  for (let i in tankInfo.engines) {
    if (tankInfo.engines[i].module_id === tankInfo.engine_id) {
      $("#engines").append(
        `<a class="dropdown-item engines active" href="#engines" onclick=changeActive(this);>${
          tankInfo.engines[i].name
        } | ${tankInfo.engines[i].tier} lvl</a>`
      );
    } else {
      $("#engines").append(
        `<a class="dropdown-item engines" href="#engines" onclick=changeActive(this);>${
          tankInfo.engines[i].name
        } | ${tankInfo.engines[i].tier} lvl</a>`
      );
    }
  }

  //Dropdown radios
  $("#radios").html("");
  for (let i in tankInfo.radios) {
    if (tankInfo.radios[i].module_id === tankInfo.radio_id) {
      $("#radios").append(
        `<a class="dropdown-item radios active" href="#radios" onclick=changeActive(this);>${
          tankInfo.radios[i].name
        } | ${tankInfo.radios[i].tier} lvl</a>`
      );
    } else {
      $("#radios").append(
        `<a class="dropdown-item radios" href="#radios" onclick=changeActive(this);>${
          tankInfo.radios[i].name
        } | ${tankInfo.radios[i].tier} lvl</a>`
      );
    }
  }
  optionalDeviceSlots = 3;
  consumableSlots = 3;
  takeInfo();
}

function takeInfo() {
  $("#crewRange").val(100);

  for (let i in tankInfo.guns) {
    if (
      tankInfo.guns[i].name ===
      $("a.guns.active")
        .text()
        .split(" | ")[0]
    ) {
      currentGun = tankInfo.guns[i];
    }
  }

  for (let i in tankInfo.turrets) {
    if (
      tankInfo.turrets[i].name ===
      $("a.turrets.active")
        .text()
        .split(" | ")[0]
    ) {
      currentTurret = tankInfo.turrets[i];
    }
  }

  for (let i in tankInfo.suspensions) {
    if (
      tankInfo.suspensions[i].name ===
      $("a.suspensions.active")
        .text()
        .split(" | ")[0]
    ) {
      currentSuspension = tankInfo.suspensions[i];
    }
  }

  for (let i in tankInfo.engines) {
    if (
      tankInfo.engines[i].name ===
      $("a.engines.active")
        .text()
        .split(" | ")[0]
    ) {
      currentEngine = tankInfo.engines[i];
    }
  }

  for (let i in tankInfo.radios) {
    if (
      tankInfo.radios[i].name ===
      $("a.radios.active")
        .text()
        .split(" | ")[0]
    ) {
      currentRadio = tankInfo.radios[i];
    }
  }

  let aj = new XMLHttpRequest();

  aj.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      tankProfile = JSON.parse(this.responseText);

      if (tankProfile === "None") {
        alert("You cannot create this build! Please try another.");
        createInfo(true);
        return;
      }
      $(".ammo").remove();
      for (let i in tankProfile.ammo) {
        let imgSrc;
        if (tankProfile.ammo[i].type == "ARMOR_PIERCING_CR") {
          imgSrc = "/static/ammo_apcr.png";
        } else if (tankProfile.ammo[i].type == "HIGH_EXPLOSIVE") {
          imgSrc = "/static/ammo_he.png";
        } else if (tankProfile.ammo[i].type == "ARMOR_PIERCING") {
          imgSrc = "/static/ammo_ap.png";
        } else {
          imgSrc = "/static/ammo_heat.png";
        }
        $("#ammo").append(`<div class="col-xs-1 mr-md-3 ammo">
                                        <a href="#/" onclick=selectAmmo(this); id="ammo${i}" class="ammo" data-toggle="tooltip" data-placement="bottom" title="Avg. damage: ${
          tankProfile.ammo[i].damage[1]
        }&#010; Avg. penetration: ${
          tankProfile.ammo[i].penetration[1]
        }"><img src="${imgSrc}" class="rounded mx-auto d-block ammo" alt="Sonar" width="52 px" height="52 px"></a>
                                    </div>`);
      }
      $("#ammo0").addClass("checked");

      $(".optionalDevice").remove();
      $(".improvedEquipment").remove();
      $(".regularConsumables").remove();
      $(".premiumConsumables").remove();
      for (let i in tankProfile.provisions) {
        if (tankProfile.provisions[i].name.indexOf("Camouflage Net") != -1) {
          let imgSrc = tankProfile.provisions[i].image.replace("http", "https");
          $("#optionalDevice")
            .append(`<div class="col-xs-1 mr-md-3 optionalDevice">
                                            <a href="#/" onclick=selectOptionalDevice(this); id="net" class="optionalDevice" addWeigth="${
                                              tankProfile.provisions[i].weight
                                            }" data-toggle="tooltip" data-placement="bottom" title="${
            tankProfile.provisions[i].description
          }"><img src="${imgSrc}" class="rounded mx-auto d-block optionalDevice" alt="Sonar" width="52 px" height="52 px"></a>
                                        </div>`);
        }
        if (tankProfile.provisions[i].name.indexOf("Binocular") != -1) {
          let imgSrc = tankProfile.provisions[i].image.replace("http", "https");
          $("#optionalDevice")
            .append(`<div class="col-xs-1 mr-md-3 optionalDevice">
                                            <a href="#/" onclick=selectOptionalDevice(this); id="binocular" class="optionalDevice" addWeigth="${
                                              tankProfile.provisions[i].weight
                                            }" data-toggle="tooltip" data-placement="bottom" title="${
            tankProfile.provisions[i].description
          }"><img src="${imgSrc}" class="rounded mx-auto d-block optionalDevice" alt="Sonar" width="52 px" height="52 px"></a>
                                        </div>`);
        }
        if (
          tankProfile.provisions[i].name.indexOf("Improved Ventilation") != -1
        ) {
          let imgSrc = tankProfile.provisions[i].image.replace("http", "https");
          $("#optionalDevice")
            .append(`<div class="col-xs-1 mr-md-3 optionalDevice">
                                            <a href="#/" onclick=selectOptionalDevice(this); id="ventilation" class="optionalDevice" addWeigth="${
                                              tankProfile.provisions[i].weight
                                            }" data-toggle="tooltip" data-placement="bottom" title="${
            tankProfile.provisions[i].description
          }"><img src="${imgSrc}" class="rounded mx-auto d-block optionalDevice" alt="Sonar" width="52 px" height="52 px"></a>
                                        </div>`);
        }
        if (tankProfile.provisions[i].name.indexOf("Venting System") != -1) {
          let imgSrc = "/static/Venting-System.png";
          $("#improvedEquipment")
            .append(`<div class="col-xs-1 mr-md-3 improvedEquipment">
                                            <a href="#/" onclick=selectOptionalDevice(this); id="ventingSystem" class="improvedEquipment" addWeigth="${
                                              tankProfile.provisions[i].weight
                                            }" data-toggle="tooltip" data-placement="bottom" title="${
            tankProfile.provisions[i].description
          }"><img src="${imgSrc}" class="rounded mx-auto d-block optionalDevice" alt="Sonar" width="52 px" height="52 px"></a>
                                        </div>`);
        }

        if (tankProfile.provisions[i].description) {
          if (
            tankProfile.provisions[i].description.indexOf(
              "+10% to suspension"
            ) != -1
          ) {
            let imgSrc = tankProfile.provisions[i].image.replace(
              "http",
              "https"
            );
            $("#optionalDevice")
              .append(`<div class="col-xs-1 mr-md-3 optionalDevice">
                                                <a href="#/" onclick=selectOptionalDevice(this); id="optionalSuspension" class="optionalDevice" data-toggle="tooltip" data-placement="bottom" title="${
                                                  tankProfile.provisions[i]
                                                    .description
                                                }"><img src="${imgSrc}" class="rounded mx-auto d-block optionalDevice" alt="Sonar" width="52 px" height="52 px"></a>
                                            </div>`);
          }
        }
        if (tankProfile.provisions[i].description) {
          if (
            tankProfile.provisions[i].description.indexOf(
              "-10% to loading time"
            ) != -1
          ) {
            let imgSrc = tankProfile.provisions[i].image.replace(
              "http",
              "https"
            );
            $("#optionalDevice")
              .append(`<div class="col-xs-1 mr-md-3 optionalDevice">
                                                <a href="#/" onclick=selectOptionalDevice(this); id="rammer" class="optionalDevice" addWeigth="${
                                                  tankProfile.provisions[i]
                                                    .weight
                                                }" data-toggle="tooltip" data-placement="bottom" title="${
              tankProfile.provisions[i].description
            }"><img src="${imgSrc}" class="rounded mx-auto d-block optionalDevice" alt="Sonar" width="52 px" height="52 px"></a>
                                            </div>`);
          }
        }
        if (
          tankProfile.provisions[i].name.indexOf("Innovative Loading System") !=
          -1
        ) {
          let imgSrc = "/static/Innovative-Loading-System.png";
          $("#improvedEquipment")
            .append(`<div class="col-xs-1 mr-md-3 improvedEquipment">
                                            <a href="#/" onclick=selectOptionalDevice(this); id="innovativeLoadingSystem" class="improvedEquipment" addWeigth="${
                                              tankProfile.provisions[i].weight
                                            }" data-toggle="tooltip" data-placement="bottom" title="${
            tankProfile.provisions[i].description
          }"><img src="${imgSrc}" class="rounded mx-auto d-block optionalDevice" alt="Sonar" width="52 px" height="52 px"></a>
                                        </div>`);
        }

        if (
          tankProfile.provisions[i].name.indexOf("Enhanced Gun Laying Drive") !=
          -1
        ) {
          let imgSrc = tankProfile.provisions[i].image.replace("http", "https");
          $("#optionalDevice")
            .append(`<div class="col-xs-1 mr-md-3 optionalDevice">
                                            <a href="#/" onclick=selectOptionalDevice(this); id="gunLayingDrive" class="optionalDevice" addWeigth="${
                                              tankProfile.provisions[i].weight
                                            }" data-toggle="tooltip" data-placement="bottom" title="${
            tankProfile.provisions[i].description
          }"><img src="${imgSrc}" class="rounded mx-auto d-block optionalDevice" alt="Sonar" width="52 px" height="52 px"></a>
                                        </div>`);
        }
        if (
          tankProfile.provisions[i].name.indexOf(
            "Wear-Resistant Gun Laying Drive"
          ) != -1
        ) {
          let imgSrc = "/static/Wear-Resistant-Gun-Laying-Drive.png";
          $("#improvedEquipment")
            .append(`<div class="col-xs-1 mr-md-3 improvedEquipment">
                                            <a href="#/" onclick=selectOptionalDevice(this); id="wearResistantGunLayingDrive" class="improvedEquipment" addWeigth="${
                                              tankProfile.provisions[i].weight
                                            }" data-toggle="tooltip" data-placement="bottom" title="${
            tankProfile.provisions[i].description
          }"><img src="${imgSrc}" class="rounded mx-auto d-block optionalDevice" alt="Sonar" width="52 px" height="52 px"></a>
                                        </div>`);
        }

        if (
          tankProfile.provisions[i].name.indexOf("Vertical Stabilizer") != -1
        ) {
          let imgSrc = tankProfile.provisions[i].image.replace("http", "https");
          $("#optionalDevice")
            .append(`<div class="col-xs-1 mr-md-3 optionalDevice">
                                            <a href="#/" onclick=selectOptionalDevice(this); id="stabilizer" class="optionalDevice" addWeigth="${
                                              tankProfile.provisions[i].weight
                                            }" data-toggle="tooltip" data-placement="bottom" title="${
            tankProfile.provisions[i].description
          }"><img src="${imgSrc}" class="rounded mx-auto d-block optionalDevice" alt="Sonar" width="52 px" height="52 px"></a>
                                        </div>`);
        }
        if (
          tankProfile.provisions[i].name.indexOf(
            "Stabilizing Equipment System"
          ) != -1
        ) {
          let imgSrc = "/static/Stabilizing-Equipment-System.png";
          $("#improvedEquipment")
            .append(`<div class="col-xs-1 mr-md-3 improvedEquipment">
                                            <a href="#/" onclick=selectOptionalDevice(this); id="stabilizingSystem" class="improvedEquipment" addWeigth="${
                                              tankProfile.provisions[i].weight
                                            }" data-toggle="tooltip" data-placement="bottom" title="${
            tankProfile.provisions[i].description
          }"><img src="${imgSrc}" class="rounded mx-auto d-block optionalDevice" alt="Sonar" width="52 px" height="52 px"></a>
                                        </div>`);
        }

        if (tankProfile.provisions[i].name.indexOf("Coated Optics") != -1) {
          let imgSrc = tankProfile.provisions[i].image.replace("http", "https");
          $("#optionalDevice")
            .append(`<div class="col-xs-1 mr-md-3 optionalDevice">
                                            <a href="#/" onclick=selectOptionalDevice(this); id="optics" class="optionalDevice" data-toggle="tooltip" data-placement="bottom" title="${
                                              tankProfile.provisions[i]
                                                .description
                                            }"><img src="${imgSrc}" class="rounded mx-auto d-block optionalDevice" alt="Sonar" width="52 px" height="52 px"></a>
                                        </div>`);
        }
        if (
          tankProfile.provisions[i].name.indexOf("Experimental Optics") != -1
        ) {
          let imgSrc = "/static/Experimental-Optics.png";
          $("#improvedEquipment")
            .append(`<div class="col-xs-1 mr-md-3 improvedEquipment">
                                            <a href="#/" onclick=selectOptionalDevice(this); id="experimentalOptics" class="improvedEquipment" data-toggle="tooltip" data-placement="bottom" title="${
                                              tankProfile.provisions[i]
                                                .description
                                            }"><img src="${imgSrc}" class="rounded mx-auto d-block optionalDevice" alt="Sonar" width="52 px" height="52 px"></a>
                                        </div>`);
        }

        if (
          tankProfile.provisions[i].name.indexOf("Additional Grousers") != -1
        ) {
          let imgSrc = tankProfile.provisions[i].image.replace("http", "https");
          $("#optionalDevice")
            .append(`<div class="col-xs-1 mr-md-3 optionalDevice">
                                            <a href="#/" onclick=selectOptionalDevice(this); id="grousers" class="optionalDevice" addWeigth="${
                                              tankProfile.provisions[i].weight
                                            }" data-toggle="tooltip" data-placement="bottom" title="${
            tankProfile.provisions[i].description
          }"><img src="${imgSrc}" class="rounded mx-auto d-block optionalDevice" alt="Sonar" width="52 px" height="52 px"></a>
                                        </div>`);
        }
        if (tankProfile.provisions[i].name.indexOf("Toolbox") != -1) {
          let imgSrc = tankProfile.provisions[i].image.replace("http", "https");
          $("#optionalDevice")
            .append(`<div class="col-xs-1 mr-md-3 optionalDevice">
                                            <a href="#/" onclick=selectOptionalDevice(this); id="toolbox" class="optionalDevice" addWeigth="${
                                              tankProfile.provisions[i].weight
                                            }" data-toggle="tooltip" data-placement="bottom" title="${
            tankProfile.provisions[i].description
          }"><img src="${imgSrc}" class="rounded mx-auto d-block optionalDevice" alt="Sonar" width="52 px" height="52 px"></a>
                                        </div>`);
        }
        if (
          tankProfile.provisions[i].name.indexOf("Extended Spare Parts Kit") !=
          -1
        ) {
          let imgSrc = "/static/Toolbox.png";
          $("#improvedEquipment")
            .append(`<div class="col-xs-1 mr-md-3 improvedEquipment">
                                            <a href="#/" onclick=selectOptionalDevice(this); id="extendedToolbox" class="improvedEquipment" addWeigth="${
                                              tankProfile.provisions[i].weight
                                            }" data-toggle="tooltip" data-placement="bottom" title="${
            tankProfile.provisions[i].description
          }"><img src="${imgSrc}" class="rounded mx-auto d-block optionalDevice" alt="Sonar" width="52 px" height="52 px"></a>
                                        </div>`);
        }
        if (tankProfile.provisions[i].name.indexOf("Small Repair Kit") != -1) {
          let imgSrc = tankProfile.provisions[i].image.replace("http", "https");
          $("#regularConsumables")
            .append(`<div class="col-xs-1 mr-md-3 regularConsumables">
                                            <a href="#/" onclick=selectConsumable(this); id="repearKit" class="regularConsumables" data-toggle="tooltip" data-placement="bottom" title="${
                                              tankProfile.provisions[i]
                                                .description
                                            }"><img src="${imgSrc}" class="rounded mx-auto d-block consumables" alt="Sonar" width="52 px" height="52 px"></a>
                                        </div>`);
        }
        if (
          tankProfile.provisions[i].name.indexOf("Small First Aid Kit") != -1
        ) {
          let imgSrc = tankProfile.provisions[i].image.replace("http", "https");
          $("#regularConsumables")
            .append(`<div class="col-xs-1 mr-md-3 regularConsumables">
                                            <a href="#/" onclick=selectConsumable(this); id="aidKit" class="regularConsumables" data-toggle="tooltip" data-placement="bottom" title="${
                                              tankProfile.provisions[i]
                                                .description
                                            }"><img src="${imgSrc}" class="rounded mx-auto d-block consumables" alt="Sonar" width="52 px" height="52 px"></a>
                                        </div>`);
        }
        if (
          tankProfile.provisions[i].name.indexOf("Manual Fire Extinguisher") !=
          -1
        ) {
          let imgSrc = tankProfile.provisions[i].image.replace("http", "https");
          $("#regularConsumables")
            .append(`<div class="col-xs-1 mr-md-3 regularConsumables">
                                            <a href="#/" onclick=selectConsumable(this); id="extinguisherst" class="regularConsumables" data-toggle="tooltip" data-placement="bottom" title="${
                                              tankProfile.provisions[i]
                                                .description
                                            }"><img src="${imgSrc}" class="rounded mx-auto d-block consumables" alt="Sonar" width="52 px" height="52 px"></a>
                                        </div>`);
        }
        if (
          tankProfile.provisions[i].name.indexOf("100-octane Gasoline") != -1
        ) {
          let imgSrc = tankProfile.provisions[i].image.replace("http", "https");
          $("#regularConsumables")
            .append(`<div class="col-xs-1 mr-md-3 regularConsumables">
                                            <a href="#/" onclick=selectConsumable(this); id="100octaneGasoline" class="regularConsumables" data-toggle="tooltip" data-placement="bottom" title="${
                                              tankProfile.provisions[i]
                                                .description
                                            }"><img src="${imgSrc}" class="rounded mx-auto d-block consumables" alt="Sonar" width="52 px" height="52 px"></a>
                                        </div>`);
        }
        if (tankProfile.provisions[i].name.indexOf("Oil") != -1) {
          let imgSrc = tankProfile.provisions[i].image.replace("http", "https");
          $("#regularConsumables")
            .append(`<div class="col-xs-1 mr-md-3 regularConsumables">
                                            <a href="#/" onclick=selectConsumable(this); id="oil" class="regularConsumables" data-toggle="tooltip" data-placement="bottom" title="${
                                              tankProfile.provisions[i]
                                                .description
                                            }"><img src="${imgSrc}" class="rounded mx-auto d-block consumables" alt="Sonar" width="52 px" height="52 px"></a>
                                        </div>`);
        }
        if (tankProfile.provisions[i].name.indexOf("Large Repair Kit") != -1) {
          let imgSrc = tankProfile.provisions[i].image.replace("http", "https");
          $("#premiumConsumables")
            .append(`<div class="col-xs-1 mr-md-3 premiumConsumables">
                                            <a href="#/" onclick=selectConsumable(this); id="largeRepearKit" class="premiumConsumables" data-toggle="tooltip" data-placement="bottom" title="${
                                              tankProfile.provisions[i]
                                                .description
                                            }"><img src="${imgSrc}" class="rounded mx-auto d-block consumables" alt="Sonar" width="52 px" height="52 px"></a>
                                        </div>`);
        }
        if (
          tankProfile.provisions[i].name.indexOf("Large First Aid Kit") != -1
        ) {
          let imgSrc = tankProfile.provisions[i].image.replace("http", "https");
          $("#premiumConsumables")
            .append(`<div class="col-xs-1 mr-md-3 premiumConsumables">
                                            <a href="#/" onclick=selectConsumable(this); id="largeAidKit" class="premiumConsumables" data-toggle="tooltip" data-placement="bottom" title="${
                                              tankProfile.provisions[i]
                                                .description
                                            }"><img src="${imgSrc}" class="rounded mx-auto d-block consumables" alt="Sonar" width="52 px" height="52 px"></a>
                                        </div>`);
        }
        if (
          tankProfile.provisions[i].name.indexOf(
            "Automatic Fire Extinguisher"
          ) != -1
        ) {
          let imgSrc = tankProfile.provisions[i].image.replace("http", "https");
          $("#premiumConsumables")
            .append(`<div class="col-xs-1 mr-md-3 premiumConsumables">
                                            <a href="#/" onclick=selectConsumable(this); id="automaticFire" class="premiumConsumables" data-toggle="tooltip" data-placement="bottom" title="${
                                              tankProfile.provisions[i]
                                                .description
                                            }"><img src="${imgSrc}" class="rounded mx-auto d-block consumables" alt="Sonar" width="52 px" height="52 px"></a>
                                        </div>`);
        }
        if (
          tankProfile.provisions[i].name.indexOf("105-octane Gasoline") != -1
        ) {
          let imgSrc = tankProfile.provisions[i].image.replace("http", "https");
          $("#premiumConsumables")
            .append(`<div class="col-xs-1 mr-md-3 premiumConsumables">
                                            <a href="#/" onclick=selectConsumable(this); id="105octaneGasoline" class="premiumConsumables" data-toggle="tooltip" data-placement="bottom" title="${
                                              tankProfile.provisions[i]
                                                .description
                                            }"><img src="${imgSrc}" class="rounded mx-auto d-block consumables" alt="Sonar" width="52 px" height="52 px"></a>
                                        </div>`);
        }
        if (tankProfile.provisions[i].description) {
          if (
            tankProfile.provisions[i].description.indexOf(
              "+10% to all crew skills and perks"
            ) != -1
          ) {
            let imgSrc = tankProfile.provisions[i].image.replace(
              "http",
              "https"
            );
            $("#premiumConsumables")
              .append(`<div class="col-xs-1 mr-md-3 premiumConsumables">
                                                <a href="#/" onclick=selectConsumable(this); id="food" class="premiumConsumables" data-toggle="tooltip" data-placement="bottom" title="${
                                                  tankProfile.provisions[i]
                                                    .description
                                                }"><img src="${imgSrc}" class="rounded mx-auto d-block consumables" alt="Sonar" width="52 px" height="52 px"></a>
                                            </div>`);
          }
        }
        if (
          tankProfile.provisions[i].name.indexOf("Removed Speed Governor") != -1
        ) {
          let imgSrc = tankProfile.provisions[i].image.replace("http", "https");
          $("#premiumConsumables")
            .append(`<div class="col-xs-1 mr-md-3 premiumConsumables">
                                            <a href="#/" onclick=selectConsumable(this); id="governor" class="premiumConsumables" data-toggle="tooltip" data-placement="bottom" title="${
                                              tankProfile.provisions[i]
                                                .description
                                            }"><img src="${imgSrc}" class="rounded mx-auto d-block consumables" alt="Sonar" width="52 px" height="52 px"></a>
                                        </div>`);
        }
      }

      createInfo(true);
    }
  };
  aj.open(
    "GET",
    "/getprofile?tank_id=" +
      tankInfo.id_tank +
      "&gun_id=" +
      currentGun.module_id +
      "&suspension_id=" +
      currentSuspension.module_id +
      "&turret_id=" +
      currentTurret.module_id +
      "&radio_id=" +
      currentRadio.module_id +
      "&engine_id=" +
      currentEngine.module_id,
    true
  );
  aj.send();
  $(".spiner").html(` <div class="spinner-border text-primary" role="status">
                            <span class="sr-only">Loading...</span>
                        </div>`);
}

function createInfo(reload) {
  if (reload) {
    $(".perks").removeClass("checked");
    optionalDeviceSlots = 3;
    consumableSlots = 3;
  }

  let brothers = 0;
  let eagle = 1;
  let boffin = 1;
  let ace = 1;
  let master = 1;
  let sonar = 1;
  let ventilation = 0;
  let binocular = 1;
  let additionalWeight = 0;
  let optionalSuspension = 1;
  let rammer = 1;
  let gunLayingDrive = 1;
  let grousers = 1;
  let gasoline = 1;
  let food = 0;
  let oil = 1;
  let governor = 1;

  if ($("#brothers").is(".checked")) {
    brothers = 5;
  }
  if ($("#eagle").is(".checked")) {
    eagle = 1.02;
  }

  if ($("#grousers").is(".checked")) {
    additionalWeight += Number($("#grousers").attr("addWeigth"));
    grousers = 1.04864;
  }
  if ($("#stabilizer").is(".checked")) {
    additionalWeight += Number($("#stabilizer").attr("addWeigth"));
    $("#stabilizingSystem").removeAttr("onclick");
    $("#stabilizingSystem").addClass("disabled");
    $("img", $("#stabilizingSystem")).addClass("opacityLow");
  } else {
    $("#stabilizingSystem").removeClass("disabled");
  }
  if ($("#stabilizingSystem").is(".checked")) {
    additionalWeight += Number($("#stabilizingSystem").attr("addWeigth"));
    $("#stabilizer").removeAttr("onclick");
    $("#stabilizer").addClass("disabled");
    $("img", $("#stabilizer")).addClass("opacityLow");
  } else {
    $("#stabilizer").removeClass("disabled");
  }
  if ($("#net").is(".checked")) {
    additionalWeight += Number($("#net").attr("addWeigth"));
  }
  if ($("#toolbox").is(".checked")) {
    additionalWeight += Number($("#toolbox").attr("addWeigth"));
    $("#extendedToolbox").removeAttr("onclick");
    $("#extendedToolbox").addClass("disabled");
    $("img", $("#extendedToolbox")).addClass("opacityLow");
  } else {
    $("#extendedToolbox").removeClass("disabled");
  }
  if ($("#extendedToolbox").is(".checked")) {
    additionalWeight += Number($("#extendedToolbox").attr("addWeigth"));
    $("#toolbox").removeAttr("onclick");
    $("#toolbox").addClass("disabled");
    $("img", $("#toolbox")).addClass("opacityLow");
  } else {
    $("#toolbox").removeClass("disabled");
  }
  if ($("#ventilation").is(".checked")) {
    ventilation = 5;
    additionalWeight += Number($("#ventilation").attr("addWeigth"));
    $("#ventingSystem").removeAttr("onclick");
    $("#ventingSystem").addClass("disabled");
    $("img", $("#ventingSystem")).addClass("opacityLow");
  } else {
    $("#ventingSystem").removeClass("disabled");
  }
  if ($("#ventingSystem").is(".checked")) {
    ventilation = 7.5;
    additionalWeight += Number($("#ventingSystem").attr("addWeigth"));
    $("#ventilation").removeAttr("onclick");
    $("#ventilation").addClass("disabled");
    $("img", $("#ventilation")).addClass("opacityLow");
  } else {
    $("#ventilation").removeClass("disabled");
  }
  if ($("#optics").is(".checked")) {
    binocular = 1.1;
    $("#experimentalOptics").removeAttr("onclick");
    $("#experimentalOptics").addClass("disabled");
    $("img", $("#experimentalOptics")).addClass("opacityLow");
  } else {
    $("#experimentalOptics").removeClass("disabled");
  }
  if ($("#experimentalOptics").is(".checked")) {
    binocular = 1.125;
    $("#optics").removeAttr("onclick");
    $("#optics").addClass("disabled");
    $("img", $("#optics")).addClass("opacityLow");
  } else {
    $("#optics").removeClass("disabled");
  }

  if ($("#binocular").is(".checked")) {
    binocular = 1.25;
    additionalWeight += Number($("#binocular").attr("addWeigth"));
  }
  if ($("#optionalSuspension").is(".checked")) {
    optionalSuspension = 1.1;
  }
  if ($("#rammer").is(".checked")) {
    rammer = 0.9;
    additionalWeight += Number($("#rammer").attr("addWeigth"));
    $("#innovativeLoadingSystem").removeAttr("onclick");
    $("#innovativeLoadingSystem").addClass("disabled");
    $("img", $("#innovativeLoadingSystem")).addClass("opacityLow");
  } else {
    $("#innovativeLoadingSystem").removeClass("disabled");
  }
  if ($("#innovativeLoadingSystem").is(".checked")) {
    rammer = 0.875;
    additionalWeight += Number($("#innovativeLoadingSystem").attr("addWeigth"));
    $("#rammer").removeAttr("onclick");
    $("#rammer").addClass("disabled");
    $("img", $("#rammer")).addClass("opacityLow");
  } else {
    $("#rammer").removeClass("disabled");
  }
  if ($("#gunLayingDrive").is(".checked")) {
    gunLayingDrive = 1.1;
    additionalWeight += Number($("#gunLayingDrive").attr("addWeigth"));
    $("#wearResistantGunLayingDrive").removeAttr("onclick");
    $("#wearResistantGunLayingDrive").addClass("disabled");
    $("img", $("#wearResistantGunLayingDrive")).addClass("opacityLow");
  } else {
    $("#wearResistantGunLayingDrive").removeClass("disabled");
  }
  if ($("#wearResistantGunLayingDrive").is(".checked")) {
    gunLayingDrive = 1.125;
    additionalWeight += Number(
      $("#wearResistantGunLayingDrive").attr("addWeigth")
    );
    $("#gunLayingDrive").removeAttr("onclick");
    $("#gunLayingDrive").addClass("disabled");
    $("img", $("#gunLayingDrive")).addClass("opacityLow");
  } else {
    $("#gunLayingDrive").removeClass("disabled");
  }
  if ($("#100octaneGasoline").is(".checked")) {
    gasoline = 1.05;
    $("#105octaneGasoline").removeAttr("onclick");
    $("#105octaneGasoline").addClass("disabled");
    $("img", $("#105octaneGasoline")).addClass("opacityLow");
  } else {
    $("#105octaneGasoline").removeClass("disabled");
  }
  if ($("#105octaneGasoline").is(".checked")) {
    gasoline = 1.1;
    $("#100octaneGasoline").removeAttr("onclick");
    $("#100octaneGasoline").addClass("disabled");
    $("img", $("#100octaneGasoline")).addClass("opacityLow");
  } else {
    $("#100octaneGasoline").removeClass("disabled");
  }
  if ($("#repearKit").is(".checked")) {
    $("#largeRepearKit").removeAttr("onclick");
    $("#largeRepearKit").addClass("disabled");
    $("img", $("#largeRepearKit")).addClass("opacityLow");
  } else {
    $("#largeRepearKit").removeClass("disabled");
  }
  if ($("#largeRepearKit").is(".checked")) {
    $("#repearKit").removeAttr("onclick");
    $("#repearKit").addClass("disabled");
    $("img", $("#repearKit")).addClass("opacityLow");
  } else {
    $("#repearKit").removeClass("disabled");
  }
  if ($("#aidKit").is(".checked")) {
    $("#largeAidKit").removeAttr("onclick");
    $("#largeAidKit").addClass("disabled");
    $("img", $("#largeAidKit")).addClass("opacityLow");
  } else {
    $("#largeAidKit").removeClass("disabled");
  }
  if ($("#largeAidKit").is(".checked")) {
    $("#aidKit").removeAttr("onclick");
    $("#aidKit").addClass("disabled");
    $("img", $("#aidKit")).addClass("opacityLow");
  } else {
    $("#aidKit").removeClass("disabled");
  }
  if ($("#extinguisherst").is(".checked")) {
    $("#automaticFire").removeAttr("onclick");
    $("#automaticFire").addClass("disabled");
    $("img", $("#automaticFire")).addClass("opacityLow");
  } else {
    $("#automaticFire").removeClass("disabled");
  }
  if ($("#automaticFire").is(".checked")) {
    $("#extinguisherst").removeAttr("onclick");
    $("#extinguisherst").addClass("disabled");
    $("img", $("#extinguisherst")).addClass("opacityLow");
  } else {
    $("#extinguisherst").removeClass("disabled");
  }
  if ($("#food").is(".checked")) {
    food = 10;
  }
  if ($("#oil").is(".checked")) {
    oil = 1.05;
  }
  if ($("#governor").is(".checked")) {
    governor = 1.1;
  }
  let tankWeight = tankProfile.weight + additionalWeight;
  let tankMaxWeight = tankProfile.max_weight * optionalSuspension;

  $.each(
    $("a.optionalDevice")
      .not(".checked")
      .not(".disabled"),
    function() {
      if (
        $(this).attr("addWeigth") != undefined &&
        Number($(this).attr("addWeigth")) + tankWeight > tankMaxWeight
      ) {
        $(this).removeAttr("onclick");
        $("img", this).addClass("redBackground");
      } else if ($(this).attr("addWeigth") != undefined) {
        $(this).attr("onclick", "selectOptionalDevice(this);");
        $("img", this).removeClass("redBackground");
      }
    }
  );
  $.each(
    $("a.improvedEquipment")
      .not(".checked")
      .not(".disabled"),
    function() {
      if (
        $(this).attr("addWeigth") != undefined &&
        Number($(this).attr("addWeigth")) + tankWeight > tankMaxWeight
      ) {
        $(this).removeAttr("onclick");
        $("img", this).addClass("redBackground");
      } else if ($(this).attr("addWeigth") != undefined) {
        $(this).attr("onclick", "selectOptionalDevice(this);");
        $("img", this).removeClass("redBackground");
      }
    }
  );

  let comanderLvl =
    Number($("#crewRange").val()) + ventilation + brothers + food;
  let crewLvl = comanderLvl + 5 + 0.1 * (comanderLvl - 50);
  let crewLvlMul = 0.875 / (0.00375 * crewLvl + 0.5);
  let comanderLvlMul = 0.875 / (0.00375 * comanderLvl + 0.5);
  let gunnerMul;
  let loaderMul;
  let radiomanMul;
  let driverMul;
  let gunnerMulBase;
  let loaderMulBase;
  let radiomanMulBase;
  let driverMulBase;

  if (comanderLvl < 100) {
    $("p.perks").text(
      "You only can use Perks when your crew are 100 or higher!"
    );
    $("a.perks").removeAttr("onclick");
    $("img.perks").addClass("opacityLow");
  } else {
    $("p.perks").text("");
    $("a.perks").attr("onclick", "selectPerk(this);");
    $("img.perks").removeClass("opacityLow");
  }

  if (tankInfo.crew[0].roles.search("Gunner") != -1) {
    gunnerMul = comanderLvlMul;
    gunnerMulBase = 1;
  } else {
    gunnerMul = crewLvlMul;
    gunnerMulBase = 1.043;
  }
  if (tankInfo.crew[0].roles.search("Loader") != -1) {
    loaderMul = comanderLvlMul;
    loaderMulBase = 1;
  } else {
    loaderMul = crewLvlMul;
    loaderMulBase = 1.043;
  }
  if (tankInfo.crew[0].roles.search("Radio Operator") != -1) {
    radiomanMul = comanderLvlMul;
    radiomanMulBase = 1;
    if ($("#boffin").is(".checked")) {
      boffin = 1 + 0.002 * comanderLvl;
    }
    if ($("#sonar").is(".checked")) {
      sonar = 1 + 0.0003 * comanderLvl;
    }
  } else {
    radiomanMul = crewLvlMul;
    radiomanMulBase = 1.043;
    if ($("#boffin").is(".checked")) {
      boffin = 1 + 0.002 * crewLvl;
    }
    if ($("#sonar").is(".checked")) {
      sonar = 1 + 0.0003 * crewLvl;
    }
  }

  if (tankInfo.crew[0].roles.search("Driver") != -1) {
    driverMul = comanderLvlMul;
    driverMulBase = 1;
    if ($("#ace").is(".checked")) {
      ace = 1 + 0.0005 * comanderLvl;
    }
    if ($("#master").is(".checked")) {
      master = 1 + 0.0004358 * comanderLvl;
    }
  } else {
    driverMul = crewLvlMul;
    driverMulBase = 1.043;
    if ($("#ace").is(".checked")) {
      ace = 1 + 0.0005 * crewLvl;
    }
    if ($("#master").is(".checked")) {
      master = 1 + 0.0004358 * crewLvl;
    }
  }
  $("#crewLvl").text(
    `Comander level: ${comanderLvl} Crew level: ${crewLvl.toFixed(0)}`
  );
  for (let i in tankProfile.ammo) {
    if ($(`#ammo${i}`).is(".checked")) {
      currentAmmo = tankProfile.ammo[i];
    }
  }

  $("#optionalDeviceSlots").text(optionalDeviceSlots);
  $("#consumableSlots").text(consumableSlots);

  let avrDmg = currentAmmo.damage;
  let avrPen = currentAmmo.penetration;

  $("#gunCol1").html(`<div class="text-right font-weight-bold">${
    tankProfile.gun.name
  }</div>
                        <div class="text-right"><span class="bold">Tier:</span> ${
                          tankProfile.gun.tier
                        } lvl</div>
                        <div class="text-right"><span class="bold">Damage (min/avg/max):</span> </div>
                        <div class="text-right">${avrDmg[0]}/${avrDmg[1]}/${
    avrDmg[2]
  } HP</div>
                        <div class="text-right"><span class="bold">Penetration (min/avg/max):</span> </div>
                        <div class="text-right">${avrPen[0]}/${avrPen[1]}/${
    avrPen[2]
  } mm</div>
                        <div class="text-right"><span class="bold">Weight:</span> ${
                          tankProfile.gun.weight
                        } kg</div>`);

  if (tankInfo.turret_id === 0) {
    $("#turretCol1").html(`<div class="text-right font-weight-bold">${
      tankProfile.turret.name
    }</div>
                            <div class="text-right"><span class="bold">Tier:</span> ${
                              tankProfile.turret.tier
                            } lvl</div>
                            <div class="text-right"><span class="bold">View range:</span> ${
                              tankProfile.turret.view_range
                            } m</div>
                            <div class="text-right"><span class="bold">Weight:</span> ${
                              tankProfile.turret.weight
                            } kg</div>`);
  } else {
    $("#turretCol1").html(`<div class="text-right font-weight-bold">${
      tankProfile.turret.name
    }</div>
                            <div class="text-right"><span class="bold">Tier:</span> ${
                              tankProfile.turret.tier
                            } lvl</div>
                            <div class="text-right"><span class="bold">View range:</span> ${
                              tankProfile.turret.view_range
                            } m</div>
                            <div class="text-right"><span class="bold">Armor (front/sides/rear):</span> </div>
                            <div class="text-right">${
                              tankProfile.armor.turret.front
                            }/${tankProfile.armor.turret.sides}/${
      tankProfile.armor.turret.rear
    } mm</div>
                            <div class="text-right"><span class="bold">Weight:</span> ${
                              tankProfile.turret.weight
                            } kg</div>`);
  }

  $("#suspensionCol1").html(`<div class="text-right font-weight-bold">${
    tankProfile.suspension.name
  }</div>
                        <div class="text-right"><span class="bold">Tier:</span> ${
                          tankProfile.suspension.tier
                        } lvl</div>
                        <div class="text-right"><span class="bold">Traverse speed:</span> ${
                          tankProfile.suspension.traverse_speed
                        } deg/s</div>
                        <div class="text-right"><span class="bold">Load limit:</span> ${
                          tankProfile.suspension.load_limit
                        } kg</div>
                        <div class="text-right"><span class="bold">Weight:</span> ${
                          tankProfile.suspension.weight
                        } kg</div>`);

  $("#engineCol1").html(`<div class="text-right font-weight-bold">${
    tankProfile.engine.name
  }</div>
                        <div class="text-right"><span class="bold">Tier:</span> ${
                          tankProfile.engine.tier
                        } lvl</div>
                        <div class="text-right"><span class="bold">Power:</span> ${
                          tankProfile.engine.power
                        } h.p.</div>
                        <div class="text-right"><span class="bold">Fire chance:</span> ${tankProfile
                          .engine.fire_chance * 100} %</div>
                        <div class="text-right"><span class="bold">Weight:</span> ${
                          tankProfile.engine.weight
                        } kg</div>`);

  $("#radioCol1").html(`<div class="text-right font-weight-bold">${
    tankProfile.radio.name
  }</div>
                        <div class="text-right"><span class="bold">Tier:</span> ${
                          tankProfile.radio.tier
                        } lvl</div>
                        <div class="text-right"><span class="bold">Signal range:</span> ${
                          tankProfile.radio.signal_range
                        } m</div>
                        <div class="text-right"><span class="bold">Weight:</span> ${
                          tankProfile.radio.weight
                        } kg</div>`);

  //Creating info
  $("#tankParams h1").text(tankInfo.name);
  $("#tankImg").attr("src", tankInfo.images.replace("http", "https"));
  $(".description").text(tankInfo.description);
  $("#gunImg").attr(
    "src",
    "https://api.worldoftanks.ru/static/2.65.3/wot/encyclopedia/module/ico-guns.gif"
  );
  $("#turretImg").attr(
    "src",
    "https://api.worldoftanks.ru/static/2.65.0/wot/encyclopedia/module/ico-head.gif"
  );
  $("#susImg").attr(
    "src",
    "https://api.worldoftanks.ru/static/2.65.0/wot/encyclopedia/module/ico-transm.gif"
  );
  $("#engineImg").attr(
    "src",
    "https://api.worldoftanks.ru/static/2.65.0/wot/encyclopedia/module/ico-engine.gif"
  );
  $("#radioImg").attr(
    "src",
    "https://api.worldoftanks.ru/static/2.65.0/wot/encyclopedia/module/ico-radio.gif"
  );

  //Creating table
  //Common info
  $("#tableCommon thead").html("");
  $("#tableCommon thead").append(`
                                    <tr>
                                        <th colspan="2">Common info</th>
                                    </tr>`);

  $("#tableCommon tbody").html("");
  if (tankInfo.nation[0] == "u") {
    insertRow("tableCommon", "Nation", tankInfo.nation.toUpperCase());
  } else {
    insertRow(
      "tableCommon",
      "Nation",
      tankInfo.nation[0].toUpperCase() + tankInfo.nation.slice(1)
    );
  }
  if (tankInfo.is_premium) {
    insertRow(
      "tableCommon",
      "Tier",
      `${tankInfo.lvl} lvl <span class="premium">Premium tank</span>`
    );
  } else {
    insertRow("tableCommon", "Tier", `${tankInfo.lvl} lvl`);
  }
  if (tankInfo.type.indexOf("Tank") === -1) {
    insertRow(
      "tableCommon",
      "Type",
      tankInfo.type[0].toUpperCase() + tankInfo.type.slice(1)
    );
  } else {
    insertRow(
      "tableCommon",
      "Type",
      tankInfo.type[0].toUpperCase() +
        tankInfo.type.slice(1, tankInfo.type.indexOf("Tank")) +
        " " +
        tankInfo.type.slice(tankInfo.type.indexOf("T")).toLowerCase()
    );
  }
  if (tankInfo.price_credit != 0) {
    insertRow("tableCommon", "Price credit", tankInfo.price_credit);
  } else if (tankInfo.price_gold != 0) {
    insertRow("tableCommon", "Price gold", tankInfo.price_gold);
  }
  if (tankInfo.prices_xp != 0) {
    insertRow("tableCommon", "Price experience", tankInfo.prices_xp);
  }

  $("#tableCommon tbody").append(`<tr id="crewRow">
                                        <th rowspan="${
                                          tankInfo.crew.length
                                        }" scope="row" style="vertical-align: middle;">
                                            Crew (${tankInfo.crew.length})
                                        </th><td>${
                                          tankInfo.crew[0].roles
                                        }</td></tr>`);
  for (let i in tankInfo.crew) {
    if (i != 0) {
      $("#crewRow").after(
        `<tr><td class="crewRow">${tankInfo.crew[i].roles}</td></tr>`
      );
    }
  }
  $("#tableCommon tbody").append(`</td></tr>`);

  //Firepower info
  $("#tableFirepower thead").html("");
  $("#tableFirepower thead").append(`
                                    <tr>
                                        <th colspan="2">Firepower</th>
                                    </tr>`);

  $("#tableSurvivability thead").html("");
  $("#tableSurvivability thead").append(`
                                    <tr>
                                        <th colspan="2">Survivability</th>
                                    </tr>`);

  $("#tableMobility thead").html("");
  $("#tableMobility thead").append(`
                                    <tr>
                                        <th colspan="2">Mobility</th>
                                    </tr>`);

  $("#tableSpotting thead").html("");
  $("#tableSpotting thead").append(`
                                    <tr>
                                        <th colspan="2">Spotting</th>
                                    </tr>`);

  $("#tableFirepower tbody").html("");
  $("#tableSurvivability tbody").html("");
  $("#tableMobility tbody").html("");
  $("#tableSpotting tbody").html("");

  insertRow("tableFirepower", "Avg. dmg. per shot", `${avrDmg[1]} HP`);
  insertRow("tableFirepower", "Avg. penetration", `${avrPen[1]} mm`);
  if (currentAmmo.stun != null) {
    insertRow(
      "tableFirepower",
      "Min. stun duration",
      `${currentAmmo.stun.duration[0]} s`
    );
    insertRow(
      "tableFirepower",
      "Max. stun duration",
      `${currentAmmo.stun.duration[1]} s`
    );
  }

  let rateFire = (tankProfile.gun.fire_rate / rammer / loaderMul).toFixed(2);
  insertRow(
    "tableFirepower",
    "Rate on fire",
    `${rateFire} <span id="notBaseROF"></span> rounds/min`
  );
  insertRow(
    "tableFirepower",
    "Reload time",
    `${(tankProfile.gun.reload_time * rammer * loaderMul).toFixed(
      2
    )} <span id="notBaseReload"></span> s`
  );
  if (tankInfo.turret_id === 0) {
    insertRow(
      "tableFirepower",
      "Gun traverse speed",
      `${((tankProfile.gun.traverse_speed * gasoline) / gunnerMul).toFixed(
        2
      )} <span id="notBaseGunTraverse"></span> deg/s`
    );
  } else {
    insertRow(
      "tableFirepower",
      "Gun traverse speed",
      `${((tankProfile.turret.traverse_speed * gasoline) / gunnerMul).toFixed(
        2
      )} <span id="notBaseGunTraverse"></span> deg/s`
    );
  }
  insertRow(
    "tableFirepower",
    "Gun depression/elevation angle",
    `-${tankProfile.gun.move_down_arc} / ${
      tankProfile.gun.move_up_arc
    } <span id=""></span> deg`
  );
  insertRow(
    "tableFirepower",
    "Aiming time",
    `${((tankProfile.gun.aim_time * gunnerMul) / gunLayingDrive).toFixed(
      2
    )} <span id="notBaseAim"></span> s`
  );
  insertRow(
    "tableFirepower",
    "Dispersion at 100 m",
    `${(tankProfile.gun.dispersion * gunnerMul).toFixed(
      2
    )} <span id="notBaseDispersion"></span> m`
  );
  insertRow(
    "tableFirepower",
    "Average damage per minute",
    `${(avrDmg[1] * rateFire).toFixed(2)} <span id="notBaseDPM"></span> HP/min`
  );

  insertRow(
    "tableSurvivability",
    "Hit points",
    `${tankProfile.turret.hp + tankProfile.hull_hp} <span id=""></span> HP`
  );
  insertRow(
    "tableSurvivability",
    "Hull armor",
    `${tankProfile.armor.hull.front} / ${tankProfile.armor.hull.sides} / ${
      tankProfile.armor.hull.rear
    } <span id=""></span> front/sides/rear mm`
  );
  if (tankInfo.turret_id != 0) {
    insertRow(
      "tableSurvivability",
      "Turret armor",
      `${tankProfile.armor.turret.front} / ${
        tankProfile.armor.turret.sides
      } / ${
        tankProfile.armor.turret.rear
      } <span id=""></span> front/sides/rear mm`
    );
  }

  insertRow("tableMobility", "Weight", `${(tankWeight / 1000).toFixed(2)} t`);
  insertRow(
    "tableMobility",
    "Load limit",
    `${(tankMaxWeight / 1000).toFixed(2)} <span id="notBaseLoadLimit"></span> t`
  );
  insertRow(
    "tableMobility",
    "Engine power",
    `${(tankProfile.engine.power * gasoline * oil * governor).toFixed(
      2
    )} <span id="notBaseEngine"></span> h.p.`
  );
  insertRow(
    "tableMobility",
    "Specific power",
    `${(
      (tankProfile.engine.power * gasoline * oil * governor) /
      (tankWeight / 1000)
    ).toFixed(2)} <span id="notBasePower"></span> h.p.`
  );
  insertRow(
    "tableMobility",
    "Top speed/reverse speed",
    `${tankProfile.speed_forward}/${tankProfile.speed_backward} km/h`
  );
  insertRow(
    "tableMobility",
    "Traverce speed",
    `${(
      (tankProfile.suspension.traverse_speed * ace * master * grousers) /
      driverMul
    ).toFixed(2)} <span id="notBaseTraverse"></span> deg/s`
  );

  insertRow(
    "tableSpotting",
    "View range",
    `${(
      (tankProfile.turret.view_range * eagle * sonar * binocular) /
      comanderLvlMul
    ).toFixed(2)} <span id="notBaseView"></span> m`
  );
  insertRow(
    "tableSpotting",
    "Signal range",
    `${((tankProfile.radio.signal_range * boffin) / radiomanMul).toFixed(
      2
    )} <span id="notBaseSignal"></span> m`
  );

  if (
    comanderLvl != 100 ||
    brothers != 0 ||
    gasoline != 1 ||
    oil != 1 ||
    governor != 1
  ) {
    let sum = (
      tankProfile.gun.dispersion * gunnerMul -
      tankProfile.gun.dispersion / gunnerMulBase
    ).toFixed(2);
    if (sum > 0) {
      $("#notBaseDispersion").css("color", "red");
      $("#notBaseDispersion").text(`(+${sum})`);
    } else if (sum < 0) {
      $("#notBaseDispersion").css("color", "green");
      $("#notBaseDispersion").text(`(${sum})`);
    }
    sum = (
      tankProfile.engine.power * gasoline * oil * governor -
      tankProfile.engine.power.toFixed(2)
    ).toFixed(2);
    if (sum < 0) {
      $("#notBaseEngine").css("color", "red");
      $("#notBaseEngine").text(`(+${sum})`);
    } else if (sum > 0) {
      $("#notBaseEngine").css("color", "green");
      $("#notBaseEngine").text(`(${sum})`);
    }
    sum = (
      (tankProfile.engine.power * gasoline * oil * governor) /
        (tankWeight / 1000) -
      (tankProfile.engine.power / (tankWeight / 1000)).toFixed(2)
    ).toFixed(2);
    if (sum < 0) {
      $("#notBasePower").css("color", "red");
      $("#notBasePower").text(`(+${sum})`);
    } else if (sum > 0) {
      $("#notBasePower").css("color", "green");
      $("#notBasePower").text(`(${sum})`);
    }
    if (tankInfo.turret_id === 0) {
      sum = (
        (tankProfile.gun.traverse_speed * gasoline) / gunnerMul -
        tankProfile.gun.traverse_speed * gunnerMulBase
      ).toFixed(2);
    } else {
      sum = (
        (tankProfile.turret.traverse_speed * gasoline) / gunnerMul -
        tankProfile.turret.traverse_speed * gunnerMulBase
      ).toFixed(2);
    }
    if (sum > 0) {
      $("#notBaseGunTraverse").css("color", "green");
      $("#notBaseGunTraverse").text(`(+${sum})`);
    } else if (sum < 0) {
      $("#notBaseGunTraverse").css("color", "red");
      $("#notBaseGunTraverse").text(`(${sum})`);
    }
  }
  if (comanderLvl != 100 || brothers != 0 || rammer != 1) {
    let sum = (
      tankProfile.gun.fire_rate / rammer / loaderMul -
      tankProfile.gun.fire_rate * loaderMulBase
    ).toFixed(2);
    if (sum >= 0) {
      $("#notBaseROF").css("color", "green");
      $("#notBaseROF").text(`(+${sum})`);
    } else {
      $("#notBaseROF").css("color", "red");
      $("#notBaseROF").text(`(${sum})`);
    }
    sum = (
      tankProfile.gun.reload_time * rammer * loaderMul -
      tankProfile.gun.reload_time / loaderMulBase
    ).toFixed(2);
    if (sum >= 0) {
      $("#notBaseReload").css("color", "red");
      $("#notBaseReload").text(`(+${sum})`);
    } else {
      $("#notBaseReload").css("color", "green");
      $("#notBaseReload").text(`(${sum})`);
    }
    sum = (
      (avrDmg[1] * tankProfile.gun.fire_rate) / rammer / loaderMul -
      avrDmg[1] * tankProfile.gun.fire_rate * loaderMulBase
    ).toFixed(2);
    if (sum >= 0) {
      $("#notBaseDPM").css("color", "green");
      $("#notBaseDPM").text(`(+${sum})`);
    } else {
      $("#notBaseDPM").css("color", "red");
      $("#notBaseDPM").text(`(${sum})`);
    }
  }
  if (comanderLvl != 100 || brothers != 0 || gunLayingDrive != 1) {
    let sum = (
      (tankProfile.gun.aim_time * gunnerMul) / gunLayingDrive -
      tankProfile.gun.aim_time / gunnerMulBase
    ).toFixed(2);
    if (sum >= 0) {
      $("#notBaseAim").css("color", "red");
      $("#notBaseAim").text(`(+${sum})`);
    } else {
      $("#notBaseAim").css("color", "green");
      $("#notBaseAim").text(`(${sum})`);
    }
  }
  if (
    comanderLvl != 100 ||
    brothers != 0 ||
    ace != 1 ||
    master != 1 ||
    grousers != 1
  ) {
    let sum = (
      (tankProfile.suspension.traverse_speed * ace * master * grousers) /
        driverMul -
      tankProfile.suspension.traverse_speed * driverMulBase
    ).toFixed(2);
    if (sum >= 0) {
      $("#notBaseTraverse").css("color", "green");
      $("#notBaseTraverse").text(`(+${sum})`);
    } else {
      $("#notBaseTraverse").css("color", "red");
      $("#notBaseTraverse").text(`(${sum})`);
    }
  }
  if (
    comanderLvl != 100 ||
    brothers != 0 ||
    eagle != 1 ||
    sonar != 1 ||
    binocular != 1
  ) {
    let sum = (
      (tankProfile.turret.view_range / comanderLvlMul) *
        eagle *
        sonar *
        binocular -
      tankProfile.turret.view_range
    ).toFixed(2);
    if (sum >= 0) {
      $("#notBaseView").css("color", "green");
      $("#notBaseView").text(`(+${sum})`);
    } else {
      $("#notBaseView").css("color", "red");
      $("#notBaseView").text(`(${sum})`);
    }
  }

  if (comanderLvl != 100 || brothers != 0 || boffin != 1) {
    let sum = (
      (tankProfile.radio.signal_range * boffin) / radiomanMul -
      tankProfile.radio.signal_range * radiomanMulBase
    ).toFixed(2);
    if (sum >= 0) {
      $("#notBaseSignal").css("color", "green");
      $("#notBaseSignal").text(`(+${sum})`);
    } else {
      $("#notBaseSignal").css("color", "red");
      $("#notBaseSignal").text(`(${sum})`);
    }
  }

  if (optionalSuspension != 1) {
    let sum = (
      (tankProfile.max_weight * optionalSuspension - tankProfile.max_weight) /
      1000
    ).toFixed(2);
    $("#notBaseLoadLimit").css("color", "green");
    $("#notBaseLoadLimit").text(`(+${sum})`);
  }

  $("#tankParams").css("visibility", "visible");
  $(".spiner").html(``);
}

function changeActive(e) {
  $(
    `#${
      $(e)
        .attr("class")
        .split(" ")[1]
    } a`
  ).removeClass("active");
  $(e).addClass("active");
  takeInfo();
}

function selectPerk(e) {
  if ($(e).is(".checked")) {
    $(e).removeClass("checked");
    $("a", e).removeClass("opacityHigh");
  } else {
    $(e).addClass("checked");
    $("a", e).addClass("opacityHigh");
  }
  createInfo(false);
}

function selectAmmo(e) {
  $(".ammo").removeClass("checked");
  $(e).addClass("checked");
  createInfo(false);
}

function selectOptionalDevice(e) {
  if ($(e).is(".checked")) {
    $(e).removeClass("checked");
    $("a", e).removeClass("opacityHigh");
    optionalDeviceSlots += 1;
    $("#optionalDeviceSlots").removeClass("red");
    $("a.optionalDevice, a.improvedEquipment").attr(
      "onclick",
      "selectOptionalDevice(this);"
    );
    $("img.optionalDevice, img.improvedEquipment").removeClass("opacityLow");
  } else if (optionalDeviceSlots > 0) {
    $(e).addClass("checked");
    $("a", e).addClass("opacityHigh");
    optionalDeviceSlots -= 1;
    if (optionalDeviceSlots == 0) {
      $("#optionalDeviceSlots").addClass("red");
      $(".optionalDevice, .improvedEquipment")
        .not(".checked")
        .removeAttr("onclick");
      $(
        "img",
        $("a.optionalDevice, a.improvedEquipment").not(".checked")
      ).addClass("opacityLow");
    }
  }

  createInfo(false);
}

function selectConsumable(e) {
  if ($(e).is(".checked")) {
    $(e).removeClass("checked");
    $("a", e).removeClass("opacityHigh");
    consumableSlots += 1;
    $("#consumableSlots").removeClass("red");
    $("a.regularConsumables, a.premiumConsumables").attr(
      "onclick",
      "selectConsumable(this);"
    );
    $("img", $("a.regularConsumables, a.premiumConsumables")).removeClass(
      "opacityLow"
    );
  } else if (consumableSlots > 0) {
    $(e).addClass("checked");
    $("a", e).addClass("opacityHigh");
    consumableSlots -= 1;
    if (consumableSlots == 0) {
      $("#consumableSlots").addClass("red");
      $(".regularConsumables, .premiumConsumables")
        .not(".checked")
        .removeAttr("onclick");
      $(
        "img",
        $("a.regularConsumables, a.premiumConsumables").not(".checked")
      ).addClass("opacityLow");
    }
  }

  createInfo(false);
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
