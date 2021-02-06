const modifier = (text) => {
  let modifiedText = text
  let stop = false

  if(state.lewt.check.length >= 1) {
    lootEval()
    state.set.outUpd = true
  }  

  if(state.set.outUpd){
    inventoryUpd()
    state.set.outUpd = false
  }

  return { text: modifiedText }
}

modifier(text)
