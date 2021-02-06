//THIS IS NOT YET FUNCTIONAL, UNDER CONSTRUCTION

//SHARED LIBRARY
if(!state.setup) {    
  state.setup = true
  state.set = {tolerance: 15, tog: 1, inUpd: false}
  state.equip = {key: /wield|wear|equip|hold|grab|unsheath|unsling/g}
  state.equip.weapon = {name: "Old Axe", type: "hand axe", properties: ["rusty", "dull"]}
  state.equip.tool = {name: "Broken Pick", type: "pickaxe", properties: ["cracked", "unbalanced"]} 
  state.equip.armor = {name: "Moth-eaten Vest", type: "vest", properties: ["ragged", "thin"]}
  state.inventory = [{name: "―Equipped", quantity: "――――――"}, {name: "Weapon:", quantity: `${state.equip.weapon.name}`},  {name: "Tool:", quantity: `${state.equip.tool.name}`},  {name: "Armor:", quantity: `${state.equip.armor.name}`}]
  state.inv = {}
  state.inv.swordSteel = {name: "Steel Sword", namePl: "Steel Swords", type: "weapon", subtype: "sword", amt: 0, equipped: 0, properties: ["sturdy", "sharp"], key: ["sword", "machete", "cleaver", "blade", "cutlass", "scimitar", "rapier"], key2: ["steel", "polished"]}
  state.inv.swordIron = {name: "Iron Sword", namePl: "Iron Swords", type: "weapon", subtype: "sword", amt: 0, equipped: 0, properties: ["crude", "unwieldy"], key: ["sword", "machete", "cleaver", "blade", "cutlass", "scimitar", "rapier"], key2: ["iron", "scrap", "ferr", "makeshift", "rust"]} 
}

const lowered = text.toLowerCase()

function check(object) {
  state[object].check = []
if(lowered.match(state[object].key)) { 
  state[object].check = lowered.match(state[object].key)
  }
}

function unequip(type){
  for (var t in state.inv){
    u = state.inv[`${t}`]
    if (u.equipped == 1 && u.type == type){
      u.equipped--
      u.amt++
    }                
  } 
}

function equipByType(type) {
  x =  state.inv[`${i}`]
  if (x.type == type){
    for (var i2 = 0; i2 < x.key.length; i2++) {
      var indices = []
      var idx = lowered.indexOf(x.key[i2])
      while (idx != -1) {
        indices.push(idx);
        idx = lowered.indexOf(x.key[i2], idx + 1)
      }
      for (var i3 = 0; i3 < indices.length; i3++) {
        for (var i4 = 0; i4 < x.key2.length; i4++) {
          var indices2 = []
          var idx2 = lowered.indexOf(x.key2[i4])
          while (idx2 != -1) {
            indices2.push(idx2);
            idx2 = lowered.indexOf(x.key2[i4], idx2 + 1)
          }
          for (var i5 = 0; i5 < indices2.length; i5++) {
            var y = indices[i3]
            var y2 = indices2[i5]
            if(y2 >= 0 && y2 <= (y + state.set.tolerance) && y2 >= (y - state.set.tolerance) && x.amt >= 1 && x.equipped == 0 && state.set.tog == 1) {
              z = state.equip[type]
              state.message += `${x.name} equipped. ${z.name} returned to your ${x.type} chest.`
              unequip (type)
              z.name = x.name
              z.properties = x.properties
              z.type = x.subtype
              x.amt--
              x.equipped++
              state.set.tog--
            }
          }
        }
      }
    }
  }
}

function updateFront() {
    
}

//INPUT LIBRARY
const modifier = (text) => {
  let modifiedText = text
  let stop = false

  var commandMatcher = text.match(/\n? ?(?:> You |> You say "|)\/(\w+?)( [\w ]+)?[".]?\n?$/i) ? text.match(/\n? ?(?:> You |> You say "|)\/(\w+?)( [\w ]+)?[".]?\n?$/i) : []
  var command = commandMatcher[1]
  state.set.args = commandMatcher[2] ? commandMatcher[2].trim().split(' ') : []

  state.message = ""

  for (i in state.inv){
    state.inv[`${i}`].amt++
  }


  check ("equip")

  if(command == "equip"){
    for (var i in state.inv) {
      equipByType("weapon")
      equipByType("tool")
      equipByType("armor")      
    }
    updateFront()
    state.set.inUpd = true
    state.equip.check = []
    state.set.tog = 1
    modifiedText = ""
  }


  if(state.equip.check.length >= 1) {
    for (var i in state.inv) {
      equipByType("weapon")
      equipByType("tool")
      equipByType("armor")
    }
    updateFront()
    state.set.inUpd = true
    state.equip.check = []
    state.set.tog = 1
  }

  if(command == "unequip"){
    x = state.equip
    if(args[0] == "weapon") {
      if(x.weapon.name != "Old Axe"){
        state.message = `You return your ${x.weapon.name} to your weapon chest and take out your trusty Old Axe.`
        unequip(weapon)
        state.equip.weapon = {name: "Old Axe", type: "hand axe", properties: ["rusty", "dull"]}
      }
    } else if(args[0] == "tool") {
        if(x.tool.name != "Broken Pick"){
          state.message = `You return your ${x.tool.name} to your tool chest and take out your trusty Broken Pick.`
          unequip(tool)
          state.equip.tool = {name: "Broken Pick", type: "pickaxe", properties: ["cracked", "unbalanced"]}
        }
    } else if(args[0] == "armor") {
        if(x.armor.name != "Moth-eaten Vest"){
          state.message = `You return your ${x.armor.name} to your armor chest and put on your trusty Moth-eaten Vest.`
          unequip(armor)
          state.equip.armor = {name: "Moth-eaten Vest", type: "vest", properties: ["ragged", "thin"]}
      }
    }
    updateFront()
    state.set.inUpd = true
    modifiedText = ""
  }

  if(state.set.inUpd){
    state.inventory.splice(0, 4, {name: "―――Equipped", quantity: "――――――――"}, {name: "Weapon:", quantity: `${state.equip.weapon.name}`},  {name: "Tool:", quantity: `${state.equip.tool.name}`},  {name: "Armor:", quantity: `${state.equip.armor.name}`})
    state.set.inUpd = false
  }

  return { text: modifiedText }
}

modifier(text)
