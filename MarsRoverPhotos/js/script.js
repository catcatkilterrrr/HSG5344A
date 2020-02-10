// https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=DEMO_KEY

const key = 'ZS8apt86ttWcaW0kFgU6Q6oPPPG7i482BAMvPWOH';
let sol;

$(document).ready(function(){

//	let headers = new Headers();
//	headers.set('x-api-key', key);

	$('.button').hover(function() {
		$(this).css('background-color', '#666666');
	},
	function(){
		$(this).css('background-color', '#000000');	
	});

	$("#c").click(function() {
		let api_call = getURL('curiosity');
		highlight("#c");
		dispJSONData(api_call);
	});
	$("#o").click(function() {
		let api_call = getURL('opportunity');
		highlight("#o");
		dispJSONData(api_call);
	});
	$("#s").click(function() {
		let api_call = getURL('spirit');
		highlight("#s");
		dispJSONData(api_call);
	});
});

function dispJSONData(api_call) {
	$.getJSON(api_call, function(data){
		let photoDisp = document.getElementById('content');
		let dateDisp = document.getElementById('roverdate');
		
		$("#content").hide();
		// get JSON data
		let marsPhotos = data.photos;
		
		// remove existing elements	
		while (dateDisp.hasChildNodes()) {
			dateDisp.removeChild(dateDisp.firstChild);
		}

		while (photoDisp.hasChildNodes()) {
			photoDisp.removeChild(photoDisp.firstChild);
		}
		
		// if there are no photos for random sol
		if (marsPhotos.length === 0) {
			dateDisp.innerHTML = `No photos found for sol ${sol}`;
			return;
		}

		//display Earth date and sol
		const earthDate = marsPhotos[0].earth_date;
		let dateTime= document.createElement("p");
		dateDisp.innerHTML = earthDate.replace(/-/g, '  ');
		dateTime.innerHTML = `sol ${sol}`;
		dateDisp.appendChild(dateTime); 
	
		//get list of photos and relevant info
		let imgSrcURL=[];
		for (let i = 0; i<marsPhotos.length;i++){
			const camName = marsPhotos[i].camera.full_name;
			const imgUrl = marsPhotos[i].img_src;
			const imgID = marsPhotos[i].id;
			imgSrcURL.push([imgUrl, camName, imgID]);	
		}

		// display one photo from each camera
		let camList = [];
		for (let i=0;i<imgSrcURL.length;i++){
			if (camList.includes(imgSrcURL[i][1])) {
				continue;
			} else {
			camList.push(imgSrcURL[i][1]);
			let marsPic = document.createElement("IMG");
			marsPic.classList.add('animated', 'fadeIn');
			let newFigCap = document.createElement("FIGCAPTION");
			newFigCap.classList.add('animated', 'fadeIn');
			marsPic.src = imgSrcURL[i][0];
			newFigCap.innerHTML = `${imgSrcURL[i][1]} | PHOTO ID ${imgSrcURL[i][2]}`;

			photoDisp.appendChild(marsPic);
			photoDisp.appendChild(newFigCap);
			}
		}

		let img = document.querySelector("img");
		img.addEventListener("load", showPage);	
	});
}

function getURL(rover) {
	sol = Math.floor(Math.random()*1000);
	const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&page=1&api_key=`+key;
	
	return url
}

function highlight(button_id) {
	$(button_id).css('border-width', '3px');
	$(button_id).css('opacity', '1.0');	
	switch (button_id) {
		case '#c':
			notClicked('#o');
			notClicked('#s');
			break;
		case '#o':
			notClicked('#c');
			notClicked('#s');
			break;	
		case '#s':
			notClicked('#o');
			notClicked('#c');
			break;
	}
}

function notClicked(button_id){
	$(button_id).css('border-width', '1px');
	$(button_id).css('opacity', '0.6');	
}

function showPage() {
	$("#content").show();
}
