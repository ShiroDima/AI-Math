export default function validateDirection(initialPosition, previousPosition, currentPosition, direction) {
	// For a horizontal direction -> initialPosition row must be same as current position row
	// For a vertical direction -> initialPosition column must be same as current position column
	// For a diagonal direction -> initial position and second position will be used
	if(direction==="Horizontal"){
		return initialPosition[0] === currentPosition[0]
	}
	if(direction==="Vertical"){
		return initialPosition[1] === currentPosition[1]
	}
	if(direction==="Diagonal"){
		return !(previousPosition[0] === currentPosition[0]) && !(previousPosition[1] === currentPosition[1]) 
	}
}
