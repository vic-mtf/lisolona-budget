function generateRandomId() {
  return Math.random().toString(16).substring(2, 26);
}

function getRandomEmail(first, last) {
  return `${first.toLowerCase()}${Math.floor(Math.random() * 100)}@example.com`;
}

function getRandomName() {
  const firstNames = ["Filia", "Viael", "Jean", "Amina", "Théo", "Maria"];
  const lastNames = [
    "Mula",
    "Mongolo",
    "Durand",
    "Kasongo",
    "Lemoine",
    "Tanzey",
  ];
  const middleNames = ["Kasongo", "Tanzey", "Elumba", "Njoko", "Makuta"];

  return {
    firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
    lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
    middleName: middleNames[Math.floor(Math.random() * middleNames.length)],
  };
}

function getRandomGrade() {
  const grades = ["CHEF DE DIVISION", "DIRECTEUR", "AGENT", "CONSEILLER"];
  return grades[Math.floor(Math.random() * grades.length)];
}

function getRandomRole() {
  const roles = [
    "DIRECTION DES RECETTES",
    "DIVISION GESTION ET DEVELOPPEMENT DES COMPETENCES",
    "SERVICE FORMATION",
    "BUREAU ANALYSE ET PLANIFICATION",
  ];
  return roles[Math.floor(Math.random() * roles.length)];
}

export default function generateData(count = 1000) {
  const data = [];
  for (let i = 0; i < count; i++) {
    const fromName = getRandomName();
    const toName = getRandomName();
    const createdAt = new Date().toISOString();

    data.push({
      id: generateRandomId(),
      from: {
        id: generateRandomId(),
        email: getRandomEmail(fromName.firstName, fromName.lastName),
        firstName: fromName.firstName,
        lastName: fromName.lastName,
        middleName: fromName.middleName,
        grade: getRandomGrade(),
        role: getRandomRole(),
      },
      to: {
        id: generateRandomId(),
        email: getRandomEmail(toName.firstName, toName.lastName),
        firstName: toName.firstName,
        lastName: toName.lastName,
        middleName: toName.middleName,
        image: `https://geidbudget.com/profils/${generateRandomId()}.webp`,
        grade: getRandomGrade(),
        role: getRandomRole(),
      },
      for: "connexion",
      createdAt,
      updatedAt: createdAt,
      __v: 0,
      variant: "guest",
      isRemote: Math.random() > 0.5,
    });
  }
  return data;
}
