//SHARED LIBRARY

//This sets up required initial states.
//State.loot is used by goblin bot, so I had to use state.lewt :(
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
const commandMatcher = text.match(/\n? ?(?:> You |> You say "|)\/(\w+?)( [\w ]+)?[".]?\n?$/i) ? text.match(/\n? ?(?:> You |> You say "|)\/(\w+?)( [\w ]+)?[".]?\n?$/i) : []
const command = commandMatcher[1]
const args = commandMatcher[2] ? commandMatcher[2].trim().split(' ') : []

function addType (type){
  for (i in state.inv) {
    var x = state.inv[`${i}`]
    if (x.type == type){
      state.inventory.push({name: x.namePl, quantity: x.amt})
    }
  }
}

//This checks for key terms. It will be use in this script to check player input for a term indicating they're looting.
function check(object) {
  state[object].check = []
  if(lowered.match(state[object].key) == null) { 
    state[object].check = "" 
  } else { state[object].check = lowered.match(state[object].key)
  }
}

//This is the heart of the script. When called, it will then evaluate the output for terms from each state.inv "noun" key. 
//Each time it finds a match, it then looks within 15 (default) characters of that "noun" for a term from the same .inv  
//item's "adjective" key. When that also matches, it will increase that item's .amt by 1 and add a notification that 
//you've looted that item to your message.
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

//When called, this sets .inventory.quantity to .inv.amt after each output (so the sidebar menu is properly updated).
//It also removes .inventory items with 0 quantity to prevent them from errantly appearing in the sidebar with a quantity of 1
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


//INPUT MODIFIER
const modifier = (text) => {
  let modifiedText = text
  let stop = false

//This rebuilds your .inventory sidebar from your .inv items. It is unfortunately necessary to do this
//with every player input, due to the weird and inaccessible .inventory backend code.
  state.inventory = []
  state.inventory.push({name: "―――Equipment", quantity: "――――――――"})
  addType ("weapon")
  addType ("tool")
  addType ("armor")
  state.inventory.push({name: '\n――――Materials', quantity: "\n――――――――"})
  addType ("materials")

  state.message = ""

//This checks player input for terms from the state.lewt.key regex, for later use.
  check ("lewt")

//This is a backup command for if the .inventory sidebar grows clunky. It lists .inv items 
//you have 1 or more of in a relatively compact message.
  if(command == "inv") {
    state.message = "Inventory Contents:\n"
    for(var i in state.inv) {
      state.message += state.inv[`${i}`].name + ": " + state.inv[`${i}`].amt + " | "
    }
    state.message = state.message.replace(new RegExp(' | ' + '$'), '');
    modifiedText = ""
  }

//This is a command for adding loot. It uses the same flexible key detection as the output bot,
//and can accept multiples of items and multiple items at once (though listing # item, like 3 iron ingots)
//is not yet implimented. I need to get better at regexp before I can do that bit.
  if(command == "loot"){
    lootEval()
    state.set.inUpd = true
    modifiedText = ""
  }

//This updates your .inventory menu after using the loot command.
  if(state.set.inUpd){
    inventoryUpd ()
    state.set.inUpd = false
  }

  return { text: modifiedText }
}

modifier(text)

//OUTPUT MODIFIER
const modifier = (text) => {
  let modifiedText = text
  let stop = false

//This triggers the loot evaluation on the AI's output text if the earlier check("lewt") function
//detected a term in the player input indicating that you're looting.
  if(state.lewt.check.length >= 1) {
    lootEval()
    state.set.outUpd = true
  }  

//This updates the .inventory menu if loot evaluation was triggered for the output. 
  if(state.set.outUpd){
    inventoryUpd()
    state.set.outUpd = false
  }

  return { text: modifiedText }
}

modifier(text)
