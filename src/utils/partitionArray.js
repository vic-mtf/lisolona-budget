export default function partitionArray(array, len= 20) {
    return array.reduce((partitions, object, index) => {
      const partitionIndex = Math.floor(index / len);
      if (!partitions[partitionIndex]) {
        partitions[partitionIndex] = [];
      }
      partitions[partitionIndex].push(object);
      return partitions;
    }, []);
  }