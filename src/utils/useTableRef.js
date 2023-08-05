import { useRef } from "react";
import mergeObjects, { deepMerge } from "./mergeObject";

const useStateRef = (init) => {
    const tableRef = useRef(init);
    const setTableRef = (data) => {
        if(typeof data === "function") 
            data(tableRef);
        else tableRef.current = data;
    }
    return [tableRef, setTableRef];
};

export default function useTableRef(initialTable=[]) {
    const [table, setTable] = useStateRef(initialTable);
    function addObject(newObject) {
      setTable([...table.current, newObject]);
    }
    function deleteObject(id) {
      setTable(table.current.filter(object => object.id !== id));
    }
  
    function updateObject(updatedObject) {
      if(updatedObject?.id || updatedObject?.id === 0) {
        const data = table.current;
        const index = data.findIndex(object => object.id === updatedObject.id);
        if (index !== -1) {
          const updatedTable = [...data];
          const currentObject = updatedTable[index];
          updatedTable[index] = deepMerge(currentObject, updatedObject);
          setTable(updatedTable);
        } else {
          addObject(updatedObject);
        }
      }
    }

    function updateObjects(updatedObjects=[]) {
      updatedObjects.forEach(update => updateObject(update));
    }
    function getTableSize() {
        // Renvoyer le nombre d'objets dans le tableau
        return table.current.length;
      }
      
      function filterTableBy(field, value) {
        // Filtrer le tableau en fonction d'un champ et d'une valeur spécifiés
        const filteredTable = table.current.filter(object => object[field] === value);
        setTable(filteredTable);
      }
      
      function getTableFields() {
        // Renvoyer un tableau des noms des champs dans le tableau
        if (table.current.length > 0) {
          return Object.keys(table.current[0]);
        }
        return [];
      }
      
      function getTableValues(field) {
        // Renvoyer un tableau des valeurs d'un champ spécifié dans le tableau
        return table.current.map(object => object[field]);
      }
      
      function reverseTable() {
        // Inverser l'ordre des objets dans le tableau
        const reversedTable = [...table.current].reverse();
        setTable(reversedTable);
      }
      
      function getObjectIndexById(id) {
        // Récupérer l'index d'un objet dans le tableau en fonction de son ID
        return table.current.findIndex(object => object.id === id);
      }
      
      function getTableSubset(startIndex, endIndex) {
        // Renvoyer un sous-ensemble du tableau en fonction des index de début et de fin spécifiés
        return table.current.slice(startIndex, endIndex);
      }
      
      function getTableSum(field) {
        // Renvoyer la somme des valeurs d'un champ spécifié dans le tableau
        const values = table.current.map(object => object[field]);
        return values.reduce((acc, curr) => acc + curr, 0);
      }

      function clearTable() {
        setTable([]);
      }
    
      function getObjectById(id) {
        return table.current.find(object => object.id === id);
      }
    
      function sortTableBy(field) {
        const sortedTable = [...table.current];
        sortedTable.sort((a, b) => a[field] - b[field]);
        setTable(sortedTable);
      }
      
      function getObjectByIndex(index) {
        // Récupérer un objet du tableau en fonction de son index
        return table.current[index];
      }
      
      function shuffleTable() {
        // Mélanger les objets dans le tableau aléatoirement
        const shuffledTable = [...table.current].sort(() => Math.random() - 0.5);
        setTable(shuffledTable);
      }

      function getTableAverage(field) {
        // Renvoyer la moyenne des valeurs d'un champ spécifié dans le tableau
        const values = table.current.map(object => object[field]);
        const sum = values.reduce((acc, curr) => acc + curr, 0);
        return sum / values.length;
      }
      
      function getTableMax(field) {
        // Renvoyer la valeur maximale d'un champ spécifié dans le tableau
        const values = table.current.map(object => object[field]);
        return Math.max(...values);
      }
      
      function getTableMin(field) {
        // Renvoyer la valeur minimale d'un champ spécifié dans le tableau
        const values = table.current.map(object => object[field]);
        return Math.min(...values);
      }
      
      function getObjectIndexByField(field, value) {
        // Récupérer l'index du premier objet dans le tableau qui a une valeur spécifiée pour un champ spécifié
        return table.current.findIndex(object => object[field] === value);
      }
      
      function getTableSubsetByField(field, value) {
        // Renvoyer un sous-ensemble du tableau qui contient uniquement les objets qui ont une valeur spécifiée pour un champ spécifié
        return table.current.filter(object => object[field] === value);
      }
      
      function getTableSubsetByRange(field, startValue, endValue) {
        // Renvoyer un sous-ensemble du tableau qui contient uniquement les objets qui ont une valeur dans une plage spécifiée pour un champ spécifié
        return table.current.filter(object => object[field] >= startValue && object[field] <= endValue);
      }
      
      function getObjectValueByIndex(index, field) {
        // Récupérer la valeur d'un champ spécifié pour un objet dans le tableau en fonction de son index
        return table.current[index][field];
      }
      
      function getObjectValueById(id, field) {
        // Récupérer la valeur d'un champ spécifié pour un objet dans le tableau en fonction de son ID
        const index = table.current.findIndex(object => object.id === id);
        return table.current[index][field];
      }
      
      function getObjectFieldNames() {
        // Renvoyer un tableau des noms des champs dans le premier objet du tableau
        if (table.current.length > 0) {
          return Object.keys(table.current[0]);
        }
        return [];
      }
      function getTableSubsetByFilter(filterFunction) {
        // Renvoyer un sous-ensemble du tableau qui satisfait une fonction de filtre spécifiée
        return table.current.filter(filterFunction);
      }
      
      function getObjectFields(id) {
        // Renvoyer un tableau des noms des champs pour un objet spécifié
        const object = getObjectById(id);
        if (object) {
          return Object.keys(object);
        }
        return [];
      }
      
      function getObjectValues(id) {
        // Renvoyer un tableau des valeurs pour un objet spécifié
        const object = getObjectById(id);
        if (object) {
          return Object.values(object);
        }
        return [];
      }
      
      function updateObjectField(id, field, value) {
        // Mettre à jour la valeur d'un champ spécifié pour un objet spécifié
        const objectIndex = getObjectIndexById(id);
        if (objectIndex !== -1) {
          const updatedObject = { ...table.current[objectIndex], [field]: value };
          const updatedTable = [...table.current];
          const object = updatedTable[objectIndex];
          updatedTable[objectIndex] = mergeObjects(object, updatedObject);
          setTable(updatedTable);
        }
      }
      
      function updateObjectFields(id, updatedFields) {
        // Mettre à jour plusieurs champs pour un objet spécifié
        const objectIndex = getObjectIndexById(id);
        if (objectIndex !== -1) {
          const updatedObject = { ...table.current[objectIndex], ...updatedFields };
          const updatedTable = [...table.current];
          updatedTable[objectIndex] = updatedObject;
          setTable(updatedTable);
        }
      }
      
      function renameObjectField(oldFieldName, newFieldName) {
        // Renommer un champ spécifié pour tous les objets dans le tableau
        const renamedTable = table.current.map(object => ({
          ...object,
          [newFieldName]: object[oldFieldName],
          [oldFieldName]: undefined,
        }));
        setTable(renamedTable);
      }
      
      function deleteObjectField(id, field) {
        // Supprimer un champ spécifié pour un objet spécifié
        const objectIndex = getObjectIndexById(id);
        if (objectIndex !== -1) {
          const updatedObject = { ...table.current[objectIndex] };
          delete updatedObject[field];
          const updatedTable = [...table.current];
          updatedTable[objectIndex] = updatedObject;
          setTable(updatedTable);
        }
      }
      
      function deleteObjectFields(id, fields) {
        // Supprimer plusieurs champs pour un objet spécifié
        const objectIndex = getObjectIndexById(id);
        if (objectIndex !== -1) {
          const updatedObject = { ...table.current[objectIndex] };
          fields.forEach(field => delete updatedObject[field]);
          const updatedTable = [...table.current];
          updatedTable[objectIndex] = updatedObject;
          setTable(updatedTable);
        }
      }
      
      function addObjects(newObjects=[]) {
        // Ajouter plusieurs objets au tableau
        newObjects.forEach(object => {
          updateObject(object)
        });
      }
      
      function deleteObjectsByField(field, value) {
        // Supprimer tous les objets qui ont une valeur spécifiée pour un champ spécifié
        const filteredTable = table.current.filter(object => object[field] !== value);
        setTable(filteredTable);
      }
      
      function updateObjectsByField(field, value, updatedFields) {
        // Mettre à jour plusieurs champs pour tous les objets qui ont une valeur spécifiée pour un champ spécifié
        const updatedTable = table.current.map(object => {
          if (object[field] === value) {
            return { ...object, ...updatedFields };
          }
          return object;
        });
        setTable(updatedTable);
      }
      
      function getUniqueValues(field) {
        // Renvoyer un tableau des valeurs uniques pour un champ spécifié dans le tableau
        const values = table.current.map(object => object[field]);
        return [...new Set(values)];
      }
      
      function getFieldValueCounts(field) {
        // Renvoyer un objet qui contient les valeurs de champs et leurs comptages dans le tableau
        const values = table.current.map(object => object[field]);
        const valueCounts = {};
        values.forEach(value => {
          if (value in valueCounts) {
            valueCounts[value]++;
          } else {
            valueCounts[value] = 1;
          }
        });
        return valueCounts;
      }
      
      function getFilteredFieldValueCounts(field, filterFunction) {
        // Renvoyer un objet qui contient les valeurs de champs et leurs comptages dans le tableau filtré par une fonction de filtre spécifiée
        const filteredValues = table.current.filter(filterFunction).map(object => object[field]);
        const valueCounts = {};
        filteredValues.forEach(value => {
          if (value in valueCounts) {
            valueCounts[value]++;
          } else {
            valueCounts[value] = 1;
          }
        });
        return valueCounts;
      }
      
      const tableMethods = {
        addObject,
        deleteObject,
        clearTable,
        getObjectById,
        sortTableBy,
        filterTableBy,
        getTableSize,
        getTableFields,
        getTableValues,
        reverseTable,
        getObjectIndexById,
        getTableSubset,
        getTableSum,
        getTableAverage,
        getTableMax,
        getTableMin,
        getObjectByIndex,
        getObjectIndexByField,
        getTableSubsetByField,
        getTableSubsetByRange,
        getTableSubsetByFilter,
        getObjectFields,
        getObjectValues,
        updateObjectField,
        updateObjectFields,
        addObjects,
        deleteObjectsByField,
        updateObjectsByField,
        getUniqueValues,
        getFieldValueCounts,
        getFilteredFieldValueCounts,
        renameObjectField,
        deleteObjectFields,
        deleteObjectField,
        updateObject,
        updateObjects,
        getObjectValueByIndex,
        getObjectValueById,
        getObjectFieldNames,
        shuffleTable,
      };

    return [table, tableMethods];
  }
  