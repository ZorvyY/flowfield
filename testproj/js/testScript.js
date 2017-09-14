var currentWeight = 1;


var text = new PointText({
    point: {x: 1400, y: 300},
	content: 'Click here to focus and then press some keys.',
	justification: 'center',
	fontSize: 15
});

(function() {
    function Grid (sizeX, sizeY) {
        this.sizeX = sizeX;
        this.sizeY = sizeY;
    }

    var view = {x : 1300, y : 750};// find actual numbers based on the viewport.
    var cellSize = 25;
    var grid = new Grid(view.x/cellSize, view.y/cellSize);

    function Node(posX, posY) {
        var self = this;
        this.posX = posX;
        this.posY = posY;
        this.totalCost = 100000; //some really big number
        this.rectpoint = new Rectangle(posX * cellSize, posY * cellSize, 
            cellSize - 1, cellSize - 1); 
        this.rect = new Path.Rectangle(this.rectpoint);
        this.cost = 1;
        this.strokeColor = 'black';
        this.weightColor = function () {
            var colorValue = 255 - Math.floor(Math.sqrt(self.cost) * 60);
            return 'rgb(' + colorValue + ',' + colorValue +
            ',' + colorValue + ')';
        }
        this.rect.fillColor = this.weightColor(); 
            
        this.rect.on("mousedrag", function () {
            self.cost = currentWeight;
            this.fillColor = self.weightColor();
        });
	}

    var flowfield = [];

    for (var i = 0; i < grid.sizeY; i++) {
        var tempRow = [];
        for (var j = 0; j < grid.sizeX; j++) {
            tempRow.push(new Node(j, i));
        }
        flowfield.push(tempRow);
    }


    function generateField (row, col) {
        var targetNode = flowfield[row][col];
        targetNode.totalCost = 0;
        targetNode.rect.fillColor = '#00ff00';

        var queue = [];
        queue.push(targetNode);
        var currentNode;

        function addNeighbor (currentNodeCost, i, j) {
            if ((i < 0 || i >=  grid.sizeY) || (j < 0 || j >= grid.sizeX))
                return;
            if (flowfield[i][j].cost + currentNodeCost < 
                    flowfield[i][j].totalCost) {

                flowfield[i][j].totalCost = flowfield[i][j].cost + currentNodeCost;
                queue.push(flowfield[i][j]);
                flowfield[i][j].goesTo = currentNode;
                drawFlow(flowfield[i][j], currentNode);
            }
        }
        while(queue.length != 0) {
            currentNode = queue[0];
            queue.shift();
            var sumCost = currentNode.totalCost;

            addNeighbor (sumCost, currentNode.posY+1, currentNode.posX - 1);
            addNeighbor (sumCost, currentNode.posY+1, currentNode.posX);
            addNeighbor (sumCost, currentNode.posY+1, currentNode.posX + 1);
            addNeighbor (sumCost, currentNode.posY, currentNode.posX + 1);
            addNeighbor (sumCost, currentNode.posY - 1, currentNode.posX +1 );
            addNeighbor (sumCost, currentNode.posY - 1, currentNode.posX);
            addNeighbor (sumCost, currentNode.posY - 1, currentNode.posX - 1);
            addNeighbor (sumCost, currentNode.posY, currentNode.posX - 1);
        }            

    }

    function drawFlow (startNode, endNode) {
        var vectorStart = new Point(startNode.rectpoint.center);
        var end = new Point(endNode.rectpoint.center);
        //var path = new Path.Line(from, to);
        //path.strokeColor = 'black';
        
        var vector = end - vectorStart;
        
        var arrowVector = vector.normalize(10);
	   
        vectorItem = new Group([
            new Path([vectorStart, end]),
            new Path([
                end + arrowVector.rotate(165),
                end,
                end + arrowVector.rotate(-165)
            ])
        ]);
        vectorItem.strokeWidth = 0.75;
        vectorItem.strokeColor = '#e4141b';
        vectorItem.fillColor = '#e4141b';
	
    }

    
    function onKeyDown(event) {
        // When a key is pressed, set the content of the text item:
        if (event.key == '.') {
            generateField(15,15);
            return;
        }
        currentWeight = (parseInt(event.key) || 0) + 1;
        text.content = 'Currently setting a weight of ' + currentWeight;
    }
})();

