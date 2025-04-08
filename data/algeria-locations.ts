export interface County {
  id: string;
  name: string;
}

export interface Wilaya {
  id: string;
  code: string;
  name: string;
  counties: County[];
}

export const algeriaWilayas: Wilaya[] = [
  {
    id: "1",
    code: "01",
    name: "Adrar",
    counties: [
      { id: "1-1", name: "Adrar" },
      { id: "1-2", name: "Reggane" },
      { id: "1-3", name: "Timimoun" },
      // More counties can be added
    ],
  },
  {
    id: "2",
    code: "02",
    name: "Chlef",
    counties: [
      { id: "2-1", name: "Chlef" },
      { id: "2-2", name: "Ténès" },
      { id: "2-3", name: "Boukadir" },
      // More counties can be added
    ],
  },
  {
    id: "3",
    code: "03",
    name: "Laghouat",
    counties: [
      { id: "3-1", name: "Laghouat" },
      { id: "3-2", name: "Aflou" },
      // More counties can be added
    ],
  },
  {
    id: "4",
    code: "04",
    name: "Oum El Bouaghi",
    counties: [
      { id: "4-1", name: "Oum El Bouaghi" },
      { id: "4-2", name: "Aïn Beïda" },
      // More counties can be added
    ],
  },
  {
    id: "16",
    code: "16",
    name: "Alger",
    counties: [
      { id: "16-1", name: "Alger-Centre" },
      { id: "16-2", name: "Bab El Oued" },
      { id: "16-3", name: "Hussein Dey" },
      { id: "16-4", name: "El Harrach" },
      // More counties can be added
    ],
  },
  {
    id: "31",
    code: "31",
    name: "Oran",
    counties: [
      { id: "31-1", name: "Oran" },
      { id: "31-2", name: "Aïn El Turk" },
      { id: "31-3", name: "Es Sénia" },
      { id: "31-4", name: "Arzew" },
      // More counties can be added
    ],
  },
  // More wilayas can be added to complete the list of 58 Algerian wilayas
];
