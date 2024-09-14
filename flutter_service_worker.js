'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/android-chrome-192x192.png": "243a2acf98e8f765b8377a2f1e512a9b",
"assets/android-chrome-512x512.png": "b00a6f48ca077b14eb377b917149144c",
"assets/apple-touch-icon.png": "c498b6115d1323ad1eb4ce6ea8c0b6c7",
"assets/AssetManifest.bin": "7e38194ab7b5218eff9c2ce6af360150",
"assets/AssetManifest.bin.json": "0eb83738751cec73d055f6760853a2a0",
"assets/AssetManifest.json": "96911665bebb189429190c4f02180ac4",
"assets/assets/fonts/CustomFontIcons.ttf": "9ae20eeca6ee38276968fd240f83aadb",
"assets/assets/images/bkgrnd_ha.jpg": "8ef314cba8658b04dc0951e34ad16193",
"assets/assets/images/bkgrnd_kn.jpg": "6ff5b4d064601f43aaafc9d5aa06f13f",
"assets/assets/images/female.jpg": "8a647ee97d6d9f41bcbbe4485521d7e2",
"assets/assets/images/femalec.jpg": "cb95433830422a726df6ea262a63d581",
"assets/assets/images/ha.png": "83b56e11f30cf28a4f0586e2796c322e",
"assets/assets/images/instagram.png": "3887dba0251b43c81d70855b073a0249",
"assets/assets/images/kn.png": "a52be12533fa409cf87b24aa3e0b4f7c",
"assets/assets/images/logo_ha.png": "b5ae6bdb1e39bbbafd1be28615d65d69",
"assets/assets/images/logo_kn.png": "4d75c280c61eec4a75c2fc746d77f131",
"assets/assets/images/male.jpg": "18629d856ed2e50c28c05ec0701044da",
"assets/assets/images/malec.jpg": "df2309108e88cc691542b0aab885472f",
"assets/favicon-16x16.png": "e225d369a5e93453367e6e1acc0b0ffe",
"assets/favicon-32x32.png": "c484da92997a91ac4b2be46a7e2e41cf",
"assets/FontManifest.json": "17317224ece14496ecc4511d50149ee8",
"assets/fonts/MaterialIcons-Regular.otf": "1758d078c3510ff9d710c9c68260a2f2",
"assets/mstile-150x150.png": "62f74e7692a1d0e6057ea41bdb52cbf5",
"assets/NOTICES": "15213383e3bb566bed8975206ff8ed71",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "e986ebe42ef785b27164c36a9abc7818",
"assets/safari-pinned-tab.svg": "fc33692a8a6fdcfa0fe4d1749dfdf253",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"browserconfig.xml": "9b2c36a9270c2b6c87ede7910777f8fa",
"canvaskit/canvaskit.js": "738255d00768497e86aa4ca510cce1e1",
"canvaskit/canvaskit.js.symbols": "74a84c23f5ada42fe063514c587968c6",
"canvaskit/canvaskit.wasm": "9251bb81ae8464c4df3b072f84aa969b",
"canvaskit/chromium/canvaskit.js": "901bb9e28fac643b7da75ecfd3339f3f",
"canvaskit/chromium/canvaskit.js.symbols": "ee7e331f7f5bbf5ec937737542112372",
"canvaskit/chromium/canvaskit.wasm": "399e2344480862e2dfa26f12fa5891d7",
"canvaskit/skwasm.js": "5d4f9263ec93efeb022bb14a3881d240",
"canvaskit/skwasm.js.symbols": "c3c05bd50bdf59da8626bbe446ce65a3",
"canvaskit/skwasm.wasm": "4051bfc27ba29bf420d17aa0c3a98bce",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03",
"favicon.ico": "b9cd13feaf6d1a96f5d0934e9812caaa",
"flutter.js": "383e55f7f3cce5be08fcf1f3881f585c",
"flutter_bootstrap.js": "eef60520a12434a4b1aef0d3c77138df",
"index.html": "55e0c81a1d600c0462539b6f1fbb2555",
"/": "55e0c81a1d600c0462539b6f1fbb2555",
"main.dart.js": "a8d40e839c010f0d28a3f54b0c9ae8ee",
"main.dart.js_1.part.js": "0a7a6ac3809e1eba4be6fd82147a9d59",
"manifest.json": "7f480852e11934b3a63a7e9c01c81d97",
"site.webmanifest": "3dd2babc97ffe35cc64535260ba9471e",
"styles.css": "f93bcc0c5652da16cba0ff7bd04aef6a",
"version.json": "8319dd0b5a841bb537af7a35642fc316"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
