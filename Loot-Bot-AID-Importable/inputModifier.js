const modifier = (text) => {
  let modifiedText = text
  let stop = false
  
  var commandMatcher = text.match(/\n? ?(?:> You |> You say "|)\/(\w+?)( [\w ]+)?[".]?\n?$/i) ? text.match(/\n? ?(?:> You |> You say "|)\/(\w+?)( [\w ]+)?[".]?\n?$/i) : []
  var command = commandMatcher[1]
  state.set.args = commandMatcher[2] ? commandMatcher[2].trim().split(' ') : []

  state.inventory = []
  state.inventory.push({name: "―――Equipment", quantity: "――――――――"})
  addType ("weapon")
  addType ("tool")
  addType ("armor")
  state.inventory.push({name: '\n――――Materials', quantity: "\n――――――――"})
  addType ("materials")

  state.message = ""

  check ("lewt")

  if(command == "loot" && !isNaN(state.set.args[0])){
    var num = Number(state.set.args[0])
    state.set.args.shift()
    var y = state.set.args.join(" ").toLowerCase()
    for(var i in state.inv) {
      var x = state.inv[`${i}`]
      var k = x.name.toLowerCase()
      var k2 = x.namePl.toLowerCase()
      if(y == k || y == k2) {
        x.amt += num 
        x.temp = num 
        break
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
    state.set.inUpd = true
    modifiedText = ""
  }

  if(command == "loot" && !state.set.inUpd){
    lootEval()
    state.set.inUpd = true
    modifiedText = ""
  }

  if(command == "inv") {
    state.message = "Inventory Contents:\n"
    for(var i in state.inv) {
      x = state.inv[`${i}`]
      if(x.amt >= 0){
        state.message += `${x.name}: ${x.amt} | `
      }
    }
    invReg = / \| $/
    state.message = state.message.replace(invReg, '');
    modifiedText = ""
  }

  if(command == "clear"){
    state.message = ""
    modifiedText = ""
  }

  if(state.set.inUpd){
    inventoryUpd ()
    state.set.inUpd = false
  }

  return { text: modifiedText }
}

modifier(text)
