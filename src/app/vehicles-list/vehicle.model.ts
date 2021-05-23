import { LoanDataModel } from "../loan/loan.data.model";

export interface Vehicle{
  type?: number;
  libelle?: string;
  model?: string;
  flagService?: boolean;
  immatriculation?: string;
  state?: number;
  site?: number;

}
//TODO : CHANGER LE TYPE DE LA COLONNE STATE 