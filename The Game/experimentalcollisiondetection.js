		if (((xPosition >= (x - linkWidth)) && (xPosition <= (x+w)))&&
			((yPosition >= (y - linkHeight))&&(yPosition <= (y + h)))){
				if ((xPosition >= (x-linkWidth))&&(xPosition < x)&&(yPosition >= (y - (((linkHeight)/3)*2)))){
					blockLeft = true
				}
				else{
					blockLeft = false
				}
		}
		else{
			blockRight = false;
			blockDown = false;
			blockLeft = false;
			blockUp = false;
		}