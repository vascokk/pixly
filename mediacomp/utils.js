
/*** utils.js V1.0 ***/

function getRidOfNakedCode(jscode){
	var lines = jscode.split("\n");
	var f_depth = 0;
	var is_in_function = false;
	for (var i = 0; i < lines.length; i++){
		
		if (lines[i].match(/function(\s+[a-zA-Z0-9_\$]*)?\([^\)]*\)/)){
			is_in_function = true;
		}
		
		if (lines[i].indexOf("{") >= 0 && is_in_function)
			f_depth++;
		else if (lines[i].indexOf("}") >= 0 && f_depth > 0){
			f_depth--;
			if (f_depth == 0) is_in_function = false;
		}
		else if (!is_in_function && f_depth <= 0 && lines[i].replace(/\s/g,'') !== "" && !lines[i].match(/\s*var/))
			lines[i] = "//" + lines[i];
	}
	return lines.join("\n");
}

function $(id){
    return document.getElementById(id);
}

function drawCircle(ctx,color,x,y,r){
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,2*Math.PI);
    ctx.stroke();
}
function fillCircle(ctx,color,x,y,r){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,2*Math.PI);
    ctx.fill();
}

function drawLine(ctx, color, x1, y1, x2, y2, thickness, cap){
    cap = cap || "round";
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.lineWidth = thickness;
    ctx.strokeStyle = color;
    ctx.lineCap = cap;
    ctx.stroke();
}

//http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}


function hsvToHex(h, s, v){
	var c = HSVtoRGB(h, s, v);
	return rgbToHex(c.r, c.g, c.b);
}

//http://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.floor(r * 255),
        g: Math.floor(g * 255),
        b: Math.floor(b * 255)
    };
}

function hypot(x,y){
    return Math.sqrt(x*x + y*y);
}

function mod(m, n) {
    return ((m % n) + n) % n;
}

function now(){
    return (new Date)*1;
}

function replaceColor(ctx, old_r, old_g, old_b, n_r, n_g, n_b){
    var pixels = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    for(var i=0; i<imageData.data.length; i+=4){
        if(pixels.data[i]==old_r && pixels.data[i+1]==old_g && pixels.data[i+2]==old_b){
              imageData.data[i] = n_r;
              imageData.data[i+1] = n_g;
              imageData.data[i+2] = n_b;
        }
    }
    ctx.putImageData(pixels,0,0);
}

 // http://stackoverflow.com/questions/10073699/pad-a-number-with-leading-zeros-in-javascript
function padl(n, width, z){
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}


/*
 // http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format
 // http://i.stack.imgur.com/jYeIc.png
if (!String.prototype.format) {
    String.prototype.format = function() {
        var str = this.toString();
        if (!arguments.length)
            return str;
        var args = typeof arguments[0],
            args = (("string" == args || "number" == args) ? arguments : arguments[0]);
        for (arg in args)
            str = str.replace(RegExp("\\{" + arg + "\\}", "gi"), args[arg]);
        return str;
    }
}*/


 // "Hello, {-name-}, are you feeling {-adjective-}?".format({name: "Mr. Krabs", adjective: "it now"})
 // "Hello, {-0-}, are you feeling {-1-}?".format("Mr. Krabs", "it now")
 // replacement identifiers can only be alphanumeric

if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    
    if(!arguments.length)
        return this.toString();
    
    if(typeof arguments[0] == "string" || typeof arguments[1] == "number")
        args = arguments;
    else
        args = arguments[0]; // if it's an object or array
    
    return this.replace(/{\-([0-9a-zA-Z]+)\-}/g, function(match, replacement_name) { 
      return typeof args[replacement_name] != 'undefined'
        ? args[replacement_name]
        : match
      ;
    });
  };
}


 // perly interpolation
 // "Hello, $name, are you feeling $adjective?".interpolate({name: "Mr. Krabs", adjective: "it now"})
 // "Hello, $0, are you feeling $1?".interpolate("Mr. Krabs", "it now")
if(!String.prototype.interpolate){
  String.prototype.interpolate = function() {
    var args = arguments;
    
    if(!arguments.length)
        return this.toString();
    
    if(typeof arguments[0] == "string" || typeof arguments[1] == "number")
        args = arguments;
    else
        args = arguments[0]; // if it's an object or array
    
    return this.replace(/\$([0-9a-zA-Z]+)/g, function(match, replacement_name) { 
      return typeof args[replacement_name] != 'undefined'
        ? args[replacement_name]
        : match
      ;
    });
  };
}