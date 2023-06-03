export default function processData(array, object) {
  const remonteData = array.map(obj => {
    let fileType = obj.File.type.startsWith('video/') ? 'media' :
      obj.File.type.startsWith('image/') ? 'media' :
      obj.File.type.startsWith('audio/') ? 'media' : 'doc';
    let subtype = obj.File.type.startsWith('video/') ? 'video' :
      obj.File.type.startsWith('image/') ? 'image' :
      obj.File.type.startsWith('audio/') ? 'audio' : undefined;
    return {
      file: obj.File,
      type: object.target.type,
      subtype: subtype,
      to: object.target.id,
      date: object.date,
      fileType: fileType,
      clientId: obj.id
    };
  });

  const localData = array.map(obj => {
    let fileType = obj.File.type.startsWith('video/') ? 'media' :
      obj.File.type.startsWith('image/') ? 'media' :
      obj.File.type.startsWith('audio/') ? 'media' : 'doc';
    let subtype = obj.File.type.startsWith('video/') ? 'video' :
      obj.File.type.startsWith('image/') ? 'image' :
      obj.File.type.startsWith('audio/') ? 'audio' : obj.File.type;
    return {
      id: obj.id,
      buffer: obj.File,
      type: fileType,
      subType: subtype,
      content: obj.File.name,
      targetId: object.target.id,
      createdAt: object.date.toString(),
      isMine: true,
      sended: false,
      timeout: 5000
    };
  });

  return {remonteData, localData};
}
