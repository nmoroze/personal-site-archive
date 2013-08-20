var physics = function() {
	var $el;
	var world;
	var counter;
	var timeout;
	var callback;

	var step = function(cnt) {
		world.Step(1.0/60, 1);
		counter++;

		var htmlString = "";

		for(var b = world.m_bodyList; b; b=b.m_next) {
			var bodyData = b.GetUserData();
			if(bodyData)
				htmlString = htmlString + "<div style=\"position:absolute; top:"+b.m_position.x+"px; left:"+b.m_position.y+"px;\"><a href=\""+bodyData.url+"\">"+bodyData.name+"</a></div>";
		}
		$el.html(htmlString);
		if(counter<timeout*60)
			setTimeout('physics.step(' + (cnt || 0) + ')', 10);
		else
			callback();
	};

	var init = function(data, selector, time, func) {
		counter = 0;
		var worldAABB = new b2AABB();
		worldAABB.minVertex.Set(0, 0);
		worldAABB.maxVertex.Set(2000, 2000);
		var gravity = new b2Vec2(300,0);
		var doSleep = true;
		world = new b2World(worldAABB, gravity, doSleep); 
		createBoundaries();
		
		$el = selector;
		console.log($el);
		for(var i=0; i<data.length; i++) {
			console.log('create');
			var forceX = Math.floor(Math.random()*5000)+600;
			if(Math.random()>0.5)
				forceX *= -1;
			var forceY = Math.floor(Math.random()*5000)+600;
			if(Math.random()>0.5)
				forceY *= -1;

			createBox(data[i].name, data[i].html_url, Math.floor(Math.random()*400), Math.floor(Math.random()*400));//.ApplyImpulse(new b2Vec2(forceX, forceY), new b2Vec2(0,0));
		}
		callback = func;
		timeout = time;
		step();
	};

	var createBoundaries = function() {
		var groundSd = new b2BoxDef();
        groundSd.extents.Set(50, 1700);
        groundSd.restitution = 1.0;
        var groundBd = new b2BodyDef();
        groundBd.AddShape(groundSd);
        groundBd.position.Set(800, 0);
        var edgeSd = new b2BoxDef();
        edgeSd.extents.Set(500, 50);
        edgeSd.restitution = 0.2;
        var edgeBd = new b2BodyDef();
        edgeBd.AddShape(edgeSd);
        edgeBd.position.Set(500, 0);
        var edge2Bd = new b2BodyDef();
        edge2Bd.AddShape(edgeSd);
        edge2Bd.position.Set(500, 1440);

        world.CreateBody(edgeBd);
        world.CreateBody(edge2Bd);
        world.CreateBody(groundBd);
	};

	var createBox = function(name, url, x, y) {
		var sd = new b2BoxDef();
        sd.extents.Set(10, 50);
        sd.restitution = 1;
        sd.density = 1;
        var bd = new b2BodyDef();
        bd.AddShape(sd);
        bd.userData = {
        	"name":name,
        	"url":url,
        }
        bd.position.Set(x, y);
        return world.CreateBody(bd);
	};

	return {
		step:step,
		init:init,
	};
}();
