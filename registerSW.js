if('serviceWorker' in navigator) {window.addEventListener('load', () => {navigator.serviceWorker.register('/Soif/sw.js', { scope: '/Soif/' })})}