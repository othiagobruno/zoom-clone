export const randomName = () => {
  const names = [
    "Thiago",
    "João",
    "Maria",
    "José",
    "Pedro",
    "Paulo",
    "Lucas",
    "Mateus",
    "Marcos",
    "Luciana",
    "Ana",
    "Paula",
    "Luana",
    "Luiza",
    "Luiz",
    "Fernanda",
    "Fernando",
    "Rafael",
    "Rafaela",
    "Rafaelo",
    "Rafaeli",
    "Rafa",
  ];
  return names[Math.floor(Math.random() * names.length)];
};
