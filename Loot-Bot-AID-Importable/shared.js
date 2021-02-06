if(!state.setup) {    
  state.setup = true
  state.set = {tolerance: 15, tog: 1, inUpd: false, outUpd: true} 
  state.lewt = {key: /loot|scavenge|salvage|steal|plunder|take|find|discover|examine|reveal|uncover|skin|mine/g}
  state.inventory = []
  state.inv = {}
  state.inv.leather = {name: "Leather", namePl: "Leather", type: "materials", amt: 0, key: ["leather", "skin", "scale", "fur", "hide", "pelt"], key2: ["bolt", "scrap", "bunch", "strip", "roll", "elk", "goat", "deer", "cow", "animal", "monster", "goblin", "kobold", "human", "dragon"]}
  state.inv.iron = {name: "Iron", namePl: "Iron", type: "materials", amt: 0, key: ["metal", "chunk", "hunk", "bar", "ingot", "ore"], key2: ["iron", "ferr", "rust", "scrap"]}
  state.inv.swordIron = {name: "Iron Sword", namePl: "Iron Swords", type: "weapon", amt: 0, key: ["sword", "machete", "cleaver", "blade", "cutlass", "scimitar", "rapier"], key2: ["iron", "scrap", "ferr", "makeshift", "rust"]}    
}

const lowered = text.toLowerCase()

function check(object) {
    state[object].check = []
  if(lowered.match(state[object].key)) { 
    state[object].check = lowered.match(state[object].key)
  }
}

function lootEval(){
  for (var i in state.inv) {
    var x = state.inv[`${i}`]
    x.temp = 0
    for (var i2 = 0; i2 < x.key.length; i2++) {
      var indices = []
      var idx = lowered.indexOf(x.key[i2])
      while (idx != -1) {
        indices.push(idx);
        idx = lowered.indexOf(x.key[i2], idx + 1)
      }
      for (var i3 = 0; i3 < indices.length; i3++, state.set.tog++) {
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
            if(y2 >= 0 && y2 <= (y + state.set.tolerance) && y2 >= (y - state.set.tolerance) && state.set.tog == 1) {
              x.amt++
              x.temp++ 
              state.set.tog--
            }
          }
        }
      }
    }
  }
  for (var i6 in state.inv) {
    var z = state.inv[`${i6}`]
    if (z.temp == 1){
      state.message += `1 ${z.name} added to your ${z.type} chest.\n`
    } else if (z.temp >= 1) {
      state.message += `${z.temp} ${z.namePl} added to your ${z.type} chest.\n`
    }
    z.temp = 0
  }
  state.set.tog = 1
}

function addType (type){
  for (i in state.inv) {
    var x = state.inv[`${i}`]
    if (x.type == type){
      state.inventory.push({name: x.namePl, quantity: x.amt})
    }
  }
}

function inventoryUpd(){
  for (var i in state.inv) {
    var x = state.inv[`${i}`]
    for (var i2 = 0; i2 < state.inventory.length; i2++){
      y = state.inventory[`${i2}`]
      if(x.namePl == y.name) {
        y.quantity = x.amt
      }
    }
  }
  for (var i = 0; i < state.inventory.length; i++){
    var x = state.inventory[`${i}`]
    if (x.quantity == 0) {
      state.inventory = state.inventory.slice(0, i).concat(state.inventory.slice(i + 1))
      i--
    }
  }
}
