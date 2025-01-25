"use strict";
const SkillTree = {
	generateTree:function(totalCards,gridSize,prizes) {
		// generate a randomized list of all the nodes which will be part of the tree
		let cards = []
		cardLoop: for (let cardNum=1;cardNum<=totalCards;cardNum++) {
			if (cardNum===227) {continue cardLoop} // 227 always appears no matter what
			cards.push(String(cardNum))
		}
		cards = cards.shuffle()
		// the current map, where keys are coordinates and values are node labels
		let map = {"0,0":"227"}
		function adjacentPrizesExist(coord1,coord2) { // we never want to place 2 prizes next to one another, so check for this before every placement
			let adjacentCoords = [coord1+","+coord2,(coord1+1)+","+coord2,(coord1-1)+","+coord2,coord1+","+(coord2+1),coord1+","+(coord2-1)]
			for (let adjacent of adjacentCoords) {
				if (map[adjacent]!==undefined) {
					return true
				}
			}
			return false
		}
		// add prizes in an 8-symmetric pattern
		prizeLoop: while (prizes>0) {
			let coord1 = Math.floor(Util.ranint(1,gridSize)/2)
			let coord2 = (prizes===4)?((Math.random()<0.5)?coord1:0):Math.floor(Util.ranint(1,gridSize)/2) // if there are only 4 prizes left, they must necessarily be placed on either an orthogonal or diagonal centre line
			// if the two coordinates place a prize next to an existing prize, generate new ones
			if (adjacentPrizesExist(coord1,coord2)) {
				continue prizeLoop
			}
			// place coordinates on each of the eight cells this cell can be mapped to via symmetry
			for (let multipliers of [[1,1],[1,-1],[-1,1],[-1,-1]]) {
				map[(multipliers[0]*coord1)+","+(multipliers[1]*coord2)] = "✪"	
				map[(multipliers[0]*coord2)+","+(multipliers[1]*coord1)] = "✪"	
			}
			prizes -= ([coord1,coord2].includes(0)||(coord1===coord2))?4:8
		}
		// fill remaining cells with card ID's
		let cardsUsed = 0
		for (let coord1=-(gridSize-1)/2;coord1<=(gridSize-1)/2;coord1++) {
			for (let coord2=-(gridSize-1)/2;coord2<=(gridSize-1)/2;coord2++) {
				if (map[coord1+","+coord2]===undefined) {
					map[coord1+","+coord2] = cards[cardsUsed]
					cardsUsed++
				}
			}
		}
		return map
	},
	processInput:function(){
		let totalCards = Number(d.element("input_totalCards").value)
		let gridSize = Number(d.element("input_gridSize").value)
		let prizes = Number(d.element("input_prizes").value)
		let generatedTree = this.generateTree(totalCards,gridSize,prizes)
		let outputTable = ""
		for (let coord1=-(gridSize-1)/2;coord1<=(gridSize-1)/2;coord1++) {
			outputTable += "<tr>"			
			for (let coord2=-(gridSize-1)/2;coord2<=(gridSize-1)/2;coord2++) {
				let nodeValue = generatedTree[coord1+","+coord2]
				outputTable += "<td class=\"treeCell\" id=\"button_treeCell"+coord1+","+coord2+"\">"
				outputTable += "<button class=\"node "+((nodeValue==="227")?"active":"inactive")+((nodeValue==="✪")?" prize":"")+"\""
				outputTable += " onClick=\"SkillTree.toggleButton(this)\" >"+nodeValue+"</button></td>"
			}
			outputTable += "</tr>"
		}
		d.display("div_inputParameters","none")
		d.innerHTML("table_tree",outputTable)
	},
	toggleButton:function(button){
		if (button.classList.contains("active")) {
			button.classList.remove("active")
			button.classList.add("inactive")
		} else {
			button.classList.remove("inactive")
			button.classList.add("active")
		}
	}
}