$(document).ready(function() {
	createDisplay();
});

function createDisplay() {

	var favourites = [ "cretetion", "comster404", "ESL_SC2", "OgamingSC2",
		"freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];

	favourites.forEach(function(favourite) {
		$.getJSON(getURL("streams", favourite), function(json) {
			var stream = json.stream;

			if (stream === undefined) {
				$("#offline-channels").append(
					createNoExistChannel(favourite).renderChannel());
				return;
			} else if (stream === null) {
				$.getJSON(getURL("channels", favourite), function(json) {
					$("#offline-channels").prepend(
						createOfflineChannel(json).renderChannel());
					return;
				});
			} else {
				$("#online-channels").append(
					createOnlineChannel(stream).renderChannel());
				return;
			};
		});
	});

	$("#all-btn").on("click", function() {
		$("#online-channels").show("fast");
		$("#offline-channels").show("fast");
	});
	$("#online-btn").on("click", function() {
		$("#online-channels").show("fast");
		$("#offline-channels").hide("fast");
	});
	$("#offline-btn").on("click", function() {
		$("#online-channels").hide("fast");
		$("#offline-channels").show("fast");
	});

};

function getURL(partURL, channel) {
//	return 'https://api.twitch.tv/kraken/' + partURL + '/' + channel + '?callback=?';
	return 'https://wind-bow.gomix.me/' + partURL + '/' + channel + '?callback=?';
};

function createOnlineChannel(stream) {
	return new Channel(
		"online",
		stream.channel.name,
		stream.viewers,
		stream.channel.status,
		stream.channel.logo,
		stream.preview.medium
	);
}

function createOfflineChannel(stream) {
	return new Channel(
		"offline",
		stream.name,
		"",
		stream.status,
		stream.logo
//		stream.video_banner
	);
}

function createNoExistChannel(name) {
	return new Channel(
		"noexist",
		name
	);
}

function Channel(status, name, viewers, description, logo, image) {
	this.renderChannel = function() {
		return '<div class="row channel"><div class="col-md-6 col-md-offset-3">' +
			getStatus() +
			getImage() +
			getLogo() +
			getName() +
			getViewers() +
			getDescription() + '</div></div>';
	}
	function getStatus() {
		return '<div class="status ' + status + '">' + status + '</div>';
	}
	function getName() {
		return status !== "noexist"
			? '<div class="name"><a href="https://www.twitch.tv/' + name +
				'" target="_blank">' + name + '</a></div>'
			: '<div class="name">' + name + '</div>';
	}
	function getViewers() {
		return status === "online" ? '<div class="viewers">Viewers: ' + viewers + '</div>': "";
	}
	function getDescription() {
		if(status === "noexist") {
			return '<div class="description">Account does not exist</div>';
		}
		return description ? '<div class="description">' + description + '</div>' : "";
	}
	function getImage() {
		return image && status !== "noexist"
			? '<img class="channel-img img-rounded img-responsive" src="' + image + '">'
			: '<div class="no-img"></div>';
	}
	function getLogo() {
		return logo && status !== "noexist"
			? '<img class="logo img-responsive" src="' + logo + '">'
			: '<div class="no-logo"></div>';
	}

}
