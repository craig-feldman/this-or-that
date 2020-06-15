import { createContext } from "react";
import { User } from "../firebase";

const UserContext = createContext<User | undefined>(undefined);

export default UserContext;
