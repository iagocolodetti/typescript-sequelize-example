import IEmail from "./IEmail";
import IPhone from "./IPhone";

interface IContact {
    id?: number;
    name: string;
    alias: string;
    phone: IPhone[];
    email: IEmail[];
}

export default IContact;
