var CACHE_NAME = "my-site-cache-v1";
var urlsToCache = [
	'/',
	'/styles/main.css',
	'/script/main.js'
];
self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then(function (cahce) {
				console.log('cache opened');
				return cache.addAll(urlsToCache);
			})
	);
});


self.addEventListener('fetch', function(event) {
	event.respondWith(
		caches.match(event.request)
			.then(function (response) {
				if (response) {
					return response;
				}
				var fetchRequest = event.request.clone();
				return fetch(event.request)
						.then(function(response) {
							if (!response || response.typ !== 'basic' || response.status !== 200) {
								return response;
							}

							var responseToCache = response.clone();
							caches.open(CACHE_NAME)
								.then(function (cache) {
									cache.put(event.request, responseToCache);
								});
							return response		
						});
			});
	);
});