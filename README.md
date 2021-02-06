# Modular Item Framework (𝐌𝐈𝐅)
A set of interchangeable and interlocking systems for acquiring, managing and using items in AI Dungeon. Each system is designed for use with other 𝐌𝐈𝐅 components, but can also function independently


## Multi-Key Evaluation
Most 𝐌𝐈𝐅 systems make use of multi-key evaluation, which use a *trigger* or *command*, a *noun* and an *adjective* to identify an item and how it's being used.

###### How it Works
𝟏. The bot checks your player **input** for a configurable *trigger* (one or more words from a configurable array) or *command* (a specific first word in the input, starting with "/", such as */loot*. The input must include at least one *trigger* or *command* to proceed to evaluation.

𝟐. The bot evaluates the text of either the **input** or the **output** (depending on the specific function) to see if they contain the primary keys (.key array; hereafter, *nouns*) of any of the items you've configured as a state.inv.*itemName* object.

𝟯. For each *noun* the bot finds, it then checks for a corresponding secondary key (.key2 array; hereafter, *adjectives*) corresponding to the same .inv item. The adjective must be within a configurable number of characters (state.set.tolerance, default 15) of the noun for the script to evaluate a hit for that item. 

𝟰. For each hit, the bot performs the remainder of the function. The script can evaluate multiple of each item and multiple items per evaluation.

𝟱. The script automatically generates an .inventory from your .inv items, creating a sidebar menu inventory. The script keeps the sidebar up to date and organized by type. The .inventory menu is also used to track equipped gear and recipes you have enough materials to craft.


## Systems

###### Loot Bot (Complete)
The Loot Bot checks **input** for a loot *trigger* or the */loot* *command*. It then uses multi-key evaluation to check for items to add to your inventory from a preconfigured list. The loot *trigger* makes the bot evaluate the AI's **output** for hits; the */loot command* makes the bot evaluate the rest of your **input** for hits.

It also features a few basic *commands*: a more rigid version of */loot* that requires specific item name, but also allows for an associated number of that item to add;  */inv* to display .inv items you have 1 or more of as a message (as an alternative to the sidebar); */clear* to empty your message.

###### Equip Bot (Current Project)
The Equip Bot checks **input** for an equip *trigger* or the */equip command*. It then uses multi-key evaluation on your **input** to determine what you're equipping. 

It can equip multiple items at once, but only one per equip category (default: weapon, tool, armor), and only allows you to equip items you have 1 or more of in your inventory. It then sets your .equip.*type* with properties corresponding to those predefined in the .inv item. It removes the equipped item from your inventory, returns the previously equipped item to your inventory, and updates you with a message.

The Equip Bot keeps your equipment and their properties at the forefront of the AI's context by using a customized script similar to Author's Note to hold equipment information just behind your most recent input. Equipment info is formatted with modified cat<nip> 2.0. 
  
Item enchantment will be included if possible.

###### Use Bot (Upcoming)
The Use Bot checks **input** for a consumable *trigger* that indicates you're using a consumable item (such as a potion or grenade). It then uses multi-key evaluation on your **input** to determine what you're using. 

You can use multiple different useables at once, but only if you have 1 or more in your inventory. The item count is then reduced by 1, and a hidden state.memory.frontMemory is included after your input which informs the AI of the affects the consumable has. 

###### Craft Bot (Upcoming)
The Equip Bot checks **input** for a craft *trigger* or the */craft command*. It then uses multi-key evaluation on your **input** to determine what you're crafting.

The bot checks whether you have enough materials for a recipe, and the required tools, before allowing you to craft it; on a successful craft, materials are removed from your inventory and the crafted item is added. It informs you of these results with a message.

This bot will also dynamically update your .inventory sidebar menu with crafting recipes you have enough materials to craft.

###### Score Script (Upcoming)
The Score Script checks **input** for a retire *trigger* or */retire command*. It then prompts a confirmation. On confirmation, the script will tabulate your final score, based on the total value of your .inv items and equipment. The script then delivers a pre-written retirement epilogue (higher scores produce better outcomes). 

