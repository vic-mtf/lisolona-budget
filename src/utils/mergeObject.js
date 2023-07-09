export default function mergeObjects(obj1, obj2) {
    // Vérifier si les deux arguments sont des objets
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
      return obj1;
    }
  
    // Vérifier si l'un des deux arguments est un tableau
    if (Array.isArray(obj1) || Array.isArray(obj2)) {
      // Si l'un des deux arguments est un tableau, fusionner les tableaux
      if (!Array.isArray(obj1)) {
        obj1 = [obj1];
      }
      if (!Array.isArray(obj2)) {
        obj2 = [obj2];
      }
      var merged = [];
      var i = 0;
      while (i < obj1.length || i < obj2.length) {
        merged.push(mergeObjects(obj1[i], obj2[i]));
        i++;
      }
      return merged;
    }
  
    // Fusionner les propriétés des deux objets
    var merged = {};
    for (var key in obj1) {
      merged[key] = obj1[key];
    }
    for (var key in obj2) {
      if (merged.hasOwnProperty(key)) {
        merged[key] = mergeObjects(merged[key], obj2[key]);
      } else {
        merged[key] = obj2[key];
      }
    }
    return merged;
  }