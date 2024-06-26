export type ProdType = {
  id: number;
  name: string;
  desc: string;
  price: number;
  image: string;
  categoryId: number;
};

export type ProdStateType = {
  prods: ProdType[];
  selectedProd: ProdType | null;
  modalType: 'edit' | 'info' | null;
};

export type AddProdForm = {
  name: string;
  desc: string;
  price: number;
  image: string;
  categoryId: number;
};
