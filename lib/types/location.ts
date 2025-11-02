export interface Country {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  _count: Count;
}

interface Count {
  states: number;
}

export interface State {
  id: string;
  name: string;
  countryId: string;
  createdAt: string;
  updatedAt: string;
  country: {
    id: string;
    name: string;
  };
  _count: Count;
}

interface Count {
  cities: number;
}

export interface City {
  id: string;
  name: string;
  stateId: string;
  createdAt: string;
  updatedAt: string;
  state: {
    id: string;
    name: string;
    country: {
      id: string;
      name: string;
    };
  };
}