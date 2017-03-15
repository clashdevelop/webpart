//绑定事件
var x = 0;
var y = 0;
document.onmousemove = mouseMove;
function mousePosition(ev){
	if(ev.pageX || ev.pageY){
		return {pos_x:ev.pageX, pos_y:ev.pageY};
	}
	return {
		pos_x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,
		pos_y:ev.clientY + document.body.scrollTop - document.body.clientTop
	};
}
function mouseMove(ev) {
	ev = ev || window.event;
	var mousePos = mousePosition(ev);
	// return {
	// 	x:(mousePos.x - document.body.clientWidth / 2),
	// 	y:(mousePos.y - document.body.clientHeight / 2)
	// };
	//获得中心点
	x = mousePos.pos_x - document.body.clientWidth / 2;
	y = mousePos.pos_y - document.body.clientHeight / 2;
	myMouse.initPosition();
	// document.getElementById("showPosition").innerHTML = "x:"+x;
}
//mouse类
function mouse(){
    drawBase.call(this);

	this.mouse_x = 0;
	this.mouse_y = 0;
	this.perLength = 2;
	//记录小球的半径，用来做绘制线条的参考
	this.ballRadius = 4;
	//鼠标角度
	this.mouseAngle = 0;
	//绘制线条位置points
	this.drawPoints = [
						[
							[-1,3.3],[0,4]
						],
						[
							[0,4],[1,3.3]
						],
						[
							[-0.7,3],[0.7,3]
						],
						[
							[-0.55,2.5],[0.55,2.5]
						],
						[
							[-0.4,2],[0.4,2]
						],
						[
							[-0.25,1.5],[0.25,1.5]
						]
					];
	// this.lines[];
	//初始化
	for(var i = 0;i < this.drawPoints.length;i++)
		for(var j = 0;j < this.drawPoints[i].length;j++)
			for(var z = 0;z < this.drawPoints[i][j].length;z++)
				this.drawPoints[i][j][z] *= this.ballRadius;
}
(function(){ //继承
    var Super = function(){};
    Super.prototype = drawBase.prototype;
    mouse.prototype = new Super();
})();
mouse.prototype.initPosition = function() {
	this.mouse_x = x;
	this.mouse_y = -y;

	//获得与y轴正方向的逆时针方向的角度
	if(this.mouse_x < 0){
		if(this.mouse_y > 0){
			this.mouseAngle = -Math.atan(this.mouse_x / this.mouse_y) * 45;
		}else if(this.mouse_y < 0){
			this.mouseAngle = (90 + Math.atan(this.mouse_y / this.mouse_x) * 45);
		}else if(this.mouse_y == 0){
			this.mouseAngle = 90;
		}
	}else if(this.mouse_x > 0){
		if(this.mouse_y < 0){
			this.mouseAngle = (180 - Math.atan(this.mouse_x / this.mouse_y) * 45);
		}else if(this.mouse_y > 0){
			this.mouseAngle = (270 + Math.atan(this.mouse_y / this.mouse_x) * 45);
		}else if(this.mouse_y == 0){
			this.mouseAngle = 270;
		}
	}else if(this.mouse_x == 0){
		if(this.mouse_y < 0){
			this.mouseAngle = 180;
		}else if(this.mouse_y > 0){
			this.mouseAngle = 0;
		}else if(this.mouse_y == 0){
			this.mouseAngle = 0;
		}
	}
	this.mouseAngle = (this.mouseAngle / 360) * 2 * Math.PI;
	for(var i = 0;i < this.drawPoints.length;i++)
		for(var j = 0;j < this.drawPoints[i].length;j++){
			var temp_x = this.drawPoints[i][j][0];
			var temp_y = this.drawPoints[i][j][1];
			temp_x = this.drawPoints[i][j][0] * Math.cos(this.mouseAngle) - this.drawPoints[i][j][1] * Math.sin(this.mouseAngle);
			temp_y = this.drawPoints[i][j][0] * Math.sin(this.mouseAngle) + this.drawPoints[i][j][1] * Math.cos(this.mouseAngle);
			this.drawPoints[i][j][0] = temp_x;
			this.drawPoints[i][j][1] = temp_y;
		}
	// for(var i = 0;i < this.lines.length ;i++){
	// 	this.lines[i].rotation.x += 0.02;
	// }
	// document.getElementById("showPosition").innerHTML = "top is "+this.mouseAngle;
};
mouse.prototype.draw = function(scene) {
    //定义两种颜色分别是两个端点的颜色
    var color1 = new THREE.Color( 0x444444 );
    var color2 = new THREE.Color( 0xFF0000 );
    //绘制箭头
    // this.initPosition();
	for(var i = 0;i < this.drawPoints.length;i++){
		//多个横线
		var geometry = new THREE.Geometry();
	    var meterial = new THREE.LineBasicMaterial({
	        vertexColors: true
	      });
		for(var j = 0;j < this.drawPoints[i].length;j++){
			//多个点
			var point_posi = new THREE.Vector3();
			// for(var z = 0;z < this.drawPoints[i][j].length;z++){
			// 	point_posi.set(this.drawPoints[i][j][z]);
			// }
			point_posi.set(this.drawPoints[i][j][0],this.drawPoints[i][j][1],0);
			//因为没有z轴，所以在这里添加0
			// point_posi.set(0);
			geometry.vertices.push(point_posi);
			// geometry.colors.push(color1, color2);
		}
		var line = new THREE.Line(geometry,meterial,THREE.LinePieces);
		scene.add(line);
		// this.lines.push(line);
	}
	// this.core = this.lines;
};