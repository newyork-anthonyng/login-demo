const LOCATION_KEY = "coole-demo";

function persist(info) {
  return localStorage.setItem(LOCATION_KEY, JSON.stringify(info));
}

function retrieve() {
  return JSON.parse(localStorage.getItem(LOCATION_KEY)) || [];
}

export { persist, retrieve };
